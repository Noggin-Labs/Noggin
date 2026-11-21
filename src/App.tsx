import { useEffect, useState, type ReactNode } from "react";
import {
  Activity, ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, CheckCircle2,
  ChevronRight, CircleHelp, Compass, FlaskConical, GraduationCap, Home,
  Layers3, Lightbulb, Menu, Microscope, Moon, Play, Search, Settings2,
  ShieldCheck, Sparkles, Star, Target, Users, X, Zap
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
  const [mobileNav, setMobileNav] = useState(false);

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
    setMobileNav(false);
  };

  const openLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setSelectedCourseId(lesson.courseId);
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

  if (!hasEntered) return <PublicLanding onEnter={() => setHasEntered(true)} onExplore={() => { setHasEntered(true); setView("curriculum"); }} />;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`} aria-label="Primary navigation">
        <button className="brand-lockup" onClick={() => { setView("dashboard"); setActiveLesson(null); }} aria-label="Noggin home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-word">noggin<span className="brand-period">.</span><small>LEARNING STUDIO</small></span>
        </button>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="nav-list" id="primary-navigation" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} aria-current={view === item.id && !activeLesson ? "page" : undefined} className={`nav-item ${view === item.id && !activeLesson ? "active" : ""}`} onClick={() => { setView(item.id); setActiveLesson(null); setMobileNav(false); }}><Icon size={18} strokeWidth={1.9}/><span>{item.label}</span>{item.id === "saved" && saved.length > 0 && <em>{saved.length}</em>}</button>;
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
      {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}

      <main className="main-area" id="main-content" tabIndex={-1}>
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label={mobileNav ? "Close navigation" : "Open navigation"} aria-expanded={mobileNav} aria-controls="primary-navigation"><Menu size={20}/></button>
          <div className="breadcrumb"><span>noggin</span><ChevronRight size={14}/><strong>{activeLesson ? "Lesson room" : view === "course" ? courses.find((course) => course.id === selectedCourseId)?.title ?? "Course overview" : navItems.find((item) => item.id === view)?.label}</strong></div>
          <div className="topbar-right"><span className="role-pill"><GraduationCap size={15}/> Student space</span><button className="avatar" aria-label="Open learning preferences" onClick={() => { setView("profile"); setActiveLesson(null); }}><Sparkles size={15}/></button></div>
        </header>

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
  return <main className="public-site">
    <header className="public-nav">
      <a className="public-brand" href="#top" aria-label="Noggin home"><span className="public-brand-mark">n.</span><span>noggin<small>LEARNING STUDIO</small></span></a>
      <nav aria-label="Public navigation"><a href="#how-it-works">How it works</a><a href="#learning-paths">Learning paths</a><a href="#principles">Our approach</a></nav>
      <button className="public-nav-cta" onClick={onEnter}>Open learning space <ArrowRight size={16}/></button>
    </header>
    <section className="public-hero" id="top">
      <div className="public-hero-copy">
        <div className="public-eyebrow"><span/> AN OPEN SPACE FOR CURIOUS MINDS <span className="public-edition">EDITION 01 / 2026</span></div>
        <h1>Learning should<br/>feel like <em>discovery.</em></h1>
        <p className="public-lede">A thoughtful learning studio for asking better questions, building real understanding, and finding your own way through big ideas.</p>
        <div className="public-actions"><button className="public-primary" onClick={onEnter}>Enter the learning space <ArrowRight size={17}/></button><button className="public-secondary" onClick={onExplore}>Browse learning paths <span>↗</span></button></div>
        <div className="public-proof"><span className="proof-mark">✳</span><span><strong>Curiosity first.</strong><small>Progress at your pace, one idea at a time.</small></span></div>
      </div>
      <div className="public-hero-art" aria-label="Abstract illustration of ideas connecting">
        <div className="hero-art-index">FIELD STUDY <b>001—A</b></div>
        <div className="hero-art-grid"/>
        <div className="hero-art-ring ring-one"/><div className="hero-art-ring ring-two"/>
        <div className="hero-art-line line-one"/><div className="hero-art-line line-two"/>
        <div className="hero-art-sun"><span>N</span><small>IDEAS<br/>CONNECT</small></div>
        <div className="hero-art-label label-one"><i>01</i><b>Question</b><small>START SOMEWHERE</small></div>
        <div className="hero-art-label label-two"><i>02</i><b>Explore</b><small>FOLLOW A THREAD</small></div>
        <div className="hero-art-label label-three"><i>03</i><b>Understand</b><small>MAKE IT YOURS</small></div>
        <div className="hero-art-caption">A MAP WITHOUT A SINGLE DESTINATION</div>
      </div>
      <div className="public-scroll-note">SCROLL TO EXPLORE <span>↓</span></div>
    </section>
    <section className="public-manifesto" id="how-it-works">
      <p className="public-section-tag">01 / THE IDEA</p><div><h2>Not another place<br/>to just <em>get through</em><br/>your lessons.</h2><p>We think learning works better when you can see how ideas fit together. Noggin brings lessons, practice, and reflection into one calm space—so the point is understanding, not racing through a checklist.</p></div>
    </section>
    <section className="public-paths" id="learning-paths">
      <div className="public-section-head"><div><p className="public-section-tag">02 / START EXPLORING</p><h2>Pick a thread.<br/><em>See where it leads.</em></h2></div><button className="public-text-link" onClick={onExplore}>View all learning paths <ArrowRight size={16}/></button></div>
      <div className="public-path-grid">
        <article className="public-path path-math"><span>PATH 01 / MATHEMATICS</span><div className="path-symbol">∑</div><h3>Patterns<br/>everywhere.</h3><p>Find the structures hiding inside numbers, shapes, and everyday problems.</p><b>Logic · Algebra · Geometry</b></article>
        <article className="public-path path-science"><span>PATH 02 / SCIENCE</span><div className="path-symbol">⌁</div><h3>Understand<br/>the systems.</h3><p>Explore the forces, processes, and connections that shape our world.</p><b>Biology · Physics · Chemistry</b></article>
        <article className="public-path path-language"><span>PATH 03 / LANGUAGE</span><div className="path-symbol">Aa</div><h3>Ideas need<br/>expression.</h3><p>Build confidence with language, communication, and clear thinking.</p><b>Reading · Writing · Reasoning</b></article>
      </div>
      <p className="public-disclaimer">A preview of the learning areas. Available courses and lessons depend on the curriculum currently published in the platform.</p>
    </section>
    <section className="public-principles" id="principles"><p className="public-section-tag">03 / OUR APPROACH</p><h2>Good learning is<br/><em>built, not rushed.</em></h2><div className="principle-list"><article><span>01</span><div><h3>Understand before advancing</h3><p>Practice is a chance to think, not just a score to collect.</p></div></article><article><span>02</span><div><h3>Make room for different minds</h3><p>Clear explanations, flexible pacing, and more than one way into an idea.</p></div></article><article><span>03</span><div><h3>Keep progress honest</h3><p>Completion, practice results, and mastery are different things. We keep them distinct.</p></div></article></div></section>
    <footer className="public-footer"><a className="public-brand" href="#top"><span className="public-brand-mark">n.</span><span>noggin<small>LEARNING STUDIO</small></span></a><span>Curiosity is a good place to begin.</span><button onClick={onEnter}>Enter Noggin <ArrowRight size={15}/></button></footer>
  </main>;
}

function Dashboard({ completed, accuracy, attemptCount, completionRate, resumeLesson, onResume, onCourse, onExplore, profile }: {
  completed: string[]; accuracy: number; attemptCount: number; completionRate: number; resumeLesson: Lesson; onResume: () => void; onCourse: (course: Course) => void; onExplore: () => void; profile: string;
}) {
  return <div className="dashboard-page studio-dashboard">
    <div className="dashboard-edition"><span>THE NOGGIN FIELD GUIDE</span><span>VOL. 01 — YOUR WORKSPACE</span></div>
    <section className="dashboard-opening">
      <div className="dashboard-opening-copy"><p className="kicker">A PLACE TO THINK OUT LOUD</p><h1>Curiosity<br/><em>looks good</em><br/>on you.</h1><p>Follow a question. Pull an idea apart. Put it back together in a way that makes sense to you.</p><button className="dashboard-explore" onClick={onExplore}>Find your next thread <ArrowRight size={17}/></button></div>
      <div className="dashboard-opening-art"><div className="opening-art-stamp">NG<br/><small>LEARN<br/>BY DOING</small></div><div className="opening-art-loop loop-a"/><div className="opening-art-loop loop-b"/><span className="opening-art-word word-a">ASK</span><span className="opening-art-word word-b">MAKE</span><span className="opening-art-word word-c">NOTICE</span><span className="opening-art-coordinate">01. / START ANYWHERE</span></div>
      <div className="dashboard-side-note"><span>YOUR MODE</span><strong>{profile}</strong><small>Change this in learning settings.</small></div>
    </section>
    <section className="continue-strip"><div className="continue-index">↳</div><div className="continue-main"><span>BACK TO YOUR LAST THREAD</span><h2>{resumeLesson.title}</h2><p>{resumeLesson.subject} <i/> {resumeLesson.level}</p></div><button onClick={onResume}>Pick it back up <ArrowRight size={17}/></button></section>
    <section className="learning-log"><div className="learning-log-heading"><span>YOUR LEARNING LOG</span><small>Progress is a record, not a ranking.</small></div><div className="learning-log-stats"><div><strong>{completed.length.toString().padStart(2,"0")}</strong><span>LESSONS COMPLETED</span></div><div><strong>{accuracy}<small>%</small></strong><span>ANSWER ACCURACY</span></div><div><strong>{completionRate}<small>%</small></strong><span>CURRICULUM COVERED</span></div><div><strong>{attemptCount.toString().padStart(2,"0")}</strong><span>ANSWERS TRIED</span></div></div></section>
    <section className="dashboard-course-section"><div className="dashboard-course-heading"><div><span>THE COURSE INDEX / 06</span><h2>Choose a subject.<br/><em>Find a question.</em></h2></div><button onClick={onExplore}>See the whole index <ArrowRight size={16}/></button></div><div className="course-grid">{courses.map((course,index)=><CourseCard key={course.id} course={course} completed={completed} onClick={()=>onCourse(course)} index={index}/>)}</div></section>
    <footer className="page-footer"><span>Make room for wonder.</span><span>noggin<span className="brand-period">.</span> <i>Field guide to learning</i></span></footer>
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
    <div className="course-art"><div className="course-art-shape shape-a"/><div className="course-art-shape shape-b"/><div className="course-art-icon"><Icon size={25} strokeWidth={1.7}/></div><span className="course-number">FIELD NOTE / 0{index + 1}</span><span className="course-art-axis">↗</span></div>
    <div className="course-content"><div className="course-meta"><span>{course.subject}</span><i/> <span>{course.level}</span></div><h3>{course.title}</h3><p>{course.description}</p>
      <div className="course-progress"><div className="progress-track"><span style={{width:`${percent}%`}}/></div><span>{done}/{course.lessonIds.length}</span></div>
      <div className="course-action"><span>{percent > 0 ? "Continue exploring" : "Start exploring"}</span><ArrowUpRightIcon/></div>
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
