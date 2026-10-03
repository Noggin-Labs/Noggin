import { useEffect, useState } from "react";
import { Trophy, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";
import { BADGE_RULES } from "@/data/lessons";
import { LESSONS } from "@/data/lessons";

export default function GoalCelebration() {
  const [completions, setCompletions] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      const [comps, badges] = await Promise.all([
        base44.entities.LessonCompletion.filter({ created_by: me.email }),
        base44.entities.Badge.filter({ created_by: me.email }),
      ]);
      setCompletions(comps);
      setEarnedBadges(badges.map((b) => b.badge_key));
    })();
  }, []);

  const totalXp = completions.reduce((s, c) => s + (c.xp_earned || 0), 0);
  const lessonsDone = completions.length;
  const totalLessons = LESSONS.length;
  const pct = totalLessons ? Math.round((lessonsDone / totalLessons) * 100) : 0;

  const celebrate = async () => {
    setLoading(true);
    const prompt = `You are Noggimigo. Write a joyful, encouraging 3-sentence celebration message for a student who has earned ${earnedBadges.length} badges, completed ${lessonsDone} lessons, and gained ${totalXp} gems. Be warm and motivating.`;
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessage(res);
    setLoading(false);
  };

  const earned = BADGE_RULES.filter((b) => earnedBadges.includes(b.key));

  return (
    <PageShell title="Goal Celebration" subtitle="Celebrate every IEP milestone and learning goal you reach!" accent="from-amber-400 via-orange-500 to-pink-500" icon={Trophy}>
      {/* Big achievement ring */}
      <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm text-center">
        <motion.div animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          className="text-7xl mb-3">🎉</motion.div>
        <p className="text-4xl font-black text-foreground">{totalXp} gems</p>
        <p className="text-sm font-bold text-muted-foreground mt-1">Total earned across {lessonsDone} lessons</p>

        <div className="mt-5 max-w-xs mx-auto">
          <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1">
            <span>Curriculum progress</span><span>{pct}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500"
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{lessonsDone} / {totalLessons} lessons</p>
        </div>

        <button onClick={celebrate} disabled={loading}
          className="mt-6 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-extrabold rounded-2xl px-6 py-3 inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "Celebrating…" : "Celebrate with Noggimigo"}
        </button>
        {message && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-foreground bg-amber-50 border border-amber-200 rounded-2xl p-4 leading-relaxed">{message}</motion.p>
        )}
      </div>

      {/* Earned badges showcase */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Milestones Achieved</h3>
        {earned.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No milestones yet — keep learning to unlock celebrations!</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {earned.map((b, i) => (
              <motion.div key={b.key} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 text-center">
                <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.8, delay: i * 0.15 }} className="text-3xl">{b.emoji}</motion.span>
                <p className="text-xs font-bold text-foreground leading-tight">{b.label}</p>
                <span className="text-xs text-amber-600 font-bold">+{b.points} pts</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
