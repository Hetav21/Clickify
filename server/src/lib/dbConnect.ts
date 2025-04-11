import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../../prisma/generated";

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());
