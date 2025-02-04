import { Athletes } from "./athletes";

interface AthletesTableProps {
  athletes: {
    id: string;
    full_name: string;
    goal: string;
    gender_age: string;
    status: string;
  }[];
}

export function AthletesTable({ athletes }: AthletesTableProps) {
  return (
    <div className="w-full px-4 py-2 md:px-8 md:py-4 max-w-[1600px] mx-auto">
      <Athletes athletes={athletes} />
    </div>
  );
}
