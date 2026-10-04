import { useState, useEffect, useRef } from "react";
import {
  Brain, Flame, Trophy, Play, Clock, BookOpen,
  Zap, LogOut, CheckCircle2, BarChart2, Activity, Award, Target, Gem,
  ChevronRight, Home, GraduationCap, ChevronDown, Star, Gamepad2,
  UserCog, Accessibility, Bot, Volume2, Lock, Snowflake, Map, Calendar, ShoppingBag } from
"lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import NoggimigoTutor from "../components/dashboard/NoggimigoTutor";
import LessonPlayer from "../components/dashboard/LessonPlayer";
import LessonRoadmap from "../components/dashboard/LessonRoadmap";
import IepGoals from "../components/dashboard/IepGoals";
import DailyFocusCard from "../components/dashboard/DailyFocusCard";
import AtomMascot from "../components/dashboard/AtomMascot";
import MascotBubble from "../components/dashboard/MascotBubble";
import SubjectIcon from "../components/SubjectIcon";
import StreakRing from "../components/StreakRing";
import { checkAutoPacing, savePacingRecord } from "../lib/autoPacing";
import { selectNextLesson } from "../lib/adaptiveEngine";
import { autoUpdateIepOnCompletion } from "../lib/iepAutomation";
import { LESSONS, BADGE_RULES } from "../data/lessons";
import { computeStreakFromUser, recordActivityAndUpdateStreak, milestoneBonusFor } from "../lib/streak";

const COURSE_META = {
  Mathematics: { color: "from-[#2d8cff] to-blue-600", bg: "bg-[#2d8cff]", light: "bg-blue-50 text-blue-700", border: "border-blue-200", hex: "#2d8cff", card: "from-[#2d8cff] to-blue-700" },
  English: { color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700", border: "border-emerald-200", hex: "#10b981", card: "from-emerald-500 to-emerald-700" },
  Science: { color: "from-purple-500 to-violet-600", bg: "bg-purple-500", light: "bg-purple-50 text-purple-700", border: "border-purple-200", hex: "#8b5cf6", card: "from-purple-500 to-violet-600" },
  "Social Studies": { color: "from-amber-500 to-orange-500", bg: "bg-amber-500", light: "bg-amber-50 text-amber-700", border: "border-amber-200", hex: "#f59e0b", card: "from-amber-500 to-orange-600" },
  "History": { color: "from-orange-500 to-red-500", bg: "bg-orange-500", light: "bg-orange-50 text-orange-700", border: "border-orange-200", hex: "#f97316", card: "from-orange-500 to-red-600" },
  "Social Emotional Learning": { color: "from-rose-500 to-pink-500", bg: "bg-rose-500", light: "bg-rose-50 text-rose-700", border: "border-rose-200", hex: "#f43f5e", card: "from-rose-500 to-pink-600" }
};

const DIFF_RANK = { easy: 0, medium: 1, hard: 2 };

const NAV_ITEMS = [
{ id: "home", label: "Home", icon: Home },
{ id: "learn", label: "Learn", icon: GraduationCap },
{ id: "progress", label: "Progress", icon: BarChart2 },
{ id: "iep", label: "IEP Goals", icon: Target },
{ id: "badges", label: "Badges", icon: Award },
{ id: "games", label: "Games", icon: Gamepad2, to: "/games" },
{ id: "ai", label: "Noggimigo", icon: Brain }];

const QUICK_LINKS = [
  { to: "/lesson-library", label: "Lesson Library", icon: BookOpen, color: "from-primary to-blue-600" },
  { to: "/learning-analytics", label: "Analytics", icon: BarChart2, color: "from-primary to-blue-600" },
  { to: "/activity-feed", label: "Activity Feed", icon: Activity, color: "from-amber-500 to-orange-500" },
  { to: "/iep-tracker", label: "IEP Tracker", icon: Target, color: "from-primary to-blue-600" },
  { to: "/goal-celebration", label: "Celebrations", icon: Trophy, color: "from-amber-400 to-orange-500" },
  { to: "/communication-board", label: "Speak Board", icon: Volume2, color: "from-primary to-blue-600" },
  { to: "/student-profile", label: "My Profile", icon: UserCog, color: "from-rose-500 to-pink-600" },
  { to: "/accessibility-settings", label: "Accessibility", icon: Accessibility, color: "from-primary to-blue-600" },
  { to: "/noggimigo-settings", label: "Noggimigo", icon: Bot, color: "from-primary to-blue-600" },
  { to: "/lesson-path", label: "Lesson Path", icon: Map, color: "from-emerald-500 to-teal-600" },
  { to: "/study-planner", label: "Study Planner", icon: Calendar, color: "from-indigo-500 to-blue-600" },
  { to: "/gems-shop", label: "Gems Shop", icon: ShoppingBag, color: "from-amber-400 to-orange-500" },
];


function XpBar({ xp }) {
  const level = Math.floor(xp / 200) + 1;
  const progress = xp % 200 / 200;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-white font-black text-xs shadow">{level}</div>
      <div className="flex-1">
        <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
          <span>Level {level}</span><span>{xp % 200}/200 gems</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-amber-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 1 }} />
        </div>
      </div>
    </div>);

}

