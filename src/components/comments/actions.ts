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

  const [addedComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        postId: post.id,
        authorId: loggedInUser.id,
      },
      include: getCommentDataInclude(loggedInUser.id),
    }),

    ...(post.authorId === loggedInUser.id
      ? []
      : [
          prisma.notification.create({
            data: {
              type: "COMMENT",
              issuerId: loggedInUser.id,
              recipientId: post.authorId,
              postId: post.id,
            },
          }),
        ]),
  ]);

  return addedComment;
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

export async function deleteComment(commentId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const commentToDelete = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (commentToDelete === null) {
    throw new Error("Comment not found");
  }

  if (commentToDelete.authorId !== loggedInUser.id) {
    throw new Error("USer does not own the comment to delete");
  }

  return prisma.comment.delete({
    where: { id: commentId },
    include: getCommentDataInclude(loggedInUser.id),
  });
}
