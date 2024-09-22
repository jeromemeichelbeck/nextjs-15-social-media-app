import {
  getLikesInfo,
  likePost,
  removeLike,
} from "@/components/posts/likes/actions";
import { useToast } from "@/hooks/use-toast";
import { LikesInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialState: LikesInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["likes-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () => getLikesInfo(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data?.isLikedByUser ? removeLike(postId) : likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const currentLikeSate = queryClient.getQueryData<LikesInfo>(queryKey);

      queryClient.setQueryData<LikesInfo>(queryKey, () => ({
        likes:
          (currentLikeSate?.likes || 0) +
          (currentLikeSate?.isLikedByUser ? -1 : +1),
        isLikedByUser: !currentLikeSate?.isLikedByUser,
      }));

      return currentLikeSate;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["post-feed"] });
    },
    onError: (error, _variables, currentLikeSate) => {
      queryClient.setQueryData(queryKey, currentLikeSate);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <HeartIcon
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes}
        <span className="hidden sm:inline">
          {" "}
          like{data.likes !== 1 ? "s" : ""}
        </span>
      </span>
    </button>
  );
}