function UnitSection({ unit, lessons, completedIds, onStart, color, hex, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const done = lessons.filter((l) => completedIds.has(l.id)).length;
  const pct = Math.round(done / lessons.length * 100);
  return (
    <div className="bg-white border border-border/60 rounded-2xl overflow-hidden mb-3 shadow-sm">
      <button onClick={() => setOpen((o) => !o)}
      className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-2 h-10 rounded-full" style={{ background: hex }} />
          <div className="text-left">
            <p className="font-extrabold text-sm text-foreground">{unit}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: hex }} />
              </div>
              <span className="text-xs text-muted-foreground font-semibold">{done}/{lessons.length}</span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open &&
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-1">
              <LessonRoadmap lessons={lessons} completedIds={completedIds} onStart={onStart} color={color} hex={hex} />
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeSubject, setActiveSubject] = useState(null);
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [earnedBadgeKeys, setEarnedBadgeKeys] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [newBadge, setNewBadge] = useState(null);
  const [streakDays, setStreakDays] = useState(0);
  const [unlockAlert, setUnlockAlert] = useState(null);
  const [milestoneAlert, setMilestoneAlert] = useState(null);
  const [mascotResult, setMascotResult] = useState(null);
  const [showMascot, setShowMascot] = useState(true);
  const lessonStartRef = useRef(null);

  useEffect(() => {
    async function init() {
      const me = await base44.auth.me();
      setUser(me);
      setStreakDays(computeStreakFromUser(me));
      const [comps, badges] = await Promise.all([
      base44.entities.LessonCompletion.filter({ created_by: me.email }),
      base44.entities.Badge.filter({ created_by: me.email })]
      );
      setCompletions(comps);
      setEarnedBadgeKeys(badges.map((b) => b.badge_key));
    }
    init();
  }, []);

  // Open a lesson deep-linked from the Lesson Path (?lesson=<id>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lid = params.get("lesson");
    if (lid) {
      const l = LESSONS.find((x) => x.id === lid);
      if (l) startLesson(l);
    }
  }, []);

  const startLesson = (lesson) => {lessonStartRef.current = Date.now();setActiveLesson(lesson);};

  const handleLessonComplete = async ({ lessonId, title, subject, score, xp }) => {
    const timeTakenSecs = lessonStartRef.current ? Math.round((Date.now() - lessonStartRef.current) / 1000) : 9999;
    const record = await base44.entities.LessonCompletion.create({ lesson_id: lessonId, lesson_title: title, subject, score, xp_earned: xp });
    const next = [...completions, record];
    setCompletions(next);
    if (user) {
      const s = await recordActivityAndUpdateStreak(user);
      setStreakDays(s);
      const refreshed = { ...user, streak_days: s, last_activity_date: new Date().toISOString().split("T")[0] };
      const bonus = milestoneBonusFor(s);
      if (bonus > 0) {
        const newBonus = (user.bonus_gems || 0) + bonus;
        await base44.auth.updateMe({ bonus_gems: newBonus });
        refreshed.bonus_gems = newBonus;
        setMilestoneAlert({ streak: s, bonus });
        setTimeout(() => setMilestoneAlert(null), 6000);
      }
      setUser(refreshed);
    }
    // Automate IEP goal progress for the matching subject (fire-and-forget)
    autoUpdateIepOnCompletion({ subject, score, lessonTitle: title });
    for (const rule of BADGE_RULES) {
      if (!earnedBadgeKeys.includes(rule.key) && rule.condition(next, streakDays)) {
        await base44.entities.Badge.create({ badge_key: rule.key, label: rule.label, emoji: rule.emoji, subject: rule.subject || "", points_awarded: rule.points });
        setEarnedBadgeKeys((p) => [...p, rule.key]);
        setNewBadge(rule);
        setTimeout(() => setNewBadge(null), 4000);
      }
    }
    const completedLesson = LESSONS.find((l) => l.id === lessonId);
    if (completedLesson) {
      const challenge = checkAutoPacing(completedLesson, timeTakenSecs, score, LESSONS, new Set(next.map((c) => c.lesson_id)));
      if (challenge) {
        setUnlockAlert({ lesson: challenge, timeSaved: Math.round((parseDuration(completedLesson.duration) - timeTakenSecs) / 60) });
        setTimeout(() => setUnlockAlert(null), 7000);
        await savePacingRecord(base44, subject, challenge.difficulty || "hard", `Finished "${title}" in ${timeTakenSecs}s with ${score}% — unlocked "${challenge.title}"`);
      }
    }
    setMascotResult({ score, xp, title });
    setShowMascot(true);
    setActiveLesson(null);
  };

  function parseDuration(dur) {const m = String(dur).match(/(\d+)/);return m ? parseInt(m[1]) * 60 : 300;}

  const completedIds = new Set(completions.map((c) => c.lesson_id));
  const totalXp = completions.reduce((s, c) => s + (c.xp_earned || 0), 0) + (user?.bonus_gems || 0);
  const availableGems = Math.max(0, totalXp - (user?.gems_spent || 0));
  const subjects = Object.keys(COURSE_META);

  const courses = subjects.map((name) => {
    const meta = COURSE_META[name];
    const subLessons = LESSONS.filter((l) => l.subject === name);
    const done = subLessons.filter((l) => completedIds.has(l.id)).length;
    return { name, ...meta, lessonCount: subLessons.length, doneLessons: done, progress: subLessons.length ? Math.round(done / subLessons.length * 100) : 0 };
  });

  const nextLesson = LESSONS.find((l) => !completedIds.has(l.id));
  const focusLessons = LESSONS
    .filter((l) => !completedIds.has(l.id))
    .sort((a, b) => (DIFF_RANK[a.difficulty] ?? 1) - (DIFF_RANK[b.difficulty] ?? 1) || (a.order || 0) - (b.order || 0))
    .slice(0, 3);
  const displayName = user?.preferred_name || user?.full_name?.split(" ")[0] || "Learner";
  const initials = user?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const goToSubject = (name) => {setActiveSubject(name);setActiveTab("learn");};
  const handleTabChange = (id) => {setActiveTab(id);setActiveSubject(null);};

  return (
    <div className="min-h-screen bg-[#f0fdfa] font-nunito">

      {/* Unlock Alert */}
      <AnimatePresence>
        {unlockAlert &&
        <motion.div initial={{ opacity: 0, y: -70, x: "-50%" }} animate={{ opacity: 1, y: 16, x: "-50%" }} exit={{ opacity: 0, y: -70 }}
        className="fixed top-0 left-1/2 z-[101] bg-white border-2 border-primary/40 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 max-w-xs w-full">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><SubjectIcon subject={unlockAlert.lesson.subject} className="w-5 h-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-primary text-sm flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Challenge Unlocked!</p>
              <p className="text-xs text-foreground font-semibold truncate">{unlockAlert.lesson.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">You're ahead of pace — try a harder module!</p>
            </div>
            <button onClick={() => {startLesson(unlockAlert.lesson);setUnlockAlert(null);}}
          className="shrink-0 text-xs font-extrabold text-white bg-primary rounded-xl px-3 py-1.5 hover:bg-primary/90">Start</button>
          </motion.div>
        }
      </AnimatePresence>

      {/* Streak Milestone Toast */}
      <AnimatePresence>
        {milestoneAlert &&
        <motion.div initial={{ opacity: 0, y: -70, x: "-50%" }} animate={{ opacity: 1, y: 16, x: "-50%" }} exit={{ opacity: 0, y: -70 }}
        className="fixed top-0 left-1/2 z-[101] bg-white border-2 border-orange-300 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 max-w-xs w-full">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0"><Flame className="w-5 h-5 text-orange-500" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-orange-700 text-sm flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {milestoneAlert.streak}-Day Streak!</p>
              <p className="text-xs text-foreground font-semibold">You're on fire! Keep it going tomorrow.</p>
              <p className="text-xs text-amber-600 font-bold mt-0.5">+{milestoneAlert.bonus} bonus gems!</p>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Badge Toast */}
      <AnimatePresence>
        {newBadge &&
        <motion.div initial={{ opacity: 0, y: -60, x: "-50%" }} animate={{ opacity: 1, y: 16, x: "-50%" }} exit={{ opacity: 0, y: -60 }}
        className="fixed top-0 left-1/2 z-[100] bg-white border-2 border-amber-300 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-500" />
            <div><p className="font-extrabold text-amber-800">Badge Unlocked!</p><p className="text-sm text-amber-700">{newBadge.label} · +{newBadge.points} pts</p></div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Lesson Modal */}
      <AnimatePresence>
        {activeLesson && <LessonPlayer lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={handleLessonComplete} />}
      </AnimatePresence>

      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-border/40 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto h-14 px-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-base text-foreground hidden sm:block tracking-tight">Noggin</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 min-w-0 justify-center overflow-x-auto">
            {NAV_ITEMS.map(({ id, label, icon: Icon, to }) =>
            to ? (
              <Link key={id} to={to}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all text-muted-foreground hover:text-foreground hover:bg-muted/60 shrink-0 whitespace-nowrap">
                <Icon className="w-3.5 h-3.5" /><span className="hidden lg:inline">{label}</span>
              </Link>
            ) : (
              <button key={id} onClick={() => handleTabChange(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all shrink-0 whitespace-nowrap
                    ${activeTab === id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
                  <Icon className="w-3.5 h-3.5" /><span className="hidden lg:inline">{label}</span>
                </button>
            )
            )}
          </nav>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1" title="Daily streak">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-orange-700 font-bold text-xs">{streakDays}d</span>
              {user?.streak_freezes > 0 && <span className="flex items-center gap-0.5 text-blue-500 font-bold text-xs"><Snowflake className="w-3 h-3" />{user.streak_freezes}</span>}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
              <Gem className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-700 font-bold text-xs">{availableGems} gems</span>
            </div>
            <button onClick={() => base44.auth.logout()} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <Link to="/student-profile" className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow hover:ring-2 ring-primary/30 transition-all" title="My profile & settings">{initials}</Link>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/40 grid grid-cols-7">
        {NAV_ITEMS.map(({ id, label, icon: Icon, to }) =>
        to ? (
          <Link key={id} to={to}
          className="flex flex-col items-center gap-0.5 py-2 px-1 border-t-2 border-transparent text-muted-foreground">
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-bold truncate w-full text-center">{label}</span>
          </Link>
        ) : (
          <button key={id} onClick={() => handleTabChange(id)}
          className={`flex flex-col items-center gap-0.5 py-2 px-1 border-t-2 transition-all
                ${activeTab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-bold truncate w-full text-center">{label}</span>
          </button>
        )
        )}
      </nav>

      {/* ── Content ── */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab + (activeSubject || "")}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

            {/* ══ HOME ══ */}
            {activeTab === "home" &&
            <div className="space-y-6">

                {/* Hero greeting banner with mascot */}
                <div className="relative bg-gradient-to-r from-primary to-blue-700 rounded-3xl overflow-hidden p-6 shadow-xl">
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white/80 text-sm font-semibold mb-1">Welcome back,</p>
                      <h1 className="text-3xl font-black text-white leading-tight">{displayName}!</h1>
                      {streakDays > 0 ?
                    <p className="text-white/75 text-sm mt-1.5 flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-300" />{streakDays}-day streak — keep it up!</p> :
                    <p className="text-white/75 text-sm mt-1.5">Start a lesson to earn gems!</p>}
                      <div className="mt-4 max-w-xs"><XpBar xp={totalXp} /></div>
                    </div>
                    <div className="w-28 h-28 shrink-0 drop-shadow-2xl">
                      <AtomMascot />
                    </div>
                  </div>
                  {/* decorative blobs */}
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                </div>

                {/* Mascot bubble */}
                {showMascot && (
                  <MascotBubble
                    lessonResult={mascotResult}
                    onDismiss={() => { setShowMascot(false); setMascotResult(null); }}
                  />
                )}

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                { icon: Gem, value: totalXp, label: "Total Gems", bg: "bg-amber-400", light: "bg-amber-50 border-amber-200 text-amber-800" },
                { icon: CheckCircle2, value: completedIds.size, label: "Lessons", bg: "bg-green-500", light: "bg-green-50 border-green-200 text-green-800" },
                { icon: Flame, value: `${streakDays}d`, label: "Streak", bg: "bg-orange-400", light: "bg-orange-50 border-orange-200 text-orange-800" }].
                map(({ icon: Icon, value, label, bg, light }) =>
                <div key={label} className={`${light} border rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm`}>
                      <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center shadow`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xl font-black">{value}</p>
                      <p className="text-xs font-bold opacity-70">{label}</p>
                    </div>
                )}
                </div>

                {/* Streak visual */}
                <StreakRing streakDays={streakDays} freezes={user?.streak_freezes ?? 0} />

                {/* Daily focus */}
                <DailyFocusCard focusLessons={focusLessons} onStart={startLesson} />

                {/* Adaptive recommendations */}
                {(() => {
                  const userLevel = user?.current_level || "Level-2-Standard";
                  const isFoundational = userLevel === "Level-1-Foundational";
                  const rec = selectNextLesson({ completions, allLessons: LESSONS, userLevel, learningProfile: user?.learning_profile });
                  const featuredLesson = rec.lesson;
                  const also = LESSONS.filter(l => !completedIds.has(l.id) && l !== featuredLesson).slice(0, 2);
                  return featuredLesson ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Recommended for You</h2>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${isFoundational ? "bg-green-50 text-green-700 border-green-200" : "bg-teal-50 text-teal-700 border-teal-200"}`}>
                          {isFoundational ? "Foundational" : "Standard"} level
                        </span>
                      </div>
                      {rec.lesson && <p className="text-xs text-muted-foreground mb-3 -mt-1">{rec.reason}</p>}
                      <motion.button whileHover={{ scale: 1.01 }} onClick={() => startLesson(featuredLesson)}
                        className={`w-full bg-gradient-to-r ${COURSE_META[featuredLesson.subject]?.card || COURSE_META[featuredLesson.subject]?.color} rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg text-left mb-3`}>
                        <div>
                          <span className="text-xs font-bold text-white/80 bg-white/15 rounded-full px-2.5 py-0.5">
                            {featuredLesson.subject} · {featuredLesson.unit}
                          </span>
                          <p className="text-white font-extrabold text-lg mt-2 leading-tight">{featuredLesson.title}</p>
                          <p className="text-white/70 text-xs mt-1 flex items-center gap-2">
                            <Clock className="w-3 h-3" />{featuredLesson.duration}
                            <Gem className="w-3 h-3 ml-1" />+{featuredLesson.xp} gems
                            <span className="ml-1 capitalize opacity-80">{featuredLesson.difficulty}</span>
                          </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                          <Play className="w-7 h-7 text-white fill-current" />
                        </div>
                      </motion.button>
                      {also.length > 0 && (
                        <div className="flex gap-2">
                          {also.map(l => (
                            <button key={l.id} onClick={() => startLesson(l)}
                              className="flex-1 bg-white border border-border/50 rounded-xl p-3 text-left hover:shadow-md hover:-translate-y-0.5 transition-all">
                              <SubjectIcon subject={l.subject} className="w-6 h-6 text-primary" />
                              <p className="text-xs font-extrabold text-foreground mt-1 leading-snug line-clamp-2">{l.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{l.subject}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                      <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                      <p className="font-extrabold text-green-700 text-lg">All lessons complete!</p>
                      <p className="text-sm text-green-600 mt-1">Revisit lessons to keep practising, or set a new IEP goal!</p>
                    </div>
                  );
                })()}

                {/* Explore Noggin quick links */}
                <div>
                  <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">Explore Noggin</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {QUICK_LINKS.map((l) => (
                      <Link key={l.to} to={l.to}
                        className="group flex items-center gap-3 bg-white border border-border/50 rounded-2xl p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.color} flex items-center justify-center shrink-0`}>
                          <l.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-foreground leading-tight truncate">{l.label}</p>
                          <p className="text-xs text-muted-foreground">Open →</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Courses grid */}
                <div>
                  <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">Your Courses</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {courses.map((c, i) =>
                  <motion.button key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => goToSubject(c.name)}
                  className="text-left bg-white border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow shrink-0`}><SubjectIcon subject={c.name} className="w-6 h-6 text-white" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="font-extrabold text-sm text-foreground">{c.name}</p>
                            <span className="text-xs font-bold text-muted-foreground">{c.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                        initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{c.doneLessons}/{c.lessonCount} lessons</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                      </motion.button>
                  )}
                  </div>
                </div>

                {/* Recent badges */}
                {earnedBadgeKeys.length > 0 &&
              <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Recent Badges</h2>
                      <button onClick={() => handleTabChange("badges")} className="text-xs font-bold text-primary hover:underline">View all →</button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {BADGE_RULES.filter((b) => earnedBadgeKeys.includes(b.key)).slice(0, 6).map((b) =>
                  <div key={b.key} className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-xl px-3 py-2 shadow-sm">
                          <Award className="w-5 h-5 text-amber-500" />
                          <span className="text-xs font-bold text-foreground">{b.label}</span>
                        </div>
                  )}
                    </div>
                  </div>
              }
              </div>
            }

            {/* ══ LEARN ══ */}
            {activeTab === "learn" &&
            <div>
                {!activeSubject ?
              <div className="space-y-4">
                    <h1 className="text-2xl font-extrabold text-foreground">Choose a Subject</h1>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {courses.map((c, i) =>
                  <motion.button key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => setActiveSubject(c.name)}
                  className="text-left bg-white border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
                          <div className={`bg-gradient-to-r ${c.card || c.color} p-5 flex items-center gap-3`}>
                            <span className="drop-shadow"><SubjectIcon subject={c.name} className="w-9 h-9 text-white" /></span>
                            <div>
                              <h3 className="text-white font-extrabold text-lg leading-tight">{c.name}</h3>
                              <p className="text-white/75 text-xs">{c.lessonCount} lessons</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-muted-foreground">{c.doneLessons} of {c.lessonCount} complete</span>
                              <span className="text-xs font-extrabold text-foreground">{c.progress}%</span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all`} style={{ width: `${c.progress}%` }} />
                            </div>
                          </div>
                        </motion.button>
                  )}
                    </div>
                  </div> :

              <div>
                    <button onClick={() => setActiveSubject(null)}
                className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 mb-4 transition-colors">
                      ← All Subjects
                    </button>
                    {(() => {
                  const meta = COURSE_META[activeSubject];
                  const subLessons = LESSONS.filter((l) => l.subject === activeSubject);
                  const done = subLessons.filter((l) => completedIds.has(l.id)).length;
                  const pct = Math.round(done / subLessons.length * 100);
                  const units = [...new Set(subLessons.map((l) => l.unit))];
                  return (
                    <>
                          <div className={`bg-gradient-to-r ${meta.card || meta.color} rounded-2xl p-6 mb-5 text-white shadow-lg`}>
                            <div className="flex items-end justify-between">
                              <div>
                                <span><SubjectIcon subject={activeSubject} className="w-10 h-10 text-white" /></span>
                                <h2 className="text-2xl font-extrabold mt-1">{activeSubject}</h2>
                                <p className="text-white/75 text-sm">{done} of {subLessons.length} lessons mastered</p>
                              </div>
                              <div className="text-right">
                                <p className="text-4xl font-black text-white">{pct}%</p>
                              </div>
                            </div>
                            <div className="mt-4 h-2.5 bg-white/20 rounded-full overflow-hidden">
                              <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                            </div>
                          </div>
                          {units.map((unit, i) =>
                      <UnitSection key={unit} unit={unit}
                      lessons={subLessons.filter((l) => l.unit === unit).sort((a, b) => (a.order || 0) - (b.order || 0))}
                      completedIds={completedIds} onStart={startLesson}
                      color={meta.color} hex={meta.hex} defaultOpen={i === 0} />
                      )}
                        </>);

                })()}
                  </div>
              }
              </div>
            }

            {/* ══ PROGRESS ══ */}
            {activeTab === "progress" &&
            <div className="space-y-5">
                <h1 className="text-2xl font-extrabold text-foreground">My Progress</h1>
                <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Overall Mastery</h3>
                  {courses.map((c) =>
                <div key={c.name} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2"><SubjectIcon subject={c.name} className="w-5 h-5 text-foreground" /><span className="text-sm font-semibold text-foreground">{c.name}</span></div>
                        <span className="text-sm font-extrabold text-foreground">{c.progress}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                    initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{c.doneLessons}/{c.lessonCount} lessons complete</p>
                    </div>
                )}
                </div>
                {completions.length > 0 &&
              <div className="bg-white border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/40">
                      <h3 className="font-bold text-foreground">Lesson History</h3>
                    </div>
                    <div className="divide-y divide-border/30">
                      {[...completions].reverse().slice(0, 20).map((c, i) =>
                  <div key={c.id || i} className="flex items-center gap-3 px-5 py-3.5">
                          <span className="shrink-0"><SubjectIcon subject={c.subject} className="w-5 h-5 text-muted-foreground" /></span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{c.lesson_title || c.lesson_id}</p>
                            <p className="text-xs text-muted-foreground">{c.subject}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-sm font-extrabold ${c.score >= 80 ? "text-green-600" : c.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{c.score}%</p>
                            <p className="text-xs text-amber-600 font-semibold">+{c.xp_earned} gems</p>
                          </div>
                        </div>
                  )}
                    </div>
                  </div>
              }
              </div>
            }

            {/* ══ BADGES ══ */}
            {activeTab === "badges" &&
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-extrabold text-foreground">Achievements</h1>
                  <div className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs font-bold text-amber-700">
                    {earnedBadgeKeys.length} / {BADGE_RULES.length} earned
                  </div>
                </div>
                {earnedBadgeKeys.length > 0 &&
              <div>
                    <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">Earned</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {BADGE_RULES.filter((b) => earnedBadgeKeys.includes(b.key)).map((b, i) =>
                  <motion.div key={b.key} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm">
                          <Award className="w-9 h-9 text-amber-500" />
                          <p className="text-xs font-extrabold text-foreground text-center leading-snug">{b.label}</p>
                          <span className="text-xs text-amber-600 font-bold">+{b.points} pts</span>
                        </motion.div>
                  )}
                    </div>
                  </div>
              }
                <div>
                  <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">Locked</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BADGE_RULES.filter((b) => !earnedBadgeKeys.includes(b.key)).map((b) =>
                  <div key={b.key} className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-border/40 bg-white opacity-50">
                        <Lock className="w-9 h-9 text-muted-foreground" />
                        <p className="text-xs font-bold text-muted-foreground text-center leading-snug">{b.label}</p>
                        <span className="text-xs text-muted-foreground">+{b.points} pts</span>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            }

            {/* ══ IEP GOALS ══ */}
            {activeTab === "iep" &&
            <div className="space-y-4">
                <IepGoals />
              </div>
            }

            {/* ══ NOGGIMIGO ══ */}
            {activeTab === "ai" &&
            <div>
                <NoggimigoTutor />
              </div>
            }

          </motion.div>
        </AnimatePresence>
      </main>
    </div>);

}
