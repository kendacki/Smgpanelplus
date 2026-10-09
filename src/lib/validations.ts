import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

const optionalText = z.string().trim().optional();

export const orderSchema = z.object({
  serviceId: z.string().min(1, "Select a service"),
  link: optionalText,
  quantity: z.coerce.number().int().positive().optional(),
  runs: z.coerce.number().int().positive().optional(),
  interval: z.coerce.number().int().positive().optional(),
  comments: optionalText,
  usernames: optionalText,
  keywords: optionalText,
  hashtag: optionalText,
  username: optionalText,
  groups: optionalText,
  answer_number: optionalText,
  min: z.coerce.number().int().positive().optional(),
  max: z.coerce.number().int().positive().optional(),
  posts: z.coerce.number().int().nonnegative().optional(),
  old_posts: z.coerce.number().int().nonnegative().optional(),
  delay: z.coerce.number().int().nonnegative().optional(),
  expiry: optionalText,
});

export const massOrderSchema = z.object({
  lines: z.string().min(3, "Paste at least one order line"),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().positive("Enter a valid amount"),
  method: z.string().min(1),
  currency: z.enum(["USDT", "NGN", "GHS", "KES"]).default("USDT"),
  note: z.string().max(240).optional(),
});

export const ticketSchema = z.object({
  subject: z.string().min(4, "Subject is too short"),
  message: z.string().min(10, "Message is too short"),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const ticketReplySchema = z.object({
  message: z.string().min(2, "Message is too short"),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const profileSchema = z.object({
  email: z.string().email(),
  currency: z.literal("USDT").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});
