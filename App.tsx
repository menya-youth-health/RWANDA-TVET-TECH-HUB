
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';

import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminDepartments from './pages/AdminDepartments';
import AdminGlossary from './pages/AdminGlossary';
import AdminCourseContent from './pages/AdminCourseContent';

import Home from './pages/Home';
import Departments from './pages/Departments';
import DepartmentDetail from './pages/DepartmentDetail';
import Glossary from './pages/Glossary';
import Register from './pages/Register';
import Course from './pages/Course';
import CourseList from './pages/CourseList';
import PublishedCourse from './pages/PublishedCourse';

import Login from './pages/Login';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';

import LabList from './pages/LabList';
import LabPlay from './pages/LabPlay';

import Progress from './pages/Progress';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* PUBLIC PAGES */}
        <Route path="/" element={<Home />} />

        <Route path="/departments" element={<Departments />} />
        <Route
          path="/departments/:deptId"
          element={<DepartmentDetail />}
        />

        <Route path="/glossary" element={<Glossary />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/lab" element={<LabList />} />
        <Route path="/lab/:scenarioId" element={<LabPlay />} />

        <Route path="/about" element={<About />} />

        {/* STUDENT PAGES - LOGIN REQUIRED */}
        <Route element={<StudentRoute />}>
          <Route path="/course" element={<CourseList />} />

          <Route path="/course/:courseId" element={<Course />} />

          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={<Lesson />}
          />

          <Route
            path="/course/:courseId/quiz"
            element={<Quiz />}
          />

          <Route
            path="/published-course/:courseId"
            element={<PublishedCourse />}
          />

          <Route path="/progress" element={<Progress />} />
        </Route>

        {/* ADMINISTRATOR PAGES - ADMIN ONLY */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/admin/courses"
            element={<AdminCourses />}
          />

          <Route
            path="/admin/course-content"
            element={<AdminCourseContent />}
          />

          <Route
            path="/admin/departments"
            element={<AdminDepartments />}
          />

          <Route
            path="/admin/glossary"
            element={<AdminGlossary />}
          />
        </Route>

        {/* PAGE NOT FOUND */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
} 
