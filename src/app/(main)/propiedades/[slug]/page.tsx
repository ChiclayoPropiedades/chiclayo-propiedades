import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createPublicClient } from "@/shared/lib/supabase/server";
import { getPropertyBySlug } from "@/features/properties/services/get-properties";
import { PropertyDetails } from "@/features/properties/components/property-details";
import { formatPrice } from "@/shared/lib/format";
import { propertyJsonLd } from "@/shared/lib/structured-data";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("properties")
    .select("slug")
    .eq("is_active", true);
  return (data ?? []).map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const property = await getPropertyBySlug(slug);
    if (!property) return { title: "Propiedad no encontrada" };
    const coverImage = property.property_images?.find((img) => img.is_cover) ??
      property.property_images?.[0] ?? null;

    return {
      title: property.title,
      description:
        property.description ??
        `${property.type} en ${property.operation} en ${property.district}, ${property.city}. Precio: ${formatPrice(property.price, property.currency)}.`,
      openGraph: {
        title: property.title,
        description:
          property.description ??
          `${property.type} en ${property.operation} en ${property.district}`,
        images: coverImage ? [{ url: coverImage.url, alt: coverImage.alt_text ?? property.title }] : [],
        type: "article",
      },
    };
  } catch {
    return {
      title: "Propiedad",
    };
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let property: Awaited<ReturnType<typeof getPropertyBySlug>> | null = null;

  try {
    property = await getPropertyBySlug(slug);
  } catch {
    notFound();
  }

  if (!property) notFound();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            propertyJsonLd({
              title: property.title,
              description: property.description ?? null,
              price: property.price,
              currency: property.currency,
              address: property.address ?? '',
              district: property.district,
              type: property.type,
              slug: property.slug,
            })
          ),
        }}
      />
      <PropertyDetails property={property} />
    </main>
  );
}
