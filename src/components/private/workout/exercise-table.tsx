"use client";

import { useQueryState } from "nuqs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SearchIcon, PlusIcon, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bodyParts } from "@/actions/exercises/bodyParts";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  target: string;
  gif_url: string;
  secondary_muscles: string[];
  instructions: string[];
}

interface ExerciseTableProps {
  exercises: {
    exercises: Exercise[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
  initialExercises: Exercise[];
}

export function ExerciseTable({
  exercises,
  initialExercises,
}: ExerciseTableProps) {
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });
  const [bodyPart, setBodyPart] = useQueryState("bodyPart");

  const filterExercises = (exercisesToFilter: Exercise[]) => {
    return exercisesToFilter.filter((exercise) => {
      const matchesSearch =
        !searchQuery ||
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.body_part.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const displayedExercises =
    bodyPart === "all" || !bodyPart
      ? filterExercises(initialExercises)
      : filterExercises(exercises.exercises);

  return (
    <div className="space-y-8">
      <div className="w-full border border-border rounded-lg">
        <div className="p-3 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center border-b gap-3 md:gap-0">
          <div className="space-y-1">
            <h2 className="text-base md:text-lg font-medium">
              Exercise Library
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Browse and add exercises to your workout
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full md:max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={bodyPart || "all"} onValueChange={setBodyPart}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Body Part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Parts</SelectItem>
                {bodyParts.map((part) => (
                  <SelectItem key={part} value={part} className="capitalize">
                    {part}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto px-2 py-1 md:px-6 md:py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Demo</TableHead>
                <TableHead className="min-w-[200px]">Exercise Name</TableHead>
                <TableHead className="min-w-[120px]">Body Part</TableHead>
                <TableHead className="min-w-[120px]">Target</TableHead>
                <TableHead className="min-w-[120px]">Equipment</TableHead>
                <TableHead className="text-right min-w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedExercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={exercise.gif_url}
                          alt={exercise.name}
                          className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="capitalize">
                            {exercise.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <img
                            src={exercise.gif_url}
                            alt={exercise.name}
                            className="w-full max-w-md object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {exercise.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {exercise.body_part}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {exercise.target}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {exercise.equipment}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          <InfoIcon className="size-4" />
                          Info
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="capitalize">
                            {exercise.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Instructions:</h4>
                            <ul className="list-decimal pl-4 space-y-2">
                              {exercise.instructions.map(
                                (instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Secondary Muscles:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {exercise.secondary_muscles.map(
                                (muscle, index) => (
                                  <Badge key={index} variant="secondary">
                                    {muscle}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
