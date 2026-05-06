import Footer from "./Footer";

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 bg-[#F9F6F0]">{children}</main>
      <Footer />
    </>
  );
}
