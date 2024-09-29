import { PostData } from "@/lib/types";
import { MessageSquareIcon } from "lucide-react";

interface CommentsButtonProps {
  post: PostData;
  onClick: () => void;
}

export default function CommentsButton({ post, onClick }: CommentsButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquareIcon className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">
          comment{post._count.comments === 1 ? "" : "s"}
        </span>
      </span>
    </button>
  );
}
