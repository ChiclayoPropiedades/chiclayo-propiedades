import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/shared/components/ui/sonner"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://chiclayopropiedades.com'
  ),
  title: {
    default: 'Chiclayo Propiedades - Tu socio inmobiliario de confianza',
    template: '%s | Chiclayo Propiedades',
  },
  description:
    'Encuentra las mejores propiedades en Chiclayo y Lambayeque. Casas, departamentos, terrenos en venta y alquiler. Asesores inmobiliarios expertos.',
  keywords: [
    'inmobiliaria chiclayo',
    'propiedades chiclayo',
    'casas en venta chiclayo',
    'departamentos chiclayo',
    'terrenos chiclayo',
    'alquiler chiclayo',
    'inmobiliaria lambayeque',
  ],
  authors: [{ name: 'Chiclayo Propiedades' }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: 'Chiclayo Propiedades',
    title: 'Chiclayo Propiedades - Tu socio inmobiliario de confianza',
    description:
      'Encuentra las mejores propiedades en Chiclayo y Lambayeque.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
