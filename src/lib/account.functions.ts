// Server-validated role + account actions. Never trust frontend role checks.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Returns the caller's role, resolved server-side from user_roles. */
export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role as string);
    return {
      userId: context.userId,
      role: roles.includes("admin") ? ("admin" as const) : ("user" as const),
    };
  });

/** Cancel one of the caller's own orders while it is still pending. */
export const cancelMyOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status")
      .eq("id", data.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order || order.user_id !== context.userId) {
      throw new Error("Order not found.");
    }
    if (order.status !== "pending") {
      throw new Error("Only pending orders can be cancelled.");
    }

    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true };
  });
