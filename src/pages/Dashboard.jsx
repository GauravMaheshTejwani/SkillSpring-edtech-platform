import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

function Dashboard() {

    const {loading: authLoading} = useSelector((state)=>state.auth);
    const {loading: profileLoading} = useSelector((state)=>state.profile);

    if(profileLoading || authLoading){
        return (
            <div className='mt-10'>
                Loading...
            </div>
        )
    }

  return (
    <div className=' relative flex bg-gray-400 '>
        <Sidebar/>
        <div className=' flex-11/12 overflow-auto bg-gray-900'>
            <div className=' py-10'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard