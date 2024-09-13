import { useDeletePostMutation } from "@/components/posts/mutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { PostData } from "@/lib/types";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

export default function DeletePostDialog({
  post,
  open,
  onClose,
}: DeletePostDialogProps) {
  const { mutate, isPending } = useDeletePostMutation();

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen || !isPending) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action can not be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutate(post.id, { onSuccess: onClose })}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={() => {
              if (!isPending) {
                onClose();
              }
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
