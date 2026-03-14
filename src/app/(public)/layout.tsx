import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccessibilityBar from "@/components/layout/AccessibilityBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AccessibilityBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
