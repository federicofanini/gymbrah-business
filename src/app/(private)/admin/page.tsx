import { AddExerciseForm } from "@/components/private/admin/add-exercise";
import { BulkAddExercisesButton } from "@/components/private/admin/bulk-add-exercises";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <BulkAddExercisesButton />
      <AddExerciseForm />
    </div>
  );
}
