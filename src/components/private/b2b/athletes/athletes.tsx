"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

const mockAthletes = [
  {
    id: "1",
    fullName: "John Smith",
    goal: "Strength",
    gender: "M",
    age: 28,
    isActive: true,
    link: "1",
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    goal: "Weight Loss",
    gender: "F",
    age: 34,
    isActive: false,
    link: "2",
  },
  {
    id: "3",
    fullName: "Mike Wilson",
    goal: "Endurance",
    gender: "M",
    age: 42,
    isActive: true,
    link: "3",
  },
];

export function Athletes() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAthletes = mockAthletes.filter((athlete) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      athlete.fullName.toLowerCase().includes(searchLower) ||
      athlete.goal.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8">
      <div className="w-full border border-border rounded-lg">
        <div className="p-3 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b gap-3 md:gap-0">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-medium">Athletes</h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Manage your athletes and their training goals
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto px-2 py-1 md:px-6 md:py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px] md:min-w-[120px]">
                  Full Name
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">
                  Goal
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[100px]">
                  Gender & Age
                </TableHead>
                <TableHead className="min-w-[80px] md:min-w-[100px]">
                  Status
                </TableHead>
                <TableHead className="text-right min-w-[100px] md:min-w-[160px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAthletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-medium">
                    {athlete.fullName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {athlete.goal}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell whitespace-nowrap">
                    {athlete.gender} - {athlete.age}y
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={athlete.isActive ? "success" : "destructive"}
                      className="whitespace-nowrap"
                    >
                      {athlete.isActive ? (
                        <CheckIcon className="size-3.5 mr-1" />
                      ) : (
                        <XIcon className="size-3.5 mr-1" />
                      )}
                      {athlete.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                      className="sm:hidden"
                    >
                      <Link href={`/business/athletes/${athlete.link}`}>
                        <UserIcon className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="hidden sm:inline-flex whitespace-nowrap"
                    >
                      <Link href={`/business/athletes/${athlete.link}`}>
                        <UserIcon className="mr-2 size-4" />
                        Athlete Page
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
