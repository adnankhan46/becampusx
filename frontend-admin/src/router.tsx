import {
    createBrowserRouter,
  } from "react-router";
import Login from "./pages/Login";  
import Home from "./pages/Home";
import Client from "./pages/Client/Client";
import Provider from "./pages/Provider/Provider";
import ClientLayout from "./pages/Client/ClientLayout";
import ProviderLayout from "./pages/Provider/ProviderLayout";
import Comment from "./pages/Client/Comment";
import Post from "./pages/Client/Post";
import User from "./pages/Client/User";
import Applicant from "./pages/Provider/Applicant";
import Opportunity from "./pages/Provider/Opportunity";
import Payment from "./pages/Provider/Payment";
import { Button } from "./components/ui/button";
const router = createBrowserRouter( [
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "*",
      element: <div>This route does not exist for now <Button onClick={()=>{router.navigate('/')}}>Go to Home</Button></div>,
    },
    {
      path: "/Client/Dashboard", // base
      element: <ClientLayout/>,
      children: [
        {
           path: "a",
           element: <Client/>,  // element 1
        },
         {
           path: "b",
           element: <Comment/>,  // element 1
        },
         {
           path: "c",
           element: <Post/>,  // element 1
        },
         {
           path: "d",
           element: <User/>,  // element 1
        }
        
        
        
      ]
    },
     {
      path: "/Provider/Dashboard",        // base
      element: <ProviderLayout/>,
      children: [
        {
           path: "a",
           element: <Provider/>,  // element 1
        },
         {
           path: "b",
           element: <Opportunity/>,  // element 1
        },
         {
           path: "c",
           element: <Payment/>,  // element 1
        },
         {
           path: "d",
           element: <Applicant />,  // element 1
        },
        {
           path: "e",
           element: <Provider />,  // element 1
        },        
      ]
    },
    
    
  ]);
  
export default router;