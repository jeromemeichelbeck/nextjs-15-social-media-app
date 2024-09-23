"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarksInfo } from "@/lib/types";

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

  const data: BookmarksInfo = {
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
