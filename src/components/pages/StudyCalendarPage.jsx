import { useState, useEffect } from "react";
import { Brain, LogOut, Bell, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StudyCalendar from "../components/calendar/StudyCalendar";

export default function StudyCalendarPage() {
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [earnedBadgeKeys, setEarnedBadgeKeys] = useState([]);

  useEffect(() => {
    async function init() {
      const me = await base44.auth.me();
      setUser(me);
      const comps = await base44.entities.LessonCompletion.filter({ created_by: me.email });
      setCompletions(comps);
      const badges = await base44.entities.Badge.filter({ created_by: me.email });
      setEarnedBadgeKeys(badges.map(b => b.badge_key));
    }
    init();
  }, []);

  const initials = user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  const displayName = user?.full_name?.split(" ")[0] || "there";
  const userRole = user?.role || "student";

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-nunito">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 pt-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">Noggin</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link to={userRole === "admin" ? "/teacher" : userRole === "parent" ? "/parent" : "/student"}
                className="text-xs text-white/80 hover:text-white font-bold px-3 py-1.5 bg-white/15 rounded-xl transition-colors">
                ← Dashboard
              </Link>
              <button onClick={() => base44.auth.logout()}
                className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                <LogOut className="w-4 h-4 text-white" />
              </button>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-sm">
                {initials}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Study Calendar</h1>
              <p className="text-white/75 text-sm mt-0.5">Hey {displayName}! Track assignments, AI assessments & milestones.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-12">
        <StudyCalendar
          userRole={userRole}
          completions={completions}
          earnedBadgeKeys={earnedBadgeKeys}
        />
      </div>
    </div>
  );
}
