import { prisma } from "@/lib/prisma";
import ThankYouPage from "@/components/site/ThankYouPage";

export const revalidate = 60;

export default async function Page() {
  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });
  return <ThankYouPage profilePhoto={content.profilePhoto} />;
}
