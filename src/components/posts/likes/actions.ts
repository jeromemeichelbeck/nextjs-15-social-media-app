"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikesInfo } from "@/lib/types";

export async function getLikesInfo(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      likes: {
        where: {
          userId: loggedInUser.id,
        },
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (post === null) {
    throw new Error("Post not found");
  }

  const data: LikesInfo = {
    likes: post._count.likes,
    isLikedByUser: post.likes.length > 0,
  };

  return data;
}

export async function likePost(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      authorId: true,
    },
  });

  if (post === null) {
    throw new Error("Post not found");
  }

  await prisma.$transaction([
    prisma.like.upsert({
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
    }),

    ...(post.authorId === loggedInUser.id
      ? []
      : [
          prisma.notification.create({
            data: {
              type: "LIKE",
              postId,
              issuerId: loggedInUser.id,
              recipientId: post.authorId,
            },
          }),
        ]),
  ]);
}

export async function removeLike(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      authorId: true,
    },
  });

  if (post === null) {
    throw new Error("Post not found");
  }

  await prisma.$transaction([
    prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    }),

    prisma.notification.deleteMany({
      where: {
        issuerId: loggedInUser.id,
        recipientId: post.authorId,
        postId,
        type: "LIKE",
      },
    }),
  ]);
}
