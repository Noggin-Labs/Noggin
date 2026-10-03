import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Check, Volume2, Trash2, Brain } from "lucide-react";

const CATEGORIES = {
  greetings: [
    { word: "Hello", emoji: "👋" }, { word: "Hi", emoji: "😊" }, { word: "Bye", emoji: "👋" },
    { word: "Good morning", emoji: "🌅" }, { word: "Good afternoon", emoji: "☀️" }, { word: "Good evening", emoji: "🌆" },
    { word: "Good night", emoji: "🌙" }, { word: "Welcome", emoji: "🎉" }, { word: "Thank you", emoji: "🙏" },
    { word: "Please", emoji: "🤲" }, { word: "See you later", emoji: "👋" }, { word: "Have a good day", emoji: "☀️" },
  ],
  feelings: [
    { word: "Happy", emoji: "😊" }, { word: "Sad", emoji: "😢" }, { word: "Excited", emoji: "🤩" },
    { word: "Angry", emoji: "😠" }, { word: "Frustrated", emoji: "😤" }, { word: "Tired", emoji: "😴" },
    { word: "Scared", emoji: "😨" }, { word: "Calm", emoji: "😌" }, { word: "Confused", emoji: "🤔" },
    { word: "Proud", emoji: "🦁" }, { word: "Lonely", emoji: "😔" }, { word: "Loved", emoji: "💕" },
  ],
  needs: [
    { word: "I need water", emoji: "💧" }, { word: "I need help", emoji: "🆘" }, { word: "I need rest", emoji: "🛏️" },
    { word: "I am hungry", emoji: "🍎" }, { word: "I am thirsty", emoji: "🥤" }, { word: "I need a break", emoji: "⏸️" },
    { word: "I need the bathroom", emoji: "🚽" }, { word: "Can I go outside", emoji: "🌳" }, { word: "I need a hug", emoji: "🤗" },
    { word: "I need quiet time", emoji: "🤫" }, { word: "I am cold", emoji: "❄️" }, { word: "I am hot", emoji: "🔥" },
  ],
  questions: [
    { word: "Can I...", emoji: "❓" }, { word: "Where is...", emoji: "🗺️" }, { word: "What is...", emoji: "🤔" },
    { word: "Who is...", emoji: "👤" }, { word: "When is...", emoji: "⏰" }, { word: "Why", emoji: "❔" },
    { word: "How do I...", emoji: "🛠️" }, { word: "Is it time for...", emoji: "⏱️" }, { word: "What time is it", emoji: "🕐" },
    { word: "What day is it", emoji: "📅" }, { word: "Who wants to...", emoji: "🙋" }, { word: "What happened", emoji: "📺" },
  ],
  actions: [
    { word: "Play", emoji: "🎮" }, { word: "Read", emoji: "📖" }, { word: "Write", emoji: "✏️" },
    { word: "Draw", emoji: "🎨" }, { word: "Sing", emoji: "🎵" }, { word: "Jump", emoji: "⛹️" },
    { word: "Run", emoji: "🏃" }, { word: "Walk", emoji: "🚶" }, { word: "Dance", emoji: "💃" },
    { word: "Eat", emoji: "🍽️" }, { word: "Drink", emoji: "🥛" }, { word: "Sleep", emoji: "😴" },
  ],
  people: [
    { word: "Mom", emoji: "👩" }, { word: "Dad", emoji: "👨" }, { word: "Sister", emoji: "👧" },
    { word: "Brother", emoji: "👦" }, { word: "Grandma", emoji: "👵" }, { word: "Grandpa", emoji: "👴" },
    { word: "Teacher", emoji: "👨‍🏫" }, { word: "Friend", emoji: "👫" }, { word: "Me", emoji: "🫵" },
    { word: "You", emoji: "👉" }, { word: "Everyone", emoji: "👥" }, { word: "Nobody", emoji: "🚫" },
  ],
  places: [
    { word: "Home", emoji: "🏠" }, { word: "School", emoji: "🏫" }, { word: "Park", emoji: "🎠" },
    { word: "Library", emoji: "📚" }, { word: "Playground", emoji: "🛝" }, { word: "Bathroom", emoji: "🚽" },
    { word: "Kitchen", emoji: "🍳" }, { word: "Bedroom", emoji: "🛏️" }, { word: "Garden", emoji: "🌻" },
    { word: "Beach", emoji: "🏖️" }, { word: "Classroom", emoji: "🎓" }, { word: "Gym", emoji: "🏋️" },
  ],
  objects: [
    { word: "Book", emoji: "📖" }, { word: "Pencil", emoji: "✏️" }, { word: "Toy", emoji: "🧸" },
    { word: "Ball", emoji: "⚽" }, { word: "Bike", emoji: "🚲" }, { word: "Computer", emoji: "💻" },
    { word: "Phone", emoji: "📱" }, { word: "Tablet", emoji: "📱" }, { word: "Snack", emoji: "🍪" },
    { word: "Drink", emoji: "🥤" }, { word: "Picture", emoji: "🖼️" }, { word: "Music", emoji: "🎵" },
  ],
};

