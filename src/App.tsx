import { useEffect, useState, type ReactNode } from "react";
import {
  Activity, ArrowLeft, ArrowRight, Bookmark, BookOpen, Brain, Check, CheckCircle2,
  Flame, GraduationCap, Home, Lightbulb, Play, Search, Settings2,
  ShieldCheck, Sparkles, Star, X
} from "lucide-react";
import { calculateAccuracy, calculateCompletionRate, type Attempt } from "./lib/progress";
import { readStoredValue, writeStoredValue } from "./lib/browserStorage";
import { courses, lessons, type Course, type Lesson } from "./features/curriculum/model";
import { NoggimigoPanel } from "./features/noggimigo/NoggimigoPanel";

type View = "dashboard" | "curriculum" | "course" | "saved" | "profile" | "qa";





const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isAttemptArray = (value: unknown): value is Attempt[] =>
  Array.isArray(value) && value.every((item) =>
    typeof item === "object" && item !== null &&
    typeof (item as Attempt).lessonId === "string" &&
    typeof (item as Attempt).correct === "boolean" &&
    typeof (item as Attempt).at === "string"
  );

const isString = (value: unknown): value is string => typeof value === "string";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const readStore = <T,>(key: string, fallback: T, isValid: (value: unknown) => value is T): T =>
  readStoredValue(key, fallback, isValid);

