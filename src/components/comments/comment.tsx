"use client";

import UserAvatar from "@/components/user/user-avatar";
import UserTooltip from "@/components/user/user-tooltip";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.author}>
          <Link href={`/users/${comment.author.username}`}>
            <UserAvatar avatarUrl={comment.author.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.author}>
            <Link
              href={`/users/${comment.author.username}`}
              className="font-medium hover:underline"
            >
              {comment.author.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  );
}
