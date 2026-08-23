type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m: { default?: ServerEntry } | ServerEntry): ServerEntry => {
        const module = m as { default?: ServerEntry };
        return (module.default ?? (m as unknown as ServerEntry));
      },
    );
  }
  return serverEntryPromise;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const server = await getServerEntry();
    return server.fetch(request, env, ctx);
  },
};
