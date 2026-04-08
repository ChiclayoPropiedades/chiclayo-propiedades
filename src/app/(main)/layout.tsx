import { Header } from "@/shared/components/layout/header"
import { Footer } from "@/shared/components/layout/footer"
import { WhatsAppButton } from "@/shared/components/layout/whatsapp-button"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
