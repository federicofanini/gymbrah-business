"use client";

import * as React from "react";
import { useAction } from "next-safe-action/hooks";
import { getExercises } from "@/actions/workout/get-exercises";
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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscles: string;
  outcomes: string; // Changed from outcome to outcomes to match API
  created_at: string;
  updated_at: string;
}

interface SelectedExercise extends Omit<Exercise, "created_at" | "updated_at"> {
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

export function WorkoutForm() {
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

  const { execute: fetchExercises, result, status } = useAction(getExercises);

  React.useEffect(() => {
    void fetchExercises();
  }, [fetchExercises]);

  const exercises = React.useMemo(() => {
    if (!result.data?.success) return [];
    return result.data.data;
  }, [result.data]);

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
        // Handle both string and array muscles
        const muscles = Array.isArray(row.original.muscles)
          ? row.original.muscles
          : row.original.muscles?.split(",").map((o) => o.trim()) || [];

        return (
          <div className="flex flex-wrap gap-1">
            {muscles.map((muscle, i) => (
              <Badge key={i} variant="outline">
                {muscle}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "outcomes",
      header: "Outcomes",
      cell: ({ row }) => {
        // Handle both string and array outcomes
        const outcomes = Array.isArray(row.original.outcomes)
          ? row.original.outcomes
          : row.original.outcomes?.split(",").map((o) => o.trim()) || [];

        return (
          <div className="flex flex-wrap gap-1">
            {outcomes.map((outcome, i) => (
              <Badge key={i} variant="outline">
                {outcome}
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

  const handleExerciseSelect = (exercise: Exercise, checked: boolean) => {
    if (checked) {
      const { created_at, updated_at, ...exerciseWithoutDates } = exercise;
      setSelectedExercises([
        ...selectedExercises,
        { ...exerciseWithoutDates, sets: 0, reps: 0, weight: 0, duration: 0 },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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

      {selectedExercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Exercises</h3>
          <div className="grid gap-4">
            {selectedExercises.map((exercise) => (
              <Card key={exercise.id} className="p-4">
                <h4 className="font-medium mb-2">{exercise.name}</h4>
                <div className="grid grid-cols-4 gap-4">
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
      )}
    </div>
  );
}
