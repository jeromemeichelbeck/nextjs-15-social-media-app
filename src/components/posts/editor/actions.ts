"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema, CreatePostValues } from "@/lib/validation";

export async function submitPost(post: CreatePostValues) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw Error("Unauthorized");
  }

  const { content, mediaIds } = createPostSchema.parse(post);

  return prisma.post.create({
    data: {
      content,
      authorId: loggedInUser.id,
      attachments: {
        connect: mediaIds.map((mediaId) => ({ id: mediaId })),
      },
    },
    include: getPostDataInclude(loggedInUser.id),
  });
}
