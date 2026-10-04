import { Link } from "react-router-dom";
import { Brain, Gamepad2, MessageCircle, Accessibility, Activity, MessagesSquare } from "lucide-react";
import FeatureCard from "../home/FeatureCard";

const features = [
  { icon: Gamepad2, label: "Play", title: "Learning Games", description: "Seven bite-sized games for maths, spelling, logic and reasoning that adapt as you play.", bgColor: "bg-blue-50", textColor: "text-blue-600", to: "/games" },
  { icon: MessageCircle, label: "Ask", title: "Noggimigo Tutor", description: "A friendly AI study buddy that runs right in your browser — no account needed.", bgColor: "bg-purple-50", textColor: "text-purple-600", to: "/chat" },
  { icon: Activity, label: "Grow", title: "Activity Feed", description: "See the lessons you've finished and the badges you've earned over time.", bgColor: "bg-amber-50", textColor: "text-amber-600", to: "/student" },
  { icon: MessagesSquare, label: "Share", title: "Communication Board", description: "Tap picture cards to say how you feel or what you need.", bgColor: "bg-emerald-50", textColor: "text-emerald-600", to: "/communication" },
  { icon: Accessibility, label: "Adjust", title: "Accessibility", description: "High contrast, larger text, read-aloud and reduced motion — your way.", bgColor: "bg-rose-50", textColor: "text-rose-600", to: "/settings" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-nunito">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-foreground">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white">
            <Brain className="w-5 h-5" />
          </span>
          Noggin
        </Link>
        <nav className="flex items-center gap-4 text-sm font-bold">
          <Link to="/games" className="text-muted-foreground hover:text-foreground">Games</Link>
          <Link to="/settings" className="text-muted-foreground hover:text-foreground">Accessibility</Link>
        </nav>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 text-center">
          <p className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-5">
            Adaptive learning for every mind
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto">
            Learning that bends to fit you, not the other way around.
          </h1>
          <p className="text-lg text-muted-foreground mt-5 max-w-2xl mx-auto">
            Noggin adjusts pace, difficulty and presentation in real time so neurodivergent students can learn with confidence.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/games" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-glow hover:bg-primary/90 transition-colors">
              Start playing
            </Link>
            <Link to="/chat" className="px-6 py-3 rounded-xl bg-card text-foreground font-bold ring-1 ring-border hover:bg-muted transition-colors">
              Meet Noggimigo
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.to} to={feature.to} className="block">
              <FeatureCard feature={feature} />
            </Link>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Noggin Labs
      </footer>
    </div>
  );
}
