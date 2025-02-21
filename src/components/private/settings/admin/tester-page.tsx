"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addTesterAction, deleteTesterAction, getTesters } from "./tester";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tester {
  id: string;
  email: string;
  role: string;
  created_at: Date;
}

export interface TestersProps {
  testers: Tester[];
}

export function Testers({ testers: initialTesters }: TestersProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("athlete");
  const [testers, setTesters] = useState<Tester[]>(initialTesters || []);

  const fetchTesters = async () => {
    setIsLoading(true);
    try {
      const result = await getTesters();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch testers");
      }
      setTesters(result.data as Tester[]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch testers"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTesters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await addTesterAction({ email, role });
      if (!result?.data?.success || !result.data?.data) {
        throw new Error(result?.data?.error || "Failed to add tester");
      }
      setTesters((prev) => [result?.data?.data as Tester, ...prev]);
      setEmail("");
      setRole("athlete");
      toast.success("Tester added successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add tester"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deleteTesterAction({ id });
      if (!result?.data?.success) {
        throw new Error(result?.data?.error || "Failed to delete tester");
      }
      setTesters((prev) => prev.filter((tester) => tester.id !== id));
      toast.success("Tester deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete tester"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Add Tester</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter tester's email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="athlete">Athlete</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Spinner size="sm" className="mr-2" />}
            Add Tester
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Testers List</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : testers?.length > 0 ? (
              testers.map((tester) => (
                <TableRow key={tester.id}>
                  <TableCell>{tester.email}</TableCell>
                  <TableCell className="capitalize">{tester.role}</TableCell>
                  <TableCell>
                    {new Date(tester.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tester.id)}
                      disabled={isDeleting === tester.id}
                    >
                      {isDeleting === tester.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No testers added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
