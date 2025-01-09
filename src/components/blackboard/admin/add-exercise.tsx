"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  categories,
  muscles,
  outcomes,
} from "../workout/create-workout/exercises/exercises-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addExercise } from "@/actions/admin/add-exercise";
import type { ActionResponse } from "@/actions/types/action-response";

interface ExerciseFormData {
  category: string;
  name: string;
  muscles: string[];
  outcomes: string[];
  reps?: number;
  sets?: number;
  duration?: number;
  weight?: number;
}

export function AddExerciseForm() {
  const [formData, setFormData] = useState<ExerciseFormData>({
    category: "",
    name: "",
    muscles: [],
    outcomes: [],
    reps: undefined,
    sets: undefined,
    duration: undefined,
    weight: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await addExercise(formData);

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          toast.success("Exercise added successfully");
          // Reset form
          setFormData({
            category: "",
            name: "",
            muscles: [],
            outcomes: [],
            reps: undefined,
            sets: undefined,
            duration: undefined,
            weight: undefined,
          });
        } else {
          toast.error(response.error || "Failed to add exercise");
        }
      }
    } catch (error) {
      console.error("Exercise creation error:", error);
      toast.error("Failed to add exercise");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(categories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Exercise Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter exercise name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Muscles</Label>
            <Select
              value={formData.muscles[0]}
              onValueChange={(value) =>
                setFormData({ ...formData, muscles: [value] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select muscle" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(muscles).map((muscle) => (
                  <SelectItem key={muscle} value={muscle}>
                    {muscle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Outcomes</Label>
            <Select
              value={formData.outcomes[0]}
              onValueChange={(value) =>
                setFormData({ ...formData, outcomes: [value] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(outcomes).map((outcome) => (
                  <SelectItem key={outcome} value={outcome}>
                    {outcome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Exercise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
