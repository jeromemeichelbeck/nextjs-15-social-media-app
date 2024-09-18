"use client";

import { followUser, unfollowUser } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser ? unfollowUser(userId) : followUser(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const currentFollowSate =
        queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (currentFollowSate?.followers || 0) +
          (currentFollowSate?.isFollowedByUser ? -1 : +1),
        isFollowedByUser: !currentFollowSate?.isFollowedByUser,
      }));

      return currentFollowSate;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["post-feed"] });
    },
    onError: (error, _variables, currentFollowSate) => {
      queryClient.setQueryData(queryKey, currentFollowSate);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
