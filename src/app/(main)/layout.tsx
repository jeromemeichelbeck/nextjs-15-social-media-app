import Navbar from "@/app/(main)/navbar";
import SessionProvider from "@/app/(main)/session-provider";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

export default async function MainLayout({ children }: PropsWithChildren<{}>) {
  const sessionContext = await validateRequest();

  if (sessionContext.user === null) {
    redirect("/login");
  }

  return (
    <SessionProvider value={sessionContext}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </div>
    </SessionProvider>
  );
}
