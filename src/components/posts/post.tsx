"use client";

import { useSession } from "@/app/(main)/session-provider";
import Linkify from "@/components/linkify";
import PostMoreButton from "@/components/posts/post-more-button";
import UserAvatar from "@/components/user-avatar";
import UserTooltip from "@/components/user-tooltip";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.author}>
            <Link href={`/users/${post.author.username}`}>
              <UserAvatar avatarUrl={post.author.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.author}>
              <Link
                href={`/users/${post.author.username}`}
                className="block font-medium hover:underline"
              >
                {post.author.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.authorId === user.id ? (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        ) : null}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
    </article>
  );
}
