import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow-button";
import Linkify from "@/components/linkify";
import UserAvatar from "@/components/user-avatar";
import UserTooltip from "@/components/user-tooltip";
import { UserData } from "@/lib/types";
import Link from "next/link";

interface UserInfoSidebarPorps {
  user: UserData;
}

export default async function UserInfoSidebar({ user }: UserInfoSidebarPorps) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    return null;
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About {user.displayName}</div>
      <UserTooltip user={user}>
        <Link
          href={`/profile/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="none flex" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      {user.bio ? (
        <Linkify>
          <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </div>
        </Linkify>
      ) : null}
      {user.id !== loggedInUser.id ? (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              (follower) => follower.followerId === loggedInUser.id,
            ),
          }}
        />
      ) : null}
    </div>
  );
}
