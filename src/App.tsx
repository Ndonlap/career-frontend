import { useState } from "react";
import "./App.css";
import Signup from "./views/components/authViews/Signup";
import Homepage from "./views/components/Homepage/Homepage";
import Login from "./views/components/authViews/Login";
import StudLanding from "./views/components/StudView/StudLanding";
import AdminDashboard from "./views/components/Dashboard/AdminDashboard";
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

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet
} from 'react-router-dom'


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
          {/* <Route index element={<StudentDashboardHomePage />} /> */}
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
        
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/CounselorDashboard" element={<CounselorDashboard />} />
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