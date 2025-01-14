"use client";

import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { BODY_PARTS, type BodyPart } from "@/app/api/config";
import { capitalize } from "@/components/blackboard/workout/create-workout/exercises/exercises-table";
import { getExercises } from "./actions";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export function ExercisesList({
  initialExercises,
}: {
  initialExercises: Exercise[];
}) {
  const [exercises, setExercises] = useState(initialExercises);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart>(
    BODY_PARTS.BACK
  );
  const [offset, setOffset] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  async function fetchExercises(bodyPart: BodyPart, currentOffset: number) {
    setIsFetching(true);
    try {
      const result = await getExercises({
        bodyPart,
        limit: 10,
        offset: currentOffset,
      });

      if (!result?.data?.success || !result?.data?.data) {
        throw new Error(result?.data?.error || "Failed to load exercises");
      }

      const newExercises = result.data.data;

      if (newExercises.length < 10) {
        setHasMore(false);
      }

      if (currentOffset === 0) {
        setExercises(newExercises);
      } else {
        setExercises((prev) => [...prev, ...newExercises]);
      }

      setOffset(currentOffset + 10);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setIsFetching(false);
    }
  }

  const debouncedFetchExercises = debounce(
    (bodyPart: BodyPart, currentOffset: number) => {
      fetchExercises(bodyPart, currentOffset);
    },
    300
  );

  const loadMoreExercises = useCallback(() => {
    if (!isFetching) {
      debouncedFetchExercises(selectedBodyPart, offset);
    }
  }, [isFetching, selectedBodyPart, offset, debouncedFetchExercises]);

  async function handleBodyPartChange(bodyPart: BodyPart) {
    setSelectedBodyPart(bodyPart);
    setOffset(0);
    setHasMore(true);
    await fetchExercises(bodyPart, 0);
  }

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-6">
      <aside className="hidden md:block w-48 space-y-2">
        <h3 className="font-semibold mb-4">Body Parts</h3>
        {Object.values(BODY_PARTS).map((bodyPart) => (
          <button
            key={bodyPart}
            onClick={() => handleBodyPartChange(bodyPart)}
            className={`block w-full text-left px-3 py-2 rounded hover:bg-muted ${
              selectedBodyPart === bodyPart ? "bg-muted" : ""
            }`}
          >
            {capitalize(bodyPart)}
          </button>
        ))}
      </aside>

      <div className="flex-1">
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <InfiniteScroll
          dataLength={exercises.length}
          next={loadMoreExercises}
          hasMore={hasMore && !isFetching}
          loader={
            <div className="text-center py-4">Loading more exercises...</div>
          }
          endMessage={
            <div className="text-center py-4">No more exercises to load.</div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="hidden md:table-cell">
                  Equipment
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((exercise) => (
                <TableRow
                  key={exercise.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        width={80}
                        height={80}
                        className="rounded object-cover"
                        unoptimized
                      />
                      <div>
                        <div className="font-medium">
                          {capitalize(exercise.name)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {capitalize(exercise.bodyPart)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{capitalize(exercise.target)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {capitalize(exercise.equipment)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfiniteScroll>

        <Dialog
          open={!!selectedExercise}
          onOpenChange={() => setSelectedExercise(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedExercise && (
              <>
                <DialogTitle>{capitalize(selectedExercise.name)}</DialogTitle>
                <div className="grid md:grid-cols-2 gap-6">
                  <Image
                    src={selectedExercise.gifUrl}
                    alt={selectedExercise.name}
                    width={400}
                    height={400}
                    className="rounded-lg"
                    unoptimized
                  />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Target Muscles</h3>
                      <div className="flex flex-wrap gap-1">
                        <Badge>{capitalize(selectedExercise.target)}</Badge>
                        {selectedExercise.secondaryMuscles.map((muscle) => (
                          <Badge key={muscle} variant="secondary">
                            {capitalize(muscle)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Instructions</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {selectedExercise.instructions.map((instruction, i) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
