"use client";

import { useSession } from "@/app/(main)/session-provider";
import Comments from "@/components/comments/comments";
import Linkify from "@/components/linkify";
import BookmarkButton from "@/components/posts/bookmarks/bookmark-button";
import CommentsButton from "@/components/posts/comments-button";
import LikeButton from "@/components/posts/likes/like-button";
import MediaPreviews from "@/components/posts/media-previews";
import PostMoreButton from "@/components/posts/post-more-button";
import UserAvatar from "@/components/user/user-avatar";
import UserTooltip from "@/components/user/user-tooltip";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const [showComments, setShowComments] = useState(false);

  const { user: loggedInUser } = useSession();

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
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.authorId === loggedInUser.id ? (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        ) : null}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {post.attachments.length > 0 ? (
        <MediaPreviews attachments={post.attachments} />
      ) : null}
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some(
                (like) => like.userId === loggedInUser.id,
              ),
            }}
          />
          <CommentsButton
            post={post}
            onClick={() => setShowComments((currentValue) => !currentValue)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === loggedInUser.id,
            ),
          }}
        />
      </div>
      {showComments ? <Comments post={post} /> : null}
    </article>
  );
}
