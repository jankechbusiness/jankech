import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jankech Web | Moderní weby, SEO a automatizace" },
      { name: "description", content: "Moderní weby pro lokální firmy, které budují důvěru a přivádějí kvalitní poptávky." },
      { property: "og:title", content: "Jankech Web | Z návštěv na poptávky" },
      { property: "og:description", content: "Web design, SEO a automatizace pro růst lokálních firem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});
