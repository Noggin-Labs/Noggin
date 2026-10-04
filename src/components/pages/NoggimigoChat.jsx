import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import PageShell from "@/components/PageShell";
import { clientAIGenerator } from "@/lib/ClientAIGenerator";
import { useAccessibility } from "@/lib/AccessibilityContext";

const SUBJECTS = [
  { label: "Maths", subject: "Math", gameType: "mathdash" },
  { label: "Spelling", subject: "English", gameType: "spelling" },
  { label: "Patterns", subject: "Logic", gameType: "pattern" },
  { label: "Odd One Out", subject: "Reasoning", gameType: "oddout" },
];

export default function NoggimigoChat() {
  const { settings, speak } = useAccessibility();
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, I'm Noggimigo! Pick a topic and I'll give you a question to try." },
  ]);
  const [current, setCurrent] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: settings.reducedMotion ? "auto" : "smooth" });
  }, [messages, settings.reducedMotion]);

  const say = (text) => {
    setMessages((m) => [...m, { from: "bot", text }]);
    if (settings.readAloud) speak(text);
  };

  const ask = async (topic) => {
    setMessages((m) => [...m, { from: "user", text: `Let's do ${topic.label}!` }]);
    const q = await clientAIGenerator.generateQuestion({ subject: topic.subject, gameType: topic.gameType });
    setCurrent(q);
    say(q.question);
  };

  const answer = (index) => {
    setMessages((m) => [...m, { from: "user", text: current.options[index] }]);
    if (index === current.correctIndex) {
      say("Yes! That's right. 🎉 Want another one?");
      setCurrent(null);
    } else {
      say(`Not quite — hint: ${current.hint}. Have another go!`);
    }
  };

  return (
    <PageShell title="Chat with Noggimigo" subtitle="Your friendly study buddy, running right in your browser." accent="from-purple-500 to-indigo-500" icon={MessageCircle}>
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-5">
        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <p className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-semibold ${msg.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {current
            ? current.options.map((opt, i) => (
                <button key={i} onClick={() => answer(i)} className="px-4 py-2 rounded-xl bg-white ring-1 ring-border font-bold text-sm hover:ring-primary">
                  {opt}
                </button>
              ))
            : SUBJECTS.map((t) => (
                <button key={t.label} onClick={() => ask(t)} className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20">
                  {t.label}
                </button>
              ))}
        </div>
      </div>
    </PageShell>
  );
}
