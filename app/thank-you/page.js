import ThankYouPage from "@/components/site/ThankYouPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "You're registered",
  description: "Thanks for saving your seat. Check your email for the workshop details.",
  robots: { index: false, follow: false },
};

async function getThankYouContent() {
  try {
    return await prisma.siteContent.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    });
  } catch {
    return null;
  }
}

export default async function Page({ searchParams }) {
  const email = typeof searchParams?.email === "string" ? searchParams.email : "";
  const content = await getThankYouContent();
  return <ThankYouPage defaultEmail={email} content={content} />;
}
