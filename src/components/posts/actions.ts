"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export async function deletePost(postId: string) {
  const { user } = await validateRequest();

  if (user === null) {
    throw Error("Unauthorized");
  }

  const postToDelete = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (postToDelete === null) {
    throw Error("Post not found");
  }

  if (postToDelete.authorId !== user.id) {
    throw new Error("User does not own the post to delete");
  }

  return prisma.post.delete({
    where: { id: postId },
    include: postDataInclude,
  });
}
