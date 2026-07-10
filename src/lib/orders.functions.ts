// Server-side order placement and coupon validation.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SHIPPING_FLAT = 50;
const SHIPPING_FREE_ABOVE = 800;

const COUPONS: Record<string, number> = {
  HENNA10: 0.1,
};

const PAYMENT_METHODS = [
  "UPI",
  "Google Pay",
  "PhonePe",
  "Paytm",
  "COD",
] as const;

const orderInput = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(200),
        qty: z.number().int().min(1).max(999),
      }),
    )
    .min(1)
    .max(100),

  address: z.string().trim().min(1).max(1000),

  phone: z.string().trim().min(4).max(20),

  payment_method: z.enum(PAYMENT_METHODS),

  coupon: z.string().trim().max(50).optional().nullable(),

  transaction_id: z.string().trim().max(200).optional().nullable(),

  payment_screenshot_path: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable(),
});

export const validateCoupon = createServerFn({
  method: "POST",
})
  .inputValidator((data: { code: string }) =>
    z.object({
      code: z.string().trim().max(50),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const rate = COUPONS[data.code.toUpperCase()] ?? 0;

    return {
      valid: rate > 0,
      rate,
    };
  });

export const placeOrder = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => orderInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;

    console.log("USER:", userId);
    console.log("CLAIMS:", claims);

    // Fetch product prices from DB
    const slugs = data.items.map((i) => i.slug);

    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("slug, name, price, discount_price")
      .in("slug", slugs);

    if (prodErr) {
      console.error(prodErr);
      throw new Error(JSON.stringify(prodErr));
    }

    const priceMap = new Map(
      (products ?? []).map((p) => [
        p.slug,
        {
          name: p.name,
          price:
            p.discount_price != null
              ? Number(p.discount_price)
              : Number(p.price),
        },
      ]),
    );

    let subtotal = 0;

    const lineItems = data.items.map((i) => {
      const p = priceMap.get(i.slug);

      if (!p) {
        throw new Error(`Unknown product: ${i.slug}`);
      }

      subtotal += p.price * i.qty;

      return {
        slug: i.slug,
        name: p.name,
        price: p.price,
        qty: i.qty,
      };
    });

    const couponRate = data.coupon
      ? COUPONS[data.coupon.trim().toUpperCase()] ?? 0
      : 0;

    const discount = Math.round(subtotal * couponRate);

    const taxable = subtotal - discount;

    const shipping =
      taxable <= 0
        ? 0
        : taxable >= SHIPPING_FREE_ABOVE
        ? 0
        : SHIPPING_FLAT;

    const total = taxable + shipping;

    const isOnline = data.payment_method !== "COD";

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,

        customer_name:
          (claims?.user_metadata as
            | { full_name?: string }
            | undefined)?.full_name ??
          (claims?.email as string | undefined) ??
          "Customer",

        customer_email:
          (claims?.email as string | undefined) ??
          null,

        customer_phone: data.phone,

        shipping_address: data.address,

        items: lineItems,

        subtotal,

        total,

        notes: `Shipping: ₹${shipping}${discount ? ` | Discount: ₹${discount}` : ""}`,

        status: "pending",

        payment_method: data.payment_method,

        payment_status: isOnline
          ? "submitted"
          : "cod",

        transaction_id:
          data.transaction_id || null,

        payment_screenshot_path:
          data.payment_screenshot_path || null,
      })
      .select("id,total")
      .single();

    if (error) {
      console.error("SUPABASE ORDER ERROR:", error);
      throw new Error(JSON.stringify(error));
    }

    return {
      id: order.id,
      total: order.total,
    };
  });
    
