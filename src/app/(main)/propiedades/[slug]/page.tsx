import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPropertyBySlug } from "@/features/properties/services/get-properties";
import { PropertyDetails } from "@/features/properties/components/property-details";
import { formatPrice } from "@/shared/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const property = await getPropertyBySlug(slug);
    const coverImage = property.property_images?.find((img) => img.is_cover) ??
      property.property_images?.[0] ?? null;

    return {
      title: `${property.title} | Chiclayo Propiedades`,
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
      title: "Propiedad | Chiclayo Propiedades",
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
      <PropertyDetails property={property} />
    </main>
  );
}
