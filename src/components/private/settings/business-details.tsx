"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";
import { updateBusinessDetails } from "@/actions/business/details/update";

export interface BusinessFormData {
  name: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  vat: string;
}

export function BusinessDetails({
  initialData,
}: {
  initialData: BusinessFormData;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>(initialData);

  const handleInputChange =
    (field: keyof BusinessFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await updateBusinessDetails(formData);

      if (!response?.data?.success) {
        throw new Error(response?.data?.error);
      }

      toast.success("Business details updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update business details"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8 max-w-screen-xl">
      <Card className="w-full bg-noise">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Business Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your business information
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Name</label>
              <Input
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Enter business name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Enter address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={formData.city}
                  onChange={handleInputChange("city")}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Province</label>
                <Input
                  value={formData.province}
                  onChange={handleInputChange("province")}
                  placeholder="Enter province"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ZIP Code</label>
                <Input
                  value={formData.zip}
                  onChange={handleInputChange("zip")}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={formData.country}
                  onChange={handleInputChange("country")}
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">VAT Number</label>
              <Input
                value={formData.vat}
                onChange={handleInputChange("vat")}
                placeholder="Enter VAT number"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full md:w-auto"
            >
              {isSaving && <Spinner size="sm" className="mr-2" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
