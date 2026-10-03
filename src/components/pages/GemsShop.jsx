import { useState, useEffect } from "react";
import { Gem, ShoppingBag, Check, Lock, Sparkles, Palette, Star, Trophy } from "lucide-react";
import PageShell from "@/components/PageShell";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

// Shop items — cosmetic + reward perks priced in gems.
const ITEMS = [
  { id: "theme-ocean", name: "Ocean Theme", desc: "Cool blue look for your dashboard.", price: 50, icon: Palette, color: "from-blue-400 to-cyan-500" },
  { id: "theme-sunset", name: "Sunset Theme", desc: "Warm orange & pink vibes.", price: 50, icon: Palette, color: "from-orange-400 to-pink-500" },
  { id: "mascot-cap", name: "Graduation Cap", desc: "Noggimigo wears a cap in lessons.", price: 80, icon: Sparkles, color: "from-violet-400 to-purple-500" },
  { id: "mascot-glasses", name: "Smart Glasses", desc: "Noggimigo gets cool specs.", price: 80, icon: Sparkles, color: "from-indigo-400 to-blue-500" },
  { id: "streak-freeze", name: "Streak Freeze", desc: "Protect your streak for one missed day.", price: 120, icon: Lock, color: "from-sky-400 to-blue-500" },
  { id: "double-gems", name: "2× Gems (1 day)", desc: "Earn double gems on your next lesson.", price: 150, icon: Star, color: "from-amber-400 to-orange-500" },
  { id: "badge-shine", name: "Badge Shine", desc: "Add a golden glow to your badges.", price: 100, icon: Trophy, color: "from-yellow-400 to-amber-500" },
  { id: "brain-boost", name: "Brain Boost Hint Pack", desc: "5 extra Noggimigo hints on demand.", price: 60, icon: Sparkles, color: "from-emerald-400 to-teal-500" },
];

export default function GemsShop() {
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      setPurchased(me.purchased_items || []);
      setCompletions(await base44.entities.LessonCompletion.filter({}));
    })();
  }, []);

  const earned = completions.reduce((s, c) => s + (c.xp_earned || 0), 0) + (user?.bonus_gems || 0);
  const spent = user?.gems_spent || 0;
  const available = Math.max(0, earned - spent);

  const buy = async (item) => {
    if (purchased.includes(item.id) || available < item.price || !user) return;
    setBusy(item.id);
    const newSpent = spent + item.price;
    const newPurchased = [...purchased, item.id];
    await base44.auth.updateMe({ gems_spent: newSpent, purchased_items: newPurchased });
    setUser((u) => ({ ...u, gems_spent: newSpent, purchased_items: newPurchased }));
    setPurchased(newPurchased);
    setBusy(null);
  };

  return (
    <PageShell title="Gems Shop" subtitle="Spend your hard-earned gems on rewards and customisations." accent="from-amber-400 to-orange-500" icon={Gem} backTo="/student">
      {/* Balance card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between mb-6">
        <div>
          <p className="text-white/80 text-sm font-bold">Your gem balance</p>
          <p className="text-4xl font-black flex items-center gap-2 mt-1"><Gem className="w-8 h-8" />{available}</p>
          <p className="text-white/70 text-xs mt-1">{earned} earned · {spent} spent</p>
        </div>
        <ShoppingBag className="w-16 h-16 text-white/30" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ITEMS.map((item) => {
          const owned = purchased.includes(item.id);
          const affordable = available >= item.price;
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className={`bg-gradient-to-br ${item.color} h-24 flex items-center justify-center`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="font-extrabold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1 flex-1">{item.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-black text-amber-600 flex items-center gap-1"><Gem className="w-4 h-4" />{item.price}</span>
                  {owned ? (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check className="w-4 h-4" /> Owned</span>
                  ) : (
                    <Button size="sm" onClick={() => buy(item)} disabled={!affordable || busy === item.id}
                      className="rounded-xl font-bold gap-1">
                      {busy === item.id ? "…" : affordable ? "Buy" : "Need more"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">Earn more gems by completing lessons and keeping your streak alive — milestone streaks pay bonus gems!</p>
      </div>
    </PageShell>
  );
}
