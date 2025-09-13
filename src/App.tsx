import { useState } from "react";
import "./App.css";
import Signup from "./views/components/authViews/Signup";
import Homepage from "./views/components/Homepage/Homepage";
import Login from "./views/components/authViews/Login";
import StudLanding  from "./views/components/StudView/StudLanding";
import AdminDashboard from "./views/components/Dashboard/AdminDashboard";
// import DashboardPage from "./views/components/Dashboard/DashboardPage";
// import ManageUsers from "./views/components/Dashboard/ManageUsers";
// import ManageTontine from "./views/components/Dashboard/ManageTontine";
import BookCounselor from "./views/components/StudView/BookCounselor";
import StudentDashboard from "./views/components/StudView/StudentDashboard";
// import Interest from "./views/components/StudView/Interest";
// import Recommendation from "./views/components/StudView/Recommendation";
// import ViewReport from "./views/components/StudView/ViewReport";
import CounselorDashboard from "./views/components/CounselorView/CounselorDashboard";
import Services from "./views/components/Homepage/Services";
import Resources from "./views/components/Homepage/Resources";
import FAQPage from "./utils/components/other components/FAQPage";
import Footer from "./utils/components/other components/Footer";
// import NotificationList from "./views/components/globalView/NotificationList";
// import Secretarypage from "./views/components/secretaryView/Secretarypage";
// import Payouts from "./views/components/globalView/Payouts";
// import MakeContribution from "./views/components/globalView/MakeContribution";
// import TontineGroups from "./utils/components/other components/TontineGroups";
// import TontineReport from "./views/components/secretaryView/TontineReport";

// import CheckboxWithTerms from "./pages/Login/CheckboxWithTerms";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet
} from 'react-router-dom'
// import StudLanding from "./views/components/StudView/StudLanding";
// import { Route, BrowserRouter as Router, Routes,Outlet } from "react-router-dom";
// import UserLanding from "./views/components/globalView/UserLanding";
// import VerifyCode from "./views/components/authViews/VerifyCode";

// import { PrimeReactProvider } from 'primereact/api';



function App() {
  //    function MyApp({ Component, pageProps }) {
  //     return (
  //         <PrimeReactProvider>
  //             <Component {...pageProps} />
  //         </PrimeReactProvider>
  //     );
  // }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Outlet />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
         <Route
          path="/studLanding"
          element={<StudLanding />}
        />
         <Route path="/Bookcounselor" element={<BookCounselor />} />
         <Route path="/StudentDashboard" element={<StudentDashboard />} />
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
