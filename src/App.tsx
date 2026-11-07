import { useEffect, useState, type ReactNode } from "react";
import {
  Activity, ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, Compass, FlaskConical, GraduationCap, Home,
  Layers3, Lightbulb, Menu, Microscope, Moon, Play, Search, Settings2,
  ShieldCheck, Sparkles, Star, Target, Users, X, Zap
} from "lucide-react";
import { calculateAccuracy, calculateMastery, calculateXp, type Attempt } from "./lib/progress";

type View = "dashboard" | "curriculum" | "saved" | "profile" | "qa";
type Lesson = { id: string; courseId: string; title: string; subject: string; level: string; intro: string; question: string; options: string[]; answer: string; explanation: string };
type Course = { id: string; subject: string; level: string; title: string; description: string; lessonIds: string[]; theme: string; icon: typeof Layers3 };

const lessons: Lesson[] = [
  { id:"fractions", courseId:"fractions-course", title:"What Exactly is a Fraction?", subject:"Mathematics", level:"Beginner", intro:"A fraction describes equal parts of one whole. Imagine sharing a pizza fairly: the denominator tells us how many equal slices make the whole, and the numerator tells us how many slices we have.", question:"A pizza is cut into 4 equal slices. You take 1 slice. What fraction did you take?", options:["1/2","1/3","1/4","4/1"], answer:"1/4", explanation:"There are 4 equal slices in the whole pizza, and you took 1. That is 1 out of 4, or one quarter." },
  { id:"equivalent-fractions", courseId:"fractions-course", title:"Fractions That Look Different", subject:"Mathematics", level:"Beginner", intro:"Two fractions can look different but represent the same amount. One half and two quarters cover exactly the same portion of a whole.", question:"Which fraction is equivalent to 1/2?", options:["1/3","2/4","3/4","2/3"], answer:"2/4", explanation:"If you split each half into two equal pieces, you get four pieces in total. Two of those four pieces make the same half." },
  { id:"algebra-balance", courseId:"algebra-course", title:"The Balance of an Equation", subject:"Mathematics", level:"Intermediate", intro:"An equation is like a balanced scale. Whatever you do to one side, you must also do to the other side to keep it balanced.", question:"If x + 3 = 8, what is x?", options:["3","5","8","11"], answer:"5", explanation:"Subtract 3 from both sides: x + 3 − 3 = 8 − 3, so x = 5." },
  { id:"photosynthesis", courseId:"photosynthesis-course", title:"How Plants Capture Sunlight", subject:"Science", level:"Beginner", intro:"Plants use energy from sunlight to help turn water and carbon dioxide into glucose. This process is called photosynthesis. Oxygen is released along the way.", question:"Which source provides the energy for photosynthesis?", options:["Moonlight","Sunlight","Soil","Wind"], answer:"Sunlight", explanation:"Light energy from the Sun powers photosynthesis. Leaves capture this energy using chlorophyll." },
  { id:"circuits", courseId:"circuits-course", title:"A Complete Electric Circuit", subject:"Science", level:"Beginner", intro:"Electric current flows around a complete path called a circuit. A battery provides energy, wires connect the components, and a closed switch completes the path.", question:"What must happen for a simple circuit to work?", options:["The switch must be open","The path must be complete","The wires must be disconnected","The battery must be removed"], answer:"The path must be complete", explanation:"Current needs a continuous, closed path from one battery terminal through the components and back to the other terminal." },
  { id:"phonics", courseId:"english-course", title:"Hear the Parts in a Word", subject:"English", level:"Beginner", intro:"Words are made from sounds called phonemes. Listening for the individual sounds in a word can help us connect spoken language to letters.", question:"How many sounds are in the spoken word “ship”?", options:["2","3","4","5"], answer:"3", explanation:"Ship has three phonemes: /sh/ /i/ /p/. The letters s and h work together to represent the first sound." },
  { id:"emotion-compass", courseId:"sel-course", title:"Name It to Understand It", subject:"Life skills", level:"Beginner", intro:"Emotions are information, not instructions. Giving a feeling a name can help us understand what we might need next. Different people experience feelings differently.", question:"Which is a useful first step when a feeling seems confusing?", options:["Ignore it","Name the feeling without judging it","Assume it will never change","Compare it with someone else's"], answer:"Name the feeling without judging it", explanation:"Naming a feeling with curiosity can make it easier to decide what support or next step might help. There is no single correct way to feel." }
];

