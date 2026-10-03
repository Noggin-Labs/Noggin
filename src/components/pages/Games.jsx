import { useState } from "react";
import { Brain, ArrowLeft, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import MemoryMatch from "../components/games/MemoryMatch";
import SpellingBee from "../components/games/SpellingBee";
import NumberPop from "../components/games/NumberPop";
import WordScramble from "../components/games/WordScramble";
import MathDash from "../components/games/MathDash";
import PatternSequence from "../components/games/PatternSequence";
import OddOneOut from "../components/games/OddOneOut";

export const games = [
  { id: "memory", title: "Memory Match", description: "Flip cards to find matching pairs. Trains focus and memory!", emoji: "🃏", color: "from-blue-400 to-blue-600", subject: "Brain Training" },
  { id: "spelling", title: "Spelling Bee", description: "Listen and type the correct spelling of the word.", emoji: "🐝", color: "from-amber-400 to-orange-500", subject: "English" },
  { id: "numberpop", title: "Number Pop", description: "Pop the balloon with the correct answer before time runs out!", emoji: "🎈", color: "from-purple-400 to-purple-600", subject: "Math" },
  { id: "wordscramble", title: "Word Scramble", description: "Unscramble the jumbled letters to form the correct word.", emoji: "🔤", color: "from-emerald-400 to-teal-500", subject: "English" },
  { id: "mathdash", title: "Math Dash", description: "Fast mental maths — pick the right answer quickly!", emoji: "⚡", color: "from-rose-400 to-pink-500", subject: "Math" },
  { id: "pattern", title: "Pattern Sequence", description: "Work out what comes next in the sequence.", emoji: "🔢", color: "from-indigo-400 to-violet-500", subject: "Logic" },
  { id: "oddout", title: "Odd One Out", description: "Spot the item that doesn't belong in the group.", emoji: "🔍", color: "from-cyan-400 to-blue-500", subject: "Reasoning" },
];

export function GamesHub() {
  const [active, setActive] = useState(null);
  const activeGame = games.find((g) => g.id === active);

  if (active) {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-foreground">{activeGame.emoji} {activeGame.title}</h2>
          <button onClick={() => setActive(null)} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4" /> All Games
          </button>
        </div>
        {active === "memory" && <MemoryMatch />}
        {active === "spelling" && <SpellingBee />}
        {active === "numberpop" && <NumberPop />}
        {active === "wordscramble" && <WordScramble />}
        {active === "mathdash" && <MathDash />}
        {active === "pattern" && <PatternSequence />}
        {active === "oddout" && <OddOneOut />}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-extrabold text-foreground">Game Arena</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <button key={g.id} onClick={() => setActive(g.id)}
            className="text-left group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:shadow-lg hover:border-primary/30 transition-all">
            <div className={`h-20 bg-gradient-to-br ${g.color} flex items-center justify-center`}>
              <span className="text-4xl drop-shadow">{g.emoji}</span>
            </div>
            <div className="p-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">{g.subject}</span>
              <h3 className="font-extrabold text-base text-foreground mt-1">{g.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{g.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Games() {
  return (
    <div className="min-h-screen bg-background font-nunito">
      <div className="bg-white border-b border-border/60 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/student" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
            <span className="font-extrabold text-xl text-foreground">Noggin</span>
          </Link>
          <Link to="/student" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Game Zone 🎮</h1>
          <p className="text-muted-foreground mt-1">Pick a game and start learning through play!</p>
        </div>
        <GamesHub />
      </div>
    </div>
  );
}
