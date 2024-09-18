import { useSession } from "@/app/(main)/session-provider";
import { submitPost } from "@/components/posts/editor/actions";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilters = {
        queryKey: ["post-feed"],
        predicate: (query) => {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilters);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilters,
        (currentData) => {
          const firstPage = currentData?.pages[0];

          if (firstPage) {
            return {
              pageParams: currentData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...currentData?.pages.slice(1),
              ],
            };
          }

          return {
            pages: [
              {
                posts: [newPost],
                nextCursor: null,
              },
            ],
            pageParams: currentData?.pageParams || [],
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilters.queryKey,
        predicate(query) {
          return queryFilters.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: "Post created",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again",
      });
    },
  });

  return mutation;
}
