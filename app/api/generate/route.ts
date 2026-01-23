import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import crypto from "node:crypto";

// Simple mapping from UI model ids to OpenRouter models.
// Note: We default to google/gemini-2.5-flash-image for now since the UI labels
// (Nano Banana, Nano Banana Pro, SeeDream 4) are productized names.
const MODEL_MAP: Record<string, string> = {
  "nano-banana": "google/gemini-2.5-flash-image",
  "nano-banana-pro": "google/gemini-2.5-flash-image",
  "seed-dream": "google/gemini-2.5-flash-image",
};

function extractImagesFromAny(root: any): string[] {
  const out: string[] = [];
  const stack = [root];
  const urlRegex = /(https?:\/\/[^\s)]+\.(?:png|jpg|jpeg|webp|gif))/i;
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (typeof node === "string") {
      // data URL or http image URL
      if (node.startsWith("data:image/")) out.push(node);
      else {
        const m = node.match(urlRegex);
        if (m) out.push(m[0]);
      }
      continue;
    }
    if (Array.isArray(node)) {
      for (const el of node) stack.push(el);
      continue;
    }
    if (typeof node === "object") {
      // common shapes
      const t = (node as any)?.type;
      if (t === "image_url" && (node as any)?.image_url?.url) out.push((node as any).image_url.url);
      if ((node as any)?.image_url && typeof (node as any).image_url === "string") out.push((node as any).image_url);
      if ((node as any)?.b64_json) out.push(`data:image/png;base64,${(node as any).b64_json}`);
      if ((node as any)?.url && typeof (node as any).url === "string" && urlRegex.test((node as any).url)) {
        out.push((node as any).url);
      }
      for (const k of Object.keys(node)) stack.push((node as any)[k]);
    }
  }
  return Array.from(new Set(out));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt || "";
    const images: string[] = Array.isArray(body?.images) ? body.images : [];
    const selectedModel: string = body?.model || "nano-banana";

    // Points cost: 1 for normal, 5 for pro
    const isPro = selectedModel === "nano-banana-pro";
    const cost = isPro ? 5 : 1;

    // Require auth to spend points
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const requestId = (() => {
      try { return crypto.randomUUID(); } catch { return `req_${Date.now()}`; }
    })();
    const reason = isPro ? "gen:pro" : "gen:basic";
    const { data: remaining, error: spendErr } = await supabase.rpc("spend_points", {
      cost,
      in_reason: reason,
      in_meta: { requestId, model: selectedModel },
    });
    if (spendErr) {
      return NextResponse.json({ error: spendErr.message || "Spend failed" }, { status: 400 });
    }
    if (remaining == null) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 402 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    if (!prompt && images.length === 0) {
      return NextResponse.json({ error: "Provide a prompt and/or at least one image" }, { status: 400 });
    }

    const model = MODEL_MAP[selectedModel] || MODEL_MAP["nano-banana"];

    // Build content array per OpenRouter chat.completions format.
    // We include the user's text prompt and any images as data URLs.
    const content: any[] = [];
    if (prompt) {
      content.push({ type: "text", text: prompt });
    }
    for (const img of images) {
      // Expecting a data URL string (from FileReader.readAsDataURL). If an https URL is provided, it still works.
      content.push({ type: "image_url", image_url: { url: img } });
    }
    // Try Responses API first with explicit instruction to return an image.
    const systemInstruction =
      "You are an image generation model. Given user instructions and optional reference images, generate and return an image only. Do not return plain text. If you must return data, return a data URL (data:image/png;base64,...) of the image.";

    const responsesBody = {
      model,
      // OpenRouter Responses API accepts either a string or a rich message array.
      input: [
        { role: "system", content: [{ type: "text", text: systemInstruction }] },
        { role: "user", content },
      ],
      // Some routers honor this to bias image outputs.
      modalities: ["image"],
    } as any;

    let imagesOut: string[] = [];
    let raw: any = null;

    const resp1 = await fetch("https://openrouter.ai/api/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "image-editor-clone",
      },
      body: JSON.stringify(responsesBody),
    });

    if (resp1.ok) {
      const data1 = await resp1.json();
      raw = data1;
      imagesOut = extractImagesFromAny(data1);
    }

    // Fallback to chat.completions if Responses didn't yield images.
    if (!imagesOut.length) {
      const resp2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "image-editor-clone",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: [{ type: "text", text: systemInstruction }] },
            { role: "user", content },
          ],
        }),
      });
      const data2 = await resp2.json().catch(() => null);
      raw = raw ?? data2;
      if (resp2.ok) {
        imagesOut = extractImagesFromAny(data2);
      } else if (!resp1.ok) {
        const status = resp2.status || resp1.status;
        const text = (await resp2.text().catch(() => "")) || (await resp1.text().catch(() => ""));
        return NextResponse.json({ error: `OpenRouter error: ${status} ${text}` }, { status: 502 });
      }
    }

    // If user supplied images but model returned none, try a text-only retry as a pragmatic fallback.
    if (!imagesOut.length && images.length > 0) {
      const textOnlyInput = [
        { role: "system", content: [{ type: "text", text: systemInstruction }] },
        { role: "user", content: [{ type: "text", text: prompt || "Generate an artistic variation of the provided scene." }] },
      ];

      // Try responses first
      const respT1 = await fetch("https://openrouter.ai/api/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "image-editor-clone",
        },
        body: JSON.stringify({ model, input: textOnlyInput, modalities: ["image"] }),
      });
      if (respT1.ok) {
        const dataT1 = await respT1.json();
        const out = extractImagesFromAny(dataT1);
        if (out.length) imagesOut = out;
        raw = raw ?? dataT1;
      }
      // Then chat.completions as last resort
      if (!imagesOut.length) {
        const respT2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "image-editor-clone",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: [{ type: "text", text: systemInstruction }] },
              { role: "user", content: [{ type: "text", text: prompt || "Generate an artistic image." }] },
            ],
          }),
        });
        const dataT2 = await respT2.json().catch(() => null);
        raw = raw ?? dataT2;
        if (respT2.ok) {
          imagesOut = extractImagesFromAny(dataT2);
        }
      }
    }

    return NextResponse.json({ images: imagesOut, raw, remainingPoints: remaining }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}
