import { Suspense } from "react";
import { getExercises } from "@/actions/workout/get-exercises";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  gif_url: string;
  target: string;
  secondary_muscles: string[];
  instructions: string[];
}

async function ExerciseList() {
  const supabase = await createClient();
  const result = await getExercises(supabase);
  const exercises = result.success ? (result.data as Exercise[]) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Library</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercise</TableHead>
              <TableHead>Body Part</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Demonstration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow key={exercise.id}>
                <TableCell className="font-medium">{exercise.name}</TableCell>
                <TableCell>{exercise.body_part}</TableCell>
                <TableCell>{exercise.target}</TableCell>
                <TableCell>{exercise.equipment}</TableCell>
                <TableCell>
                  {exercise.gif_url && (
                    <Image
                      src={exercise.gif_url}
                      alt={exercise.name}
                      width={80}
                      height={80}
                      className="rounded-md"
                      unoptimized
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function ExercisesPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading exercises...</div>}>
        <ExerciseList />
      </Suspense>
    </div>
  );
}
