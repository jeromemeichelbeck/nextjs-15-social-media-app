import UserPosts from "@/app/(main)/users/[username]/user-posts";
import { validateRequest } from "@/auth";
import TrendsSidebar from "@/components/trends-sidebar";
import UserProfile from "@/components/user-profile";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

interface ProfilePageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUserId),
  });

  if (user === null) {
    notFound();
  }

  return user;
});

export async function generateMetadata({
  params: { username },
}: ProfilePageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    // This can't happen because users are automatically redirected if not logged in
    // LINK src/app/(main)/layout.tsx#redirect-to-login
    return {};
  }

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} @${user.username}`,
  };
}

export default async function ProfilePage({
  params: { username },
}: ProfilePageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    return (
      <p className="text-destructive">You are not allowed to view this page</p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
