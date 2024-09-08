"use client";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useSession } from "../app/(main)/session-provider";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "@/components/user-avatar";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="">
          <UserAvatar avatarUrl={user.avatarUrl} />
        </button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
