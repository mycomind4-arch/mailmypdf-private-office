import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
      detectSessionInUrl: isBrowser,
    },
  });
}

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;
let _initPromise: Promise<void> | null = null;

if (envUrl && envKey) {
  _supabase = createSupabaseClient(envUrl, envKey);
}

async function ensureSupabase(): Promise<void> {
  if (_supabase) return;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    try {
      const res = await fetch("/api/auth/config");
      if (!res.ok) return;
      const data = await res.json() as { configured: boolean; url: string; anonKey: string };
      if (data.configured && data.url && data.anonKey) {
        _supabase = createSupabaseClient(data.url, data.anonKey);
      }
    } catch { /* network error */ }
  })();
  return _initPromise;
}

if (isBrowser && !_supabase) {
  void ensureSupabase();
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    if (!_supabase) {
      if (isBrowser) void ensureSupabase();
      return undefined;
    }
    return Reflect.get(_supabase, prop, receiver);
  },
});
