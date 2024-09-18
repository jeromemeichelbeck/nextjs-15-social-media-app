"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect } from "@/lib/types";

export async function getFollowersInfo(userId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      followers: {
        where: {
          followerId: loggedInUser.id,
        },
        select: {
          followerId: true,
        },
      },
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  if (user === null) {
    throw new Error("User not found");
  }

  const data: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.length > 0,
  };

  return data;
}

export async function followUser(userId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
    },
    create: {
      followerId: loggedInUser.id,
      followingId: userId,
    },
    update: {}, // Ignore if it already exists
  });
}

export async function unfollowUser(userId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  await prisma.follow.deleteMany({
    where: {
      followerId: loggedInUser.id,
      followingId: userId,
    },
  });
}

export async function getUserDataByUsername(username: string) {
  console.log("fetching data for user", username);
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUser.id),
  });

  if (user === null) {
    throw new Error("User not found");
  }

  return user;
}
