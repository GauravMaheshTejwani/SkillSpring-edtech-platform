import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { GiNinjaStar } from "react-icons/gi"
import { removeFromCart } from "../../../../slices/cartSlice";
import { RiDeleteBin6Line } from "react-icons/ri"

function RenderCartCourses() {

    const {cart} = useSelector((state)=>state.cart);
    const dispatch = useDispatch();

  return (
    <div className='flex flex-1 flex-col'>
        {
            cart.map((course, index) => (
                <div key={index} className='flex w-full flex-wrap items-start justify-between gap-6 border-b border-b-gray-400 pb-6 false pt-6'>

                    <div className='flex flex-1 flex-col gap-4 xl:flex-row'>

                        <Link to={`/courses/${course._id}`}>
                            <img 
                            className='md:h-[148px] md:w-[220px] h-[100px] w-[180px] rounded-lg object-cover'
                            src={course?.thumbnail}/>
                        </Link>

                        <div className='flex flex-col space-y-1'>

                            <Link to={`/course/${course._id}`}>
                                <p className='text-lg font-semibold text-gray-50 poppins'>{course?.courseName}</p>
                            </Link>

                            <Link to={`/catalog/${course?.category?.name}`}>
                                <p className='text-sm text-gray-400'>{course?.category?.name}</p>
                            </Link>

                            <div className='flex items-center gap-2'>
                                <span className=" text-yellow-300"></span>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<GiNinjaStar/>}
                                    fullIcon={<GiNinjaStar/>}
                                />
                                <span className='text-gray-500'>{course?.ratingAndReviews?.length} Ratings</span>
                            </div>

                        </div>

                    </div>


                    <div className='flex flex-col items-end  space-y-2 crimson'>
                        <p className='mb-6 text-2xl md:text-3xl font-medium text-yellow-400'>₹ {course?.price}</p>
                        <button
                        className='flex items-center gap-x-1 rounded-md border border-gray-600 bg-gray-700 py-2 px-[8px] text-pink-400 text-lg font-medium'
                        onClick={()=> dispatch(removeFromCart(course._id))}
                        >
                            <RiDeleteBin6Line/>
                            <span></span>
                        </button>
                    </div>

                </div>
            ))
        }
    </div>
  );
}

export default RenderCartCourses;
