import { useSession } from "@/app/(main)/session-provider";
import { submitComment } from "@/components/comments/actions";
import { useToast } from "@/hooks/use-toast";
import { CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey = ["comments", postId] satisfies QueryKey;

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueriesData<InfiniteData<CommentsPage, string | null>>(
        { queryKey },
        (currentData) => {
          const firstPage = currentData?.pages[0];

          if (firstPage) {
            return {
              pageParams: currentData.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, newComment],
                  previousCursor: firstPage.previousCursor,
                },
                ...currentData.pages.slice(1),
              ],
            };
          }

          return {
            pages: [{ comments: [newComment], previousCursor: null }],
            pageParams: currentData?.pageParams || [],
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Comment created",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to comment. Please try again",
      });
    },
  });

  return mutation;
}
