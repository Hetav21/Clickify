import { prisma } from "../lib/dbConnect";

// Function to sign up a new user and return the userId
export async function signUpUser(email: string, password: string) {
  try {
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // You should hash the password before saving it in a real-world application.
      },
    });

    // Return the userId of the newly created user
    return newUser.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error signing up user.");
  }
}
