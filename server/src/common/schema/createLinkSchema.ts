import { z } from "zod";

export const createLinkSchema = z.object({
  longUrl: z
    .string()
    .url("Invalid URL")
    .min(5, "URL must be at least 5 characters long"),
  expiresAt: z.coerce
    .date()
    .min(new Date(), "Link must expire in the future")
    .optional(),
  customAlias: z
    .string()
    .min(3, "Alias must be at least 3 characters long")
    .max(10, "Alias must be at most 10 characters long")
    .optional(),
});
