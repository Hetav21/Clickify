import bcrypt from "bcryptjs";

// Hashing password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Comparing password and hashed password
export async function comparePasswords(
  userPassword: string,
  dbPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(userPassword, dbPassword);
}
