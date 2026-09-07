/**
 * One chat completion against Fireworks (OpenAI-compatible shape). Used by
 * the support chat only. Same provider and model family handpenned runs on,
 * so the fleet has one bill and one key to rotate.
 *
 * SERVER ONLY.
 */

const BASE_URL = "https://api.fireworks.ai/inference/v1";

/** DeepSeek V4 Pro: the fleet default. SUPPORT_MODEL in the env overrides it. */
export const DEFAULT_MODEL = "accounts/fireworks/models/deepseek-v4-pro-0813";

export function currentModel(): string {
  return process.env.SUPPORT_MODEL || DEFAULT_MODEL;
}

export function llmConfigured(): boolean {
  return Boolean(process.env.FIREWORKS_API_KEY);
}

export interface CompleteOptions {
  system: string;
  user: string;
  maxTokens: number;
  temperature: number;
  model?: string;
}

export interface Completion {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  ms: number;
}

interface ChatResponse {
  choices?: {
    message?: { content?: string; reasoning_content?: string };
    finish_reason?: string;
  }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string } | string;
}

export async function complete(opts: CompleteOptions): Promise<Completion> {
  const key = process.env.FIREWORKS_API_KEY;
  if (!key) throw new Error("FIREWORKS_API_KEY is not set.");
  const model = opts.model ?? currentModel();

  const started = Date.now();
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(50_000),
  });

  const json = (await res.json().catch(() => ({}))) as ChatResponse;
  if (!res.ok) {
    const why = typeof json.error === "string" ? json.error : json.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Fireworks rejected the request: ${why}`);
  }
  const choice = json.choices?.[0];
  const text = (choice?.message?.content ?? "").trim();
  if (!text) {
    const why =
      choice?.finish_reason === "length"
        ? "ran out of tokens before answering"
        : choice?.message?.reasoning_content
          ? "returned reasoning but no answer"
          : "returned an empty completion";
    throw new Error(`Fireworks ${why}.`);
  }
  return {
    text,
    model,
    inputTokens: json.usage?.prompt_tokens ?? 0,
    outputTokens: json.usage?.completion_tokens ?? 0,
    ms: Date.now() - started,
  };
}
