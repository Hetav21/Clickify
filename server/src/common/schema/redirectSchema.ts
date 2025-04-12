import { z } from "zod";
import { customAliasSchema } from "./createLinkSchema";

export const redirectSchema = z.object({
  shortUrl: customAliasSchema,
});
