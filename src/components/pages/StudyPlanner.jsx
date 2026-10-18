import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Plus, CheckCircle2, Circle, Trash2, Bell, BookOpen, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "History", "Social Emotional Learning"];
const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const dayName = (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d];
const fmt = (d) => d.toISOString().split("T")[0];

export default function StudyPlanner() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "Mathematics", due_date: fmt(new Date()), due_time: "16:00", priority: "medium" });

  const load = async () => {
    try { setEvents(await base44.entities.CalendarEvent.filter({})); } catch { setEvents([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // Build a 7-day window starting today
  const today = new Date();
  const week = [...Array(7)].map((_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });

  const addEvent = async () => {
    if (!form.title.trim()) return;
    const created = await base44.entities.CalendarEvent.create({
      ...form, event_type: "study_session", status: "upcoming",
    });
    setEvents((e) => [...e, created]);
    setForm({ ...form, title: "" });
    setShowAdd(false);
  };

  const toggleDone = async (ev) => {
    const updated = await base44.entities.CalendarEvent.update(ev.id, { status: ev.status === "completed" ? "upcoming" : "completed" });
    setEvents((e) => e.map((x) => (x.id === ev.id ? updated : x)));
  };

  const remove = async (id) => {
    await base44.entities.CalendarEvent.delete(id);
    setEvents((e) => e.filter((x) => x.id !== id));
  };

  const byDay = (date) => events.filter((e) => e.due_date === fmt(date)).sort((a, b) => (a.due_time || "").localeCompare(b.due_time || ""));

  return (
    <PageShell title="Study Planner" subtitle="Plan your week, set study reminders, and keep your schedule on track." accent="from-indigo-500 to-blue-600" icon={Calendar} backTo="/student">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="w-4 h-4 text-primary" /> {events.filter((e) => e.status !== "completed").length} upcoming session{events.filter((e) => e.status !== "completed").length === 1 ? "" : "s"}
        </div>
        <Button onClick={() => setShowAdd((s) => !s)} className="rounded-xl gap-1.5 font-bold">
          <Plus className="w-4 h-4" /> {showAdd ? "Close" : "Add session"}
        </Button>
      </div>

      {showAdd && (
        <div className="bg-white border border-border/50 rounded-2xl p-5 mb-5 space-y-3 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Study session title…"
              className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary sm:col-span-2" />
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary">
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary">
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
            <select value={form.due_time} onChange={(e) => setForm({ ...form, due_time: e.target.value })}
              className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary">
              {TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Button onClick={addEvent} disabled={!form.title.trim()} className="w-full rounded-xl font-bold">Schedule session</Button>
        </div>
      )}

      {/* Week grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {week.map((d) => {
          const dayEvents = byDay(d);
          const isToday = fmt(d) === fmt(today);
          return (
            <div key={fmt(d)} className={`bg-white border rounded-2xl p-3 min-h-[160px] flex flex-col ${isToday ? "border-primary shadow-sm" : "border-border/40"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className={`text-xs font-bold uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`}>{dayName(d.getDay())}</p>
                  <p className={`text-lg font-black ${isToday ? "text-primary" : "text-foreground"}`}>{d.getDate()}</p>
                </div>
                {isToday && <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">Today</span>}
              </div>
              <div className="space-y-2 flex-1">
                {dayEvents.map((ev) => (
                  <div key={ev.id} className={`rounded-xl p-2 border text-xs ${ev.status === "completed" ? "bg-green-50 border-green-200 opacity-70" : ev.priority === "high" ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
                    <div className="flex items-start justify-between gap-1">
                      <button onClick={() => toggleDone(ev)} className="shrink-0 mt-0.5">
                        {ev.status === "completed" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground" />}
                      </button>
                      <button onClick={() => remove(ev.id)} className="shrink-0"><X className="w-3 h-3 text-muted-foreground hover:text-red-500" /></button>
                    </div>
                    <p className={`font-bold mt-1 leading-snug ${ev.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>{ev.title}</p>
                    {ev.due_time && <p className="flex items-center gap-1 text-muted-foreground mt-0.5"><Clock className="w-3 h-3" />{ev.due_time}</p>}
                    {ev.subject && <p className="text-muted-foreground/80">{ev.subject}</p>}
                  </div>
                ))}
                {dayEvents.length === 0 && <p className="text-[11px] text-muted-foreground/60 text-center mt-4">No sessions</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-indigo-700 text-sm">Tip</p>
          <p className="text-sm text-indigo-600/80 mt-0.5">Short, regular sessions beat long cramming. Aim for 15–20 minutes a day to keep your streak alive and your brain fresh.</p>
          <Link to="/lesson-path" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 mt-2">Browse the lesson path →</Link>
        </div>
      </div>
    </PageShell>
  );
}