const courses: Course[] = [
  { id:"fractions-course", subject:"Mathematics", level:"Beginner", title:"Visual Fractions & Proportions", description:"See fractions as parts of a whole through visual models, sharing and equivalent amounts.", lessonIds:["fractions","equivalent-fractions"], theme:"blue", icon:Layers3 },
  { id:"algebra-course", subject:"Mathematics", level:"Intermediate", title:"Algebraic Balances & Unknowns", description:"Explore equations as balanced relationships and discover what an unknown value means.", lessonIds:["algebra-balance"], theme:"violet", icon:Activity },
  { id:"photosynthesis-course", subject:"Science", level:"Beginner", title:"Photosynthesis & Solar Energy", description:"Follow the journey from sunlight, water and carbon dioxide to plant-made sugars.", lessonIds:["photosynthesis"], theme:"green", icon:FlaskConical },
  { id:"circuits-course", subject:"Science", level:"Beginner", title:"Electric Circuits & Electrons", description:"Explore batteries, switches and the idea of a complete path for electric current.", lessonIds:["circuits"], theme:"amber", icon:Zap },
  { id:"english-course", subject:"English", level:"Beginner", title:"Phonics & Word Crafting", description:"Listen closely to sounds, syllables and the building blocks of written words.", lessonIds:["phonics"], theme:"coral", icon:BookOpen },
  { id:"sel-course", subject:"Life skills", level:"Beginner", title:"The Emotion Compass", description:"Build a vocabulary for feelings and explore thoughtful ways to respond to them.", lessonIds:["emotion-compass"], theme:"pink", icon:Compass }
];

