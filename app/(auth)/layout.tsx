
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex min-h-screen w-screen flex-col justify-center items-center bg-background">
        {children}
      </div>
  );
}
