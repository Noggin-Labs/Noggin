import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Scale,
  Bot,
  Trophy,
  BarChart3,
  Atom,
  BookOpen,
  Landmark,
  Globe,
  HeartHandshake,
  Check,
  Github,
  Star,
  Sparkles,
  LineChart,
  Calculator,
  FlaskConical,
  Globe2,
  Hourglass,
  Smile,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Gem,
  Heart,
  Zap
} from 'lucide-react';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 font-nunito text-slate-800 selection:bg-blue-100 selection:text-blue-700">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between px-5 sm:px-6 h-16 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
                🧠
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Noggin</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#subjects" className="hover:text-blue-600 transition-colors">Subjects</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                to="/student"
                className="hidden sm:inline-block px-4 py-2 rounded-xl font-semibold text-sm text-slate-700 hover:text-blue-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/games"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Learning Free</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 border border-blue-100 text-blue-700 font-semibold text-sm mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Meet Noggimigo — your child's AI tutor</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Learning that <span className="text-blue-600">Adapts to You.</span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-slate-600 leading-relaxed font-normal mb-8">
              Noggin is an adaptive learning platform built for neurodivergent children — ADHD, autism, dyslexia, and dyscalculia. Noggimigo meets each child at their exact level and guides them one encouraging step at a time.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-10 text-xs sm:text-sm font-semibold text-slate-600">
              <span className="px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200 shadow-sm">Adaptive difficulty</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200 shadow-sm">Guided feedback</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200 shadow-sm">Gems & streaks</span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200 shadow-sm">Parent & teacher tools</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/games"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/student"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              >
                Parent Dashboard
              </Link>
            </div>
          </div>

          {/* Right: visual with floating cards */}
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="mx-auto w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-600/30 flex items-center justify-center">
              <Atom className="w-28 h-28 sm:w-32 sm:h-32 text-white" />
            </div>

            {/* Floating: streak */}
            <div className="absolute -top-4 -left-2 sm:-left-8 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center space-x-3 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">7-day streak!</div>
                <div className="text-xs text-slate-500">Keep it up!</div>
              </div>
            </div>

            {/* Floating: badge */}
            <div className="absolute top-1/2 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center space-x-3" style={{ animation: 'float 5s ease-in-out infinite' }}>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">Badge unlocked!</div>
                <div className="text-xs text-slate-500">Bookworm</div>
              </div>
            </div>

            {/* Floating: gems */}
            <div className="absolute -bottom-4 left-4 sm:left-8 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center space-x-3" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">+150 gems earned</div>
                <div className="text-xs text-slate-500">Maths mastered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adaptive Framework Section */}
      <section id="features" className="py-20 bg-white/40 border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Adaptive Framework
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
              Built for the way <span className="text-blue-600">your child learns</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Every feature is designed with neurodivergent learners in mind — combining science with joyful experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Adaptive</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Adjusts to each learner
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Personalised</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Built around your child
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Multi-sensory</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Visual · audio · tactile
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Free</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                No cost, no ads
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum / Subjects Section */}
      <section id="subjects" className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Interactive Curriculum
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
              A full curriculum, <span className="text-blue-600">reimagined</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Every subject is broken down into byte-sized modules designed with multisensory learning aids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Subject Card 1 */}
            <Link to="/games" className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">48 Lessons</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Mathematics</h3>
            </Link>

            {/* Subject Card 2 */}
            <Link to="/games" className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">32 Lessons</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">English Literacy</h3>
            </Link>

            {/* Subject Card 3 */}
            <Link to="/games" className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">40 Lessons</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Science</h3>
            </Link>

            {/* Subject Card 4 */}
            <Link to="/games" className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Globe2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">28 Lessons</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Social Studies</h3>
            </Link>

            {/* Subject Card 5 */}
            <Link to="/games" className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Hourglass className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">36 Lessons</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">History</h3>
            </Link>

            {/* Subject Card 6 */}
            <Link to="/games" className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Smile className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-400">50 Lessons</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Social Emotional Learning</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works / Simple Setup */}
      <section id="how-it-works" className="py-20 bg-white/40 border-y border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Simple Setup
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
              Getting started is <span className="text-blue-600">simple.</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Designed to integrate easily into your existing school curriculum or IEP goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative">
              <span className="text-4xl font-black text-blue-600/30 block mb-4">01</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Assessment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Spend 3 minutes solving curriculum questions and choosing your child's diagnostic learning markers (e.g. dyslexic reading preferences or dyscalculia aids).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative">
              <span className="text-4xl font-black text-blue-600/30 block mb-4">02</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Meet Noggimigo</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your child connects with their helpful AI tutor, customize app appearance, and chooses their primary subject focus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative">
              <span className="text-4xl font-black text-blue-600/30 block mb-4">03</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Learning</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Daily personalized lesson queues populate breakdowns focused on positive pacing and encouraging positive rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Parent Support
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
              A learning experience that brings relief to families
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Real stories from families who replaced math-anxiety struggles with self-paced daily wins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                  "My son used to get upset and lose focus every time we pulled out traditional school sheets. With Noggin, Noggimigo rewards his small focus spurts instead of counting the clock. It has saved our family dynamic."
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Bankole O.</p>
                <p className="text-xs text-slate-400">Parent of autistic child, age 13</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                  "The dyslexia friendly font options and pacing toggles are a godsend. She's not trying to rush a timer anymore. She just gets to explore at her speed, gaining confidence with every milestone."
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Kassim A.</p>
                <p className="text-xs text-slate-400">Parent of Dyslexic child, age 11</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                  "As an educator and a father of an autistic son, I am incredibly critical of gamification tactics. Noggin gets it right. The feedback loops are encouraging, structured, and completely non-punitive."
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Dr. Marcus T.</p>
                <p className="text-xs text-slate-400">Pediatric Psychologist & Father</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tier Section */}
      <section id="pricing" className="py-20 bg-white/40 border-t border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
              Free for everyone. <span className="text-blue-600">Always.</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Noggin will always be free and open source to the parents, students, teachers and psychologists that need it most, help use keep it that way on GitHub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Students Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Students</h3>
                <div className="text-4xl font-black text-blue-600 mb-4">$0</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Unlimited access to all 6 subjects, Noggimigo AI help, and sensory accommodations.
                </p>
              </div>
              <Link
                to="/games"
                className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                Start Learning
              </Link>
            </div>

            {/* Parents Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Parents</h3>
                <div className="text-4xl font-black text-blue-600 mb-4">$0</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Parent dashboard, progress tracking, and IEP-aligned goal insights.
                </p>
              </div>
              <Link
                to="/student"
                className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                Parent Dashboard
              </Link>
            </div>

            {/* Teachers Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Teachers</h3>
                <div className="text-4xl font-black text-blue-600 mb-4">$0</div>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  Class rosters, multi-child profiles, and curriculum alignment tools.
                </p>
              </div>
              <Link
                to="/student"
                className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                Teacher Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Banner */}
      <section id="open-source" className="py-16 bg-white/30 border-t border-slate-200/50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Noggin is free & open source
          </h2>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-4">
            Community supported
          </span>
          <div className="text-3xl font-black text-slate-900 mb-2">$0</div>
          <p className="text-slate-500 text-xs sm:text-sm mb-6">Forever free • Open source on GitHub</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
          >
            <Github className="w-4 h-4" />
            <span>Explore on GitHub</span>
          </a>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Ready to unlock your <span className="text-amber-300">child's potential?</span>
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Give your student the customized learning experience they deserve — peaceful, encouraging, and designed just for their unique mind.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/games"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-blue-700 bg-white hover:bg-blue-50 transition-all shadow-lg"
            >
              Start Learning Free
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white border-2 border-white/40 hover:bg-white/10 transition-all"
            >
              Star on GitHub
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 text-white font-bold text-xl mb-4">
                🧠 <span>Noggin</span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
                Redefining educational software for neurodiverse excellence. Built with patience, loved by parents, trusted by clinics.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#subjects" className="hover:text-white transition-colors">Subjects</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#case-studies" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Research</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Noggimigo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Advisory Board</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 | Folarera Kassim, All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
