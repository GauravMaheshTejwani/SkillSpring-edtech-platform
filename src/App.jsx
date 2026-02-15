import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/common/Navbar';
import { useState } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Dashboard from './pages/Dashboard';
import MyProfile from './components/core/Dashboard/MyProfile';
import Setting from './components/core/Dashboard/Setting';
import Cart from './components/core/Dashboard/Cart';
import AdminPanel from './components/core/Dashboard/AdminPanel';
import AddCourse from './components/core/Dashboard/AddCourse';
import MyCourses from './components/core/Dashboard/MyCourses/MyCourses';
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import PurchaseHistory from './components/core/Dashboard/PurchaseHistory';
import SearchCourse from './pages/SearchCourse';
import ContactUs from './pages/ContactUs';
import About from './pages/About';
import FormgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';
import { useSelector } from 'react-redux';
import OpenRoute from './components/core/Auth/OpenRoute';
import { ACCOUNT_TYPE } from './utils/constants';

function App() {

  const [isLoggedIn, setIsloggedIn] = useState(false);
  console.log("isLoggedIn",isLoggedIn);

  const user = useSelector((state)=> state.profile.user);

  return (
    <div className='w-screen min-h-screen bg-gray-900 flex flex-col font-inter'>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>

        <Route path='/catalog/:catalog' element={<Catalog/>}></Route>

        <Route path='/login' element={
          <OpenRoute>
            <Login setIsloggedIn={setIsloggedIn}/>
          </OpenRoute>
        }/>

        <Route path='/signup' element={
          <OpenRoute>
            <SignUp setIsloggedIn={setIsloggedIn}/>
          </OpenRoute>
        }/>

        {/* <Route path="/login" element={<Login setIsloggedIn={setIsloggedIn}></Login>}></Route>
        <Route path="/signup" element={<SignUp setIsloggedIn={setIsloggedIn}></SignUp>}></Route> */}

        <Route path='/forgot-password' element={<FormgotPassword/>}/>
        <Route path='/update-password/:id' element={<ResetPassword/>}/>
        <Route path='/verify-email' element={<VerifyOtp/>}/>

        <Route path='/contact' element={<ContactUs/>}/>
        <Route path='/about' element={<About/>}/>
        
        <Route path="/courses/:courseId" element={<CourseDetails />} />
      
        <Route path='/search/:searchQuery' element={<SearchCourse/>}/>

        
        <Route element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>

          <Route path='/dashboard/my-profile' element={<MyProfile/>}/>
          <Route path='/dashboard/settings' element={<Setting/>}/>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path='/dashboard/cart' element={<Cart/>}></Route>
                <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
                <Route path='/dashboard/purchase-history' element={<PurchaseHistory/>}/>
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path='/dashboard/add-course' element={<AddCourse/>}></Route>
                <Route path='/dashboard/my-course' element={<MyCourses/>}/>
                <Route path='/dashboard/edit-course/:courseId' element={<EditCourse/>}/>
                <Route path='/dashboard/instructor' element={<Instructor/>}/>
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path='/dashboard/admin-panel' element={<AdminPanel/>}/>
              </>
            )
          }

        </Route>

        <Route element={
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route 
                  path='/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
                  element={<VideoDetails/>}
                ></Route>
              </>
            )
          }

        </Route>


        {/* <Route 
          path='/view-course/:courseId/section/:sectionId/sub-section/:subSectionId'
          element={<VideoDetails/>}
        ></Route> */}

        {/* <Route path='/dashboard/instructor' element={<Instructor/>}></Route>
        
        <Route path='/dashboard/my-profile' element={<MyProfile/>}/>
        <Route path='/dashboard/settings' element={<Setting/>}/>
        

        <Route path='dashboard' element={<Dashboard/>}></Route>
        
        <Route path='/dashboard/cart' element={<Cart/>}></Route>
        <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>}/>
        <Route path='/dashboard/purchase-history' element={<PurchaseHistory/>}/>
        <Route path='/dashboard/admin-panel' element={<AdminPanel/>}/>


        <Route path='/dashboard/add-course' element={<AddCourse/>}></Route>
        <Route path='/dashboard/my-course' element={<MyCourses/>}/>
        <Route path='/dashboard/edit-course/:courseId' element={<EditCourse/>}/> */}

        

        
      </Routes>
    </div>
  )
}

export default App;
