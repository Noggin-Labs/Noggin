import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AssessmentProvider, useAssessment } from '@/lib/AssessmentContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import OnboardingAssessment from './components/onboarding/OnboardingAssessment';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AccessibilityProvider } from '@/lib/AccessibilityContext';
import AccessibilityToggle from '@/components/AccessibilityToggle';
// Add page imports here
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Games from './pages/Games';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudyPlanner from './pages/StudyPlanner';
import StudentProfile from './pages/StudentProfile';
import LessonLibrary from './pages/LessonLibrary';
import LearningAnalytics from './pages/LearningAnalytics';
import IepTracker from './pages/IepTracker';
import LessonBuilder from './pages/LessonBuilder';
import AccessibilitySettings from './pages/AccessibilitySettings';
import NoggimigoSettings from './pages/NoggimigoSettings';
import ActivityFeed from './pages/ActivityFeed';
import ResourceLibrary from './pages/ResourceLibrary';
import GoalCelebration from './pages/GoalCelebration';
import CommunicationBoard from './pages/CommunicationBoard';
import GemsShop from './pages/GemsShop';
import SubjectHub from './pages/SubjectHub';
import LessonPath from './pages/LessonPath';
import GrowthReports from './pages/GrowthReports';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const { hasCompletedAssessment } = useAssessment();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Show gatekeeper for student routes if assessment not completed
  const isStudentRoute = ["/student", "/games"].includes(window.location.pathname);
  if (isStudentRoute && hasCompletedAssessment === false) {
    return <OnboardingAssessment />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/games" element={<Games />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/lesson-library" element={<LessonLibrary />} />
        <Route path="/learning-analytics" element={<LearningAnalytics />} />
        <Route path="/iep-tracker" element={<IepTracker />} />
        <Route path="/lesson-builder" element={<LessonBuilder />} />
        <Route path="/accessibility-settings" element={<AccessibilitySettings />} />
        <Route path="/noggimigo-settings" element={<NoggimigoSettings />} />
        <Route path="/activity-feed" element={<ActivityFeed />} />
        <Route path="/resource-library" element={<ResourceLibrary />} />
        <Route path="/goal-celebration" element={<GoalCelebration />} />
        <Route path="/study-planner" element={<StudyPlanner />} />
        <Route path="/communication-board" element={<CommunicationBoard />} />
        <Route path="/gems-shop" element={<GemsShop />} />
        <Route path="/subject-hub" element={<SubjectHub />} />
        <Route path="/lesson-path" element={<LessonPath />} />
        <Route path="/growth-reports" element={<GrowthReports />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AssessmentProvider>
              <AuthenticatedApp />
            </AssessmentProvider>
            <AccessibilityToggle />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </AccessibilityProvider>
  )
}

export default App
