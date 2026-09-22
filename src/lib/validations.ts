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

export const orderSchema = z.object({
  serviceId: z.string().min(1, "Select a service"),
  link: z.string().url("Enter a valid URL"),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
});

export const massOrderSchema = z.object({
  lines: z.string().min(3, "Paste at least one order line"),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().positive("Enter a valid amount"),
  method: z.string().min(1),
  currency: z.enum(["NGN", "USD", "GHS", "KES"]),
});

export const ticketSchema = z.object({
  subject: z.string().min(4, "Subject is too short"),
  message: z.string().min(10, "Message is too short"),
});

export const ticketReplySchema = z.object({
  message: z.string().min(2, "Message is too short"),
});

export const profileSchema = z.object({
  email: z.string().email(),
  currency: z.enum(["NGN", "USD", "GHS", "KES"]),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});
