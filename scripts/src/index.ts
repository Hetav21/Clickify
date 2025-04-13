import dotenv from "dotenv";
import { populateLinks } from "./populateDb/links";
import { prisma } from "./lib/dbConnect";
import { signUpUser } from "./populateDb/user";
import { simulateClicks, simulateClicksRandom } from "./populateDb/clicks";
dotenv.config();

let userId: string = "";

signUpUser("example@email.com", "12345@hH")
  .then((id) => {
    console.log(`User created with ID: ${id}`);
    userId = id;
  })
  .catch((error) => {
    console.error("Error creating user:", error);
  });

// Populate the database with 100 links
populateLinks(userId, 100).catch((error) => {
  console.log(error);
  process.exit(1);
});

// Populate the clicks on selected 5 links
let shortUrls: string[] = [];
getLinks(userId, 5)
  .then((links) => {
    // @ts-ignore
    shortUrls = links;
  })
  .catch((error) => {
    console.error("Error fetching links:", error);
  });

simulateClicks(shortUrls, 50000)
  .catch((err) => {
    console.error("Error simulating clicks:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Populate clicks on random links 50000 times
simulateClicksRandom(userId, 50000)
  .catch((err) => {
    console.error("Error simulating clicks:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

prisma.$disconnect().then(() => {
  console.log("DB disconnected successfully");
});

async function getLinks(userId: string, count: number) {
  const links = await prisma.link.findMany({
    where: {
      userId: userId,
    },
    take: count,
    select: { shortUrl: true },
  });

  return [links];
}
