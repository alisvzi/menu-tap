import Header from "./_components/Header";

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto shadow-2xl overflow-hidden">
        {children}
      </main>
    </>
  );
}
