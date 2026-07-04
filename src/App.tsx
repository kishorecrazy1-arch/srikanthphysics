import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SrikanthLanding } from './pages/SrikanthLanding';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const Landing = lazy(() => import('./pages/Landing').then((m) => ({ default: m.Landing })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const PostSignIn = lazy(() => import('./pages/PostSignIn').then((m) => ({ default: m.PostSignIn })));
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Quiz = lazy(() => import('./pages/Quiz').then((m) => ({ default: m.Quiz })));
const Progress = lazy(() => import('./pages/Progress').then((m) => ({ default: m.Progress })));
const Schedule = lazy(() => import('./pages/Schedule').then((m) => ({ default: m.Schedule })));
const Achievements = lazy(() => import('./pages/Achievements').then((m) => ({ default: m.Achievements })));
const TopicSelection = lazy(() => import('./pages/TopicSelection').then((m) => ({ default: m.TopicSelection })));
const TopicDetail = lazy(() => import('./pages/TopicDetail').then((m) => ({ default: m.TopicDetail })));
const CourseDetails = lazy(() => import('./pages/CourseDetails').then((m) => ({ default: m.CourseDetails })));
const APPhysicsSelector = lazy(() => import('./pages/APPhysicsSelector').then((m) => ({ default: m.APPhysicsSelector })));
const MotionSimulator = lazy(() => import('./pages/MotionSimulator').then((m) => ({ default: m.MotionSimulator })));
const Simulators = lazy(() => import('./pages/Simulators').then((m) => ({ default: m.Simulators })));
const GraphGenerator = lazy(() => import('./pages/GraphGenerator').then((m) => ({ default: m.GraphGenerator })));
const MockTest = lazy(() => import('./pages/MockTest').then((m) => ({ default: m.MockTest })));
const FRQPractice = lazy(() => import('./pages/FRQPractice').then((m) => ({ default: m.FRQPractice })));
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })));
const SpeedDrill = lazy(() => import('./pages/SpeedDrill').then((m) => ({ default: m.SpeedDrill })));
const IGCSECourse = lazy(() => import('./pages/IGCSECourse'));
const SATPhysics = lazy(() => import('./pages/SATPhysics'));
const IITJEEPhysics = lazy(() => import('./pages/IITJEEPhysics'));
const NEETPhysics = lazy(() => import('./pages/NEETPhysics'));
const APPhysicsMechanics = lazy(() => import('./pages/APPhysicsMechanics').then((m) => ({ default: m.APPhysicsMechanics })));
const APPhysicsEM = lazy(() => import('./pages/APPhysicsEM').then((m) => ({ default: m.APPhysicsEM })));
const APPhysics2 = lazy(() => import('./pages/APPhysics2').then((m) => ({ default: m.APPhysics2 })));
const FoundationCourse = lazy(() => import('./pages/FoundationCourse').then((m) => ({ default: m.FoundationCourse })));
const MathsFoundationCourse = lazy(() => import('./pages/MathsFoundationCourse').then((m) => ({ default: m.MathsFoundationCourse })));
const ChemistryFoundationCourse = lazy(() => import('./pages/ChemistryFoundationCourse').then((m) => ({ default: m.ChemistryFoundationCourse })));
const QuantumPhysicsCourse = lazy(() => import('./pages/QuantumPhysicsCourse').then((m) => ({ default: m.QuantumPhysicsCourse })));
const FoundationSelection = lazy(() => import('./pages/FoundationSelection').then((m) => ({ default: m.FoundationSelection })));
const AdminGeneratePracticeBank = lazy(() => import('./pages/AdminGeneratePracticeBank').then((m) => ({ default: m.AdminGeneratePracticeBank })));
const MultiSyllabusDailyEngine = lazy(() => import('./pages/admin/MultiSyllabusDailyEngine').then((m) => ({ default: m.MultiSyllabusDailyEngine })));
const Demo = lazy(() => import('./pages/Demo').then((m) => ({ default: m.Demo })));
const DemoSuccess = lazy(() => import('./pages/DemoSuccess').then((m) => ({ default: m.DemoSuccess })));
const Webinar = lazy(() => import('./pages/Webinar').then((m) => ({ default: m.Webinar })));
const Courses = lazy(() => import('./pages/Courses').then((m) => ({ default: m.Courses })));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess').then((m) => ({ default: m.PaymentSuccess })));
const ApproveSubscription = lazy(() => import('./pages/ApproveSubscription').then((m) => ({ default: m.ApproveSubscription })));
const ApprovalPending = lazy(() => import('./pages/ApprovalPending').then((m) => ({ default: m.ApprovalPending })));
const FoundationDashboard = lazy(() => import('./pages/FoundationDashboard'));
const FoundationDailyPractice = lazy(() => import('./pages/FoundationDailyPractice').then((m) => ({ default: m.FoundationDailyPractice })));
const FoundationMotionSimulator = lazy(() => import('./pages/FoundationMotionSimulator').then((m) => ({ default: m.FoundationMotionSimulator })));
const FoundationGraphMastery = lazy(() => import('./pages/FoundationGraphMastery').then((m) => ({ default: m.FoundationGraphMastery })));
const FoundationMockTest = lazy(() => import('./pages/FoundationMockTest').then((m) => ({ default: m.FoundationMockTest })));
const FoundationAnalytics = lazy(() => import('./pages/FoundationAnalytics').then((m) => ({ default: m.FoundationAnalytics })));
const FoundationHomework = lazy(() => import('./pages/FoundationHomework').then((m) => ({ default: m.FoundationHomework })));
const FoundationDailyQuestions = lazy(() => import('./pages/FoundationDailyQuestions').then((m) => ({ default: m.FoundationDailyQuestions })));
const MultiSyllabusDailyPractice = lazy(() => import('./pages/MultiSyllabusDailyPractice').then((m) => ({ default: m.MultiSyllabusDailyPractice })));
const Chatbot = lazy(() => import('./components/Chatbot').then((m) => ({ default: m.Chatbot })));
const FloatingRAGWidget = lazy(() => import('./components/AITutor/FloatingRAGWidget').then((m) => ({ default: m.FloatingRAGWidget })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<SrikanthLanding />} />
          <Route path="/old-landing" element={<Landing />} />
          <Route path="/course/foundation" element={<FoundationCourse />} />
          <Route path="/course/maths-foundation" element={<MathsFoundationCourse />} />
          <Route path="/course/chemistry-foundation" element={<ChemistryFoundationCourse />} />
          <Route path="/course/quantum" element={<QuantumPhysicsCourse />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/course/ap-physics-2" element={<APPhysics2 />} />
          <Route path="/course/ap-physics-mechanics" element={<APPhysicsMechanics />} />
          <Route path="/course/ap-physics-em" element={<APPhysicsEM />} />
          <Route path="/course/igcse" element={<IGCSECourse />} />
          <Route path="/course/sat" element={<SATPhysics />} />
          <Route path="/course/iit-jee" element={<IITJEEPhysics />} />
          <Route path="/course/neet" element={<NEETPhysics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post-signin" element={<PostSignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/approval-pending" element={<ApprovalPending />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/foundation" element={<FoundationSelection />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/demo/success" element={<DemoSuccess />} />
          <Route path="/webinar" element={<Webinar />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/approve-subscription" element={<ApproveSubscription />} />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route path="/igcse" element={<Navigate to="/course/igcse" replace />} />
          <Route path="/sat" element={<Navigate to="/course/sat" replace />} />
          <Route path="/iit-jee" element={<Navigate to="/course/iit-jee" replace />} />
          <Route path="/neet" element={<Navigate to="/course/neet" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard"
            element={
              <ProtectedRoute>
                <FoundationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/practice"
            element={
              <ProtectedRoute>
                <FoundationDailyPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-practice"
            element={
              <ProtectedRoute>
                <MultiSyllabusDailyPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/daily-questions"
            element={
              <ProtectedRoute>
                <FoundationDailyQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/simulator"
            element={
              <ProtectedRoute>
                <FoundationMotionSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/graph-mastery"
            element={
              <ProtectedRoute>
                <FoundationGraphMastery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/mock-test"
            element={
              <ProtectedRoute>
                <FoundationMockTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/homework"
            element={
              <ProtectedRoute>
                <FoundationHomework />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foundation-dashboard/analytics"
            element={
              <ProtectedRoute>
                <FoundationAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Layout>
                  <Quiz />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Layout>
                  <Progress />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Layout>
                  <Schedule />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Layout>
                  <Achievements />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ap-physics-courses"
            element={
              <ProtectedRoute>
                <APPhysicsSelector />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ap-physics"
            element={
              <ProtectedRoute>
                <TopicSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ap-physics/topic/:topicId"
            element={
              <ProtectedRoute>
                <TopicDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/motion-simulator"
            element={
              <ProtectedRoute>
                <MotionSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulators"
            element={
              <ProtectedRoute>
                <Simulators />
              </ProtectedRoute>
            }
          />
          <Route
            path="/graph-generator"
            element={
              <ProtectedRoute>
                <GraphGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mock-test"
            element={
              <ProtectedRoute>
                <MockTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/frq-practice"
            element={
              <ProtectedRoute>
                <FRQPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/speed-drill"
            element={
              <ProtectedRoute>
                <SpeedDrill />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/generate-practice-bank"
            element={
              <ProtectedRoute>
                <AdminGeneratePracticeBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/daily-question-engine"
            element={
              <ProtectedRoute>
                <MultiSyllabusDailyEngine />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        <FloatingRAGWidget />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
