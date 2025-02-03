"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Overview() {
  const [customArea, setCustomArea] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const predefinedAreas = ["Technology", "Health", "Marketing", "Education"];

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 ">
      <div className="space-y-8">
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-medium">What is a Unique Value Zone?</h3>
          <p className="text-muted-foreground">
            A UVZ is a{" "}
            <span className="font-medium text-primary">
              specific, high-value problem
            </span>{" "}
            that, when solved, can be the foundation of a profitable digital
            product. It&apos;s not about trying to become an expert in a whole
            field, but rather about focusing on solving one{" "}
            <span className="font-medium text-primary">
              specific, pressing issue
            </span>{" "}
            that people are willing to pay to have resolved.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-medium">
            Why is Identifying a UVZ So Important?
          </h3>
          <p className="text-muted-foreground">
            Choosing the right UVZ is critical. Without a clearly defined UVZ,
            you risk wasting time and resources on problems that are either not
            very important or are already widely solved. The goal here is to
            find
            <span className="font-medium text-primary">
              {" "}
              unique problems
            </span>{" "}
            that aren&apos;t being addressed by others, but for which people are{" "}
            <span className="font-medium text-primary">
              willing to invest
            </span>{" "}
            in a solution.
          </p>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Focus on Specificity</h3>
            <p className="text-muted-foreground">
              Instead of trying to be an expert in an entire field, we focus on
              becoming an expert in solving{" "}
              <span className="font-medium text-primary">
                one specific problem
              </span>
              . This is much easier and more effective.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">
              Defining your Area of Interest
            </h4>
            <p className="text-muted-foreground mb-4">
              To begin, please specify the area or industry you&apos;re
              interested in. You can choose from the options below or enter your
              own:
            </p>

            <Select value={selectedArea}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an area of interest" />
              </SelectTrigger>
              <SelectContent>
                {predefinedAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Other</SelectItem>
              </SelectContent>
            </Select>
            {selectedArea === "custom" && (
              <div className="flex gap-2">
                <Input
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  className="w-[280px]"
                  placeholder="Specify your area..."
                />
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Remember, the concept of a &quot;niche&quot; is no longer
            sufficient. You need to identify{" "}
            <span className="font-medium text-primary">
              specific and high-value problems
            </span>{" "}
            within your chosen area. We&apos;re going deeper than a niche, and
            focusing on a UVZ.
          </p>
        </Card>
      </div>
    </div>
  );
}
