import ThankYouPage from "@/components/site/ThankYouPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "You're registered",
  description: "Thanks for saving your seat. Check your email for the workshop details.",
  robots: { index: false, follow: false },
};

export default function Page({ searchParams }) {
  const email = typeof searchParams?.email === "string" ? searchParams.email : "";
  return <ThankYouPage defaultEmail={email} />;
}
