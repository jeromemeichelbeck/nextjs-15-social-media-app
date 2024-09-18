import { getFollowersInfo } from "@/components/actions";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(
  userId: string,
  initialState: FollowerInfo,
) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () => getFollowersInfo(userId),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
