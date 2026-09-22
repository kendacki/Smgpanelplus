import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateApiKey } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticketReply.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const adminHash = await bcrypt.hash("Admin123!", 12);

  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@smgpanel.com",
      passwordHash: adminHash,
      role: "ADMIN",
      balance: 0,
      currency: "NGN",
      apiKey: generateApiKey(),
    },
  });

  await prisma.user.create({
    data: {
      username: "demo",
      email: "demo@smgpanel.com",
      passwordHash,
      role: "USER",
      balance: 50000,
      currency: "NGN",
      apiKey: generateApiKey(),
    },
  });

  const categories = await Promise.all(
    [
      { name: "Instagram", slug: "instagram", icon: "instagram", sortOrder: 1 },
      { name: "TikTok", slug: "tiktok", icon: "tiktok", sortOrder: 2 },
      { name: "Twitter / X", slug: "twitter", icon: "twitter", sortOrder: 3 },
      { name: "Facebook", slug: "facebook", icon: "facebook", sortOrder: 4 },
      { name: "YouTube", slug: "youtube", icon: "youtube", sortOrder: 5 },
      { name: "Telegram", slug: "telegram", icon: "telegram", sortOrder: 6 },
      { name: "Spotify", slug: "spotify", icon: "spotify", sortOrder: 7 },
    ].map((c) => prisma.category.create({ data: c })),
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const services = [
    {
      categoryId: bySlug.instagram,
      name: "Instagram Followers [Nigeria] — High Quality",
      description: "Nigerian-looking profiles. Refill 30 days. Start 0-1 hour.",
      rate: 1800,
      min: 50,
      max: 20000,
      refill: true,
      averageTime: "0-1 hours",
    },
    {
      categoryId: bySlug.instagram,
      name: "Instagram Followers [Africa Mix] — Fast",
      description: "African mix followers with fast start. No refill.",
      rate: 950,
      min: 100,
      max: 100000,
      refill: false,
      averageTime: "0-30 minutes",
    },
    {
      categoryId: bySlug.instagram,
      name: "Instagram Likes [Real] — Instant",
      description: "High quality likes for posts and reels.",
      rate: 220,
      min: 20,
      max: 50000,
      refill: true,
      averageTime: "instant",
    },
    {
      categoryId: bySlug.instagram,
      name: "Instagram Reel Views — Recommended",
      description: "Boost reel reach with fast views.",
      rate: 45,
      min: 500,
      max: 1000000,
      refill: false,
      averageTime: "0-15 minutes",
    },
    {
      categoryId: bySlug.instagram,
      name: "Instagram Comments [Custom Nigerian]",
      description: "Custom comments with Nigerian slang. Provide list.",
      type: "Custom Comments",
      rate: 8500,
      min: 5,
      max: 500,
      refill: false,
      averageTime: "1-6 hours",
    },
    {
      categoryId: bySlug.instagram,
      name: "Instagram Story Views",
      description: "Story views from active looking accounts.",
      rate: 80,
      min: 100,
      max: 20000,
      refill: false,
      averageTime: "0-30 minutes",
    },
    {
      categoryId: bySlug.tiktok,
      name: "TikTok Followers [Real] — HQ",
      description: "High quality TikTok followers. Refill 30 days.",
      rate: 2100,
      min: 50,
      max: 50000,
      refill: true,
      averageTime: "0-2 hours",
    },
    {
      categoryId: bySlug.tiktok,
      name: "TikTok Likes — Instant",
      description: "Cheap and fast TikTok likes.",
      rate: 180,
      min: 50,
      max: 200000,
      refill: true,
      averageTime: "instant",
    },
    {
      categoryId: bySlug.tiktok,
      name: "TikTok Views — For You Page boost",
      description: "Views that help content get more distribution.",
      rate: 20,
      min: 1000,
      max: 5000000,
      refill: false,
      averageTime: "0-15 minutes",
    },
    {
      categoryId: bySlug.tiktok,
      name: "TikTok Shares + Saves Combo",
      description: "Shares and saves to improve ranking signals.",
      rate: 650,
      min: 50,
      max: 20000,
      refill: false,
      averageTime: "0-2 hours",
    },
    {
      categoryId: bySlug.tiktok,
      name: "TikTok Live Comments [Custom]",
      description: "Custom live comments during your stream.",
      type: "Custom Comments",
      rate: 12000,
      min: 10,
      max: 300,
      refill: false,
      averageTime: "live window",
    },
    {
      categoryId: bySlug.twitter,
      name: "Twitter / X Followers [HQ]",
      description: "High quality followers with refill.",
      rate: 2400,
      min: 50,
      max: 25000,
      refill: true,
      averageTime: "0-3 hours",
    },
    {
      categoryId: bySlug.twitter,
      name: "Twitter / X Likes",
      description: "Fast likes for tweets.",
      rate: 300,
      min: 20,
      max: 20000,
      refill: false,
      averageTime: "0-30 minutes",
    },
    {
      categoryId: bySlug.twitter,
      name: "Twitter / X Retweets",
      description: "Retweets from mixed quality accounts.",
      rate: 700,
      min: 10,
      max: 5000,
      refill: false,
      averageTime: "0-1 hours",
    },
    {
      categoryId: bySlug.facebook,
      name: "Facebook Page Likes [Nigeria]",
      description: "Page likes with Nigerian audience targeting.",
      rate: 1600,
      min: 100,
      max: 30000,
      refill: true,
      averageTime: "0-6 hours",
    },
    {
      categoryId: bySlug.facebook,
      name: "Facebook Post Likes",
      description: "Likes for posts, reels and videos.",
      rate: 280,
      min: 20,
      max: 20000,
      refill: false,
      averageTime: "0-1 hours",
    },
    {
      categoryId: bySlug.facebook,
      name: "Facebook Video Views",
      description: "Video views for organic-looking reach.",
      rate: 55,
      min: 500,
      max: 500000,
      refill: false,
      averageTime: "0-30 minutes",
    },
    {
      categoryId: bySlug.youtube,
      name: "YouTube Subscribers [HQ]",
      description: "High quality subscribers. Drop-safe refill 30 days.",
      rate: 6500,
      min: 50,
      max: 10000,
      refill: true,
      averageTime: "0-24 hours",
    },
    {
      categoryId: bySlug.youtube,
      name: "YouTube Views [Speed 10k/day]",
      description: "Safe speed views. Use public video URL.",
      rate: 350,
      min: 1000,
      max: 500000,
      refill: true,
      averageTime: "0-6 hours",
    },
    {
      categoryId: bySlug.youtube,
      name: "YouTube Likes",
      description: "Likes for videos and shorts.",
      rate: 900,
      min: 20,
      max: 20000,
      refill: false,
      averageTime: "0-2 hours",
    },
    {
      categoryId: bySlug.telegram,
      name: "Telegram Members [HQ]",
      description: "Members for public groups and channels.",
      rate: 1100,
      min: 50,
      max: 50000,
      refill: true,
      averageTime: "0-2 hours",
    },
    {
      categoryId: bySlug.telegram,
      name: "Telegram Post Views",
      description: "Channel post views.",
      rate: 35,
      min: 500,
      max: 1000000,
      refill: false,
      averageTime: "0-15 minutes",
    },
    {
      categoryId: bySlug.telegram,
      name: "Telegram Comments [Custom]",
      description: "Custom comments on channel posts.",
      type: "Custom Comments",
      rate: 7800,
      min: 5,
      max: 200,
      refill: false,
      averageTime: "1-12 hours",
    },
    {
      categoryId: bySlug.spotify,
      name: "Spotify Plays [Safe]",
      description: "Plays from premium-looking accounts.",
      rate: 400,
      min: 1000,
      max: 100000,
      refill: false,
      averageTime: "0-24 hours",
    },
    {
      categoryId: bySlug.spotify,
      name: "Spotify Followers",
      description: "Artist or playlist followers.",
      rate: 1500,
      min: 50,
      max: 20000,
      refill: true,
      averageTime: "0-6 hours",
    },
  ];

  await prisma.service.createMany({ data: services });

  await prisma.blogPost.createMany({
    data: [
      {
        slug: "rise-of-tiktok-africa",
        title: "The Rise of TikTok: What African Creators Need to Know",
        excerpt:
          "TikTok has rewritten entertainment and brand discovery across Nigeria, Ghana and Kenya. Here is how to ride the wave without burning out.",
        content: `TikTok is now the discovery engine for music, fashion, comedy and commerce across Africa. Creators who treat it like a distribution channel — not just a camera — grow faster.

Start with a tight hook in the first two seconds, post when your city is awake, and pair organic posting with a smart boost when a video already has early traction. SMG Panel is built for that second step: amplifying content that already deserves a bigger stage.

The platforms reward watch time, saves and shares. A boost that only dumps empty views rarely compounds. Choose services that match the outcome you want — followers for social proof, views for reach, comments for conversation.

Finally, stay consistent. One viral clip is luck. A weekly system is a business.`,
      },
      {
        slug: "brand-building-on-social-media",
        title: "Brand and Branding Using Social Media",
        excerpt:
          "Social media changed how African businesses get found. Branding is no longer a logo — it is a repeatable presence.",
        content: `A brand is the feeling people get when they see your page. In Lagos, Accra and Nairobi that feeling is built in public: comments, reviews, live sessions, and proof that other people already trust you.

Use a consistent visual system, reply like a human, and keep your offer obvious. Then use SMG Panel to put distribution behind content that already converts. Followers without a clear offer waste money. Followers with a shop, booking link or WhatsApp line become pipeline.`,
      },
      {
        slug: "social-media-and-public-opinion",
        title: "The Evolving Role of Social Media in Shaping Public Opinion",
        excerpt:
          "Timelines now set the conversation. Creators and businesses who understand attention can participate without shouting.",
        content: `Public opinion on the continent moves through WhatsApp groups, Twitter spaces, Instagram carousels and TikTok stitches. Visibility is not vanity when your work, music or product needs a crowd.

The ethical line is clear: boost real work, never fake news. SMG Panel exists to help legitimate creators, stores and pages get seen — not to manufacture false events.`,
      },
      {
        slug: "fake-news-and-better-signals",
        title: "Fake News and Misinformation: Challenges and Solutions",
        excerpt:
          "False information spreads because it is designed to travel. The fix is better signals, not more noise.",
        content: `Misinformation travels on emotion. Brands that want long-term trust should invest in clear sourcing, community replies, and content people can verify.

If you use growth services, use them on authentic posts. Buying comments that claim things your business never did is a fast way to lose the room. SMG Panel services are for reach and engagement around work you actually published.`,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "Is SMG Panel safe for my account?",
        answer:
          "We use gradual, high-quality delivery and never ask for your password. Always keep 2FA on and avoid banned automation apps.",
        sortOrder: 1,
      },
      {
        question: "How fast do orders start?",
        answer:
          "Most view and like services start within minutes. Follower services typically start within 0-3 hours depending on the package.",
        sortOrder: 2,
      },
      {
        question: "What payment methods do you support?",
        answer:
          "Paystack, Flutterwave, bank transfer, M-Pesa, MoMo, USDT, and demo credit for testing. Currency can be NGN, USD, GHS or KES.",
        sortOrder: 3,
      },
      {
        question: "Do you offer a refill?",
        answer:
          "Services marked Refill include a 30-day refill if the drop is abnormal. Open a ticket with your order ID.",
        sortOrder: 4,
      },
      {
        question: "Can I resell with the API?",
        answer:
          "Yes. Every account can generate an API key from the dashboard and connect child panels or scripts.",
        sortOrder: 5,
      },
      {
        question: "What if I enter the wrong link?",
        answer:
          "Wrong links cannot always be redirected. Double-check the example format before you submit. Contact support immediately if you notice a mistake.",
        sortOrder: 6,
      },
    ],
  });

  await prisma.announcement.create({
    data: {
      title: "Welcome to SMG Panel",
      message:
        "New Nigerian Instagram comments and TikTok live packages are live. Demo login: demo / Password123!",
    },
  });

  console.log("Seed complete.");
  console.log("Admin  -> username: admin  password: Admin123!");
  console.log("Demo   -> username: demo   password: Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
