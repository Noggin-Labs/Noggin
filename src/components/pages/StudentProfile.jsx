import { useEffect, useState } from "react";
import { UserCog, Target, Save, CheckCircle2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";

const ACCOMMODATIONS = [
  { key: "adhd", label: "ADHD", desc: "Shorter sessions, frequent breaks, movement-friendly." },
  { key: "dyslexia", label: "Dyslexia", desc: "Dyslexia-friendly fonts, read-aloud, extra time." },
  { key: "autism", label: "Autism", desc: "Predictable structure, reduced sensory load." },
  { key: "dyscalculia", label: "Dyscalculia", desc: "Visual maths aids, step-by-step working." },
  { key: "processing", label: "Processing Difficulties", desc: "Slower pacing, repeated instructions." },
  { key: "visual", label: "Visual Learning", desc: "Diagrams, charts, colour-coded content." },
  { key: "kinesthetic", label: "Kinesthetic Learning", desc: "Hands-on activities, interactive games." },
];

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [goalNotes, setGoalNotes] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifBadges, setNotifBadges] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      setAccommodations(me.accommodations || []);
      setGoalNotes(me.goal_notes || "");
      setNotifEmail(me.notification_prefs?.email ?? true);
      setNotifWeekly(me.notification_prefs?.weekly ?? true);
      setNotifBadges(me.notification_prefs?.badges ?? true);
    })();
  }, []);

  const toggleAcc = (key) => setAccommodations((a) => a.includes(key) ? a.filter((x) => x !== key) : [...a, key]);

  const save = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      accommodations,
      goal_notes: goalNotes,
      notification_prefs: { email: notifEmail, weekly: notifWeekly, badges: notifBadges },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageShell title="Student Profile" subtitle="Manage your learning goals, neurodivergent accommodations, and notifications." accent="from-rose-500 to-pink-600" icon={UserCog}>
      {/* Personal goals */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-foreground flex items-center gap-2 mb-3"><Target className="w-4 h-4 text-primary" /> My Learning Goals</h3>
        <textarea value={goalNotes} onChange={(e) => setGoalNotes(e.target.value)} rows={3}
          placeholder="What do you want to achieve this term? e.g. Master fractions, read 5 chapter books…"
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-primary" />
      </div>

      {/* Accommodations */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-1">Neurodivergent Accommodations</h3>
        <p className="text-xs text-muted-foreground mb-4">Select what applies to you — Noggin adapts content and pacing accordingly.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ACCOMMODATIONS.map((a) => {
            const on = accommodations.includes(a.key);
            return (
              <button key={a.key} onClick={() => toggleAcc(a.key)}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${on ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/30"}`}>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-foreground">{a.label}</p>
                  {on && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Notification Preferences</h3>
        {[
          { label: "Email reminders", desc: "Daily nudge to keep your streak alive.", val: notifEmail, set: setNotifEmail },
          { label: "Weekly progress report", desc: "A summary of your week, emailed to you and your parent.", val: notifWeekly, set: setNotifWeekly },
          { label: "Badge celebrations", desc: "Celebrate when you earn a new badge.", val: notifBadges, set: setNotifBadges },
        ].map((n) => (
          <div key={n.label} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <button onClick={() => n.set(!n.val)} className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${n.val ? "bg-primary" : "bg-muted"}`}>
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${n.val ? "translate-x-5" : ""}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Account & security */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3 flex items-center gap-2"><UserCog className="w-4 h-4 text-primary" /> Account & Security</h3>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Email</span><span className="font-bold text-foreground">{user?.email || "—"}</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Role</span><span className="font-bold text-foreground capitalize">{user?.role || "student"}</span></div>
          <div className="flex items-center justify-between"><span className="text-muted-foreground">Password</span><a href="/forgot-password" className="font-bold text-primary hover:underline">Reset password</a></div>
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="mt-5 w-full bg-primary text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50">
        <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Profile"}
      </button>
      {saved && <p className="text-center text-sm text-green-600 font-bold mt-3">Profile saved! 🎉</p>}
    </PageShell>
  );
}
