import { HeroBanner } from "./components/HeroBanner";
import { PopularCategoriesGrid } from "./components/PopularCategoriesGrid";
import { DualPromoBanners } from "./components/DualPromoBanners";
import { RecommendedSection } from "./components/RecommendedSection";
import { ClearanceSaleSection } from "./components/ClearanceSaleSection";
import { NewArrivalSection } from "./components/NewArrivalSection";
import { WhatsNewArticlesSection } from "./components/WhatsNewArticlesSection";
import { TrustBadgesBar } from "./components/TrustBadgesBar";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <PopularCategoriesGrid />
      <DualPromoBanners />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">
        <RecommendedSection />
        <ClearanceSaleSection />
        <NewArrivalSection />
        <WhatsNewArticlesSection />
      </div>

      <TrustBadgesBar />
    </div>
  );
}
