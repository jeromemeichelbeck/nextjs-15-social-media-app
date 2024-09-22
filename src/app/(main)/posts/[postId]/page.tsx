import UserInfoSidebar from "@/app/(main)/posts/[postId]/user-info-sidebar";
import { validateRequest } from "@/auth";
import Post from "@/components/posts/post";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { Loader2Icon } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PostPageProps {
  params: {
    postId: string;
  };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: getPostDataInclude(loggedInUserId),
  });

  if (post === null) {
    notFound();
  }

  return post;
});

export async function generateMetadata({
  params: { postId },
}: PostPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    return {};
  }

  const post = await getPost(postId, loggedInUser.id);

  return {
    title: `${post.author.displayName} ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostPage({ params: { postId } }: PostPageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    return (
      <p className="text-destructive">You are not allowed to view this page</p>
    );
  }

  const post = await getPost(postId, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none space-y-5 lg:block">
        <Suspense fallback={<Loader2Icon className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.author} />
        </Suspense>
      </div>
    </main>
  );
}
