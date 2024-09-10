"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema, CreatePostValues } from "@/lib/validation";

export async function submitPost(post: CreatePostValues) {
  const { user } = await validateRequest();

  if (user === null) {
    throw Error("Unauthorized");
  }

  const { content } = createPostSchema.parse(post);

  await prisma.post.create({ data: { content, authorId: user.id } });
}
