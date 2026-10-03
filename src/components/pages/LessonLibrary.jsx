import { useState } from "react";
import { Library, Filter } from "lucide-react";
import PageShell from "@/components/PageShell";
import LessonPlayer from "@/components/dashboard/LessonPlayer";
import { LESSONS } from "@/data/lessons";
import { base44 } from "@/api/base44Client";

const SUBJECTS = ["All", "Mathematics", "English", "Science", "Social Studies", "History", "Social Emotional Learning"];
const DIFFICULTIES = ["All", "easy", "medium", "hard"];

const SUBJECT_EMOJI = {
  Mathematics: "🔢", English: "📖", Science: "🔬", "Social Studies": "🌍", History: "🏛️", "Social Emotional Learning": "❤️",
};

export default function LessonLibrary() {
  const [subject, setSubject] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [query, setQuery] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [savedToast, setSavedToast] = useState(null);

  const filtered = LESSONS.filter((l) =>
    (subject === "All" || l.subject === subject) &&
    (difficulty === "All" || l.difficulty === difficulty) &&
    (!query.trim() || (l.title + " " + l.unit + " " + l.subject).toLowerCase().includes(query.toLowerCase()))
  );

  const grouped = SUBJECTS.slice(1).map((s) => ({
    subject: s,
    lessons: filtered.filter((l) => l.subject === s),
  })).filter((g) => g.lessons.length);

  const onComplete = async ({ lessonId, title, subject, score, xp }) => {
    await base44.entities.LessonCompletion.create({ lesson_id: lessonId, lesson_title: title, subject, score, xp_earned: xp });
    setActiveLesson(null);
    setSavedToast(`${title}: ${score}% · +${xp} gems saved!`);
    setTimeout(() => setSavedToast(null), 3500);
  };

  return (
    <PageShell title="Lesson Library" subtitle="Browse every subject and lesson — filter by interest or skill level." accent="from-blue-500 to-indigo-600" icon={Library}>
      {/* Filters */}
      <div className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground"><Filter className="w-4 h-4" /> Filters</div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons…"
          className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:border-primary" />
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button key={s} onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${subject === s ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/30"}`}>
              {s === "All" ? "All Subjects" : `${SUBJECT_EMOJI[s] || ""} ${s}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border-2 transition-all ${difficulty === d ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/30"}`}>
              {d === "All" ? "All Levels" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="mt-5 space-y-6">
        {grouped.length === 0 && <p className="text-center text-sm text-muted-foreground py-10">No lessons match your filters.</p>}
        {grouped.map((g) => (
          <div key={g.subject}>
            <h2 className="text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-2">{SUBJECT_EMOJI[g.subject]} {g.subject} · {g.lessons.length}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.lessons.map((l) => (
                <button key={l.id} onClick={() => setActiveLesson(l)}
                  className="text-left bg-white border border-border/50 rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{l.emoji}</span>
                    <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{l.difficulty}</span>
                  </div>
                  <p className="font-extrabold text-sm text-foreground mt-2 leading-snug">{l.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{l.unit} · {l.duration} · +{l.xp} gems</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeLesson && <LessonPlayer lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={onComplete} />}

      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-xl">
          {savedToast}
        </div>
      )}
    </PageShell>
  );
}
