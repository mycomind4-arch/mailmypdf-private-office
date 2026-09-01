import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./supabase";

/**
 * Canonical MailMyPDF Account boundary for TanStack Start server functions.
 * The client side attaches the current Supabase access token; the server
 * validates it again before the function executes.
 *
 * Note: requireAuthenticatedUser is dynamically imported inside the .server()
 * callback to keep this file client-safe — auth-guard.ts uses process.env
 * which would trigger TanStack Start's import-protection plugin.
 */
export const accountAuthMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error("Authentication required.");

    const authedFetch: typeof fetch = async (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      return fetch(input, { ...init, headers });
    };
    return next({ fetch: authedFetch });
  })
  .server(async ({ next, request }) => {
    const { requireAuthenticatedUser } = await import("./auth-guard");
    const user = await requireAuthenticatedUser(request);
    return next({ context: { user } });
  });
