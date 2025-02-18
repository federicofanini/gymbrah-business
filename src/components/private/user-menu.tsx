"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImageNext,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut, getUser } from "@/actions/user/user-menu";
import { useEffect, useState } from "react";
import type { ActionResponse } from "@/actions/types/action-response";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenu() {
  const [userData, setUserData] = useState<ActionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await getUser();
        if (response?.data?.success && response?.data?.data) {
          setUserData(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!userData?.success || !userData?.data) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer">
          {userData?.data?.avatar_url && (
            <AvatarImageNext
              src={userData.data.avatar_url}
              alt={userData.data.full_name}
              width={32}
              height={32}
              quality={100}
            />
          )}
          <AvatarFallback>
            <span className="text-xs text-primary">
              {userData.data.full_name?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="truncate line-clamp-1 max-w-[155px] block">
                {userData.data.full_name}
              </span>
              <span className="truncate text-xs text-[#606060] font-normal">
                {userData.data.email}
              </span>
            </div>
            <div className="border py-0.5 px-3 rounded-full text-[11px] font-normal">
              Beta
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link prefetch href="/blackboard/settings">
            <DropdownMenuItem>Account</DropdownMenuItem>
          </Link>

          <Link prefetch href="/blackboard/settings">
            <DropdownMenuItem>Support</DropdownMenuItem>
          </Link>

          <Link prefetch href="/blackboard/tokens">
            <DropdownMenuItem>Credits</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
          className="text-red-500 font-bold"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
