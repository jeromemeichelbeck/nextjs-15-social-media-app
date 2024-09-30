import { useSession } from "@/app/(main)/session-provider";
import { deleteComment, submitComment } from "@/components/comments/actions";
import { useToast } from "@/hooks/use-toast";
import { CommentData, CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
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

export function useDeleteCommentMutation(comment: CommentData) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryFilters = {
        queryKey: ["comments", comment.postId],
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilters);

      queryClient.setQueriesData<InfiniteData<CommentsPage, string | null>>(
        queryFilters,
        (currentData) => {
          if (!currentData) {
            return;
          }

          return {
            pageParams: currentData.pageParams,
            pages: currentData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter(
                (comment) => comment.id != deletedComment.id,
              ),
            })),
          };
        },
      );

      toast({
        description: "Comment deleted",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment",
      });
    },
  });

  return mutation;
}
