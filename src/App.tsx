import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SrikanthLanding } from './pages/SrikanthLanding';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/Quiz';
import { Progress } from './pages/Progress';
import { Schedule } from './pages/Schedule';
import { Achievements } from './pages/Achievements';
import { TopicSelection } from './pages/TopicSelection';
import { TopicDetail } from './pages/TopicDetail';
import { CourseDetails } from './pages/CourseDetails';
import { APPhysicsSelector } from './pages/APPhysicsSelector';
import { MotionSimulator } from './pages/MotionSimulator';
import { GraphGenerator } from './pages/GraphGenerator';
import { MockTest } from './pages/MockTest';
import { FRQPractice } from './pages/FRQPractice';
import { Analytics } from './pages/Analytics';
import { SpeedDrill } from './pages/SpeedDrill';
import IGCSECourse from './pages/IGCSECourse';
import SATPhysics from './pages/SATPhysics';
import IITJEEPhysics from './pages/IITJEEPhysics';
import NEETPhysics from './pages/NEETPhysics';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SrikanthLanding />} />
        <Route path="/old-landing" element={<Landing />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/course/igcse" element={<IGCSECourse />} />
        <Route path="/course/sat" element={<SATPhysics />} />
        <Route path="/course/iit-jee" element={<IITJEEPhysics />} />
        <Route path="/course/neet" element={<NEETPhysics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Redirect routes for course shortcuts */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
