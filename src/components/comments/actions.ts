"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude, PostData } from "@/lib/types";
import { CreateCommentValues, createCommmentSchema } from "@/lib/validation";

interface SubmitCommentDTO {
  comment: CreateCommentValues;
  post: PostData;
}

export async function submitComment({ comment, post }: SubmitCommentDTO) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw Error("Unauthorized");
  }

  const { content } = createCommmentSchema.parse(comment);

  return prisma.comment.create({
    data: {
      content,
      postId: post.id,
      authorId: loggedInUser.id,
    },
    include: getCommentDataInclude(loggedInUser.id),
  });
}

interface GetPostCommentDTO {
  postId: string;
  cursor: string | null;
}

export async function getPostComments({ postId, cursor }: GetPostCommentDTO) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const pageSize = 5;

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: getCommentDataInclude(loggedInUser.id),
    orderBy: {
      createdAt: "asc",
    },
    take: -pageSize - 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const previousCursor = comments.length > pageSize ? comments[0].id : null;

  const data: CommentsPage = {
    comments: comments.length > pageSize ? comments.slice(1) : comments,
    previousCursor,
  };

  return data;
}
