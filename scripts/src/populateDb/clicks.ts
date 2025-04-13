import { prisma } from "../lib/dbConnect";
import { nanoid } from "nanoid";
import Bowser from "bowser";

// Sample random data to simulate a user click
const userAgents = [
  // Windows 10 - Chrome
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",

  // Windows 10 - Edge
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edge/91.0.864.54",

  // macOS - Chrome
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",

  // iPhone 12 - Safari
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/537.36",

  // Android 10 - Chrome
  "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",

  // macOS - Safari
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",

  // Windows 7 - Firefox
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",

  // Android 9 - Chrome
  "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",

  // iPhone 11 - Safari
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/537.36",

  // Windows 10 - Firefox
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",

  // iPad - Safari
  "Mozilla/5.0 (iPad; CPU OS 14_4_2 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/537.36",

  // Linux - Chrome
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
];

// List of locales and countries for randomness
const locales = [
  "en-US",
  "en-GB",
  "fr-FR",
  "de-DE",
  "es-ES",
  "pt-PT",
  "it-IT",
  "ja-JP",
  "zh-CN",
  "ru-RU",
];
const referrers = [
  "https://www.google.com/search?q=",
  "https://www.bing.com/search?q=",
  "https://www.yahoo.com/search?q=",
  "https://www.reddit.com/r/all/top/",
  "https://www.stackoverflow.com/questions/",
];

const countries = [
  "United States",
  "Canada",
  "Germany",
  "France",
  "India",
  "China",
  "Russia",
  "Japan",
  "Brazil",
  "United Kingdom",
  "Australia",
  "South Korea",
  "Italy",
  "Mexico",
  "South Africa",
  "Spain",
  "Argentina",
  "Netherlands",
  "Turkey",
  "Saudi Arabia",
];

// Function to generate a random timestamp within the last 3 months
function getRandomTimestamp() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const randomTime = new Date(
    threeMonthsAgo.getTime() +
      Math.random() * (new Date().getTime() - threeMonthsAgo.getTime()),
  );
  return randomTime;
}

// Function to simulate the click
async function simulateClick(shortUrls: string[], index: number) {
  // Randomly pick a shortUrl from the provided array
  const shortUrl = shortUrls[Math.floor(Math.random() * shortUrls.length)];

  // Simulating random headers for each click
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  const ip = `192.168.1.${Math.floor(Math.random() * 255) + 1}`;
  const locale = locales[Math.floor(Math.random() * locales.length)];
  const referrer =
    referrers[Math.floor(Math.random() * referrers.length)] + nanoid(10); // Random query for referrer

  // Simulating browser details using Bowser
  const bow = Bowser.getParser(userAgent);
  const browser = bow.getBrowser();
  const os = bow.getOS();
  const platform = bow.getPlatformType();

  const deviceType =
    platform === "mobile" || platform === "tablet" ? "mobile" : "desktop";

  // Simulating the click update (just like the original route logic)
  const updateData: any = {
    totalClick: { increment: 1 },
  };

  if (deviceType === "mobile") {
    updateData.mobileClicks = { increment: 1 };
  } else {
    updateData.desktopClicks = { increment: 1 };
  }

  // Update the link click count and create a new click record
  const findUrl = await prisma.link.findUnique({
    where: { shortUrl },
    select: { id: true, longUrl: true, expiresAt: true },
  });

  if (findUrl) {
    if (findUrl.expiresAt && new Date() > new Date(findUrl.expiresAt)) {
      console.log(
        `${index}. Link ${shortUrl} is expired, skipping click simulation.`,
      );
      return;
    }

    // Update the link click count in the database
    await prisma.link.update({
      where: { shortUrl },
      data: updateData,
    });

    // Randomly select country
    const country = countries[Math.floor(Math.random() * countries.length)];

    // Generate a random timestamp for the click
    const timestamp = getRandomTimestamp();

    // Create a click record in the Click table
    await prisma.click.create({
      data: {
        linkId: findUrl.id,
        ip,
        os: os.name,
        browser: browser.name,
        device: platform,
        locale,
        country,
        referrer,
        timestamp,
      },
    });

    console.log(`${index}. Simulated click for ${shortUrl}`);
  } else {
    console.log(`${index}. Link with shortUrl ${shortUrl} not found.`);
  }
}

// Main function to simulate clicks for a given array of shortUrls
export async function simulateClicks(shortUrls: string[], n: number) {
  // Simulate a click for each shortUrl in the array
  for (let i = 1; i <= n; i++) {
    await simulateClick(shortUrls, i);
  }

  console.log("Click simulation complete.");
}

// Main function to simulate clicks for a random link of a particular user
export async function simulateClicksRandom(userId: string, n: number) {
  // Fetch all the links for the given user
  const links = await prisma.link.findMany({
    where: {
      userId: userId,
    },
    select: {
      shortUrl: true,
    },
  });

  // Check if the user has any links
  if (links.length === 0) {
    console.log("No links found for this user.");
    return;
  }

  // Simulate a click for each link
  for (let i = 1; i <= n; i++) {
    // Pick a random link from the user's links
    const randomLink = links[Math.floor(Math.random() * links.length)].shortUrl;
    await simulateClick([randomLink], i);
  }

  console.log("Click simulation complete.");
}
