import { useState } from "react";
import { Bot, Save, CheckCircle2 } from "lucide-react";
import PageShell from "@/components/PageShell";

const PERSONALITIES = [
  { key: "cheerleader", label: "Cheerleader", emoji: "📣", desc: "Energetic, lots of praise and excitement." },
  { key: "calm", label: "Calm Coach", emoji: "🧘", desc: "Gentle, patient, soothing tone." },
  { key: "curious", label: "Curious Explorer", emoji: "🔬", desc: "Asks questions, encourages discovery." },
  { key: "silly", label: "Silly Friend", emoji: "🤪", desc: "Playful and goofy for fun learning." },
];

const VOICES = [
  { key: "river", label: "River — calm, neutral" },
  { key: "honey", label: "Honey — warm, soft" },
  { key: "sunny", label: "Sunny — bright, upbeat" },
  { key: "storm", label: "Storm — formal, authoritative" },
  { key: "spark", label: "Spark — energetic, quick" },
];

const FREQUENCIES = [
  { key: "always", label: "Always", desc: "React to every answer." },
  { key: "often", label: "Often", desc: "React to most answers." },
  { key: "sometimes", label: "Sometimes", desc: "Only chime in occasionally." },
];

const DEFAULTS = { personality: "cheerleader", voice: "sunny", frequency: "often" };

export default function NoggimigoSettings() {
  const [cfg, setCfg] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("noggimigo-cfg") || "{}") }; } catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    localStorage.setItem("noggimigo-cfg", JSON.stringify(cfg));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageShell title="Noggimigo Settings" subtitle="Adjust Noggimigo's personality, feedback frequency, and voice to suit your sensory needs." accent="from-violet-500 to-fuchsia-600" icon={Bot}>
      {/* Personality */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Personality</h3>
        <div className="grid grid-cols-2 gap-3">
          {PERSONALITIES.map((p) => (
            <button key={p.key} onClick={() => setCfg({ ...cfg, personality: p.key })}
              className={`text-left p-4 rounded-2xl border-2 transition-all ${cfg.personality === p.key ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/30"}`}>
              <p className="text-2xl">{p.emoji}</p>
              <p className="font-bold text-sm text-foreground mt-1">{p.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback frequency */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Feedback Frequency</h3>
        <div className="space-y-2">
          {FREQUENCIES.map((f) => (
            <button key={f.key} onClick={() => setCfg({ ...cfg, frequency: f.key })}
              className={`w-full text-left p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${cfg.frequency === f.key ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/30"}`}>
              <div>
                <p className="font-bold text-sm text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              {cfg.frequency === f.key && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Voice */}
      <div className="bg-white border border-border/50 rounded-2xl p-5 mt-4 shadow-sm">
        <h3 className="font-extrabold text-foreground mb-3">Voice</h3>
        <div className="space-y-2">
          {VOICES.map((v) => (
            <button key={v.key} onClick={() => setCfg({ ...cfg, voice: v.key })}
              className={`w-full text-left p-3.5 rounded-xl border-2 flex items-center justify-between transition-all ${cfg.voice === v.key ? "border-primary bg-primary/5" : "border-border/40 hover:border-primary/30"}`}>
              <span className="text-sm font-bold text-foreground">{v.label}</span>
              {cfg.voice === v.key && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      <button onClick={save} className="mt-5 w-full bg-primary text-white font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-primary/90">
        <Save className="w-4 h-4" /> Save Noggimigo Settings
      </button>
      {saved && <p className="text-center text-sm text-green-600 font-bold mt-3">Settings saved! 🤖✨</p>}
    </PageShell>
  );
}
