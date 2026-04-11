import { organizationJsonLd } from "@/shared/lib/structured-data"
import { HeroSection } from "@/shared/components/animated/hero-section"
import { ScrollReveal } from "@/shared/components/animated/scroll-reveal"
import { AboutSection } from "@/shared/components/sections/about-section"
import { FeaturedPropertiesSection } from "@/shared/components/sections/featured-properties-section"
import { RankingSection } from "@/shared/components/sections/ranking-section"
import { TrainingsSection } from "@/shared/components/sections/trainings-section"
import { NewsSection } from "@/shared/components/sections/news-section"
import { NewsletterSection } from "@/shared/components/sections/newsletter-section"

export const revalidate = 60;

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <HeroSection />
      <AboutSection />
      <ScrollReveal>
        <FeaturedPropertiesSection />
      </ScrollReveal>
      <ScrollReveal>
        <RankingSection />
      </ScrollReveal>
      <ScrollReveal>
        <TrainingsSection />
      </ScrollReveal>
      <ScrollReveal>
        <NewsSection />
      </ScrollReveal>
      <NewsletterSection />
    </>
  )
}
