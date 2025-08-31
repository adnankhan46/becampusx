import {
    createBrowserRouter,
  } from "react-router";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import DashboardLayout from "./layouts/Dashboard.layout";
import CreateOpportunity from "./pages/CreateOpportunity";
import AllOpportunity from "./pages/AllOpportunity";
import AllApplications from "./pages/AllApplications";
import Payments from "./pages/Payments";
import Dashboard from "./pages/Dashboard";
import { Button } from "./components/ui/button";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>,
  },
    {
      path: "/Dashboard",
      element: <DashboardLayout/>,
      children: [
      {
        path: "",
        element: <Dashboard/>,
      },  
      {
        path: "createOpportunity",
        element: <CreateOpportunity/>,
      },  
      {
        path: "allOpportunities",
        element: <AllOpportunity/>,
      },  
      {
        path: "allApplicants/:oppId",
        element: <AllApplications/>,
      },  
      {
        path: "selectedApplicants",
        element: <div>Selected Applications</div>,
      },  
      {
        path: "payments",
        element: <Payments/>,
      },  
      {
        path: "notifications",
        element: <div>N Applications</div>,
      },  
      ]
    },
    
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/profile",
      element: <Profile/>,
    },
    {
      path: "*",
      element: <div>This route does not exist for now <Button onClick={()=>{router.navigate('/')}}>Go to Home</Button></div>,
    },
  ]);
  
export default router;