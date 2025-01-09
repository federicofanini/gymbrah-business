"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  outcomes: string[];
}

interface ExercisesTableProps {
  exercises: Exercise[];
  uniqueCategories: string[];
  selectedExercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
}

export function ExercisesTable({
  exercises,
  uniqueCategories,
  selectedExercises,
  onExerciseSelect,
}: ExercisesTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByName, setSortByName] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 10;

  const filteredExercises = exercises
    .filter(
      (exercise) =>
        (!selectedCategory || exercise.category === selectedCategory) &&
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortByName
        ? a.name.localeCompare(b.name)
        : a.category.localeCompare(b.category)
    );

  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);
  const startIndex = (currentPage - 1) * exercisesPerPage;
  const paginatedExercises = filteredExercises.slice(
    startIndex,
    startIndex + exercisesPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) => {
              setSelectedCategory(value || null);
              setCurrentPage(1);
            }}
            value={selectedCategory || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search exercises..."
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setSortByName(!sortByName)}
            >
              Name <ArrowUpDown className="inline h-4 w-4" />
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Muscles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedExercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell>
                <Checkbox
                  checked={selectedExercises.some((e) => e.id === exercise.id)}
                  onCheckedChange={() => onExerciseSelect(exercise)}
                />
              </TableCell>
              <TableCell>{exercise.name}</TableCell>
              <TableCell>{exercise.category}</TableCell>
              <TableCell>
                {exercise.muscles.map((muscle) => (
                  <Badge key={muscle} variant="outline" className="mr-1">
                    {muscle}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + exercisesPerPage, filteredExercises.length)} of{" "}
          {filteredExercises.length} exercises
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
