import { useState, useEffect } from "react";
import {
  Brain, BarChart2, TrendingUp, Users, CalendarPlus, Target, BookOpen,
  MessageCircle, LogOut, ShieldAlert, Library, AlertTriangle, Award, Menu, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TeacherAnalytics from "../components/teacher/TeacherAnalytics";
import StudentRoster from "../components/teacher/StudentRoster";
import AssignmentCreator from "../components/teacher/AssignmentCreator";
import TeacherIepManager from "../components/teacher/TeacherIepManager";
import PerformanceTable from "../components/teacher/PerformanceTable";
import LessonPlanTemplates from "../components/teacher/LessonPlanTemplates";
import MessagingPanel from "../components/messaging/MessagingPanel";
import ExportToSheetsButton from "../components/dashboard/ExportToSheetsButton";

const NAV = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "students", label: "Students", icon: Users },
  { id: "assignments", label: "Assignments", icon: CalendarPlus },
  { id: "iep", label: "IEP Goals", icon: Target },
  { id: "performance", label: "Performance", icon: BarChart2 },
  { id: "lessonplans", label: "Lesson Plans", icon: BookOpen },
  { id: "messages", label: "Messages", icon: MessageCircle },
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const me = await base44.auth.me();
        setUser(me);
        if (me.role !== "teacher" && me.role !== "admin") {
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        const [progs, allBadges, allUsers] = await Promise.all([
          base44.entities.LessonCompletion.list("-created_date", 300),
          base44.entities.Badge.list("-created_date", 200),
          base44.entities.User.list(),
        ]);
        setProgressRecords(progs);
        setBadges(allBadges);
        setStudents(allUsers.filter((u) => u.role === "student" || !u.role || u.role === "user"));
      } catch {}
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Access Restricted</h1>
        <p className="text-muted-foreground max-w-sm">This dashboard is only available to teachers. Please contact your administrator if you believe this is an error.</p>
        <Link to="/"><Button variant="outline" className="rounded-full font-bold mt-2">Go Home</Button></Link>
      </div>
    );
  }

  const displayName = user?.full_name || "Teacher";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const avgScore = progressRecords.length ? Math.round(progressRecords.reduce((s, r) => s + (r.score || 0), 0) / progressRecords.length) : 0;
  const needsAttention = progressRecords.filter((r) => r.score != null && r.score < 60);

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-foreground">Noggin</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/40 space-y-1">
        <Link to="/lesson-builder" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
          <Wand2 className="w-4 h-4" /> Lesson Builder
        </Link>
        <button onClick={() => base44.auth.logout()} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-nunito flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-border/40 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="md:hidden fixed inset-0 bg-black/40 z-40" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 26 }} className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-white flex flex-col z-50">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-border/40 sticky top-0 z-30 flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-xl hover:bg-muted/40 flex items-center justify-center">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div>
            <span className="font-extrabold text-foreground">Noggin</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center">{initials}</div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
            <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Teacher Dashboard</p>
                <h1 className="text-2xl font-extrabold text-foreground mt-0.5">{NAV.find((n) => n.id === activeTab)?.label}</h1>
                <p className="text-muted-foreground text-sm mt-0.5">{students.length} students · {progressRecords.length} lessons · {avgScore}% avg</p>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border/40 rounded-2xl px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center">{initials}</div>
                <span className="text-sm font-bold text-foreground hidden sm:block">{displayName}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Students", value: students.length, icon: Users, color: "from-blue-500 to-blue-600" },
                        { label: "Avg Score", value: `${avgScore}%`, icon: Target, color: "from-emerald-500 to-teal-500" },
                        { label: "Lessons Done", value: progressRecords.length, icon: BookOpen, color: "from-amber-500 to-orange-500" },
                        { label: "Badges", value: badges.length, icon: Award, color: "from-violet-500 to-purple-600" },
                      ].map((c, i) => (
                        <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-2xl p-4 text-white bg-gradient-to-br ${c.color} shadow-sm`}>
                          <c.icon className="w-5 h-5 text-white/80 mb-2" />
                          <p className="text-2xl font-extrabold">{c.value}</p>
                          <p className="text-xs text-white/80 font-bold mt-0.5">{c.label}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="bg-white border border-border/60 rounded-2xl p-5">
                        <h2 className="font-extrabold text-foreground mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Needs Attention</h2>
                        {needsAttention.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4 text-center">No one is struggling right now — great!</p>
                        ) : (
                          <div className="space-y-2">
                            {needsAttention.slice(0, 5).map((r, i) => (
                              <div key={r.id || i} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                <div className="min-w-0">
                                  <p className="font-bold text-sm text-foreground truncate">{r.created_by || "Unknown"}</p>
                                  <p className="text-xs text-muted-foreground truncate">{r.lesson_title || r.lesson_id} · {r.score}%</p>
                                </div>
                                <Button size="sm" variant="outline" className="rounded-full font-bold text-xs shrink-0" onClick={() => setActiveTab("messages")}>Message</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="bg-white border border-border/60 rounded-2xl p-5">
                        <h2 className="font-extrabold text-foreground mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Recent Activity</h2>
                        {progressRecords.length === 0 ? (
                          <p className="text-sm text-muted-foreground py-4 text-center">No completions yet.</p>
                        ) : (
                          <div className="divide-y divide-border/30 max-h-64 overflow-y-auto">
                            {progressRecords.slice(0, 8).map((r, i) => (
                              <div key={r.id || i} className="flex items-center gap-3 py-2.5">
                                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">{(r.created_by || "?").charAt(0).toUpperCase()}</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-foreground truncate">{r.lesson_title || r.lesson_id}</p>
                                  <p className="text-xs text-muted-foreground">{r.subject} · {r.created_by}</p>
                                </div>
                                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full shrink-0 ${r.score >= 80 ? "bg-green-50 text-green-700" : r.score >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{r.score}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && <TeacherAnalytics progressRecords={progressRecords} badges={badges} />}

                {activeTab === "students" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div><h2 className="text-lg font-extrabold text-foreground">Students</h2><p className="text-sm text-muted-foreground mt-0.5">Select any student to drill into their performance.</p></div>
                      <ExportToSheetsButton progressRecords={progressRecords} studentName="All Students" />
                    </div>
                    <StudentRoster students={students} progressRecords={progressRecords} />
                  </div>
                )}

                {activeTab === "assignments" && (
                  <div className="space-y-4">
                    <div><h2 className="text-lg font-extrabold text-foreground">Assignments</h2><p className="text-sm text-muted-foreground mt-0.5">Create assignments and schedule them to your students' calendars.</p></div>
                    <AssignmentCreator students={students} />
                  </div>
                )}

                {activeTab === "iep" && <TeacherIepManager />}

                {activeTab === "performance" && (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div><h2 className="text-lg font-extrabold text-foreground">Performance Logs</h2><p className="text-sm text-muted-foreground mt-0.5">Filter and sort to identify students who need support.</p></div>
                      <ExportToSheetsButton progressRecords={progressRecords} studentName="All Students" />
                    </div>
                    <PerformanceTable progressRecords={progressRecords} />
                  </div>
                )}

                {activeTab === "lessonplans" && <LessonPlanTemplates />}

                {activeTab === "messages" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <p className="text-sm font-bold text-blue-700 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Parent Communication</p>
                      <p className="text-xs text-muted-foreground mt-1">Real conversations with parents — no sample data.</p>
                    </div>
                    <MessagingPanel userRole="teacher" userName={displayName} />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
