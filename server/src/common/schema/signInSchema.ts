import { z } from "zod";
import { emailValidation, passwordValidation } from "./signUpSchema";

export const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});
