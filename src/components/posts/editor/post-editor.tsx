"use client";

import { useSession } from "@/app/(main)/session-provider";
import UserAvatar from "@/components/user-avatar";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import AddAttachmentsButton from "@/components/posts/editor/add-attachments-button";
import AttachmentPreviews from "@/components/posts/editor/attachment-previews";
import { useSubmitPostMutation } from "@/components/posts/editor/mutations";
import useMediaUpload from "@/components/posts/editor/useMediaUpload";
import LoadingButton from "@/components/ui/loading-button";
import { useDropzone } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import "./styles.css";
import { cn } from "@/lib/utils";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUpload,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick: _, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((attachment) => attachment.mediaId)
          .filter((mediaId) => mediaId !== undefined),
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {attachments.length > 0 ? (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      ) : null}
      <div className="flex items-center justify-end gap-3">
        {isUploading ? (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        ) : null}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          disabled={input.trim() === "" || isUploading}
          className="min-w-20"
          loading={mutation.isPending}
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