const writeStore = (key: string, value: unknown) => {
  // Storage failures must not interrupt the learner's current session.
  writeStoredValue(key, value);
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [hasEntered, setHasEntered] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => readStore("noggin.completed", [], isStringArray));
  const [attempts, setAttempts] = useState<Attempt[]>(() => readStore("noggin.attempts", [], isAttemptArray));
  const [saved, setSaved] = useState<string[]>(() => readStore("noggin.saved", [], isStringArray));
  const [lastLessonId, setLastLessonId] = useState<string>(() => readStore("noggin.lastLesson", "fractions", isString));
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [profile, setProfile] = useState<string>(() => readStore("noggin.profile", "Balanced Explorer", isString));
  const [pacing, setPacing] = useState<string>(() => readStore("noggin.pacing", "Balanced", isString));
  const [visuals, setVisuals] = useState<boolean>(() => readStore("noggin.visuals", true, isBoolean));

  useEffect(() => writeStore("noggin.completed", completed), [completed]);
  useEffect(() => writeStore("noggin.attempts", attempts), [attempts]);
  useEffect(() => writeStore("noggin.saved", saved), [saved]);
  useEffect(() => writeStore("noggin.lastLesson", lastLessonId), [lastLessonId]);
  useEffect(() => writeStore("noggin.profile", profile), [profile]);
  useEffect(() => writeStore("noggin.pacing", pacing), [pacing]);
  useEffect(() => writeStore("noggin.visuals", visuals), [visuals]);

  const accuracy = calculateAccuracy(attempts);
  const completionRate = calculateCompletionRate(completed, lessons.length);
  const resumeLesson = lessons.find((lesson) => lesson.id === lastLessonId) ?? lessons[0];
  const savedLessons = lessons.filter((lesson) => saved.includes(lesson.id));

  const openCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setActiveLesson(null);
    setView("course");
  };

  const openLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedCourseId(lesson.courseId);
    setLastLessonId(lesson.id);
    setSelected("");
    setFeedback(null);
    setView("dashboard");
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

  if (!hasEntered) return <PublicLanding onEnter={() => setHasEntered(true)} onExplore={() => { setHasEntered(true); setView("curriculum"); }} />;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="learner-topnav">
        <button className="learner-brand" onClick={() => { setView("dashboard"); setActiveLesson(null); }} aria-label="Noggin home">
          <span className="learner-brand-mark"><Brain size={21}/></span><strong>Noggin</strong>
        </button>
        <nav className="learner-links" aria-label="Learning navigation">
          {[
            {label:"Home",view:"dashboard" as View,icon:Home},
            {label:"Learn",view:"curriculum" as View,icon:GraduationCap},
            {label:"Progress",view:"qa" as View,icon:Activity},
            {label:"Library",view:"saved" as View,icon:Bookmark},
            {label:"Settings",view:"profile" as View,icon:Settings2}
          ].map((item) => { const Icon=item.icon; return <button key={item.label} aria-current={view===item.view&&!activeLesson?"page":undefined} className={view===item.view&&!activeLesson?"active":""} onClick={()=>{setView(item.view);setActiveLesson(null);}}><Icon size={15}/><span>{item.label}</span></button>; })}
        </nav>
        <div className="learner-status">
          <span className="status-chip">Learning space</span>
          <button className="learner-icon-button" aria-label="Learning preferences" onClick={()=>{setView("profile");setActiveLesson(null);}}><Settings2 size={17}/></button>
          <button className="learner-avatar" aria-label="Profile" onClick={()=>{setView("profile");setActiveLesson(null);}}>N</button>
        </div>
      </header>
      <main className="main-area" id="main-content" tabIndex={-1}>

        <div className="page-wrap">
          {activeLesson ? (
            <LessonRoom lesson={activeLesson} course={activeCourse} selected={selected} setSelected={setSelected} feedback={feedback} submitAnswer={submitAnswer} retryAnswer={() => { setSelected(""); setFeedback(null); }} visuals={visuals} pacing={pacing} saved={saved.includes(activeLesson.id)} toggleSaved={() => toggleSaved(activeLesson.id)} completed={completed.includes(activeLesson.id)} hasNext={lessons.filter((item) => item.courseId === activeLesson.courseId).findIndex((item) => item.id === activeLesson.id) < lessons.filter((item) => item.courseId === activeLesson.courseId).length - 1} onBack={() => { setActiveLesson(null); setView("course"); }} onNext={() => { const courseLessons = lessons.filter((item) => item.courseId === activeLesson.courseId); const index = courseLessons.findIndex((item) => item.id === activeLesson.id); if (index >= 0 && index < courseLessons.length - 1) openLesson(courseLessons[index + 1]); else { setActiveLesson(null); setView("course"); } }} />
          ) : view === "dashboard" ? (
            <Dashboard completed={completed} accuracy={accuracy} attemptCount={attempts.length} completionRate={completionRate} resumeLesson={resumeLesson} onResume={() => openLesson(resumeLesson)} onCourse={openCourse} onExplore={() => setView("curriculum")} profile={profile} />
          ) : view === "curriculum" ? (
            <Curriculum completed={completed} onCourse={openCourse} />
          ) : view === "course" ? (
            <CourseOverview course={courses.find((course) => course.id === selectedCourseId) ?? courses[0]} completed={completed} onBack={() => setView("curriculum")} onOpenLesson={openLesson} />
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


function PublicLanding({ onEnter, onExplore }: { onEnter: () => void; onExplore: () => void }) {
  return <main className="public-site figma-public noggin-home" id="top">
    <header className="figma-public-nav">
      <a className="figma-brand" href="#top" aria-label="Noggin home"><span><Brain size={21}/></span><strong>Noggin</strong></a>
      <nav aria-label="Public navigation"><a href="#approach">Our approach</a><a href="#learning-paths">Learning paths</a><a href="#noggimigo">Noggimigo</a><a href="#faq">Questions</a></nav>
      <div className="figma-nav-actions"><button className="login-link" onClick={onEnter}>Open demo</button><button className="get-started" onClick={onExplore}>Explore lessons <ArrowRight size={16}/></button></div>
    </header>

    <section className="noggin-hero">
      <div className="noggin-hero-copy">
        <span className="noggin-kicker"><span/> A more considered way to learn</span>
        <h1>Learning that <em>Adapts to You.</em></h1>
        <p>Noggin brings clear explanations, guided practice and flexible learning preferences together in one calm, encouraging space.</p>
        <div className="noggin-hero-actions"><button className="get-started" onClick={onExplore}>Explore the learning space <ArrowRight size={16}/></button><a href="#approach">See how it works <span>↓</span></a></div>
        <div className="noggin-hero-note"><ShieldCheck size={15}/> No streak pressure. Take lessons at your own pace.</div>
      </div>
      <div className="noggin-hero-art" aria-label="Illustration of a Noggin lesson preview">
        <div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/>
        <div className="hero-note-card"><span className="hero-note-label">A LITTLE PROGRESS</span><strong>One idea<br/>at a time.</strong><div className="hero-note-dots"><i/><i/><i/><i/></div></div>
        <div className="hero-preview-card">
          <div className="hero-preview-top"><span className="hero-mini-mark"><Brain size={15}/></span><b>Learning space</b><span className="hero-preview-tag">LESSON 01</span></div>
          <div className="hero-preview-subject">MATHEMATICS <i/> BEGINNER</div>
          <h2>Fractions are numbers, not just slices</h2>
          <p>A fraction describes a quantity made from equal parts of a whole.</p>
          <div className="hero-fraction-row"><div className="hero-fraction-circle"><i/><i/><i/><i/></div><div><strong>3/4</strong><small>three equal parts out of four</small></div></div>
          <div className="hero-preview-footer"><span><CheckCircle2 size={14}/> Worked example</span><span>Practice follows <ArrowRight size={13}/></span></div>
        </div>
        <div className="hero-floating-note"><span><Lightbulb size={16}/></span><div><b>Take your time</b><small>Learning has no timer here.</small></div></div>
      </div>
    </section>

    <section className="noggin-proof-strip" aria-label="What Noggin brings together">
      <span>One learning space</span><i/><span>Clear explanations</span><i/><span>Practice with feedback</span><i/><span>Flexible preferences</span>
    </section>

    <section className="noggin-approach" id="approach">
      <div className="noggin-section-intro"><span className="noggin-kicker">THE NOGGIN APPROACH</span><h2>Structure when you need it.<br/><em>Flexibility when you don't.</em></h2><p>Learning can feel more manageable when the next step is clear, the explanation makes sense, and there's room to pause or try again.</p></div>
      <div className="noggin-approach-grid">
        <article className="approach-card approach-blue"><span className="approach-number">01</span><div className="approach-icon"><BookOpen size={22}/></div><h3>Understand the idea</h3><p>Lessons begin with a clear objective and a focused explanation of the concept.</p></article>
        <article className="approach-card approach-mint"><span className="approach-number">02</span><div className="approach-icon"><Lightbulb size={22}/></div><h3>See it worked through</h3><p>Step-by-step examples make the reasoning visible, not just the final answer.</p></article>
        <article className="approach-card approach-cream"><span className="approach-number">03</span><div className="approach-icon"><CheckCircle2 size={22}/></div><h3>Try it for yourself</h3><p>Practice questions give feedback and an explanation you can revisit.</p></article>
      </div>
    </section>

    <section className="noggin-paths" id="learning-paths">
      <div className="noggin-paths-heading"><div><span className="noggin-kicker">START SOMEWHERE INTERESTING</span><h2>Follow a question.<br/><em>Find your next idea.</em></h2></div><p>Explore the starter collection of lessons currently available in Noggin. More learning paths can be added as the curriculum grows.</p></div>
      <div className="noggin-path-grid">
        <article className="noggin-path-card path-math"><span>01 / MATHEMATICS</span><b>∑</b><h3>Patterns &amp; problem-solving</h3><p>Fractions, equivalence and the logic behind equations.</p><small>2 courses · 3 lessons</small></article>
        <article className="noggin-path-card path-science"><span>02 / SCIENCE</span><b>⚛</b><h3>Explore how things work</h3><p>Follow energy through plants and trace a complete circuit.</p><small>2 courses · 2 lessons</small></article>
        <article className="noggin-path-card path-language"><span>03 / LANGUAGE</span><b>Aa</b><h3>Sounds, words &amp; meaning</h3><p>Explore how speech sounds connect to letters and spelling.</p><small>1 course · 1 lesson</small></article>
        <article className="noggin-path-card path-life"><span>04 / LIFE SKILLS</span><b>◎</b><h3>Emotions &amp; reflection</h3><p>Build language for feelings and practise thoughtful reflection.</p><small>1 course · 1 lesson</small></article>
      </div>
      <div className="noggin-paths-foot"><span>Starter curriculum · 6 courses · 7 lessons</span><button className="noggin-text-link" onClick={onExplore}>Browse the learning space <ArrowRight size={15}/></button></div>
    </section>

    <section className="noggin-flexibility">
      <div className="flexibility-visual"><div className="flexibility-sheet"><span>YOUR LEARNING PREFERENCES</span><div><b>Lesson pacing</b><strong>Balanced</strong></div><div className="flexibility-rule"><i/></div><div><b>Visual explanations</b><strong className="enabled-label">On <Check size={13}/></strong></div><div className="flexibility-toggle"><i/></div><small>Preferences can be changed whenever you like.</small></div><div className="flexibility-spark">✳</div></div>
      <div className="flexibility-copy"><span className="noggin-kicker">A SPACE YOU CAN ADJUST</span><h2>Different ways in.<br/><em>Same respect for every learner.</em></h2><p>Choose a comfortable lesson pace and switch visual explanations on or off. These are simple presentation preferences—not labels, diagnoses, or assumptions about what a learner can do.</p><button className="noggin-text-link" onClick={onEnter}>Open the learning demo <ArrowRight size={15}/></button></div>
    </section>

    <section className="noggin-companion" id="noggimigo">
      <div className="companion-mark"><div className="companion-orbit"/><div className="companion-face"><span>•</span><span>•</span><i/></div><div className="companion-star">✦</div></div>
      <div className="companion-copy"><span className="noggin-kicker">MEET YOUR OPTIONAL STUDY COMPANION</span><h2>A little help, when you want it.</h2><p>Noggimigo is Noggin's AI tutoring companion, available from supported lessons. Ask a question or request another explanation while you work through an idea.</p><small>Noggimigo is an optional support tool. It can make mistakes, so lesson content and worked explanations remain available to check.</small></div>
    </section>

    <section className="noggin-faq" id="faq">
      <div><span className="noggin-kicker">A FEW THINGS YOU MAY BE WONDERING</span><h2>Good questions<br/><em>belong here.</em></h2></div>
      <div className="noggin-faq-list">
        <details><summary>Is Noggin designed for one kind of learner?</summary><p>No. Noggin aims to offer clear structure and adjustable presentation preferences without assuming every learner needs the same thing.</p></details>
        <details><summary>Does Noggin currently have a full curriculum?</summary><p>Not yet. The current experience is an early starter collection with six courses and seven lessons. The curriculum is still being developed.</p></details>
        <details><summary>Do I need to use Noggimigo?</summary><p>No. Noggimigo is optional and appears in supported lessons. You can use the lesson explanations and practice without opening the tutor.</p></details>
        <details><summary>Is this a finished account-based platform?</summary><p>The current learning demo stores progress and preferences in this browser. Accounts and cross-device progress are not available yet.</p></details>
      </div>
    </section>

    <section className="noggin-final-cta"><div><span className="noggin-kicker">YOUR NEXT STEP CAN BE A SMALL ONE</span><h2>Curiosity is a good place to begin.</h2><p>Open the learning space and explore the lessons currently available.</p></div><button className="get-started" onClick={onExplore}>Explore Noggin <ArrowRight size={16}/></button></section>
    <footer className="noggin-footer"><div className="noggin-footer-brand"><a className="figma-brand" href="#top"><span><Brain size={21}/></span><strong>Noggin</strong></a><p>Learning that makes room for different minds.</p></div><div className="noggin-footer-links"><a href="#approach">Our approach</a><a href="#learning-paths">Learning paths</a><a href="#noggimigo">Noggimigo</a><a href="#faq">Questions</a></div><small>Early learning demo · Progress is stored in this browser</small></footer>
  </main>;
}
function Dashboard({ completed, accuracy, attemptCount, completionRate, resumeLesson, onResume, onCourse, onExplore, profile }: {
  completed: string[]; accuracy: number; attemptCount: number; completionRate: number; resumeLesson: Lesson; onResume: () => void; onCourse: (course: Course) => void; onExplore: () => void; profile: string;
}) {
  return <div className="dashboard-page noggin-dashboard">
    <section className="noggimigo-welcome">
      <div className="noggimigo-avatar" aria-hidden="true"><span>✦</span><i/></div>
      <div className="noggimigo-bubble"><div><strong>Noggimigo</strong><span>🤖</span><button aria-label="Dismiss welcome" onClick={(event)=>event.currentTarget.closest(".noggimigo-bubble")?.classList.add("dismissed")}><X size={14}/></button></div><p>Learning is your superpower! Let's unlock it together! <b>⚡</b></p></div>
    </section>
    <section className="noggin-stat-grid" aria-label="Learning summary">
      <article className="noggin-stat gems"><span className="stat-icon"><CheckCircle2 size={19}/></span><strong>{completed.length}</strong><small>Lessons completed</small></article>
      <article className="noggin-stat lessons"><span className="stat-icon"><Activity size={19}/></span><strong>{accuracy}%</strong><small>Answer accuracy</small></article>
      <article className="noggin-stat streak"><span className="stat-icon"><BookOpen size={19}/></span><strong>{attemptCount}</strong><small>Practice answers</small></article>
    </section>
    <section className="streak-banner">
      <div className="streak-orbit"><Flame size={31}/><strong>0</strong><small>DAYS</small></div>
      <div className="streak-copy"><h2><Star size={17} fill="currentColor"/> Your learning rhythm</h2><p>There is no rush. Pick a topic, work through one idea, and return when it suits you. <b>✨</b></p><span className="streak-footnote"><i>Small steps count</i> Your progress is saved in this browser.</span></div>
    </section>
    <section className="today-focus">
      <div className="focus-heading"><span className="focus-icon"><Sparkles size={19}/></span><div><h2>Today's Focus</h2><p>One small step is still progress.</p></div></div>
      <button className="focus-lesson" onClick={onResume}><span><small>CONTINUE LEARNING</small><strong>{resumeLesson.title}</strong><em>{resumeLesson.subject} · {resumeLesson.level}</em></span><span className="focus-action"><Play size={17} fill="currentColor"/></span></button>
    </section>
    <section className="noggin-course-section"><div className="noggin-section-heading"><div><span>KEEP EXPLORING</span><h2>Choose what to learn next</h2></div><button onClick={onExplore}>See all subjects <ArrowRight size={16}/></button></div><div className="course-grid">{courses.map((course,index)=><CourseCard key={course.id} course={course} completed={completed} onClick={()=>onCourse(course)} index={index}/>)}</div></section>
    <section className="noggin-progress-note"><div><strong>Your learning snapshot</strong><span>{profile} · {accuracy}% answer accuracy · {completionRate}% of available lessons completed · {attemptCount} answers tried</span></div><button onClick={()=>onExplore()}>Explore lessons <ArrowRight size={15}/></button></section>
  </div>;
}

function Metric({ icon, label, value, note, tone }: { icon: ReactNode; label: string; value: string; note: string; tone: string }) {
  return <div className={`metric metric-${tone}`}><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span></div><strong className="metric-value">{value}</strong><span className="metric-note">{note}</span></div>;
}

function CourseCard({ course, completed, onClick, index }: { course: Course; completed: string[]; onClick: () => void; index: number }) {
  const Icon = course.icon;
  const done = course.lessonIds.filter((id) => completed.includes(id)).length;
  const percent = Math.round(done / course.lessonIds.length * 100);
  return <button className={`course-card field-course course-${course.theme}`} onClick={onClick}>
    <div className="field-course-top"><span>STUDY {String(index+1).padStart(2,"0")}</span><Icon size={21} strokeWidth={1.7}/><span>{course.subject.toUpperCase()}</span></div>
    <div className="field-course-symbol">{course.subject==="Mathematics"?"∑":course.subject==="Science"?"⌁":course.subject==="English"?"Aa":"✳"}</div>
    <div className="course-content"><div className="course-meta"><span>{course.level}</span><i/> <span>{course.lessonIds.length} {course.lessonIds.length===1?"lesson":"lessons"}</span></div><h3>{course.title}</h3><p>{course.description}</p>
      <div className="course-progress"><div className="progress-track"><span style={{width:`${percent}%`}}/></div><span>{done}/{course.lessonIds.length}</span></div>
      <div className="course-action"><span>{percent>0?"Return to this subject":"Open this subject"}</span><ArrowRight size={16}/></div>
    </div>
  </button>;
}

function ArrowUpRightIcon() { return <ArrowRight size={16}/>; }

function Curriculum({ completed, onCourse }: { completed: string[]; onCourse: (course: Course) => void }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const subjects = ["All subjects", ...Array.from(new Set(courses.map((course) => course.subject)))];
  const filteredCourses = courses.filter((course) => {
    const matchesSubject = subject === "All subjects" || course.subject === subject;
    const searchText = `${course.title} ${course.subject} ${course.description}`.toLowerCase();
    return matchesSubject && searchText.includes(query.trim().toLowerCase());
  });
  return <div className="subpage"><div className="subpage-heading"><p className="kicker">THE MAP IS YOURS</p><h1>Explore the <span>curriculum.</span></h1><p>Choose a trail that sparks your curiosity. You can move between subjects whenever you like.</p></div><div className="curriculum-tools"><label className="curriculum-search"><Search size={18}/><input aria-label="Search courses" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects, topics, or courses"/></label><label className="curriculum-filter"><span>Subject</span><select aria-label="Filter courses by subject" value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><span className="course-result-count">{filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}</span></div>{filteredCourses.length ? <div className="course-grid curriculum-grid">{filteredCourses.map((course, index) => <CourseCard key={course.id} course={course} completed={completed} onClick={() => onCourse(course)} index={index}/>)}</div> : <div className="empty-state curriculum-empty"><div className="empty-icon"><Search size={24}/></div><h2>No courses found</h2><p>Try another search or choose a different subject.</p><button className="text-button" onClick={() => { setQuery(""); setSubject("All subjects"); }}>Clear filters <ArrowRight size={15}/></button></div>}</div>;
}


function CourseOverview({ course, completed, onBack, onOpenLesson }: { course: Course; completed: string[]; onBack: () => void; onOpenLesson: (lesson: Lesson) => void }) {
  const Icon = course.icon;
  const courseLessons = course.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)).filter((lesson): lesson is Lesson => Boolean(lesson));
  const done = courseLessons.filter((lesson) => completed.includes(lesson.id)).length;
  const percent = courseLessons.length ? Math.round((done / courseLessons.length) * 100) : 0;

  return <div className="subpage course-overview">
    <button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to curriculum</button>
    <section className={`course-overview-hero course-${course.theme}`}>
      <div className="course-overview-art"><Icon size={42} strokeWidth={1.5}/></div>
      <div className="course-overview-copy">
        <div className="course-meta"><span>{course.subject}</span><i/> <span>{course.level}</span></div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="course-overview-progress"><div className="progress-track"><span style={{width: String(percent) + "%"}}/></div><span>{done} of {courseLessons.length} lessons completed · {percent}%</span></div>
      </div>
    </section>
    <section className="course-learning-outcomes">
      <div><span className="section-overline">YOUR LEARNING PATH</span><h2>Lessons in this course</h2><p>Work through the lessons in order, or revisit any topic whenever you need.</p></div>
      <div className="course-lesson-list">
        {courseLessons.map((lesson, index) => {
          const isDone = completed.includes(lesson.id);
          return <article className="course-lesson-row" key={lesson.id}>
            <span className={`course-lesson-number ${isDone ? "is-done" : ""}`}>{isDone ? <Check size={17}/> : String(index + 1).padStart(2, "0")}</span>
            <div className="course-lesson-copy"><strong>{lesson.title}</strong><p>{lesson.intro}</p><small>{lesson.level} · Practice question included</small></div>
            <button className="text-button" onClick={() => onOpenLesson(lesson)}>{isDone ? "Review" : "Start lesson"} <ArrowRight size={15}/></button>
          </article>;
        })}
      </div>
    </section>
  </div>;
}

