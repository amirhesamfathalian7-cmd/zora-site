import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { Story } from "@/components/site/story";
import { Features } from "@/components/site/features";
import { BirdsSection } from "@/components/site/birds-section";
import { Tour } from "@/components/site/tour";
import { UpdateSystem } from "@/components/site/update-system";
import { DownloadCenter } from "@/components/site/download";
import { Faq } from "@/components/site/faq";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Story />
        <Features />
        <BirdsSection />
        <Tour />
        <UpdateSystem />
        <DownloadCenter />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
