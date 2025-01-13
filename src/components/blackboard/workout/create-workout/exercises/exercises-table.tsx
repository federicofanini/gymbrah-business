"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export interface Exercise {
  id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
  secondary_muscles: string[];
  instructions: string[];
  gif_url: string;
}

interface ExercisesTableProps {
  exercises: Exercise[];
  selectedExercises?: Exercise[];
  onExerciseSelect?: (exercise: Exercise) => void;
  roundIndex?: number;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ExercisesTable({
  exercises: initialExercises,
  selectedExercises = [],
  onExerciseSelect = () => {},
  roundIndex = 0,
}: ExercisesTableProps) {
  const [open, setOpen] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByName, setSortByName] = useState(true);
  const [exercises] = useState<Exercise[]>(initialExercises);
  const [selectedExerciseDetails, setSelectedExerciseDetails] =
    useState<Exercise | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get unique body parts
  const uniqueBodyParts = Array.from(
    new Set(exercises.map((exercise) => exercise.body_part))
  );

  const filteredExercises = exercises
    .filter(
      (exercise) =>
        (!selectedBodyPart || exercise.body_part === selectedBodyPart) &&
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortByName
        ? a.name.localeCompare(b.name)
        : a.body_part.localeCompare(b.body_part)
    );

  const CategoryMenu = () => (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={!selectedBodyPart}
          onClick={() => setSelectedBodyPart(null)}
        >
          <a href="#">All Body Parts</a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {uniqueBodyParts.map((bodyPart) => (
        <SidebarMenuItem key={bodyPart}>
          <SidebarMenuButton
            asChild
            isActive={selectedBodyPart === bodyPart}
            onClick={() => setSelectedBodyPart(bodyPart)}
          >
            <a href="#">{capitalize(bodyPart)}</a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Select Exercises</Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0 h-[90dvh] w-full max-w-full md:h-[700px] md:max-w-[900px] lg:max-w-[1000px]">
          <DialogTitle className="sr-only">Select Exercises</DialogTitle>
          <DialogDescription className="sr-only">
            Select exercises for your workout
          </DialogDescription>
          <SidebarProvider className="items-start">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <CategoryMenu />
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <main className="flex h-full flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] p-0">
                    <div className="py-4">
                      <CategoryMenu />
                    </div>
                  </SheetContent>
                </Sheet>

                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search exercises..."
                  className="flex-1"
                />
              </div>

              <div className="flex-1 overflow-y-auto px-2 md:px-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead className="w-[120px]"></TableHead>
                      <TableHead
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => setSortByName(!sortByName)}
                      >
                        Name <ArrowUpDown className="inline h-4 w-4" />
                      </TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">
                        Body Part
                      </TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">
                        Target
                      </TableHead>
                      <TableHead className="hidden md:table-cell whitespace-nowrap">
                        Equipment
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExercises.map((exercise) => (
                      <TableRow
                        key={exercise.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedExerciseDetails(exercise);
                          setShowDetails(true);
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedExercises.some(
                              (e) => e.id === exercise.id
                            )}
                            onCheckedChange={() => onExerciseSelect(exercise)}
                          />
                        </TableCell>
                        <TableCell>
                          <Image
                            width={80}
                            height={80}
                            src={exercise.gif_url}
                            alt={exercise.name}
                            className="size-20 object-cover rounded"
                            unoptimized
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            {capitalize(exercise.name)}
                            <div className="md:hidden text-sm text-muted-foreground">
                              {capitalize(exercise.body_part)}
                            </div>
                            <div className="flex flex-wrap gap-1 md:hidden mt-1">
                              {exercise.secondary_muscles?.map((muscle) => (
                                <Badge
                                  key={muscle}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {capitalize(muscle)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {capitalize(exercise.body_part)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {capitalize(exercise.target)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {capitalize(exercise.equipment)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-h-[90dvh] max-w-[95vw] md:max-w-3xl overflow-y-auto">
          <DialogTitle>
            {capitalize(selectedExerciseDetails?.name || "")}
          </DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                width={300}
                height={300}
                src={selectedExerciseDetails?.gif_url || ""}
                alt={selectedExerciseDetails?.name || ""}
                className="w-full rounded-lg"
                unoptimized
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Body Part:</div>
                  <div>
                    {capitalize(selectedExerciseDetails?.body_part || "")}
                  </div>
                  <div className="text-muted-foreground">Target:</div>
                  <div>{capitalize(selectedExerciseDetails?.target || "")}</div>
                  <div className="text-muted-foreground">Equipment:</div>
                  <div>
                    {capitalize(selectedExerciseDetails?.equipment || "")}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secondary Muscles</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedExerciseDetails?.secondary_muscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary">
                      {capitalize(muscle)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  {selectedExerciseDetails?.instructions.map(
                    (instruction, index) => (
                      <li key={index}>{instruction}</li>
                    )
                  )}
                </ol>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
