"use client";

import { useState } from "react";
import { assignWorkout } from "@/actions/workout/assign-workout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getBusinessId } from "@/actions/business/business-id";

interface Athlete {
  id: string;
  full_name: string;
  goal: string;
  gender_age: string;
  status: string;
}

interface Workout {
  id: string;
  name: string;
  created_at: string;
}

interface AssignWorkoutProps {
  athletes: {
    athletes: Athlete[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
  workouts: {
    workouts: Workout[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export function AssignWorkout({ athletes, workouts }: AssignWorkoutProps) {
  const router = useRouter();
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [athleteSearch, setAthleteSearch] = useQueryState("athleteSearch", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  const [workoutSearch, setWorkoutSearch] = useQueryState("workoutSearch", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  const handleAssignWorkout = async () => {
    if (!selectedAthlete || !selectedWorkout) {
      toast.error("Please select both an athlete and a workout");
      return;
    }

    setIsSubmitting(true);

    try {
      const businessIdResult = await getBusinessId();
      console.log("businessIdResult", businessIdResult);

      if (!businessIdResult?.data?.success || !businessIdResult?.data?.data) {
        toast.error("Failed to get business ID");
        return;
      }

      const result = await assignWorkout({
        athleteId: selectedAthlete,
        workoutId: selectedWorkout,
        businessId: businessIdResult.data.data,
      });

      if (result?.data?.success) {
        toast.success("Workout assigned successfully");
        setSelectedAthlete(null);
        setSelectedWorkout(null);
        router.refresh();
      } else {
        toast.error("Failed to assign workout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAthletes = athletes.athletes.filter((athlete) =>
    athlete.full_name
      .toLowerCase()
      .includes((athleteSearch || "").toLowerCase())
  );

  const filteredWorkouts = workouts.workouts.filter((workout) =>
    workout.name.toLowerCase().includes((workoutSearch || "").toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assign Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Athletes Table */}
            <div className="space-y-4">
              <Input
                placeholder="Search athletes..."
                value={athleteSearch}
                onChange={(e) => setAthleteSearch(e.target.value)}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAthletes.map((athlete) => (
                    <TableRow key={athlete.id}>
                      <TableCell>{athlete.full_name}</TableCell>
                      <TableCell>{athlete.goal}</TableCell>
                      <TableCell>
                        <Button
                          variant={
                            selectedAthlete === athlete.id
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedAthlete(athlete.id)}
                        >
                          {selectedAthlete === athlete.id
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Workouts Table */}
            <div className="space-y-4">
              <Input
                placeholder="Search workouts..."
                value={workoutSearch}
                onChange={(e) => setWorkoutSearch(e.target.value)}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell>{workout.name}</TableCell>
                      <TableCell>
                        {new Date(workout.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={
                            selectedWorkout === workout.id
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedWorkout(workout.id)}
                        >
                          {selectedWorkout === workout.id
                            ? "Selected"
                            : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Button
            onClick={handleAssignWorkout}
            disabled={isSubmitting || !selectedAthlete || !selectedWorkout}
            className="w-full mt-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Workout"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
