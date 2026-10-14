/**
 * One Claude answer for the support chat, through Anthropic's own SDK on the
 * Mako Logics API key. Used by the support chat only.
 *
 * Moved off Fireworks on 2026-10-13: that account was closed, and the chat had
 * failed every question since. Anthropic is the fleet's one text provider.
 *
 * SERVER ONLY.
 */

import Anthropic from "@anthropic-ai/sdk";

/** Claude Opus 5.5. SUPPORT_MODEL in the env overrides it. */
export const DEFAULT_MODEL = "claude-opus-5-5";

export function currentModel(): string {
  return process.env.SUPPORT_MODEL || DEFAULT_MODEL;
}

export function llmConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface CompleteOptions {
  system: string;
  /**
   * Long reference text that rarely changes (the knowledge block). It goes
   * last in the system prompt with a cache marker, so repeat questions read
   * it from Anthropic's cache at a tenth of the price instead of paying for
   * all of it every time.
   */
  context?: string;
  user: string;
  /** Thinking counts against this too, so leave room above the answer itself. */
  maxTokens: number;
  model?: string;
}

export interface Completion {
  text: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  ms: number;
}

let client: Anthropic | null = null;

function anthropic(key: string): Anthropic {
  // The chat route may run for 60 seconds. One retry of a 25-second request
  // still finishes inside that, so a visitor never waits on a dead request.
  client ??= new Anthropic({ apiKey: key, timeout: 25_000, maxRetries: 1 });
  return client;
}

export async function complete(opts: CompleteOptions): Promise<Completion> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set.");
  const model = opts.model ?? currentModel();

  const system: Anthropic.Beta.BetaTextBlockParam[] = [{ type: "text", text: opts.system }];
  if (opts.context) system.push({ type: "text", text: opts.context, cache_control: { type: "ephemeral" } });

  const started = Date.now();
  const res = await anthropic(key).beta.messages.create({
    model,
    max_tokens: opts.maxTokens,
    // A short answer from a fact sheet needs little thinking.
    output_config: { effort: "low" },
    // If a question trips a safety classifier, Anthropic re-runs it on the
    // model it picks for that case instead of leaving the visitor with nothing.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    messages: [{ role: "user", content: opts.user }],
  });

  if (res.stop_reason === "refusal") throw new Error("Claude declined to answer this question.");
  const text = res.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim();
  if (!text) {
    throw new Error(
      res.stop_reason === "max_tokens" ? "Claude ran out of room before it answered." : "Claude returned an empty answer.",
    );
  }
  return {
    text,
    model: res.model,
    inputTokens: res.usage.input_tokens + (res.usage.cache_read_input_tokens ?? 0) + (res.usage.cache_creation_input_tokens ?? 0),
    outputTokens: res.usage.output_tokens,
    ms: Date.now() - started,
  };
}

/**
 * Why the chat could not answer, in words the owner can act on. `billing` is
 * true when the fix is adding credit, so the alert can link straight to it.
 */
export function describeFailure(err: unknown): { reason: string; billing: boolean } {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return { reason: "Anthropic refused the site's API key (ANTHROPIC_API_KEY). It may have been revoked or replaced.", billing: false };
  }
  // Running out of credit has no error class of its own: it is a 400 whose
  // message says so.
  if (err instanceof Anthropic.BadRequestError && /credit balance/i.test(err.message)) {
    return { reason: "The Anthropic account behind the site's API key is out of credit.", billing: true };
  }
  if (err instanceof Anthropic.RateLimitError) return { reason: "Anthropic is rate-limiting the site's API key.", billing: false };
  if (err instanceof Anthropic.APIConnectionTimeoutError) return { reason: "Anthropic did not answer within 25 seconds.", billing: false };
  if (err instanceof Anthropic.APIConnectionError) return { reason: "The site could not reach Anthropic.", billing: false };
  if (err instanceof Anthropic.APIError) return { reason: `Anthropic returned an error (${err.status ?? "no status"}): ${err.message}`, billing: false };
  return { reason: err instanceof Error ? err.message : String(err), billing: false };
}
