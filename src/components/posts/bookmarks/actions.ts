"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo, getPostDataInclude, PostsPage } from "@/lib/types";

export async function getBookmarkInfo(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId: loggedInUser.id,
        postId,
      },
    },
  });

  const data: BookmarkInfo = {
    isBookmarkedByUser: bookmark !== null,
  };

  return data;
}

export async function bookmarkPost(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  await prisma.bookmark.upsert({
    where: {
      userId_postId: {
        userId: loggedInUser.id,
        postId,
      },
    },
    create: {
      userId: loggedInUser.id,
      postId,
    },
    update: {},
  });
}

export async function removeBookmark(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  await prisma.bookmark.deleteMany({
    where: {
      userId: loggedInUser.id,
      postId,
    },
  });
}

export async function getBookmarkedPosts(cursor: string | null) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const pageSize = 10;

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: loggedInUser.id,
    },
    include: {
      post: {
        include: getPostDataInclude(loggedInUser.id),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor =
    bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

  const data: PostsPage = {
    posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
    nextCursor,
  };

  return data;
}
