import {
  bookmarkPost,
  getBookmarkInfo,
  removeBookmark,
} from "@/components/posts/bookmarks/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmarks-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () => getBookmarkInfo(postId),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser ? removeBookmark(postId) : bookmarkPost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const currentBookmarkSate =
        queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !currentBookmarkSate?.isBookmarkedByUser,
      }));

      return currentBookmarkSate;
    },
    onSuccess: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "added to bookmarks" : "removed from bookmarks"}`,
      });
      await queryClient.invalidateQueries({ queryKey: ["post-feed"] });
    },
    onError: (error, _variables, currentBookmarkState) => {
      queryClient.setQueryData(queryKey, currentBookmarkState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });

  return (
    <button onClick={() => mutate()}>
      <BookmarkIcon
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
