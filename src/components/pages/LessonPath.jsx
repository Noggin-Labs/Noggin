import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Map, Lock, CheckCircle2, Play, Trophy, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";
import SubjectIcon from "@/components/SubjectIcon";
import { LESSONS } from "@/data/lessons";

const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "History", "Social Emotional Learning"];
const SUBJECT_COLOR = {
  Mathematics: "#2d8cff", English: "#10b981", Science: "#8b5cf6",
  "Social Studies": "#f59e0b", History: "#f97316", "Social Emotional Learning": "#f43f5e",
};

export default function LessonPath() {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setCompletions(await base44.entities.LessonCompletion.filter({})); } catch { setCompletions([]); }
      setLoading(false);
    })();
  }, []);

  const doneIds = new Set(completions.map((c) => c.lesson_id));

  // A lesson is unlocked if all earlier-order lessons in the same subject are done.
  const isUnlocked = (lesson) => {
    const prior = LESSONS.filter((l) => l.subject === lesson.subject && (l.order || 0) < (lesson.order || 0));
    return prior.every((l) => doneIds.has(l.id));
  };

  const overallDone = LESSONS.filter((l) => doneIds.has(l.id)).length;
  const overallPct = Math.round((overallDone / LESSONS.length) * 100);

  return (
    <PageShell title="Lesson Path" subtitle="Your learning journey — one step at a time. Unlock the next lesson by finishing the ones before it." accent="from-emerald-500 to-teal-600" icon={Map} backTo="/student">
      {/* Overall progress */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-bold">Your journey</p>
            <p className="text-3xl font-black mt-1">{overallDone} / {LESSONS.length} lessons</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{overallPct}%</p>
            <p className="text-white/70 text-xs">complete</p>
          </div>
        </div>
        <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} animate={{ width: `${overallPct}%` }} transition={{ duration: 0.8 }} />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-sm text-muted-foreground py-10">Loading your path…</div>
      ) : (
        <div className="space-y-6">
          {SUBJECTS.map((subject) => {
            const subLessons = LESSONS.filter((l) => l.subject === subject).sort((a, b) => (a.order || 0) - (b.order || 0));
            if (!subLessons.length) return null;
            const done = subLessons.filter((l) => doneIds.has(l.id)).length;
            const hex = SUBJECT_COLOR[subject];
            return (
              <div key={subject}>
                <div className="flex items-center gap-2 mb-3">
                  <SubjectIcon subject={subject} className="w-5 h-5" style={{ color: hex }} />
                  <h3 className="font-extrabold text-foreground">{subject}</h3>
                  <span className="text-xs font-bold text-muted-foreground">{done}/{subLessons.length}</span>
                </div>
                <div className="relative pl-4">
                  {/* vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                  <div className="space-y-2.5">
                    {subLessons.map((l, i) => {
                      const done = doneIds.has(l.id);
                      const unlocked = done || isUnlocked(l);
                      return (
                        <motion.div key={l.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                          <Link to={unlocked ? `/student?lesson=${l.id}` : "#"} className={`flex items-center gap-3 bg-white border rounded-2xl p-3 transition-all ${unlocked ? "border-border/50 hover:shadow-md hover:-translate-y-0.5" : "border-border/30 opacity-60 cursor-not-allowed"}`}>
                            <div className="relative z-10 shrink-0">
                              {done ? (
                                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: hex }}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                </div>
                              ) : unlocked ? (
                                <div className="w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: hex }} />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center"><Lock className="w-2.5 h-2.5 text-muted-foreground" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm leading-snug ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{l.title}</p>
                              <p className="text-xs text-muted-foreground">{l.unit} · {l.duration} · +{l.xp} gems</p>
                            </div>
                            {unlocked && !done && (
                              <span className="shrink-0 text-xs font-bold text-white rounded-lg px-2.5 py-1.5 flex items-center gap-1" style={{ background: hex }}>
                                <Play className="w-3 h-3" /> Start
                              </span>
                            )}
                            {done && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <p className="text-sm text-emerald-700 font-semibold">Finished a path? Head back to explore more or visit the Gems Shop.</p>
        <Link to="/gems-shop" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0">Gems Shop <ChevronRight className="w-4 h-4" /></Link>
      </div>
    </PageShell>
  );
}
