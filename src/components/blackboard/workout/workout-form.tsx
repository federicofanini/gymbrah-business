"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getExercises } from "@/actions/workout/get-exercises";
import { createWorkout } from "@/actions/workout/workout";
import { type ActionResponse } from "@/actions/types/action-response";

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string;
  outcomes: string;
  created_at: string;
  updated_at: string;
}

interface SelectedExercise extends Omit<Exercise, "created_at" | "updated_at"> {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

interface WorkoutData {
  id: string;
  name: string;
  exercises: Array<{
    exercise: Exercise;
    reps: number;
    sets: number;
    weight: number | null;
    duration: number | null;
  }>;
}

export function WorkoutForm() {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [workoutName, setWorkoutName] = React.useState("");
  const [selectedExercises, setSelectedExercises] = React.useState<
    SelectedExercise[]
  >([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  React.useEffect(() => {
    async function fetchExercises() {
      try {
        const result = await getExercises();
        if (result?.data?.success) {
          setExercises(result.data.data as unknown as Exercise[]);
        } else {
          toast.error("Failed to load exercises");
        }
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
        toast.error("Failed to load exercises");
      }
    }
    fetchExercises();
  }, []);

  // Get unique values for filters
  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(
      exercises.map((exercise: Exercise) => exercise.category)
    );
    return Array.from(categories) as string[];
  }, [exercises]);

  const columns: ColumnDef<Exercise>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleExerciseSelect(row.original, !!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "muscles",
      header: "Muscles",
      cell: ({ row }) => {
        const muscles = Array.isArray(row.original.muscles)
          ? row.original.muscles
          : row.original.muscles?.split(",").map((o) => o.trim()) || [];

        return (
          <div className="flex flex-wrap gap-1">
            {muscles.map((muscle, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {muscle}
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: exercises,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleExerciseSelect = (
    exercise: Exercise | SelectedExercise,
    checked: boolean
  ) => {
    if (checked) {
      const { created_at, updated_at, ...exerciseWithoutDates } =
        exercise as unknown as Exercise;
      setSelectedExercises([
        ...selectedExercises,
        { ...exerciseWithoutDates, sets: 0, reps: 0 },
      ]);
    } else {
      setSelectedExercises(
        selectedExercises.filter((e) => e.id !== exercise.id)
      );
    }
  };

  const updateExerciseDetails = (
    exerciseId: string,
    field: keyof SelectedExercise,
    value: number
  ) => {
    setSelectedExercises(
      selectedExercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSaveWorkout = async () => {
    try {
      const workoutData = {
        name: workoutName,
        exercises: selectedExercises.map((exercise) => ({
          exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || null,
          duration: exercise.duration || null,
        })),
      };

      const result = await createWorkout(workoutData);

      if (result?.data?.success) {
        toast.success("Workout created successfully");
        setWorkoutName("");
        setSelectedExercises([]);
        setStep(1);
      } else {
        toast.error("Failed to create workout");
      }
    } catch (error) {
      console.error("Workout creation error:", error);
      toast.error("Failed to create workout");
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-full sm:max-w-xs"
            />

            <Select
              onValueChange={(value) =>
                table.getColumn("category")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
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

          <div className="flex items-center gap-2">
            {selectedExercises.length > 0 && (
              <Button onClick={() => setStep(2)}>
                Configure {selectedExercises.length} Exercise
                {selectedExercises.length === 1 ? "" : "s"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} selected
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Configure Exercises</h2>
        <Button variant="outline" onClick={() => setStep(1)}>
          Back
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Enter workout name..."
          />
        </div>

        <div className="grid gap-4">
          {selectedExercises.map((exercise) => (
            <Card key={exercise.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">{exercise.name}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExerciseSelect(exercise, false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
                  <Input
                    id={`sets-${exercise.id}`}
                    type="number"
                    value={exercise.sets}
                    onChange={(e) =>
                      updateExerciseDetails(
                        exercise.id,
                        "sets",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
                  <Input
                    id={`reps-${exercise.id}`}
                    type="number"
                    value={exercise.reps}
                    onChange={(e) =>
                      updateExerciseDetails(
                        exercise.id,
                        "reps",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`weight-${exercise.id}`}>Weight (kg)</Label>
                  <Input
                    id={`weight-${exercise.id}`}
                    type="number"
                    value={exercise.weight}
                    onChange={(e) =>
                      updateExerciseDetails(
                        exercise.id,
                        "weight",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`duration-${exercise.id}`}>
                    Duration (min)
                  </Label>
                  <Input
                    id={`duration-${exercise.id}`}
                    type="number"
                    value={exercise.duration}
                    onChange={(e) =>
                      updateExerciseDetails(
                        exercise.id,
                        "duration",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="w-full sm:w-auto"
          onClick={handleSaveWorkout}
          disabled={!workoutName.trim()}
        >
          Save Workout
        </Button>
      </div>
    </div>
  );
}
