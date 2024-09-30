"use client";

import { getPostComments } from "@/components/comments/actions";
import Comment from "@/components/comments/comment";
import CommentInput from "@/components/comments/comment-input";
import { Button } from "@/components/ui/button";
import { PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        getPostComments({ cursor: pageParam, postId: post.id }),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage ? (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      ) : null}
      {status === "pending" ? (
        <Loader2Icon className="mx-auto animate-spin" />
      ) : null}
      {status === "success" && comments.length < 1 ? (
        <p className="text-center text-muted-foreground">No comments yet</p>
      ) : null}
      {status === "error" ? (
        <p className="text-center text-destructive">
          An error occured while loading comments
        </p>
      ) : null}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
