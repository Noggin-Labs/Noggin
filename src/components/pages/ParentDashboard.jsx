import { useState, useEffect } from "react";
import {
  Brain, Trophy, Zap, Gem, Target, TrendingUp, BookOpen,
  Calculator, Atom, Globe, Star, ChevronRight, Bell,
  LogOut, BarChart2, User, Map, Medal, Calendar, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import SubjectMasteryMap from "../components/dashboard/SubjectMasteryMap";
import ParentAiAssistant from "../components/dashboard/ParentAiAssistant";
import MessagingPanel from "../components/messaging/MessagingPanel";
import ExportToSheetsButton from "../components/dashboard/ExportToSheetsButton";
import { BADGE_RULES } from "../data/lessons";

// ─── Config ───────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { name: "Mathematics", emoji: "🔢", color: "from-blue-500 to-blue-600", light: "bg-blue-50 text-blue-700", bar: "#3b82f6" },
  { name: "English",     emoji: "📖", color: "from-emerald-500 to-teal-500", light: "bg-emerald-50 text-emerald-700", bar: "#10b981" },
  { name: "Science",     emoji: "🔬", color: "from-purple-500 to-violet-600", light: "bg-purple-50 text-purple-700", bar: "#8b5cf6" },
  { name: "Social Studies", emoji: "🌍", color: "from-amber-500 to-orange-500", light: "bg-amber-50 text-amber-700", bar: "#f59e0b" },
  { name: "History", emoji: "🏛️", color: "from-orange-500 to-red-500", light: "bg-orange-50 text-orange-700", bar: "#f97316" },
  { name: "Social Emotional Learning", emoji: "❤️", color: "from-rose-500 to-pink-500", light: "bg-rose-50 text-rose-700", bar: "#f43f5e" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, sub, color, gradient }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 text-white bg-gradient-to-br ${gradient} shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {sub && <span className="text-xs text-white/70 font-semibold">{sub}</span>}
      </div>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-white/80 text-sm mt-0.5 font-semibold">{label}</p>
    </motion.div>
  );
}

