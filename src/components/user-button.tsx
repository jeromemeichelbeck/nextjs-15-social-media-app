"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "../app/(main)/session-provider";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "@/components/user-avatar";
import Link from "next/link";
import {
  CheckIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { logout } from "@/app/(auth)/(logout)/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MonitorIcon className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <MonitorIcon className="mr-2 size-4" />
                System default
                {theme === "system" ? (
                  <CheckIcon className="ms-2 size-4" />
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <SunIcon className="mr-2 size-4" />
                Light
                {theme === "light" ? (
                  <CheckIcon className="ms-2 size-4" />
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <MoonIcon className="mr-2 size-4" />
                Dark
                {theme === "dark" ? (
                  <CheckIcon className="ms-2 size-4" />
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
