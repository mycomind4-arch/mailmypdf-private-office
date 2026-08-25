/**
 * Provider-agnostic LLM adapter for Private Office.
 *
 * Architecture:
 *   Workflow / Analysis / Draft
 *           ↓
 *       LLM Adapter (transport layer)
 *           ↓
 *   ┌──────┼──────────┐
 *   │      │          │
 * Gemini  OpenAI   Anthropic
 * (default) (optional) (optional)
 *
 * The LLM proposes information. The deterministic application validates and
 * controls state. The human approves consequential correspondence.
 *
 * The LLM must NEVER directly control:
 * - authorization, approval, payment, fulfillment
 * - matter state transitions
 * - consequential mailing
 *
 * For the multi-LLM provider router, see llm-router.ts.
 * For structured output schemas, see llm-schemas.ts.
 * For runtime configuration, see llm-config.ts.
 */

// ── Provenance ──────────────────────────────────────────────────────────

export interface LLMProvenance {
  /** Provider identifier: "gemini", "openai", "anthropic" */
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

// ── Factory (legacy compatibility) ───────────────────────────────────────

import { GeminiAdapter } from "./gemini-adapter";
import { OpenAIAdapter } from "./openai-adapter";
import { AnthropicAdapter } from "./anthropic-adapter";
import type { LLMProviderId } from "./llm-types";

let cachedAdapter: LLMAdapter | null = null;

/**
 * Returns the configured LLM adapter. Defaults to Gemini.
 * Selection via LLM_PROVIDER environment variable.
 * Returns null when no provider is configured (rule-based path is used).
 *
 * NOTE: This is the legacy single-adapter factory. The multi-provider
 * router (llm-router.ts) should be used for fallback and consensus.
 * This factory is kept for backward compatibility.
 */
export function getLLMAdapter(): LLMAdapter | null {
  if (cachedAdapter !== null) return cachedAdapter;

  const provider = (process.env.LLM_PROVIDER ?? "gemini") as LLMProviderId;

  if (provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) return null;
    cachedAdapter = new GeminiAdapter({
      apiKey,
      model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
      apiUrl: process.env.GEMINI_API_URL,
    });
    return cachedAdapter;
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    cachedAdapter = new OpenAIAdapter({
      apiKey,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      apiUrl: process.env.OPENAI_API_URL,
    });
    return cachedAdapter;
  }

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;
    cachedAdapter = new AnthropicAdapter({
      apiKey,
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022",
      apiUrl: process.env.ANTHROPIC_API_URL,
    });
    return cachedAdapter;
  }

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
