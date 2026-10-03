import { Accessibility, Contrast, Type, Volume2, Wind, CheckCircle2 } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAccessibility } from "@/lib/AccessibilityContext";

const TOGGLES = [
  { key: "highContrast", icon: Contrast, label: "High Contrast Mode", desc: "Bolder colours and stronger borders for clearer distinction.", color: "bg-blue-50 text-blue-600" },
  { key: "largeText", icon: Type, label: "Large Text", desc: "Increase base text size across the whole app.", color: "bg-emerald-50 text-emerald-600" },
  { key: "readAloud", icon: Volume2, label: "Text-to-Speech", desc: "Hear page headings and content read aloud.", color: "bg-violet-50 text-violet-600" },
  { key: "reducedMotion", icon: Wind, label: "Reduced Motion", desc: "Calm animations and transitions for sensory comfort.", color: "bg-amber-50 text-amber-600" },
];

export default function AccessibilitySettings() {
  const { settings, toggle, speak, stopSpeaking } = useAccessibility();

  return (
    <PageShell title="Accessibility Settings" subtitle="Personalise Noggin to support your sensory and learning needs." accent="from-cyan-500 to-blue-600" icon={Accessibility}>
      <div className="space-y-4">
        {TOGGLES.map(({ key, icon: Icon, label, desc, color }) => {
          const on = settings[key];
          return (
            <div key={key} className="bg-white border border-border/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <button onClick={() => toggle(key)} className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${on ? "bg-primary" : "bg-muted"}`}>
                <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : ""}`} />
              </button>
            </div>
          );
        })}

        {settings.readAloud && (
          <div className="bg-white border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="font-extrabold text-foreground mb-1">Test Text-to-Speech</p>
            <p className="text-sm text-muted-foreground mb-3">Hear how Noggin reads content aloud.</p>
            <div className="flex gap-2">
              <button onClick={() => speak("Hello! I'm Noggimigo, your learning buddy. I can read lessons and pages aloud for you.")}
                className="flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-primary/90">
                <Volume2 className="w-4 h-4" /> Play sample
              </button>
              <button onClick={stopSpeaking}
                className="flex items-center gap-2 bg-muted text-foreground rounded-xl px-4 py-2 text-sm font-bold hover:bg-muted/70">
                Stop
              </button>
            </div>
          </div>
        )}

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-800">Your preferences are saved automatically and apply across every page in Noggin.</p>
        </div>
      </div>
    </PageShell>
  );
}
