import { sign } from "jsonwebtoken";
import { z } from "zod";

export function generateJwtToken(user: {
  id: string;
  email: string;
  shortId: string;
}): string {
  return (
    "Bearer " +
    sign(
      { id: user.id, email: user.email, shortId: user.shortId },
      process.env.JWT_SECRET! || "0000",
    )
  );
}
