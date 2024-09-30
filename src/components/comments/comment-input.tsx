"use client";

import { useSubmitCommentMutation } from "@/components/comments/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostData } from "@/lib/types";
import { Loader2Icon, SendHorizonalIcon } from "lucide-react";
import { FormEvent, useState } from "react";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [commentInput, setCommentInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!commentInput) {
      return;
    }

    mutation.mutate(
      { comment: { content: commentInput }, post },
      { onSuccess: () => setCommentInput("") },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment..."
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!commentInput.trim() || mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <SendHorizonalIcon />
        )}
      </Button>
    </form>
  );
}
