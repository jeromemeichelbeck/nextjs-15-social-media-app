"use client";

import { useDeleteCommentMutation } from "@/components/comments/mutations";
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
import { CommentData } from "@/lib/types";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export default function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const { mutate, isPending } = useDeleteCommentMutation(comment);

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
          <DialogTitle>Delete comment?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this comment? This action can not be
          undone.
        </DialogDescription>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutate(comment.id, { onSuccess: onClose })}
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
