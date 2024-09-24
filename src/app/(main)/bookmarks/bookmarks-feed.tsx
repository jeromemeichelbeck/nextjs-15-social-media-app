"use client";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { getBookmarkedPosts } from "@/components/posts/bookmarks/actions";
import Post from "@/components/posts/post";
import PostsLoadingSkeleton from "@/components/posts/posts-loading-skeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

export default function BookmarksFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) => getBookmarkedPosts(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton numberOfPosts={5} />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading bookmarked posts
      </p>
    );
  }

  if (posts.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmark for now
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <Loader2Icon className="mx-auto my-3 animate-spin" />
      )}
    </InfiniteScrollContainer>
  );
}