const readStore = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => readStore("noggin.completed", []));
  const [attempts, setAttempts] = useState<Attempt[]>(() => readStore("noggin.attempts", []));
  const [saved, setSaved] = useState<string[]>(() => readStore("noggin.saved", []));
  const [lastLessonId, setLastLessonId] = useState<string>(() => readStore("noggin.lastLesson", "fractions"));
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [profile, setProfile] = useState<string>(() => readStore("noggin.profile", "Balanced Explorer"));
  const [pacing, setPacing] = useState<string>(() => readStore("noggin.pacing", "Balanced"));
  const [visuals, setVisuals] = useState<boolean>(() => readStore("noggin.visuals", true));
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => localStorage.setItem("noggin.completed", JSON.stringify(completed)), [completed]);
  useEffect(() => localStorage.setItem("noggin.attempts", JSON.stringify(attempts)), [attempts]);
  useEffect(() => localStorage.setItem("noggin.saved", JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem("noggin.lastLesson", JSON.stringify(lastLessonId)), [lastLessonId]);
  useEffect(() => localStorage.setItem("noggin.profile", JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem("noggin.pacing", JSON.stringify(pacing)), [pacing]);
  useEffect(() => localStorage.setItem("noggin.visuals", JSON.stringify(visuals)), [visuals]);

  const accuracy = calculateAccuracy(attempts);
  const mastery = calculateMastery(completed, lessons.length);
  const xp = calculateXp(attempts);
  const resumeLesson = lessons.find((lesson) => lesson.id === lastLessonId) ?? lessons[0];
  const savedLessons = lessons.filter((lesson) => saved.includes(lesson.id));

  const openLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setLastLessonId(lesson.id);
    setSelected("");
    setFeedback(null);
    setView("dashboard");
    setMobileNav(false);
  };

  const submitAnswer = () => {
    if (!activeLesson || !selected) return;
    const correct = selected === activeLesson.answer;
    setAttempts((current) => [...current, { lessonId: activeLesson.id, correct, at: new Date().toISOString() }]);
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) setCompleted((current) => current.includes(activeLesson.id) ? current : [...current, activeLesson.id]);
  };

  const toggleSaved = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const activeCourse = activeLesson ? courses.find((course) => course.id === activeLesson.courseId) : undefined;

  const navItems = [
    { id:"dashboard" as View, label:"Home base", icon:Home },
    { id:"curriculum" as View, label:"Explore", icon:Compass },
    { id:"saved" as View, label:"My library", icon:Bookmark },
    { id:"profile" as View, label:"My learning", icon:Settings2 },
    { id:"qa" as View, label:"QA & Tests", icon:ShieldCheck }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <button className="brand-lockup" onClick={() => { setView("dashboard"); setActiveLesson(null); }} aria-label="Noggin home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-word">noggin<span className="brand-period">.</span><small>LEARNING STUDIO</small></span>
        </button>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${view === item.id && !activeLesson ? "active" : ""}`} onClick={() => { setView(item.id); setActiveLesson(null); setMobileNav(false); }}><Icon size={18} strokeWidth={1.9}/><span>{item.label}</span>{item.id === "saved" && saved.length > 0 && <em>{saved.length}</em>}</button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="nudge-card">
            <div className="nudge-orbit"><Sparkles size={18}/></div>
            <strong>A little curiosity goes a long way.</strong>
            <span>Small steps count. Keep exploring.</span>
          </div>
          <div className="org-note"><span className="org-dot" /> A space for curious minds</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20}/></button>
          <div className="breadcrumb"><span>noggin</span><ChevronRight size={14}/><strong>{activeLesson ? "Lesson room" : navItems.find((item) => item.id === view)?.label}</strong></div>
          <div className="topbar-right"><span className="role-pill"><GraduationCap size={15}/> Student space</span><button className="avatar" aria-label="Learner profile" onClick={() => setView("profile")}>A</button></div>
        </header>

        <div className="page-wrap">
          {activeLesson ? (
            <LessonRoom lesson={activeLesson} course={activeCourse} selected={selected} setSelected={setSelected} feedback={feedback} submitAnswer={submitAnswer} retryAnswer={() => { setSelected(""); setFeedback(null); }} visuals={visuals} pacing={pacing} saved={saved.includes(activeLesson.id)} toggleSaved={() => toggleSaved(activeLesson.id)} completed={completed.includes(activeLesson.id)} onBack={() => setActiveLesson(null)} onNext={() => { const index = lessons.findIndex((item) => item.id === activeLesson.id); openLesson(lessons[(index + 1) % lessons.length]); }} />
          ) : view === "dashboard" ? (
            <Dashboard completed={completed} accuracy={accuracy} attemptCount={attempts.length} mastery={mastery} xp={xp} resumeLesson={resumeLesson} onResume={() => openLesson(resumeLesson)} onCourse={(course) => openLesson(lessons.find((lesson) => lesson.id === course.lessonIds[0])!)} onExplore={() => setView("curriculum")} profile={profile} />
          ) : view === "curriculum" ? (
            <Curriculum completed={completed} onCourse={(course) => openLesson(lessons.find((lesson) => lesson.id === course.lessonIds[0])!)} />
          ) : view === "saved" ? (
            <SavedLibrary savedLessons={savedLessons} onOpen={openLesson} onRemove={toggleSaved}/>
          ) : view === "profile" ? (
            <Profile profile={profile} setProfile={setProfile} pacing={pacing} setPacing={setPacing} visuals={visuals} setVisuals={setVisuals}/>
          ) : (
            <QaPage attempts={attempts} completed={completed} saved={saved} />
          )}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ completed, accuracy, attemptCount, mastery, xp, resumeLesson, onResume, onCourse, onExplore, profile }: {
  completed: string[]; accuracy: number; attemptCount: number; mastery: number; xp: number; resumeLesson: Lesson; onResume: () => void; onCourse: (course: Course) => void; onExplore: () => void; profile: string;
}) {
  return <div className="dashboard-page">
    <div className="eyebrow"><span className="eyebrow-line"/> YOUR LEARNING SPACE <span className="eyebrow-line"/></div>
    <section className="welcome-row">
      <div className="welcome-copy">
        <p className="kicker">A NEW DAY TO DISCOVER</p>
        <h1>Welcome back,<br/><span>Alex.</span></h1>
        <p className="welcome-text">Your curiosity sets the pace. Pick up where you left off, or follow something that catches your eye.</p>
        <div className="profile-chip"><span className="profile-spark"><Sparkles size={14}/></span><span><small>YOUR LEARNING STYLE</small><strong>{profile}</strong></span><span className="chip-arrow">↗</span></div>
      </div>
      <div className="welcome-art" aria-label="Abstract illustration of a curious little character">
        <div className="art-sun"/><div className="art-ring ring-one"/><div className="art-ring ring-two"/>
        <div className="mascot"><div className="mascot-antenna"/><div className="mascot-eyes"><i/><i/></div><div className="mascot-mouth"/></div>
        <span className="art-note note-one">hmm...</span><span className="art-note note-two">✦</span><span className="art-note note-three">?</span>
        <div className="art-caption">Noggimigo is ready<br/>to explore with you.</div>
      </div>
    </section>

    <section className="resume-panel">
      <div className="resume-icon"><BookOpen size={21}/></div>
      <div className="resume-copy"><span className="section-overline">PICK UP WHERE YOU LEFT OFF</span><h2>{resumeLesson.title}</h2><p>{resumeLesson.subject} <span>·</span> {resumeLesson.level}</p></div>
      <button className="primary-button" onClick={onResume}>Resume <ArrowRight size={16}/></button>
    </section>

    <section className="metrics-row">
      <Metric icon={<Zap size={17}/>} label="Experience points" value={xp.toString()} note="10 XP per lesson completed correctly" tone="blue"/>
      <Metric icon={<Target size={17}/>} label="Exercise accuracy" value={`${accuracy}%`} note={`${attemptCount === 0 ? "No answers submitted yet" : `${attemptCount} submitted answers`}`} tone="coral"/>
      <Metric icon={<Layers3 size={17}/>} label="Curriculum progress" value={`${mastery}%`} note={`${completed.length} of ${lessons.length} lessons completed`} tone="violet"/>
    </section>

    <section className="section-heading"><div><p className="kicker">A FEW PLACES TO BEGIN</p><h2>What are you curious about?</h2></div><button className="text-button" onClick={onExplore}>Explore curriculum <ArrowRight size={15}/></button></section>
    <div className="course-grid">
      {courses.map((course, index) => <CourseCard key={course.id} course={course} completed={completed} onClick={() => onCourse(course)} index={index}/>)}
    </div>
    <footer className="page-footer"><span>Learning that adapts to you.</span><span>noggin<span className="brand-period">.</span> <i>Learning, your way</i></span></footer>
  </div>;
}

function Metric({ icon, label, value, note, tone }: { icon: ReactNode; label: string; value: string; note: string; tone: string }) {
  return <div className={`metric metric-${tone}`}><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span></div><strong className="metric-value">{value}</strong><span className="metric-note">{note}</span></div>;
}

function CourseCard({ course, completed, onClick, index }: { course: Course; completed: string[]; onClick: () => void; index: number }) {
  const Icon = course.icon;
  const done = course.lessonIds.filter((id) => completed.includes(id)).length;
  const percent = Math.round(done / course.lessonIds.length * 100);
  return <button className={`course-card course-${course.theme}`} onClick={onClick}>
    <div className="course-art"><div className="course-art-shape shape-a"/><div className="course-art-shape shape-b"/><div className="course-art-icon"><Icon size={25} strokeWidth={1.7}/></div><span className="course-number">0{index + 1}</span></div>
    <div className="course-content"><div className="course-meta"><span>{course.subject}</span><i/> <span>{course.level}</span></div><h3>{course.title}</h3><p>{course.description}</p>
      <div className="course-progress"><div className="progress-track"><span style={{width:`${percent}%`}}/></div><span>{done}/{course.lessonIds.length}</span></div>
      <div className="course-action"><span>{percent > 0 ? "Continue exploring" : "Start exploring"}</span><ArrowUpRightIcon/></div>
    </div>
  </button>;
}

function ArrowUpRightIcon() { return <ArrowRight size={16}/>; }

function Curriculum({ completed, onCourse }: { completed: string[]; onCourse: (course: Course) => void }) {
  return <div className="subpage"><div className="subpage-heading"><p className="kicker">THE MAP IS YOURS</p><h1>Explore the <span>curriculum.</span></h1><p>Choose a trail that sparks your curiosity. You can move between subjects whenever you like.</p></div><div className="course-grid curriculum-grid">{courses.map((course, index) => <CourseCard key={course.id} course={course} completed={completed} onClick={() => onCourse(course)} index={index}/>)}</div></div>;
}

function LessonRoom({ lesson, course, selected, setSelected, feedback, submitAnswer, retryAnswer, visuals, pacing, saved, toggleSaved, completed, onBack, onNext }: {
  lesson: Lesson; course?: Course; selected: string; setSelected: (value: string) => void; feedback: "correct" | "incorrect" | null; submitAnswer: () => void; retryAnswer: () => void; visuals: boolean; pacing: string; saved: boolean; toggleSaved: () => void; completed: boolean; onBack: () => void; onNext: () => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const hint = lesson.id.includes("fraction") ? "Count the equal parts in the whole first. That number belongs on the bottom of the fraction." : lesson.id === "algebra-balance" ? "Think about what would keep both sides balanced if you removed 3 from the left." : lesson.id === "photosynthesis" ? "Think about the energy source plants capture with the green pigment in their leaves." : lesson.id === "circuits" ? "Imagine tracing a complete route from one battery terminal and back again." : lesson.id === "phonics" ? "Say the word slowly and listen for each distinct sound, not each letter." : "Start by noticing and naming the feeling without judging whether it is good or bad.";
  return <div className="lesson-room"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to home</button>
    <div className="lesson-layout"><article className={`lesson-main pace-${pacing.toLowerCase()}`}><div className="lesson-meta"><span>{lesson.subject}</span><i/>{lesson.level}<i/> LESSON</div><h1>{lesson.title}</h1><p className="lesson-intro">{lesson.intro}</p>
      {visuals ? <div className={`lesson-visual visual-${course?.theme ?? "blue"}`}>{lesson.id.includes("fraction") ? <FractionVisual/> : lesson.id === "algebra-balance" ? <BalanceVisual/> : <div className="visual-concept"><Sparkles size={28}/><span>IDEA IN FOCUS</span><strong>{lesson.subject}</strong><small>Explore the concept, then try it yourself.</small></div>}</div> : <div className="visual-disabled-note"><span>VISUAL SUPPORT IS OFF</span><p>This lesson is showing its text explanation without the concept illustration.</p></div>}
      <div className="question-block"><div className="question-label"><span>YOUR TURN</span><span>01 / 01</span></div><h2>{lesson.question}</h2><div className="answer-options">{lesson.options.map((option, index) => <button key={option} className={`answer-option ${selected === option ? "selected" : ""} ${feedback && option === lesson.answer ? "answer-correct" : ""}`} onClick={() => { setSelected(option); }} disabled={!!feedback}><span className="option-letter">{String.fromCharCode(65 + index)}</span>{option}{feedback && option === lesson.answer && <CheckCircle2 size={18}/>}</button>)}</div>
        {!feedback ? <button className="primary-button check-button" disabled={!selected} onClick={submitAnswer}>Check my answer <ArrowRight size={16}/></button> : <div className={`feedback-box ${feedback}`}><div className="feedback-title">{feedback === "correct" ? <><CheckCircle2 size={19}/> That's it. Nicely reasoned!</> : <><Lightbulb size={19}/> Let's look at it another way.</>}</div><p>{lesson.explanation}</p>{feedback === "incorrect" ? <><button className="text-button" onClick={retryAnswer}>Try again <ArrowRight size={15}/></button><button className="text-button" onClick={onNext}>Move to next lesson <ArrowRight size={15}/></button></> : <button className="text-button" onClick={onNext}>Next lesson <ArrowRight size={15}/></button>}</div>}
      </div>
    </article><aside className="lesson-aside"><button className={`save-lesson ${saved ? "is-saved" : ""}`} onClick={toggleSaved}><Bookmark size={17} fill={saved ? "currentColor" : "none"}/>{saved ? "Saved to your library" : "Save this lesson"}</button><div className="aside-note"><div className="aside-mascot"><Sparkles size={20}/></div><strong>A thought from Noggimigo</strong><p>Take your time. Understanding the idea matters more than being quick.</p><button className="text-button hint-button" onClick={() => setShowHint(!showHint)}>{showHint ? "Hide hint" : "Ask for a hint"} <ArrowRight size={14}/></button>{showHint && <div className="hint-text">{hint}<small>Built-in lesson hint · AI chat is not connected yet.</small></div>}</div><div className="lesson-checkpoint"><span>YOUR PROGRESS</span><div className="checkpoint-line"><i className={completed ? "done" : ""}/></div><small>{completed ? "Lesson completed" : "One small step at a time"}</small></div></aside></div>
  </div>;
}

function FractionVisual() {
  return <div className="fraction-visual"><div className="pizza"><i/><i/><i/><i/></div><div className="fraction-copy"><span>ONE OUT OF FOUR</span><strong>¼</strong><small>1 slice · 4 equal parts</small></div></div>;
}
function BalanceVisual() {
  return <div className="balance-visual"><div className="balance-beam"/><div className="balance-pan left-pan"><b>x</b><i>+ 3</i></div><div className="balance-pan right-pan"><b>8</b></div><div className="balance-base"/></div>;
}

function SavedLibrary({ savedLessons, onOpen, onRemove }: { savedLessons: Lesson[]; onOpen: (lesson: Lesson) => void; onRemove: (id: string) => void }) {
  return <div className="subpage"><div className="subpage-heading"><p className="kicker">YOUR PERSONAL COLLECTION</p><h1>Your <span>learning library.</span></h1><p>Keep the ideas you want to revisit close at hand.</p></div>{savedLessons.length ? <div className="saved-list">{savedLessons.map((lesson) => <div className="saved-row" key={lesson.id}><div className="saved-icon"><Bookmark size={18}/></div><div><strong>{lesson.title}</strong><small>{lesson.subject} · {lesson.level}</small></div><button className="text-button" onClick={() => onOpen(lesson)}>Open <ArrowRight size={15}/></button><button className="icon-button" aria-label="Remove saved lesson" onClick={() => onRemove(lesson.id)}><X size={17}/></button></div>)}</div> : <div className="empty-state"><div className="empty-icon"><Bookmark size={25}/></div><h2>Your library is waiting.</h2><p>Save a lesson while exploring and it will appear here for easy revision.</p></div>}</div>;
}

function Profile({ profile, setProfile, pacing, setPacing, visuals, setVisuals }: { profile: string; setProfile: (v: string) => void; pacing: string; setPacing: (v: string) => void; visuals: boolean; setVisuals: (v: boolean) => void }) {
  return <div className="subpage"><div className="subpage-heading"><p className="kicker">MAKE THIS SPACE YOURS</p><h1>Your learning <span>settings.</span></h1><p>These preferences shape how lessons are presented. They are learning preferences, not diagnoses.</p></div><div className="settings-panel"><div className="setting-row"><div><strong>Learning profile</strong><p>A starting point for how Noggin presents learning activities.</p></div><select value={profile} onChange={(e) => setProfile(e.target.value)}><option>Balanced Explorer</option><option>Visual Explorer</option><option>Step-by-step Thinker</option><option>Flexible Explorer</option></select></div><div className="setting-row"><div><strong>Lesson pacing</strong><p>Choose the rhythm that feels comfortable.</p></div><select value={pacing} onChange={(e) => setPacing(e.target.value)}><option>Gentle</option><option>Balanced</option><option>Focused</option></select></div><div className="setting-row"><div><strong>Visual explanations</strong><p>Show diagrams and visual concept models when available.</p></div><button className={`toggle ${visuals ? "on" : ""}`} onClick={() => setVisuals(!visuals)} aria-pressed={visuals}><i/></button></div><p className="settings-footnote"><ShieldCheck size={15}/> Preferences are stored in this browser for this prototype.</p></div></div>;
}

function QaPage({ attempts, completed, saved }: { attempts: Attempt[]; completed: string[]; saved: string[] }) {
  return <div className="subpage"><div className="subpage-heading"><p className="kicker">ENGINEERING TRANSPARENCY</p><h1>Quality, not <span>guesswork.</span></h1><p>This page reports the current browser profile's learning data. It does not claim automated tests have passed.</p></div><div className="qa-grid"><div className="qa-card"><span>RECORDED ANSWER ATTEMPTS</span><strong>{attempts.length}</strong><small>Stored in this browser</small></div><div className="qa-card"><span>COMPLETED LESSONS</span><strong>{completed.length}</strong><small>Unique lesson completions</small></div><div className="qa-card"><span>SAVED LESSONS</span><strong>{saved.length}</strong><small>Personal library entries</small></div></div><div className="qa-note"><ShieldCheck size={20}/><div><strong>Automated test status: not yet run</strong><p>Run <code>npm test</code> and <code>npm run build</code> in the project environment before treating this build as verified.</p></div></div></div>;
}
