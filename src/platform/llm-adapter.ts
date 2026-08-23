/**
 * Provider-agnostic LLM adapter for Private Office.
 *
 * Architecture:
 *   Workflow / Analysis / Draft
 *           ↓
 *       LLM Adapter
 *           ↓
 *   ┌──────┼──────────┐
 *   │      │          │
 * Gemini  OpenAI   Future
 * (default)
 *
 * The LLM proposes information. The deterministic application validates and
 * controls state. The human approves consequential correspondence.
 *
 * The LLM must NEVER directly control:
 * - authorization, approval, payment, fulfillment
 * - matter state transitions
 * - consequential mailing
 */

// ── Provenance ──────────────────────────────────────────────────────────

export interface LLMProvenance {
  /** Provider identifier: "gemini", "openai", etc. */
  provider: string;
  /** Model identifier used for generation */
  model: string;
  /** ISO-8601 generation timestamp */
  generatedAt: string;
  /** SHA-256 hash of the input that produced this artifact */
  inputHash: string;
}

// ── Request / Response ───────────────────────────────────────────────────

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  /** Max output tokens (provider-specific default if omitted) */
  maxTokens?: number;
  /** Temperature (0–1, provider-specific default if omitted) */
  temperature?: number;
  /** Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

export interface LLMResponse {
  content: string;
  provenance: LLMProvenance;
}

// ── Adapter Interface ────────────────────────────────────────────────────

export interface LLMAdapter {
  readonly provider: string;
  generate(request: LLMRequest): Promise<LLMResponse>;
}

// ── Errors ──────────────────────────────────────────────────────────────

export class LLMError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly code?: string,
    readonly timeout?: boolean,
  ) {
    super(message);
    this.name = "LLMError";
  }
}

// ── Hash helper (shared with draft-provenance for input hashing) ─────────

export async function hashInput(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ── Factory ─────────────────────────────────────────────────────────────

import { GeminiAdapter } from "./gemini-adapter";

let cachedAdapter: LLMAdapter | null = null;

/**
 * Returns the configured LLM adapter. Defaults to Gemini.
 * Selection via LLM_PROVIDER environment variable.
 * Returns null when no provider is configured (rule-based path is used).
 */
export function getLLMAdapter(): LLMAdapter | null {
  if (cachedAdapter !== null) return cachedAdapter;

  const provider = process.env.LLM_PROVIDER ?? "gemini";
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    // No credentials configured — use rule-based path
    return null;
  }

  if (provider === "gemini") {
    cachedAdapter = new GeminiAdapter({
      apiKey,
      model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
      apiUrl: process.env.GEMINI_API_URL,
    });
    return cachedAdapter;
  }

  // Future providers: add openai, anthropic, etc. here
  throw new LLMError(
    `LLM provider "${provider}" is not configured`,
    provider,
    "PROVIDER_NOT_SUPPORTED",
  );
}

/**
 * Test-only: inject a custom adapter (e.g. a mock).
 */
export function _setLLMAdapter(adapter: LLMAdapter | null): void {
  cachedAdapter = adapter;
}

/**
 * Test-only: reset the cached adapter.
 */
export function _resetLLMAdapter(): void {
  cachedAdapter = null;
}