const TABS = [
  { key: "greetings", emoji: "👋", label: "Greetings" },
  { key: "feelings", emoji: "😊", label: "Feelings" },
  { key: "needs", emoji: "🤔", label: "Needs" },
  { key: "questions", emoji: "❓", label: "Questions" },
  { key: "actions", emoji: "🎯", label: "Actions" },
  { key: "people", emoji: "👥", label: "People" },
  { key: "places", emoji: "🗺️", label: "Places" },
  { key: "objects", emoji: "📦", label: "Objects" },
];

const CATEGORY_COLORS = {
  greetings: "#FFB84D", feelings: "#FF6B9D", needs: "#4ECDC4", questions: "#95E1D3",
  actions: "#A8E6CF", people: "#C7B3E5", places: "#FFB3BA", objects: "#FFDFBA",
};

export default function CommunicationBoard() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("greetings");
  const [title, setTitle] = useState("Communication Board");
  const [instructions, setInstructions] = useState("Tap words to speak");
  const [editing, setEditing] = useState(false);

  const addWord = (word) => setSelectedWords((w) => [...w, word]);
  const speak = () => {
    if (!selectedWords.length) return;
    const utterance = new SpeechSynthesisUtterance(selectedWords.join(" "));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  const clear = () => setSelectedWords([]);
  const tint = (hex) => hex + "1F";

  return (
    <div className="min-h-screen bg-background font-nunito">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Link to="/student" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-card rounded-3xl shadow-soft ring-1 ring-border/50 overflow-hidden mb-5">
          <div className="h-1.5 bg-gradient-to-r from-primary to-blue-500" />
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  {editing ? (
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-extrabold text-foreground border-b-2 border-primary outline-none bg-transparent w-full" />
                  ) : (
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight truncate">{title}</h1>
                  )}
                  {editing ? (
                    <input value={instructions} onChange={(e) => setInstructions(e.target.value)} className="text-sm text-muted-foreground font-medium border-b border-border outline-none bg-transparent mt-1 w-full" />
                  ) : (
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">{instructions}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setEditing((e) => !e)} className="shrink-0 w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors" aria-label="Edit board text">
                {editing ? <Check className="w-4 h-4 text-green-600" /> : <Pencil className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Speech display + controls */}
        <div className="bg-card rounded-3xl shadow-soft ring-1 ring-border/50 p-5 sm:p-6 mb-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Message</label>
            {selectedWords.length > 0 && <span className="text-xs font-bold text-muted-foreground">{selectedWords.length} word{selectedWords.length !== 1 ? "s" : ""}</span>}
          </div>
          <div className="cb-speech-bubble" role="status" aria-live="polite" aria-label="Your current message">
            {selectedWords.length === 0 ? (
              <span className="text-muted-foreground/60 font-medium">Tap words below to build your message…</span>
            ) : (
              selectedWords.map((w, i) => <span key={i} className="cb-word-chip">{w}</span>)
            )}
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            <button className="cb-speak-button" onClick={speak} disabled={!selectedWords.length} aria-label="Speak your message aloud">
              <Volume2 className="w-5 h-5" /> Speak
            </button>
            <button className="cb-speak-button secondary" onClick={clear} disabled={!selectedWords.length} aria-label="Clear the message">
              <Trash2 className="w-5 h-5" /> Clear
            </button>
          </div>
        </div>

        {/* Categories + grid */}
        <div className="bg-card rounded-3xl shadow-soft ring-1 ring-border/50 p-5 sm:p-6">
          <div className="flex gap-2 mb-5 flex-wrap" role="tablist">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setCurrentCategory(t.key)}
                className={`cb-category-tab ${currentCategory === t.key ? "active" : ""}`}
                role="tab" aria-selected={currentCategory === t.key} aria-label={t.label}>
                <span className="mr-1">{t.emoji}</span>{t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CATEGORIES[currentCategory].map((item) => (
              <button key={item.word} onClick={() => addWord(item.word)} className="cb-button-word"
                style={{ backgroundColor: tint(CATEGORY_COLORS[currentCategory]) }} aria-label={`Select ${item.word}`}>
                <span style={{ fontSize: 30, lineHeight: 1 }}>{item.emoji}</span>
                <span>{item.word}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
