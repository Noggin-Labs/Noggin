import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import PageShell from "@/components/PageShell";
import IepGoals from "@/components/dashboard/IepGoals";

export default function IepTracker() {
  return (
    <PageShell title="IEP Tracker" subtitle="Track educational objectives and visualise growth toward mastery." accent="from-emerald-500 to-teal-600" icon={Target}>
      <IepGoals />
    </PageShell>
  );
}
