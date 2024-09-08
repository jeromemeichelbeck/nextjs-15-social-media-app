import SessionProvider from "@/app/(main)/session-provider";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";

export default async function MainLayout({ children }: PropsWithChildren<{}>) {
  const sessionContext = await validateRequest();

  if (sessionContext.user === null) {
    redirect("/login");
  }

  return <SessionProvider value={sessionContext}>{children}</SessionProvider>;
}
