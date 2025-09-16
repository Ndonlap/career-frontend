import { useState } from "react";
import "./App.css";
import Signup from "./views/components/authViews/Signup";
import Homepage from "./views/components/Homepage/Homepage";
import Login from "./views/components/authViews/Login";
import StudLanding from "./views/components/StudView/StudLanding";
import AdminDashboard from "./views/components/Dashboard/toDetele/AdminDashboard";
import BookCounselor from "./views/components/StudView/BookCounselor";

// Import the new layout and separated components
import StudentDashboardLayout from "./views/components/StudView/StudentDashboardLayout";
import StudentDashboardHomePage from "./views/components/StudView/StudentDashboardHomePage"; // For the index route of student dashboard
import UploadReportCard from "./views/components/StudView/UploadReportCard"; // Now used as a direct route component
import AssessmentPage from "./views/components/StudView/AssessmentPage"; // Lists available assessments
import AptitudeTestPage from "./views/components/StudView/AptitudeTestPage"; // For taking a specific assessment
import AptitudeTestResult from "./views/components/StudView/AptitudeTestResult"; // For displaying assessment results
import RecommendationPage from "./views/components/StudView/RecommendationPage";
import ConversationPage from "./views/components/StudView/ConversationPage"; // New
import StudentSetting from "./views/components/StudView/StudentSetting";     // New

import CounselorDashboard from "./views/components/CounselorView/CounselorDashboard";
import Services from "./views/components/Homepage/Services";
import Resources from "./views/components/Homepage/Resources";
import FAQPage from "./utils/components/other components/FAQPage";
import Footer from "./utils/components/other components/Footer";

import AdminDashboardLayout from "./views/components/Dashboard/AdminDashboardLayout";
import AdminDashboardHomePage from "./views/components/Dashboard/AdminDashboardHomePage";
import AccountManagement from "./views/components/Dashboard/AccountManagement";
import AcademicRecordManagement from "./views/components/Dashboard/AcademicRecordManagement";
import AssessmentsManagement from "./views/components/Dashboard/AssessmentsManagement";
import SkillManagement from "./views/components/Dashboard/toDetele/SkillManagement";
import CourseManagement from "./views/components/Dashboard/toDetele/CourseManagement";
import AdminConversationPage from "./views/components/Dashboard/AdminConversationPage";
import AdminSetting from "./views/components/Dashboard/AdminSetting";


import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet
} from 'react-router-dom'
import CounselorDashboardLayout from "./views/components/CounselorView/CounselorDashboardLayout";
import CounselorDashboardHomePage from "./views/components/CounselorView/CounselorDashboardHomePage";
import StudentManagement from "./views/components/CounselorView/StudentManagement";
import CounselorRecommendationsPage from "./views/components/CounselorView/CounselorRecommendationsPage";
import CounselorAppointmentsPage from "./views/components/CounselorView/CounselorAppointmentsPage";
import CounselorConversationPage from "./views/components/CounselorView/CounselorConversationPage";
import CounselorSetting from "./views/components/CounselorView/CounselorSetting";
import ContentManagement from "./views/components/Dashboard/ContentManagement";


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Outlet />}>
        <Route index element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Top-level StudLanding, if still used outside StudentDashboardLayout */}
        <Route path="/studLanding" element={<StudLanding />} />

        {/* Nested Routes for Student Dashboard */}
        {/* StudentDashboardLayout will provide the common sidebar and header */}
        <Route path="/StudentDashboard" element={<StudentDashboardLayout />}>
          <Route index element={<StudLanding />} />
          <Route path="upload-records" element={<UploadReportCard />} />
          <Route path="assessments" element={<Outlet />} > {/* Nested route for assessments */}
            <Route index element={<AssessmentPage />} /> {/* Lists available assessments */}
            <Route path=":assessmentId/start" element={<AptitudeTestPage />} /> {/* Route for taking an assessment */}
            <Route path=":assessmentId/result" element={<AptitudeTestResult />} /> {/* Route for displaying results */}
          </Route>

          <Route path="recommendations" element={<RecommendationPage />} />
          <Route path="conversation" element={<ConversationPage />} />
          <Route path="settings" element={<StudentSetting />} />
          <Route path="Bookcounselor" element={<BookCounselor />} />
        </Route>

        {/* Nested Routes for Counselor Dashboard */}
        <Route path="/CounselorDashboard" element={<CounselorDashboardLayout />}>
          {/* <Route index element={<CounselorDashboardHomePage />} /> */}
          <Route path="Student-Management" element={<StudentManagement />} />
          <Route path="recommendations" element={<CounselorRecommendationsPage />} />
          <Route path="appointment" element={<CounselorAppointmentsPage />} />
          <Route path="conversation" element={<CounselorConversationPage />} />
          <Route path="settings" element={<CounselorSetting />} />
          {/* If you have specific routes for viewing student details or reports from a counselor's perspective: */}
          {/* <Route path="Student-Management/:studentId" element={<CounselorStudentDetailPage />} /> */}
        </Route>

        {/* Nested Routes for Admin Dashboard (NEW) */}
        <Route path="/AdminDashboard" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboardHomePage />} />
          <Route path="account" element={<AccountManagement />} />
          <Route path="academic-record" element={<AcademicRecordManagement />} />
          <Route path="assessments" element={<AssessmentsManagement />} />
          <Route path="content" element={<ContentManagement />} />
          {/* <Route path="course" element={<CourseManagement />} /> */}
          <Route path="conversation" element={<AdminConversationPage />} />
          <Route path="settings" element={<AdminSetting />} />
        </Route>

        <Route path="/Services" element={<Services />} />
        <Route path="/Resources" element={<Resources />} />
        <Route path="/FAQPage" element={<FAQPage />} />
        <Route path="/Footer" element={<Footer />} />
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  );
}

export default App;