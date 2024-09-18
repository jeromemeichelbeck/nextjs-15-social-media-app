"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";

export async function getForYouPosts(cursor: string | null) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const pageSize = 10;

  const posts = await prisma.post.findMany({
    include: getPostDataInclude(loggedInUser.id),
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

  const data: PostsPage = {
    posts: posts.slice(0, pageSize),
    nextCursor,
  };

  return data;
}

export async function getFollowingPosts(cursor: string | null) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const pageSize = 10;

  const posts = await prisma.post.findMany({
    include: getPostDataInclude(loggedInUser.id),
    where: {
      author: {
        followers: {
          some: {
            followerId: loggedInUser.id,
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

  const data: PostsPage = {
    posts: posts.slice(0, pageSize),
    nextCursor,
  };

  return data;
}

export async function deletePost(postId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw Error("Unauthorized");
  }

  const postToDelete = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (postToDelete === null) {
    throw Error("Post not found");
  }

  if (postToDelete.authorId !== loggedInUser.id) {
    throw new Error("User does not own the post to delete");
  }

  return prisma.post.delete({
    where: { id: postId },
    include: getPostDataInclude(loggedInUser.id),
  });
}

export async function getUserPosts(userId: string, cursor: string | null) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const pageSize = 10;

  const posts = await prisma.post.findMany({
    include: getPostDataInclude(loggedInUser.id),
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

  const data: PostsPage = {
    posts: posts.slice(0, pageSize),
    nextCursor,
  };

  return data;
}
