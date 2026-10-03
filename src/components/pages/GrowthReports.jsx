import { useState, useEffect } from "react";
import { FileText, Download, Printer, Loader2, Award } from "lucide-react";
import PageShell from "@/components/PageShell";
import SubjectIcon from "@/components/SubjectIcon";
import { base44 } from "@/api/base44Client";
import { SUBJECT_META, SUBJECTS } from "@/data/subjects";
import jsPDF from "jspdf";

export default function GrowthReports() {
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [badges, setBadges] = useState([]);
  const [term, setTerm] = useState("current");
  const [building, setBuilding] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);
      if (!me) return;
      const [comps, gs, bds] = await Promise.all([
        base44.entities.LessonCompletion.filter({ created_by: me.email }),
        base44.entities.IEPGoal.filter({}),
        base44.entities.Badge.filter({ created_by: me.email }),
      ]);
      setCompletions(comps);
      setGoals(gs);
      setBadges(bds);
    })();
  }, []);

  const totalXp = completions.reduce((s, c) => s + (c.xp_earned || 0), 0);
  const avgScore = completions.length ? Math.round(completions.reduce((s, c) => s + (c.score || 0), 0) / completions.length) : 0;
  const mastered = completions.filter((c) => (c.score || 0) >= 80).length;

  const subjectBreakdown = SUBJECTS.map((name) => {
    const cs = completions.filter((c) => c.subject === name);
    return { name, lessons: cs.length, avg: cs.length ? Math.round(cs.reduce((a, c) => a + (c.score || 0), 0) / cs.length) : 0, xp: cs.reduce((a, c) => a + (c.xp_earned || 0), 0) };
  }).filter((s) => s.lessons > 0);

  const goalsProgress = goals.map((g) => ({ title: g.title, subject: g.subject, progress: g.progress || 0, status: g.status }));
  const termLabel = term === "current" ? "Current Term" : "Full Academic Year";

  const buildPdf = async () => {
    setBuilding(true);
    try {
      const doc = new jsPDF();
      let y = 16;
      doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.text("Noggin — Growth Report", 14, y); y += 7;
      doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
      doc.text(`${termLabel} · Generated ${new Date().toLocaleDateString()}`, 14, y); y += 8; doc.setTextColor(0);

      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Student", 14, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text(`Name: ${user?.full_name || "—"}`, 14, y); y += 5;
      doc.text(`Email: ${user?.email || "—"}`, 14, y); y += 5;
      doc.text(`Role: ${user?.role || "—"}`, 14, y); y += 8;

      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Summary", 14, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text(`Lessons completed: ${completions.length}`, 14, y); y += 5;
      doc.text(`Skills mastered (>= 80%): ${mastered}`, 14, y); y += 5;
      doc.text(`Average score: ${avgScore}%`, 14, y); y += 5;
      doc.text(`Total Gems: ${totalXp}`, 14, y); y += 5;
      doc.text(`Badges earned: ${badges.length}`, 14, y); y += 8;

      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Subject Breakdown", 14, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      subjectBreakdown.forEach((s) => {
        if (y > 280) { doc.addPage(); y = 16; }
        doc.text(`${s.name}: ${s.lessons} lessons, avg ${s.avg}%, ${s.xp} gems`, 14, y); y += 5;
      });
      y += 4;

      if (goalsProgress.length) {
        if (y > 250) { doc.addPage(); y = 16; }
        doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("IEP Goals Progress", 14, y); y += 6;
        doc.setFont("helvetica", "normal"); doc.setFontSize(10);
        goalsProgress.forEach((g) => {
          if (y > 280) { doc.addPage(); y = 16; }
          doc.text(`- ${g.title} (${g.subject}) — ${g.progress}% [${g.status}]`, 14, y); y += 5;
        });
      }

      doc.save(`noggin-growth-report-${user?.email || "student"}.pdf`);
    } catch {}
    setBuilding(false);
  };

  return (
    <PageShell title="Growth Reports" subtitle="Summarise performance for IEP reviews — download or print a term report." accent="from-teal-500 to-emerald-600" icon={FileText}>
      {/* Controls */}
      <div className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-muted-foreground">Period</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)} className="border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary">
            <option value="current">Current Term</option>
            <option value="full">Full Academic Year</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={buildPdf} disabled={building} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold rounded-xl px-4 py-2.5 hover:bg-primary/90 disabled:opacity-50">
            {building ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download PDF
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 text-sm font-bold rounded-xl px-4 py-2.5 border border-border bg-white hover:bg-muted/40">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Report preview */}
      <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm mt-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-foreground">Noggin Growth Report</h3>
            <p className="text-sm text-muted-foreground">{termLabel} · {user?.full_name || "—"}</p>
          </div>
          <FileText className="w-8 h-8 text-primary/30" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Lessons", value: completions.length },
            { label: "Mastered", value: mastered },
            { label: "Avg Score", value: `${avgScore}%` },
            { label: "Total Gems", value: totalXp },
          ].map((s) => (
            <div key={s.label} className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs font-bold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <h4 className="font-extrabold text-foreground mb-2">Subject Breakdown</h4>
        <div className="space-y-2 mb-5">
          {subjectBreakdown.length === 0 && <p className="text-sm text-muted-foreground">No completed lessons yet.</p>}
          {subjectBreakdown.map((s) => {
            const m = SUBJECT_META[s.name];
            return (
              <div key={s.name} className="flex items-center gap-3">
                <SubjectIcon subject={s.name} className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground w-40 sm:w-56 truncate">{s.name}</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500" style={{ width: `${s.avg}%` }} />
                </div>
                <span className="text-sm font-extrabold text-foreground w-14 text-right">{s.avg}%</span>
                <span className="text-xs text-muted-foreground hidden sm:inline w-24 text-right">{s.lessons} lessons</span>
              </div>
            );
          })}
        </div>

        {goalsProgress.length > 0 && (
          <>
            <h4 className="font-extrabold text-foreground mb-2">IEP Goals</h4>
            <div className="space-y-2 mb-5">
              {goalsProgress.map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground flex-1 truncate">{g.title}</span>
                  <div className="w-40 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${g.status === "achieved" ? "bg-green-500" : g.status === "on_track" ? "bg-blue-500" : "bg-amber-400"}`} style={{ width: `${g.progress}%` }} />
                  </div>
                  <span className="text-sm font-bold text-foreground w-12 text-right">{g.progress}%</span>
                </div>
              ))}
            </div>
          </>
        )}

        <h4 className="font-extrabold text-foreground mb-2 flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-500" /> Badges Earned ({badges.length})</h4>
        <div className="flex flex-wrap gap-2">
          {badges.length === 0 && <p className="text-sm text-muted-foreground">No badges yet.</p>}
          {badges.map((b) => (
            <span key={b.id} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-800"><Award className="w-4 h-4 text-amber-600" />{b.label}</span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
