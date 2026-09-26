import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oliver Jankech | Jednoduché weby a digitální projekty" },
      { name: "description", content: "Jsem 15letý student gymnázia a tvořím jednoduché weby, online prezentace a digitální projekty — poctivě a za férovou cenu." },
      { property: "og:title", content: "Oliver Jankech | Jednoduché weby a digitální projekty" },
      { property: "og:description", content: "Student gymnázia, který rád pomůže s menším webem nebo online prezentací." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});
