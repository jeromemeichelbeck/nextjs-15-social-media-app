"use client";

import Notification from "@/app/(main)/notifications/notification";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/components/notifications/actions";
import PostsLoadingSkeleton from "@/components/posts/posts-loading-skeleton";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

export default function Notifications() {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) => getNotifications(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastpage) => lastpage.nextCursor,
  });

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  const { mutate } = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      console.log("success");
      queryClient.setQueryData(["unread-notifications-count"], 0);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (status === "pending") {
    return <PostsLoadingSkeleton numberOfPosts={10} />;
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading notifications
      </p>
    );
  }

  if (notifications.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any notifications for now
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && (
        <Loader2Icon className="mx-auto my-3 animate-spin" />
      )}
    </InfiniteScrollContainer>
  );
}
