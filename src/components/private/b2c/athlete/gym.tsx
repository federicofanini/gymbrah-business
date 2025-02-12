"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GymDetailsProps {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

const mockGyms: GymDetailsProps[] = [
  {
    id: "1",
    name: "PowerFit Elite Gym",
    address: "123 Fitness Avenue",
    city: "Vancouver",
    province: "BC",
    zip: "V6B 1A1",
    country: "Canada",
  },
  {
    id: "2",
    name: "Downtown Fitness Center",
    address: "456 Workout Street",
    city: "Vancouver",
    province: "BC",
    zip: "V6C 2G8",
    country: "Canada",
  },
];

export function GymDetails() {
  const [selectedGym, setSelectedGym] = useState<GymDetailsProps>(mockGyms[0]);

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{selectedGym.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {selectedGym.address}, {selectedGym.city},{" "}
                {selectedGym.province}, {selectedGym.zip}, {selectedGym.country}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="p-4">
          <Select
            defaultValue={selectedGym.id}
            onValueChange={(value) => {
              const gym = mockGyms.find((g) => g.id === value);
              if (gym) setSelectedGym(gym);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a gym" />
            </SelectTrigger>
            <SelectContent>
              {mockGyms.map((gym) => (
                <SelectItem key={gym.id} value={gym.id}>
                  {gym.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
