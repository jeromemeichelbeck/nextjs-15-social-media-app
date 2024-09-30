import CommentInput from "@/components/comments/comment-input";
import { PostData } from "@/lib/types";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  return (
    <div>
      <CommentInput post={post} />
    </div>
  );
}
