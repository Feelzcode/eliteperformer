import ThankYouPage from "@/components/site/ThankYouPage";

export const dynamic = "force-dynamic";

export default function Page({ searchParams }) {
  const email = typeof searchParams?.email === "string" ? searchParams.email : "";
  return <ThankYouPage defaultEmail={email} />;
}
