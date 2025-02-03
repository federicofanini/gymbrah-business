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

const mockAthletes = [
  {
    id: "1",
    fullName: "John Smith",
    goal: "Strength",
    gender: "M",
    age: 28,
    isActive: true,
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    goal: "Weight Loss",
    gender: "F",
    age: 34,
    isActive: false,
  },
  {
    id: "3",
    fullName: "Mike Wilson",
    goal: "Endurance",
    gender: "M",
    age: 42,
    isActive: true,
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
    <div className="w-full border border-border rounded-lg">
      <div className="p-4 flex justify-between items-center border-b">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">Athletes</h2>
          <p className="text-sm text-muted-foreground">
            Manage your athletes and their training goals
          </p>
        </div>
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search athletes..."
            className="pl-8 w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Gender & Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAthletes.map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell className="font-medium">
                  {athlete.fullName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{athlete.goal}</Badge>
                </TableCell>
                <TableCell>
                  {athlete.gender} - {athlete.age}y
                </TableCell>
                <TableCell>
                  <Badge variant={athlete.isActive ? "success" : "destructive"}>
                    {athlete.isActive ? (
                      <CheckIcon className="size-3.5 mr-1" />
                    ) : (
                      <XIcon className="size-3.5 mr-1" />
                    )}
                    {athlete.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <UserIcon className="mr-2 size-4" />
                    Athlete Page
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
  );
}
