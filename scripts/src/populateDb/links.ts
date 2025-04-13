import { prisma } from "../lib/dbConnect";
import { nanoid } from "nanoid";

// Array of popular websites for the long URLs
const popularWebsites = [
  "https://www.google.com",
  "https://www.youtube.com",
  "https://www.facebook.com",
  "https://www.instagram.com",
  "https://www.twitter.com",
  "https://www.amazon.com",
  "https://www.wikipedia.org",
  "https://www.reddit.com",
  "https://www.linkedin.com",
  "https://www.netflix.com",
];

function getRandomExpirationDate(): Date {
  // Get today's date
  const today = new Date();

  // Add a random number of days between 1 and 90 (for the next 3 months)
  const randomDays = Math.floor(Math.random() * 90) + 1;
  today.setDate(today.getDate() + randomDays);

  return today;
}

export async function populateLinks(userId: string, n: number) {
  const links = [];

  for (let i = 1; i <= n; i++) {
    // Generating a short URL
    const shortUrl = nanoid(6);

    // random website from a list of popular websites
    const longUrl =
      popularWebsites[Math.floor(Math.random() * popularWebsites.length)];

    // Generate a random expiration date
    const expiresAt = getRandomExpirationDate();

    // Creating the record in db
    const link = prisma.link.create({
      data: {
        userId,
        shortUrl,
        longUrl,
        expiresAt,
      },
    });

    links.push(link);
  }

  // Execute all the create operations as a transaction
  await prisma.$transaction(links);
  console.log(`Successfully created ${n} links for user with ID: ${userId}`);
}
