import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.middleware";
import { reviewRepository } from "../repositories/review.repository";
import { validateBody } from "../middleware/validation.middleware";
import { createReviewSchema } from "../validators/schema.validator";

const reviewsRouter = new Hono();

// Publicly list freelancer reviews
reviewsRouter.get("/freelancer/:id", async (c) => {
  const freelancerId = c.req.param("id");
  const data = await reviewRepository.listForFreelancer(freelancerId);
  return c.json({ success: true, data });
});

reviewsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const review = await reviewRepository.getById(id);
  if (!review) {
    return c.json({ success: false, error: "Review not found" }, 404);
  }
  return c.json({ success: true, data: review });
});

// Post a review
reviewsRouter.post("/", requireAuth(), validateBody(createReviewSchema), async (c) => {
  const reviewerId = c.get("userId");
  const body = c.get("validBody" as any);

  const review = await reviewRepository.create({
    reviewerId,
    freelancerId: body.freelancerId,
    rating: body.rating,
    comment: body.comment,
  });

  return c.json({ success: true, message: "Review posted successfully", data: review }, 201);
});

export { reviewsRouter };
