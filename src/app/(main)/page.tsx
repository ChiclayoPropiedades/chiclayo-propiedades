import { organizationJsonLd } from "@/shared/lib/structured-data"
import { HeroSection } from "@/shared/components/animated/hero-section"
import { AboutSection } from "@/shared/components/sections/about-section"
import { FeaturedPropertiesSection } from "@/shared/components/sections/featured-properties-section"
import { RankingSection } from "@/shared/components/sections/ranking-section"
import { TrainingsSection } from "@/shared/components/sections/trainings-section"
import { NewsSection } from "@/shared/components/sections/news-section"
import { NewsletterSection } from "@/shared/components/sections/newsletter-section"

export default async function HomePage() {
  return (
    <div className="snap-y snap-proximity">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <div className="snap-start">
        <HeroSection />
      </div>
      <div className="snap-start">
        <AboutSection />
      </div>
      <div className="snap-start">
        <FeaturedPropertiesSection />
      </div>
      <div className="snap-start">
        <RankingSection />
      </div>
      <div className="snap-start">
        <TrainingsSection />
      </div>
      <div className="snap-start">
        <NewsSection />
      </div>
      <div className="snap-start">
        <NewsletterSection />
      </div>
    </div>
  )
}
