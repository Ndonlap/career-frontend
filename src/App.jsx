import { useState } from "react";
import "./App.css";
import Signup from "./views/components/authViews/Signup";
import Homepage from "./views/components/Homepage/Homepage";
import Login from "./views/components/authViews/Login";
import DashboardLayout from "./views/components/Dashboard/DashboardLayout";
import DashboardPage from "./views/components/Dashboard/DashboardPage";
import ManageUsers from "./views/components/Dashboard/ManageUsers";
import ManageTontine from "./views/components/Dashboard/ManageTontine";
import Userdecision from "./views/components/memberView/Userdecision";
import Creationform from "./views/components/presidentView/Creationform";
import Joinform from "./views/components/memberView/Joinform";
import President from "./views/components/presidentView/President";
import Member from "./views/components/memberView/Member";
import { getTontineById } from "./apis/tontine";
import NotificationList from "./views/components/globalView/NotificationList";
// import userLanding  from "./views/components/globalView/UserLanding";
import Secretarypage from "./views/components/secretaryView/Secretarypage";
import Payouts from "./views/components/globalView/Payouts";
import MakeContribution from "./views/components/globalView/MakeContribution";
import TontineGroups from "./utils/components/other components/TontineGroups";
import TontineReport from "./views/components/secretaryView/TontineReport";

// import CheckboxWithTerms from "./pages/Login/CheckboxWithTerms";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet
} from 'react-router-dom'
// import { Route, BrowserRouter as Router, Routes,Outlet } from "react-router-dom";
import UserLanding from "./views/components/globalView/UserLanding";
import VerifyCode from "./views/components/authViews/VerifyCode";

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
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/Userdecision" element={<Userdecision />} />
        <Route path="/Creationform" element={<Creationform />} />
        <Route path="/Joinform" element={<Joinform />} />
        <Route path="/President" element={<President />} />
        <Route path="/NotificationList"
          element={<NotificationList />}
        />
        <Route
          path="/UserLanding"
          element={<UserLanding />}
        />
        <Route path="/Secretarypage" element={<Secretarypage />} />
        <Route path="/Payouts" element={<Payouts />} />
        <Route path="/MakeContribution" element={<MakeContribution />} />
        <Route path="/TontineGroups" element={<TontineGroups />}  />
        <Route path="/member/:id" element={<Member />} />
        <Route path="/TontineReport" element={<TontineReport />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-tontine" element={<ManageTontine />} />
        </Route>
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  

  );

}







export default App;
