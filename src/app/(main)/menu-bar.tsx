import NotificationButton from "@/app/(main)/notifications-button";
import { validateRequest } from "@/auth";
import { getUnreadNotificationsCount } from "@/components/notifications/actions";
import { Button } from "@/components/ui/button";
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const unreadNotificationsCount = await getUnreadNotificationsCount();

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <HomeIcon className="size-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationButton initialCount={unreadNotificationsCount} />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <MailIcon className="size-4" />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon className="size-4" />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
