/**
 * Authoritative matter-completion server function.
 *
 * A workflow becomes a durable capability only when its matter reaches the
 * completed state. The capability graph is updated from that server-side
 * transition; the UI cannot grant the capability by itself.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { accountAuthMiddleware } from "@/lib/server-function-auth";

const inputSchema = z.object({
  matterId: z.string().min(1),
  expectedVersion: z.number().int().positive(),
  proofHash: z.string().min(1),
});

export const completeMatter = createServerFn({ method: "POST" })
  .middleware([accountAuthMiddleware])
  .validator(inputSchema)
  .handler(async ({ data, context }) => {
    const userId = context.user.id;
    const { supabaseMatterRepository } = await import(
      "@/services/supabase-matter-repository"
    );
    const { supabaseCapabilityStateRepository } = await import(
      "@/services/supabase-capability-state"
    );

    const current = await supabaseMatterRepository.get(userId, data.matterId);
    if (!current) throw new Error("Matter is not accessible for this owner.");

    // Idempotent replay: a completed matter must not emit a second capability
    // transition. The capability repository also enforces idempotence.
    if (current.status === "completed") {
      return {
        matter: current,
        capabilityState: await supabaseCapabilityStateRepository.load(userId),
      };
    }

    const matter = await supabaseMatterRepository.transition(
      userId,
      data.matterId,
      data.expectedVersion,
      "completed",
      { proofHash: data.proofHash },
    );

    const capabilityState =
      await supabaseCapabilityStateRepository.completeWorkflowForMatter(
        userId,
        matter.id,
        matter.workflowId,
      );

    return { matter, capabilityState };
  });
