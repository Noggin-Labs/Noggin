import { useState, useEffect } from "react";
import { Wand2, BookOpen, Save, CheckCircle2, Sparkles, Plus, Trash2, ShieldAlert } from "lucide-react";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "History", "Social Emotional Learning", "Mixed"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const NEURO_FOCUS = ["ADHD", "Dyslexia", "Autism", "Dyscalculia", "Processing Difficulties", "Visual Learning", "Kinesthetic Learning"];

const TEMPLATES = [
  { title: "Visual Fractions", subject: "Mathematics", difficulty: "medium", neurodivergent_focus: ["Dyscalculia", "Visual Learning"], objectives: "Understand fractions using visual area models.", activities: "Pizza-slice demo, shade-the-shape task, compare fractions.", accommodations: "Visual aids, step-by-step, read-aloud." },
  { title: "Phonics Sound Sort", subject: "English", difficulty: "easy", neurodivergent_focus: ["Dyslexia"], objectives: "Match sounds to letters and sort words by sound.", activities: "Sound cards, picture sort, read-aloud practice.", accommodations: "Dyslexia-friendly font, read-aloud, extra time." },
  { title: "Sensory Science Walk", subject: "Science", difficulty: "easy", neurodivergent_focus: ["Autism", "Kinesthetic Learning"], objectives: "Observe and describe using the five senses.", activities: "Outdoor observation, drawing, sharing findings.", accommodations: "Predictable routine, low-sensory options, movement breaks." },
  { title: "Timed Math Sprint", subject: "Mathematics", difficulty: "hard", neurodivergent_focus: ["ADHD"], objectives: "Build fluency with quick, repeated practice.", activities: "Short timed rounds, instant feedback, beat-your-score.", accommodations: "Visible timer, frequent breaks, energetic tone." },
];

const empty = { title: "", subject: "Mathematics", difficulty: "medium", duration_minutes: 30, neurodivergent_focus: [], objectives: "", activities: "", accommodations: "", materials: "", notes: "" };

export default function LessonBuilder() {
  const [user, setUser] = useState(null);
  const [denied, setDenied] = useState(false);
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        if (me.role !== "teacher" && me.role !== "admin") { setDenied(true); return; }
        setTemplates(await base44.entities.LessonPlanTemplate.filter({}));
      } catch { setDenied(true); }
    })();
  }, []);

  const toggleFocus = (f) => setForm((s) => ({ ...s, neurodivergent_focus: s.neurodivergent_focus.includes(f) ? s.neurodivergent_focus.filter((x) => x !== f) : [...s.neurodivergent_focus, f] }));

  const applyTemplate = (t) => setForm({
    title: t.title, subject: t.subject, difficulty: t.difficulty, duration_minutes: 30,
    neurodivergent_focus: t.neurodivergent_focus || [], objectives: t.objectives, activities: t.activities,
    accommodations: t.accommodations || "", materials: "", notes: "",
  });

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await base44.entities.LessonPlanTemplate.create(form);
    setSaving(false);
    setSaved(true);
    setTemplates((t) => [{ ...form }, ...t]);
    setForm(empty);
    setTimeout(() => setSaved(false), 3000);
  };

  const remove = async (id) => {
    await base44.entities.LessonPlanTemplate.delete(id);
    setTemplates((t) => t.filter((x) => x.id !== id));
  };

  if (denied) {
    return (
      <PageShell title="Lesson Builder" subtitle="Build custom, accommodated lessons." accent="from-violet-500 to-purple-600" icon={Wand2} backTo="/teacher">
        <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center"><ShieldAlert className="w-8 h-8 text-red-500" /></div>
          <h2 className="text-xl font-extrabold text-foreground">Teachers only</h2>
          <p className="text-muted-foreground max-w-sm">The Lesson Builder is available to teacher accounts.</p>
          <Link to="/teacher"><Button variant="outline" className="rounded-full font-bold">Back to dashboard</Button></Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Lesson Builder" subtitle="Craft custom lessons with built-in neurodivergent accommodations." accent="from-violet-500 to-purple-600" icon={Wand2} backTo="/teacher">
      {/* Template picker */}
      <div className="mb-5">
        <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Start from a template</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => (
            <button key={t.title} onClick={() => applyTemplate(t)}
              className="text-left bg-white border border-border/50 rounded-2xl p-4 hover:border-violet-300 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center mb-2"><BookOpen className="w-4 h-4 text-violet-600" /></div>
              <p className="font-bold text-sm text-foreground leading-snug">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.subject} · {t.difficulty}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {(t.neurodivergent_focus || []).slice(0, 2).map((f) => <span key={f} className="text-[10px] font-bold bg-violet-50 text-violet-600 rounded-full px-2 py-0.5">{f}</span>)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Builder form */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground">Lesson title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Fractions with Pizza"
              className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Subject</label>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary">
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Difficulty</label>
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary">
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">Duration (minutes)</label>
            <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
              className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground">Learning objectives</label>
            <textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} rows={2}
              className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground">Activities & instructions</label>
            <textarea value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} rows={3}
              className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground">Accommodations & adaptations</label>
            <textarea value={form.accommodations} onChange={(e) => setForm({ ...form, accommodations: e.target.value })} rows={2} placeholder="e.g. read-aloud, visual aids, extra time, movement breaks"
              className="w-full mt-1 border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground">Neurodivergent focus</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {NEURO_FOCUS.map((f) => {
              const on = form.neurodivergent_focus.includes(f);
              return (
                <button key={f} onClick={() => toggleFocus(f)}
                  className={`text-xs font-bold rounded-full px-3 py-1.5 border-2 transition-all ${on ? "bg-violet-500 text-white border-violet-500" : "bg-white text-foreground border-border hover:border-violet-300"}`}>
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={save} disabled={saving || !form.title.trim()} className="w-full rounded-xl font-bold gap-2">
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save lesson plan"}
        </Button>
        {saved && <p className="text-center text-sm text-green-600 font-bold flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> Lesson plan saved!</p>}
      </div>

      {/* Saved plans */}
      {templates.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-3">Your saved plans</p>
          <div className="space-y-2">
            {templates.map((t) => (
              <div key={t.id} className="bg-white border border-border/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.subject} · {t.difficulty} · {t.duration_minutes} min</p>
                  {(t.neurodivergent_focus || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.neurodivergent_focus.map((f) => <span key={f} className="text-[10px] font-bold bg-violet-50 text-violet-600 rounded-full px-2 py-0.5">{f}</span>)}
                    </div>
                  )}
                </div>
                <button onClick={() => remove(t.id)} className="shrink-0 w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
