
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex min-h-screen w-full flex-col justify-center items-center ">
        {children}
      </div>
  );
}
