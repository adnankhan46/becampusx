import {BrowserRouter, Routes, Route} from "react-router-dom"
import Front from "./pages/Front";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CampusAi from "./pages/CampusAi";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import AddPost from "./pages/AddPost";
import PostPage from "./pages/PostPage";
import ReportPage from "./pages/ReportPage";
import Notification from "./pages/Notification";
import ErrorPage from "./pages/ErrorPage";
import Explore from "./pages/Explore";
import UserPage from "./pages/UserPage";
// import Comment from "./components/Comment";



function App() {
  return (
    <>

   <BrowserRouter>
   <Routes>
   <Route path='/' element={<Front/>}/>
   <Route path='/signup' element={<Signup/>}/>
   <Route path='/login' element={<Login/>}/>
   <Route path='/campusai' element={<CampusAi/>}/>
   
   
   {/** Will be Private */}
   <Route element={<PrivateRoute/>}>
   <Route path='/profile' element={<Profile/>}/>
   <Route path='/upload' element={<AddPost/>}/>
   <Route path='/post/:postId' element={<PostPage/>}/>
   <Route path='/notification' element={<Notification/>}/>
   <Route path='/user' element={<UserPage/>}/>
   </Route>
   <Route path='/home' element={<Home/>}/>
   <Route path='/explore' element={<Explore/>}/>
   
   <Route path='/report' element={<ReportPage/>}/>

   <Route path='*' element={<ErrorPage/>}/>
   </Routes>
   </BrowserRouter>
    </>
  )
}

export default App
