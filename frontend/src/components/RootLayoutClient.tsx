'use client';

import { SessionProvider } from "next-auth/react";
import HeaderContent from "@/components/HeaderContent";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <HeaderContent />
      {children}
    </SessionProvider>
  );
}
