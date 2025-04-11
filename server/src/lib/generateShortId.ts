import { customAlphabet } from "nanoid";
import { prisma } from "./dbConnect";
import { SIZEOF_NANO_ID } from "../config/app";

export async function generateShortId(id: string): Promise<string> {
  let shortId: string;
  let exists = true;

  const nanoid = customAlphabet(id, SIZEOF_NANO_ID);

  do {
    shortId = nanoid();
    const existingUser = await prisma.user.findUnique({ where: { shortId } });
    exists = !!existingUser;
  } while (exists);

  return shortId;
}
