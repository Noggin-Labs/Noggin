import { useState, useEffect } from "react";
import { BarChart3, Sparkles, Loader2, Gem, Award, TrendingUp } from "lucide-react";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";
import { BADGE_RULES } from "@/data/lessons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";

const SUBJECT_BAR = { Mathematics: "#3b82f6", English: "#10b981", Science: "#8b5cf6", "Social Studies": "#f59e0b", History: "#f97316", "Social Emotional Learning": "#f43f5e" };

export default function LearningAnalytics() {
  const [completions, setCompletions] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      const [comps, badges] = await Promise.all([
        base44.entities.LessonCompletion.filter({ created_by: me.email }),
        base44.entities.Badge.filter({ created_by: me.email }),
      ]);
      setCompletions(comps);
      setEarnedBadges(badges.map((b) => b.badge_key));
    })();
  }, []);

  const totalXp = completions.reduce((s, c) => s + (c.xp_earned || 0), 0);
  const avgScore = completions.length ? Math.round(completions.reduce((s, c) => s + (c.score || 0), 0) / completions.length) : 0;

  const subjectData = Object.keys(SUBJECT_BAR).map((s) => {
    const sc = completions.filter((c) => c.subject === s);
    return { subject: s.split(" ")[0], score: sc.length ? Math.round(sc.reduce((a, c) => a + (c.score || 0), 0) / sc.length) : 0, fill: SUBJECT_BAR[s] };
  }).filter((d) => d.score > 0);

  // XP over time (cumulative by day)
  const byDay = {};
  completions.forEach((c) => {
    const d = (c.created_date || new Date().toISOString()).slice(0, 10);
    byDay[d] = (byDay[d] || 0) + (c.xp_earned || 0);
  });
  const days = Object.keys(byDay).sort();
  let cum = 0;
  const xpData = days.map((d) => { cum += byDay[d]; return { date: d.slice(5), gems: cum }; });

  const generateFeedback = async () => {
    setLoadingAi(true);
    const summary = {
      totalLessons: completions.length,
      avgScore,
      totalXp,
      bySubject: Object.keys(SUBJECT_BAR).map((s) => `${s}: ${completions.filter(c => c.subject === s).length} lessons`).join("; "),
    };
    const prompt = `You are Noggimigo, a warm, encouraging learning coach for a neurodivergent student. Based on this learning data, write a short (4-5 sentence) personalised feedback summary celebrating strengths and suggesting one focus area. Use friendly, supportive language. Data: ${JSON.stringify(summary)}`;
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setFeedback(res);
    setLoadingAi(false);
  };

  return (
    <PageShell title="Learning Analytics" subtitle="Visual progress charts, badges, and AI-driven feedback on your journey." accent="from-emerald-500 to-teal-600" icon={BarChart3}>
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Gem, value: totalXp, label: "Total Gems", color: "text-amber-600", bg: "bg-amber-50" },
          { icon: TrendingUp, value: `${avgScore}%`, label: "Avg Score", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Award, value: earnedBadges.length, label: "Badges", color: "text-violet-600", bg: "bg-violet-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border/50 rounded-2xl p-4 text-center shadow-sm">
            <div className={`w-9 h-9 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs font-bold text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* XP over time */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Gems Growth Over Time</h3>
        {xpData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={xpData} margin={{ left: -18, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="gems" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="text-sm text-muted-foreground text-center py-8">Complete lessons to see your gems growth.</p>}
      </div>

      {/* Subject scores */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Average Score by Subject</h3>
        {subjectData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData} margin={{ left: -18, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {subjectData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-sm text-muted-foreground text-center py-8">No subject scores yet.</p>}
      </div>

      {/* Badges */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Badges Earned</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {BADGE_RULES.map((b) => {
            const on = earnedBadges.includes(b.key);
            return (
              <div key={b.key} className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center ${on ? "border-amber-200 bg-amber-50" : "border-border/40 opacity-50"}`}>
                <span className="text-2xl">{on ? b.emoji : "🔒"}</span>
                <p className="text-xs font-bold text-foreground leading-tight">{b.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI feedback */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> AI Feedback Summary</h3>
          <button onClick={generateFeedback} disabled={loadingAi}
            className="bg-violet-500 text-white text-sm font-bold rounded-xl px-4 py-2 hover:bg-violet-600 disabled:opacity-50">
            {loadingAi ? "Generating…" : "Generate"}
          </button>
        </div>
        {loadingAi ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Noggimigo is analysing your progress…</div>
        ) : feedback ? (
          <p className="text-sm text-foreground leading-relaxed">{feedback}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Tap “Generate” for a personalised feedback summary from Noggimigo.</p>
        )}
      </div>
    </PageShell>
  );
}
