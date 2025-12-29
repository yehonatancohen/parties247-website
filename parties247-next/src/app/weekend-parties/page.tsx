import { Metadata } from "next";
import PartyGrid from "@/components/PartyGrid";
import { getParties } from "@/services/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מסיבות סוף שבוע | Parties247",
  description: "מסיבות חמות לחמישי עד שבת בישראל.",
};

export default async function WeekendPartiesPage() {
  const parties = await getParties();
  
  // Logic remains the same
  const weekend = parties.filter(party => {
    const day = new Date(party.date).getDay();
    return day === 4 || day === 5 || day === 6; // Thursday-Saturday
  });

  return (
    <main className="space-y-8 p-6">
      <PartyGrid
        parties={weekend}
        title="מסיבות סוף שבוע"
        description="חמישי, שישי ושבת – כל המסיבות של סוף השבוע במקום אחד."
        showFilters={false}
        basePath="/weekend-parties"
      />
    </main>
  );
}