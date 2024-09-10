import { Skeleton } from "@/components/ui/skeleton";

interface PostsLoadingSkeletonProps {
  numberOfPosts?: number;
}

export default function PostsLoadingSkeleton({
  numberOfPosts,
}: PostsLoadingSkeletonProps) {
  return (
    <div className="space-y-5">
      {Array(numberOfPosts ?? 3)
        .fill(null)
        .map((_, index) => (
          <PostLoadingSkeleton key={index} />
        ))}
    </div>
  );
}

function PostLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-16 rounded" />
    </div>
  );
}
