import { Hero } from "@/components/Hero";
import { Sidebar } from "@/components/Sidebar";
import { PresetGrid } from "@/components/PresetGrid";
import { CTASection } from "@/components/CTASection";
import { getPresets } from "@/lib/presets";

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string, sort?: string, search?: string }> }) {
  const { category, sort, search } = await searchParams;
  const { presets, counts } = await getPresets(category, sort, search);

  return (
    <div className="text-foreground font-sans selection:bg-green-500/30 selection:text-green-200">
      <main className="max-w-[1400px] mx-auto">
        <Hero />

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-4 md:px-6 py-6 md:py-8">
          <Sidebar counts={counts} />
          <PresetGrid presets={presets} />
        </div>

        <CTASection />
      </main>
    </div>
  );
}
