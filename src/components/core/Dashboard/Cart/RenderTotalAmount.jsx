import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';

function RenderTotalAmount() {

    const {total, cart} = useSelector((state) => state.cart);
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBuyCourses = () => {
        const courses = cart.map((course) => course._id);
        if(token){
            buyCourse(token, courses, user, navigate, dispatch);
        }
        else{
            navigate("/login");
        }
    }

  return (
    <div className='min-w-[280px] rounded-md border-[1px] border-gray-700 bg-gray-800 p-3 md:p-6 '>
        <p className='mb-1 text-sm font-medium text-gray-300'>Total : </p>
        <p className='mb-6 text-3xl font-medium text-yellow-400 crimson'>₹ {total}</p>

        <IconBtn
            text="Buy Now"
            onclick={handleBuyCourses}
            customClass={"flex items-center bg-yellow-200 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-gray-900 w-full justify-center"}
        />
    </div>
  )
}

export default RenderTotalAmount