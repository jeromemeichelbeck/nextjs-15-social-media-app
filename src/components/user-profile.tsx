import FollowButton from "@/components/follow-button";
import FolloewerCount from "@/components/follower-count";
import Linkify from "@/components/linkify";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

export default async function UserProfile({
  user,
  loggedInUserId,
}: UserProfileProps) {
  const followersInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="gap3 flex flex-wrap sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h3 className="text-3xl font-bold">{user.displayName}</h3>
            <div className="text-muted-foreground">@{user.username}</div>
            <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
            <div className="flex items-center gap-3">
              <span>
                Posts:{" "}
                <span className="font-semibold">
                  {formatNumber(user._count.posts)}
                </span>
              </span>
              <FolloewerCount userId={user.id} initialState={followersInfo} />
            </div>
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followersInfo} />
        )}
      </div>
      {user.bio ? (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      ) : null}
    </div>
  );
}
