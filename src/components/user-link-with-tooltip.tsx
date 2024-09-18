"use client";

import { getUserDataByUsername } from "@/components/actions";
import UserTooltip from "@/components/user-tooltip";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  username,
  children,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () => getUserDataByUsername(username),
    retry: (failureCount, error) => {
      if (error.message === "User not found") {
        return false;
      }

      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
