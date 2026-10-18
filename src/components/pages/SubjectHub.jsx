import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Play, CheckCircle2, Clock, Zap, ArrowLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import SubjectIcon from "@/components/SubjectIcon";
import { base44 } from "@/api/base44Client";
import { LESSONS } from "@/data/lessons";
import { SUBJECT_META, SUBJECTS } from "@/data/subjects";

export default function SubjectHub() {
  const [params, setParams] = useSearchParams();
  const subject = params.get("subject");
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      const comps = me ? await base44.entities.LessonCompletion.filter({ created_by: me.email }) : [];
      setCompletions(comps);
    })();
  }, []);

  const completedIds = new Set(completions.map((c) => c.lesson_id));
  const bestScore = (id) => {
    const cs = completions.filter((c) => c.lesson_id === id);
    return cs.length ? Math.max(...cs.map((c) => c.score || 0)) : null;
  };

  // ── Subject picker ──
  if (!subject || !SUBJECT_META[subject]) {
    return (
      <PageShell title="Subject Hub" subtitle="Pick a subject to see topic progress and recommended next steps." accent="from-teal-500 to-emerald-600" icon={BookOpen}>
        <div className="grid sm:grid-cols-2 gap-4">
          {SUBJECTS.map((name, i) => {
            const m = SUBJECT_META[name];
            const sub = LESSONS.filter((l) => l.subject === name);
            const done = sub.filter((l) => completedIds.has(l.id)).length;
            const pct = sub.length ? Math.round((done / sub.length) * 100) : 0;
            return (
              <motion.button key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setParams({ subject: name })}
                className="text-left bg-white border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`bg-gradient-to-r ${m.card} p-5 flex items-center gap-3`}>
                  <span><SubjectIcon subject={name} className="w-8 h-8 text-white" /></span>
                  <div>
                    <h3 className="text-white font-extrabold text-lg">{name}</h3>
                    <p className="text-white/75 text-xs">{sub.length} lessons · {pct}% complete</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{done} of {sub.length} topics started</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </PageShell>
    );
  }

  // ── Subject detail ──
  const m = SUBJECT_META[subject];
  const subLessons = LESSONS.filter((l) => l.subject === subject).sort((a, b) => (a.order || 0) - (b.order || 0));
  const done = subLessons.filter((l) => completedIds.has(l.id)).length;
  const pct = subLessons.length ? Math.round((done / subLessons.length) * 100) : 0;
  const units = [...new Set(subLessons.map((l) => l.unit))];
  const nextLesson = subLessons.find((l) => !completedIds.has(l.id));

  return (
    <PageShell title={subject} subtitle="Topic progress and recommended next steps." accent={m.card} icon={BookOpen}>
      <button onClick={() => setParams({})} className="text-sm font-bold text-primary hover:underline flex items-center gap-1 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Subjects
      </button>

      <div className={`bg-gradient-to-r ${m.card} rounded-2xl p-5 text-white shadow-sm mb-5`}>
        <div className="flex items-center justify-between">
          <div>
            <span><SubjectIcon subject={subject} className="w-9 h-9 text-white" /></span>
            <h2 className="text-xl font-extrabold mt-1">{subject}</h2>
            <p className="text-white/75 text-sm">{done} of {subLessons.length} lessons mastered</p>
          </div>
          <p className="text-4xl font-black">{pct}%</p>
        </div>
        <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {nextLesson && (
        <div className="bg-white border border-border/50 rounded-2xl p-4 mb-5 shadow-sm">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-2">Recommended Next Step</p>
          <Link to="/student" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"><SubjectIcon subject={nextLesson.subject} className="w-6 h-6 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-foreground">{nextLesson.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                <Clock className="w-3 h-3" />{nextLesson.duration}
                <Zap className="w-3 h-3" />+{nextLesson.xp} XP · {nextLesson.unit}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0" />
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {units.map((unit) => {
          const ul = subLessons.filter((l) => l.unit === unit);
          const ud = ul.filter((l) => completedIds.has(l.id)).length;
          const up = ul.length ? Math.round((ud / ul.length) * 100) : 0;
          return (
            <div key={unit} className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-foreground">{unit}</h3>
                <span className="text-xs font-bold text-muted-foreground">{ud}/{ul.length} · {up}%</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {ul.map((l) => {
                  const isDone = completedIds.has(l.id);
                  const score = bestScore(l.id);
                  return (
                    <Link key={l.id} to="/student" className="flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${isDone ? "bg-green-50 text-green-600" : "bg-muted"}`}>
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : <SubjectIcon subject={l.subject} className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{l.title}</p>
                        <p className="text-xs text-muted-foreground">{l.duration} · +{l.xp} XP{score != null ? ` · ${score}%` : ""}</p>
                      </div>
                      <Play className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
