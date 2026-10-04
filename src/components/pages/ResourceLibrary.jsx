import { useState } from "react";
import { Library, Play, FileText, Download } from "lucide-react";
import PageShell from "@/components/PageShell";

const VIDEOS = [
  { title: "Fractions Made Simple", subject: "Mathematics", grade: "3–6", url: "https://www.youtube.com/embed/3j6L9FEfq9k", emoji: "🔢" },
  { title: "Parts of Speech Rap", subject: "English", grade: "2–5", url: "https://www.youtube.com/embed/0W3QBqDgE1w", emoji: "📖" },
  { title: "The Water Cycle", subject: "Science", grade: "3–6", url: "https://www.youtube.com/eX-Dv8EM9O8", emoji: "💧" },
  { title: "Three Branches of Government", subject: "Social Studies", grade: "6–8", url: "https://www.youtube.com/embed/0W3QBqDgE1w", emoji: "⚖️" },
  { title: "Intro to Algebra", subject: "Mathematics", grade: "6–8", url: "https://www.youtube.com/embed/vDqOoI2M-1A", emoji: "📐" },
  { title: "Cells: The Building Blocks", subject: "Science", grade: "7–10", url: "https://www.youtube.com/embed/URUJD5NEXC8", emoji: "🔬" },
];

const PRINTABLES = [
  { title: "Multiplication Tables 1–12", subject: "Mathematics", type: "Worksheet", emoji: "✖️" },
  { title: "Sight Words Checklist", subject: "English", type: "Checklist", emoji: "📝" },
  { title: "Solar System Diagram", subject: "Science", type: "Diagram", emoji: "🪐" },
  { title: "World Map Labelling", subject: "Social Studies", type: "Worksheet", emoji: "🗺️" },
  { title: "Essay Planning Template (PEEL)", subject: "English", type: "Template", emoji: "📝" },
  { title: "Pythagoras Practice", subject: "Mathematics", type: "Worksheet", emoji: "📏" },
];

const SUBJECTS = ["All", "Mathematics", "English", "Science", "Social Studies"];

export default function ResourceLibrary() {
  const [subject, setSubject] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null);

  const videos = VIDEOS.filter((v) => subject === "All" || v.subject === subject);
  const printables = PRINTABLES.filter((p) => subject === "All" || p.subject === subject);

  return (
    <PageShell title="Resource Library" subtitle="Curated educational videos and printable materials to deepen your learning." accent="from-indigo-500 to-blue-600" icon={Library}>
      {/* Subject filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SUBJECTS.map((s) => (
          <button key={s} onClick={() => setSubject(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${subject === s ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/30"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Videos */}
      <h3 className="text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Play className="w-4 h-4" /> Videos</h3>
      {activeVideo ? (
        <div className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm">
          <div className="rounded-xl overflow-hidden bg-black aspect-video mb-3">
            <iframe src={activeVideo.url} title={activeVideo.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-bold text-foreground">{activeVideo.emoji} {activeVideo.title}</p><p className="text-xs text-muted-foreground">{activeVideo.subject} · Grade {activeVideo.grade}</p></div>
            <button onClick={() => setActiveVideo(null)} className="text-sm font-bold text-primary hover:underline">← Back to list</button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map((v) => (
            <button key={v.title} onClick={() => setActiveVideo(v)}
              className="text-left bg-white border border-border/50 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center relative">
                <span className="text-4xl">{v.emoji}</span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow"><Play className="w-5 h-5 text-primary fill-primary" /></div>
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-sm text-foreground">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.subject} · Grade {v.grade}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Printables */}
      <h3 className="text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-3 mt-6 flex items-center gap-2"><FileText className="w-4 h-4" /> Printables</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {printables.map((p) => (
          <div key={p.title} className="bg-white border border-border/50 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <span className="text-3xl">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.subject} · {p.type}</p>
            </div>
            <button className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 shrink-0"><Download className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
