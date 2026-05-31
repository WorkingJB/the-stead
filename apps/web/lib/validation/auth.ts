import { z } from "zod";

/** Shared between client (RHF) and server action validation. */
export const magicLinkSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
