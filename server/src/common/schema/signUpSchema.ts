import { z } from "zod";
import { emailRegex, passwordRegex } from "../regex";

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" })
  .regex(emailRegex, "Invalid email address");

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    passwordRegex,
    "Password must contain at least one digit, one lowercase letter, one uppercase letter",
  );

export const signUpSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});
