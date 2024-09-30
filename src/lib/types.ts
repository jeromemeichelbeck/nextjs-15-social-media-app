import { Prisma } from "@prisma/client";

export const getUserDataSelect = (loggedInUserId: string) =>
  ({
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  }) satisfies Prisma.UserSelect;

export const getPostDataInclude = (loggedInUserId: string) =>
  ({
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    author: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
  }) satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type PostsPage = {
  posts: PostData[];
  nextCursor: string | null;
};

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    author: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type CommentsPage = {
  comments: CommentData[];
  previousCursor: string | null;
};

export type FollowerInfo = {
  followers: number;
  isFollowedByUser: boolean;
};

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export type LikesInfo = {
  likes: number;
  isLikedByUser: boolean;
};

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};

export const notificationDataInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationDataInclude;
}>;

export type NotificationsPage = {
  notifications: NotificationData[];
  nextCursor: string | null;
};
