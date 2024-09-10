import { submitPost } from "@/components/posts/editor/actions";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubmitPostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: () => {},
    onError: (error) => {
      console.error(error),
        toast({
          variant: "destructive",
          description: "Failed to post. Please try again",
        });
    },
  });

  return mutation;
}
