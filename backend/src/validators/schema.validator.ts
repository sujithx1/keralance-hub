import { z } from "zod";

// Auth Schemas
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user", "freelancer"]).default("user"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Job Schemas
export const createJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
  category: z.string().min(2, "Category is required"),
  deadline: z.string().optional(),
});

export const applyJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  proposal: z.string().min(15, "Proposal must be at least 15 characters"),
  amount: z.coerce.number().positive("Amount must be positive"),
});

// Profile Schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateFreelancerProfileSchema = z.object({
  title: z.string().min(3).optional(),
  bio: z.string().min(10).optional(),
  hourlyRate: z.coerce.number().nonnegative().optional(),
  location: z.string().optional(),
  availability: z.enum(["available", "busy", "unavailable"]).optional(),
  skills: z.array(z.string()).optional(),
});

// Review Schema
export const createReviewSchema = z.object({
  freelancerId: z.string().uuid("Invalid freelancer ID"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5),
});

// Message Schema
export const sendMessageSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),
  content: z.string().min(1, "Message content cannot be empty"),
  attachments: z.array(z.string().url()).optional(),
});

// OTP Schemas
export const sendOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format (e.g. +917994591023)"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format"),
  code: z.string().length(6, "OTP must be exactly 6 digits"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["admin", "user", "freelancer"]).default("user").optional(),
});
