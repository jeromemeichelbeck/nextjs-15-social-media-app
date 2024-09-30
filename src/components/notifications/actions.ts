"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { notificationDataInclude, NotificationsPage } from "@/lib/types";

export async function getNotifications(cursor: string | null) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const pageSize = 20;

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: loggedInUser.id,
    },
    include: notificationDataInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize + 1,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const nextCursor =
    notifications.length > pageSize ? notifications[pageSize].id : null;

  const data: NotificationsPage = {
    notifications: notifications.slice(0, pageSize),
    nextCursor,
  };

  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { user: loggedInUser } = await validateRequest();

  if (loggedInUser === null) {
    throw new Error("Unauthorized");
  }

  const notificationToMarkAsRead = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (notificationToMarkAsRead === null) {
    throw new Error("Notification not found");
  }

  if (notificationToMarkAsRead.issuerId !== loggedInUser.id) {
    throw new Error("User does not own the notification to mark as read");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });
}
