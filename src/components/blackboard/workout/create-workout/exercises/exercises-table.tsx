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
  const [open, setOpen] = useState(false);
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

  const CategoryMenu = () => (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
        >
          <a href="#">All Categories</a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {uniqueCategories.map((category) => (
        <SidebarMenuItem key={category}>
          <SidebarMenuButton
            asChild
            isActive={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            <a href="#">{category}</a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Select Exercises</Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 h-[100dvh] w-full max-w-full md:h-[700px] md:max-w-[900px] lg:max-w-[1000px]">
        <DialogTitle className="sr-only">Select Exercises</DialogTitle>
        <DialogDescription className="sr-only">
          Select exercises for your workout
        </DialogDescription>
        <SidebarProvider className="items-start">
          {/* Desktop Sidebar */}
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
              {/* Mobile Category Menu */}
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search exercises..."
                className="flex-1"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-2 md:px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => setSortByName(!sortByName)}
                    >
                      Name <ArrowUpDown className="inline h-4 w-4" />
                    </TableHead>
                    <TableHead className="hidden md:table-cell whitespace-nowrap">
                      Category
                    </TableHead>
                    <TableHead className="hidden md:table-cell whitespace-nowrap">
                      Muscles
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExercises.map((exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedExercises.some(
                            (e) => e.id === exercise.id
                          )}
                          onCheckedChange={() => onExerciseSelect(exercise)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          {exercise.name}
                          <div className="md:hidden text-sm text-muted-foreground">
                            {exercise.category}
                          </div>
                          <div className="flex flex-wrap gap-1 md:hidden mt-1">
                            {exercise.muscles.map((muscle) => (
                              <Badge
                                key={muscle}
                                variant="outline"
                                className="text-xs"
                              >
                                {muscle}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {exercise.category}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {exercise.muscles.map((muscle) => (
                            <Badge key={muscle} variant="outline">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between border-t p-4 gap-4">
              <div className="text-sm text-muted-foreground order-2 md:order-1">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + exercisesPerPage,
                  filteredExercises.length
                )}{" "}
                of {filteredExercises.length} exercises
              </div>
              <div className="flex gap-2 order-1 md:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex-1 md:flex-none"
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
                  className="flex-1 md:flex-none"
                >
                  Next
                </Button>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
