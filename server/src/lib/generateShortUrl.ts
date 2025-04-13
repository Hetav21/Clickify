import { nanoid } from "nanoid-cjs";
import { SIZEOF_NANO_ID } from "../config/app";
import { prisma } from "./dbConnect";

export async function generateShortUrl(): Promise<string> {
  let shortUrl: string;
  let exists = true;

  do {
    shortUrl = nanoid(SIZEOF_NANO_ID);
    const linkExists = await prisma.link.findUnique({ where: { shortUrl } });
    if (!linkExists) exists = false;
  } while (exists);

  return shortUrl;
}
