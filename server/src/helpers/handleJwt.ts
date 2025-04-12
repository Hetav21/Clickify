import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

export function generateJwtToken(user: { id: string; email: string }): string {
  return (
    "Bearer " +
    sign({ id: user.id, email: user.email }, process.env.JWT_SECRET! || "0000")
  );
}

export function verifyJwtToken(token: string) {
  try {
    const payload = verify(token, process.env.JWT_SECRET!);
    return payload;
  } catch (err) {
    console.error(err);
    throw new Error("Invalid token");
  }
}