function LessonRoom({ lesson, course, selected, setSelected, feedback, submitAnswer, retryAnswer, visuals, pacing, saved, toggleSaved, completed, hasNext, onBack, onNext }: {
  lesson: Lesson; course?: Course; selected: string; setSelected: (value: string) => void; feedback: "correct" | "incorrect" | null; submitAnswer: () => void; retryAnswer: () => void; visuals: boolean; pacing: string; saved: boolean; toggleSaved: () => void; completed: boolean; hasNext: boolean; onBack: () => void; onNext: () => void;
}) {
  return <div className="lesson-room lesson-studio">
    <div className="lesson-studio-top"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Course map</button><div className="lesson-studio-count">FIELD NOTE <b>{String(lessons.findIndex((item) => item.id === lesson.id) + 1).padStart(2,"0")}</b><span> / {String(lessons.length).padStart(2,"0")}</span></div></div>
    <div className="lesson-studio-heading"><div className="lesson-studio-subject"><span>{lesson.subject}</span><i/>{lesson.level}<i/> {course?.title ?? "Independent lesson"}</div><h1>{lesson.title}</h1><p>{lesson.intro}</p><div className="lesson-objective"><span>THE POINT OF THIS LESSON</span><strong>{lesson.objective}</strong></div></div>
    <div className="lesson-studio-grid">
      <main className="lesson-studio-main">
        <section className="lesson-workbench">
          <div className="workbench-heading"><span>01 / WORK THROUGH THE IDEA</span><span>READ · TRACE · CONNECT</span></div>
          {visuals ? <div className={`lesson-visual studio-visual visual-${course?.theme ?? "blue"}`}>{lesson.id.includes("fraction") ? <FractionVisual/> : lesson.id === "algebra-balance" ? <BalanceVisual/> : <div className="visual-concept"><span>CONCEPT STUDY</span><strong>{lesson.subject}</strong><small>{lesson.title}</small></div>}</div> : null}
          <div className="worked-example"><div className="worked-example-label"><span>WORKED EXAMPLE</span><h2>{lesson.workedExample.label}</h2></div><ol>{lesson.workedExample.steps.map((step,index)=><li key={index}><span>{String(index+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol><div className="worked-takeaway"><b>KEEP IN MIND</b><p>{lesson.workedExample.takeaway}</p></div></div>
          <div className="common-mistake"><span>WATCH FOR THIS</span><p>{lesson.commonMistake}</p></div>
        </section>
        <section className="question-block studio-question">
          <div className="question-label"><span>02 / CHECK YOUR THINKING</span><span>ONE QUESTION</span></div>
          <h2>{lesson.question}</h2>
          <div className="answer-options">{lesson.options.map((option,index)=><button key={option} className={`answer-option ${selected===option?"selected":""} ${feedback&&option===lesson.answer?"answer-correct":""}`} aria-pressed={selected===option} onClick={()=>setSelected(option)} disabled={!!feedback}><span className="option-letter">{String.fromCharCode(65+index)}</span><span>{option}</span>{feedback&&option===lesson.answer?<CheckCircle2 size={18}/>:null}</button>)}</div>
          {!feedback ? <button className="primary-button check-button" disabled={!selected} onClick={submitAnswer}>Check my reasoning <ArrowRight size={16}/></button> : <div className={`feedback-box ${feedback}`} role="status" aria-live="polite"><div className="feedback-title">{feedback==="correct"?<><CheckCircle2 size={19}/> Correct — your reasoning holds.</>:<><Lightbulb size={19}/> Not quite. Revisit the idea.</>}</div><p>{lesson.explanation}</p>{feedback==="incorrect"?<button className="text-button" onClick={retryAnswer}>Try another answer <ArrowRight size={15}/></button>:<button className="text-button" onClick={onNext}>{hasNext?"Continue to the next lesson":"Return to course map"} <ArrowRight size={15}/></button>}</div>}
        </section>
        <section className="reflection-card"><span>03 / MAKE IT YOURS</span><h2>One more thought.</h2><p>{lesson.reflection}</p><small>You can think it through before moving on. This reflection is not graded.</small></section>
      </main>
      <aside className="lesson-studio-rail">
        <button className={`save-lesson studio-save ${saved?"is-saved":""}`} onClick={toggleSaved}><Bookmark size={16} fill={saved?"currentColor":"none"}/>{saved?"Saved in your fieldbook":"Save to fieldbook"}</button>
        <div className="lesson-rail-card"><span>YOUR PROGRESS</span><div className="rail-progress"><i className={completed?"done":""}/></div><strong>{completed?"Concept checked":"In the making"}</strong><p>{completed?"You answered the practice question correctly.":"Work through the example, then test your understanding."}</p></div>
        <NoggimigoPanel lessonId={lesson.id as "fractions"|"equivalent-fractions"|"algebra-balance"|"photosynthesis"|"circuits"|"phonics"|"emotion-compass"}/>
        <div className="lesson-rail-note"><span>LEARNING NOTE</span><p>Understanding grows when you can explain an idea in your own words. Take your time.</p></div>
      </aside>
    </div>
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
