"use client";

import { getUnreadNotificationsCount } from "@/components/notifications/actions";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import Link from "next/link";

interface NotificationButtonProps {
  initialCount: number;
}

export default function NotificationButton({
  initialCount,
}: NotificationButtonProps) {
  const { data: unreadCount } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () => getUnreadNotificationsCount(),
    initialData: initialCount,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <BellIcon className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
