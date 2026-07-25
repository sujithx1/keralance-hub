import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { db } from "../db/connection";
import { PaymentTable } from "../schema/db.schema";
import { z } from "zod";
import { validateBody } from "../middleware/validation.middleware";

const paymentsRouter = new Hono();

paymentsRouter.use("/*", requireAuth());

const createPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().default("INR"),
});

paymentsRouter.post("/", validateBody(createPaymentSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.get("validBody" as any);

  const transactionId = "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();

  const [payment] = await db
    .insert(PaymentTable)
    .values({
      userId,
      amount: body.amount.toString(),
      currency: body.currency,
      transactionId,
      status: "completed",
    })
    .returning();

  return c.json({
    success: true,
    message: "Payment processed successfully",
    data: payment,
  }, 201);
});

export { paymentsRouter };
