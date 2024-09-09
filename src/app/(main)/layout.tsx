import MenuBar from "@/app/(main)/menu-bar";
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
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
      </div>
    </SessionProvider>
  );
}