function SubjectRow({ subject, completions, index }) {
  const subComps = completions.filter(c => c.subject === subject.name);
  const xp = subComps.reduce((s, c) => s + (c.xp_earned || 0), 0);
  const avgScore = subComps.length
    ? Math.round(subComps.reduce((s, c) => s + (c.score || 0), 0) / subComps.length)
    : 0;
  const progressPct = Math.min(100, Math.round((subComps.length / 2) * 100)); // 2 lessons per subject

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      className="bg-white border border-border/40 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl shrink-0`}>
          {subject.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-foreground">{subject.name}</p>
          <p className="text-xs text-muted-foreground">{subComps.length} lesson{subComps.length !== 1 ? "s" : ""} completed</p>
        </div>
        <div className="text-right">
          <p className="font-extrabold text-foreground text-lg">{avgScore > 0 ? `${avgScore}%` : "—"}</p>
          <p className="text-xs text-muted-foreground">Avg score</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
          initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.7, delay: index * 0.08 }} />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1 text-amber-600 font-bold"><Gem className="w-3 h-3" />{xp} gems</span>
        <span className={`px-2 py-0.5 rounded-full font-bold ${subject.light}`}>
          {progressPct >= 100 ? "Complete" : progressPct >= 50 ? "On Track" : "In Progress"}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubject, setActiveSubject] = useState("Mathematics");
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [earnedBadgeKeys, setEarnedBadgeKeys] = useState([]);
  const [emailing, setEmailing] = useState(false);
  const [emailed, setEmailed] = useState(false);

  useEffect(() => {
    async function init() {
      const me = await base44.auth.me();
      setUser(me);
      // In a real multi-child setup you'd query by child's email.
      // Here we query the current user's own completions for demo purposes.
      const comps = await base44.entities.LessonCompletion.filter({ created_by: me.email });
      setCompletions(comps);
      const badges = await base44.entities.Badge.filter({ created_by: me.email });
      setEarnedBadgeKeys(badges.map(b => b.badge_key));
    }
    init();
  }, []);

  // Derived stats
  const totalXp = completions.reduce((s, c) => s + (c.xp_earned || 0), 0);
  const totalLessons = completions.length;
  const avgScore = totalLessons
    ? Math.round(completions.reduce((s, c) => s + (c.score || 0), 0) / totalLessons)
    : 0;

  // Radar chart data
  const radarData = SUBJECTS.map(s => {
    const subComps = completions.filter(c => c.subject === s.name);
    const avg = subComps.length
      ? Math.round(subComps.reduce((sc, c) => sc + (c.score || 0), 0) / subComps.length)
      : 0;
    return { subject: s.emoji + " " + s.name.split(" ")[0], score: avg };
  });

  // Bar chart — scores per lesson
  const barData = completions.slice(-8).map((c, i) => ({
    name: c.lesson_title ? c.lesson_title.split(" ").slice(0, 2).join(" ") : `Lesson ${i + 1}`,
    score: c.score,
    xp: c.xp_earned,
    subject: c.subject,
  }));

  const displayName = user?.full_name?.split(" ")[0] || "there";
  const initials = user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  const childName = user?.full_name?.split(" ")[0] || "Your child";

  const sendWeeklyReport = async () => {
    if (!user?.email) return;
    setEmailing(true);
    const lines = completions.slice(0, 10)
      .map((c, i) => `${i + 1}. ${c.lesson_title || c.lesson_id} (${c.subject}) — ${c.score}% · +${c.xp_earned || 0} gems`)
      .join("\n");
    const body = `Hi ${displayName},\n\nHere's ${childName}'s weekly progress report from Noggin.\n\nLessons completed: ${totalLessons}\nAverage score: ${avgScore}%\nTotal gems: ${totalXp}\nBadges earned: ${earnedBadgeKeys.length}\n\nRecent lessons:\n${lines || "No lessons yet this week."}\n\nKeep up the great work!\n— Noggimigo`;
    try {
      await base44.integrations.Core.SendEmail({ to: user.email, subject: `${childName}'s Weekly Noggin Progress`, body });
      setEmailed(true);
      setTimeout(() => setEmailed(false), 4000);
    } catch {}
    setEmailing(false);
  };

  const TABS = ["overview", "subjects", "mastery maps", "badges", "messages", "ai assistant"];

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-nunito">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-600 px-6 pt-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">Noggin</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                <Bell className="w-4 h-4 text-white" />
              </button>
              <Link to="/curriculum-manager" className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors" title="Curriculum Manager">
                <BookOpen className="w-4 h-4 text-white" />
              </Link>
              <Link to="/calendar" className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors" title="Study Calendar">
                <Calendar className="w-4 h-4 text-white" />
              </Link>
              <button onClick={() => base44.auth.logout()}
                className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                <LogOut className="w-4 h-4 text-white" />
              </button>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-sm">{initials}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Parent Dashboard</p>
              <h1 className="text-2xl font-extrabold text-white">Welcome back, {displayName} 👋</h1>
              <p className="text-white/70 text-xs mt-0.5">Monitoring: <span className="text-white font-bold">{childName}'s Progress</span></p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: Gem,    value: totalXp,          label: "Total Gems",       color: "text-yellow-300" },
              { icon: Target, value: `${avgScore}%`,   label: "Avg Score",      color: "text-green-300" },
              { icon: BookOpen, value: totalLessons,   label: "Lessons Done",   color: "text-blue-300" },
              { icon: Trophy, value: earnedBadgeKeys.length, label: "Badges",    color: "text-orange-300" },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5">
                <p.icon className={`w-4 h-4 ${p.color}`} />
                <div>
                  <p className="text-white font-extrabold text-sm leading-none">{p.value}</p>
                  <p className="text-white/70 text-xs mt-0.5">{p.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 pb-12 space-y-6">

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Gem}      value={totalXp}          label="Gems Earned"       gradient="from-amber-400 to-orange-500" />
          <StatCard icon={Target}   value={`${avgScore}%`}   label="Average Score"   gradient="from-blue-500 to-blue-600" />
          <StatCard icon={BookOpen} value={totalLessons}      label="Lessons Done"    gradient="from-emerald-500 to-teal-500" />
          <StatCard icon={Trophy}   value={earnedBadgeKeys.length} label="Badges Earned" gradient="from-violet-500 to-purple-600" />
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <ExportToSheetsButton progressRecords={completions} studentName={childName} />
          <Button onClick={sendWeeklyReport} disabled={emailing || !user?.email}
            className="rounded-xl gap-2 font-bold bg-gradient-to-r from-violet-600 to-purple-600 border-0">
            <Mail className="w-4 h-4" /> {emailed ? "Sent! Check your email" : emailing ? "Sending..." : "Email weekly report"}
          </Button>
        </div>

        <div className="flex gap-1 bg-white border border-border/40 rounded-2xl p-1 shadow-sm overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all
                ${activeTab === tab ? "bg-violet-600 text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
              {tab === "mastery maps" ? "🗺 Maps" : tab === "badges" ? "🎖 Badges" : tab === "messages" ? "💬 Chat" : tab === "ai assistant" ? "🤖 AI" : tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-5">

                {/* Performance radar */}
                <div className="bg-white border border-border/40 rounded-2xl shadow-sm p-5">
                  <h3 className="font-extrabold text-foreground mb-1">Subject Performance Overview</h3>
                  <p className="text-xs text-muted-foreground mb-4">Average quiz scores across all subjects</p>
                  {radarData.some(d => d.score > 0) ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: "Nunito", fontWeight: 700, fill: "hsl(var(--foreground))" }} />
                        <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                      Complete lessons to see performance data
                    </div>
                  )}
                </div>

                {/* Recent scores bar chart */}
                {barData.length > 0 && (
                  <div className="bg-white border border-border/40 rounded-2xl shadow-sm p-5">
                    <h3 className="font-extrabold text-foreground mb-1">Recent Lesson Scores</h3>
                    <p className="text-xs text-muted-foreground mb-4">Last {barData.length} completed lessons</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barData} barSize={28}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Nunito" }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                          formatter={(val) => [`${val}%`, "Score"]}
                        />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {barData.map((entry, i) => {
                            const subj = SUBJECTS.find(s => s.name === entry.subject);
                            return <Cell key={i} fill={subj?.bar || "#8b5cf6"} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Recent lessons list */}
                {completions.length > 0 && (
                  <div className="bg-white border border-border/40 rounded-2xl shadow-sm p-5">
                    <h3 className="font-extrabold text-foreground mb-3">Recent Activity</h3>
                    <div className="space-y-0 divide-y divide-border/40">
                      {[...completions].reverse().slice(0, 5).map((c, i) => {
                        const subj = SUBJECTS.find(s => s.name === c.subject);
                        return (
                          <div key={c.id || i} className="flex items-center gap-3 py-3">
                            <span className="text-2xl">{subj?.emoji || "📚"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{c.lesson_title || c.lesson_id}</p>
                              <p className="text-xs text-muted-foreground">{c.subject}</p>
                            </div>
                            <div className="text-right shrink-0 space-y-0.5">
                              <p className={`text-sm font-extrabold ${c.score >= 80 ? "text-green-600" : c.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{c.score}%</p>
                              <p className="text-xs text-amber-600 font-bold flex items-center gap-0.5 justify-end"><Gem className="w-3 h-3" />+{c.xp_earned}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUBJECTS */}
            {activeTab === "subjects" && (
              <div className="space-y-4">
                {SUBJECTS.map((s, i) => (
                  <SubjectRow key={s.name} subject={s} completions={completions} index={i} />
                ))}
              </div>
            )}

            {/* MASTERY MAPS */}
            {activeTab === "mastery maps" && (
              <div className="space-y-5">
                {/* Subject selector */}
                <div className="flex gap-2 flex-wrap">
                  {SUBJECTS.map(s => (
                    <button key={s.name} onClick={() => setActiveSubject(s.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all
                        ${activeSubject === s.name ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/30"}`}>
                      <span>{s.emoji}</span> {s.name}
                    </button>
                  ))}
                </div>
                <SubjectMasteryMap subject={activeSubject} completions={completions} />
              </div>
            )}

            {/* BADGES */}
            {activeTab === "badges" && (
              <div className="space-y-5">
                <div className="bg-white border border-border/40 rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="font-extrabold text-foreground">Earned Badges</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{earnedBadgeKeys.length} / {BADGE_RULES.length} unlocked</p>
                    </div>
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-5 py-3 text-center">
                      <p className="text-2xl font-extrabold text-amber-600">{earnedBadgeKeys.length}</p>
                      <p className="text-xs text-muted-foreground">Badges</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {BADGE_RULES.map((b, i) => {
                      const unlocked = earnedBadgeKeys.includes(b.key);
                      return (
                        <motion.div key={b.key} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center
                            ${unlocked ? "border-amber-200 bg-amber-50" : "border-border/40 bg-muted/40 opacity-50"}`}>
                          <span className="text-4xl">{unlocked ? b.emoji : "🔒"}</span>
                          <p className="text-sm font-bold text-foreground leading-tight">{b.label}</p>
                          {unlocked
                            ? <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5"><Zap className="w-3 h-3" />+{b.points} pts</span>
                            : <span className="text-xs text-muted-foreground">Locked</span>
                          }
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === "messages" && (
              <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-indigo-700">💬 Teacher–Parent Messaging</p>
                  <p className="text-xs text-muted-foreground mt-1">Real-time conversations with your child's teachers about progress updates, concerns, and school communication.</p>
                </div>
                <MessagingPanel userRole="parent" userName={user?.full_name || "Parent"} />
              </div>
            )}

            {/* AI ASSISTANT */}
            {activeTab === "ai assistant" && (
              <ParentAiAssistant
                completions={completions}
                earnedBadgeKeys={earnedBadgeKeys}
                childName={childName}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
