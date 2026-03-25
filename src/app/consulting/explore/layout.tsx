import { notFound } from "next/navigation";
import { getGoldenFlowsState } from "@/lib/golden-flows";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = getGoldenFlowsState();

  if (state === "off") {
    notFound();
  }

  return (
    <>
      {state === "hidden" && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      {children}
    </>
  );
}
