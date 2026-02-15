import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { formatDate } from '../../../../utils/formatDate';
import { COURSE_STATUS } from '../../../../utils/constants';
import { HiClock } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ConfirmationModal from '../../../common/ConfirmationModal';

const CourseTable = ({courses, setCourses}) => {

    const navigate = useNavigate();
    const {token} = useSelector((state)=> state.auth);
    const [loading, setLoading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const TRUNCATE_LENGTH = 30;

    const handleDeleteCourse  = async(courseId)=> {
        setLoading(true);
        await deleteCourse({courseId:courseId}, token);
        const result = await fetchInstructorCourses(token);
        if(result){
            setCourses(result);
        }
        setConfirmationModal(null)
        setLoading(false);
    }

    if(loading){
        return <div className='custom-loader'></div>
    }

  return (
    <>
        <Table className="rounded-xl border border-gray-800 ">
            <Thead>
                <Tr className="flex gap-x-10 rounded-t-md border-b border-b-gray-800 px-6 py-2 text-gray-400">
                    <Th className="flex-1 text-left text-sm font-medium uppercase text-gray-300">
                        Courses
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-gray-300">
                        Price
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-gray-300">
                        Actions
                    </Th>
                </Tr>
            </Thead>

            <Tbody>
                {courses?.length === 0 ? (
                    <Tr>
                        <Td className="py-10 text-center text-2xl font-medium text-gray-400">
                            No Courses Found
                        </Td>
                    </Tr>
                ):(
                    courses?.map((course) => (
                        <Tr
                        key={course?._id}
                        className="flex gap-x-10 border-b border-gray-800 px-6 py-8 gap-4"
                        >
                            <Td colSpan={1}  className="flex flex-1 gap-x-4 p-3">
                                <img
                                    src={course?.thumbnail}
                                    alt={course?.courseName}
                                    className="md:h-[148px] md:w-[220px] aspect-video rounded-lg object-cover"
                                />
                                <div className="flex flex-col gap-1 justify-between">
                                    <p className="text-lg font-semibold text-gray-50 mt-3">
                                        {course.courseName}
                                    </p>

                                    <p className="text-xs text-gray-300">
                                        {course.courseDescription.split(" ")?.length >  TRUNCATE_LENGTH 
                                        ? course.courseDescription.split(" ").slice(0, TRUNCATE_LENGTH).join(" ") + "..."
                                        : course.courseDescription }
                                    </p>

                                    <p className="text-[12px] text-white">
                                        Created: {formatDate(course?.createdAt || course?.updatedAt)}
                                    </p>

                                    {course?.status === COURSE_STATUS.DRAFT ? (
                                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-gray-700 px-2 py-[2px] text-[12px] font-medium text-pink-500">
                                            <HiClock size={14}/>
                                            Drafted
                                        </p>
                                    ) : (
                                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-gray-700 px-2 py-[2px] text-[12px] font-medium text-yellow-400">
                                            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-400 text-gray-700">
                                                <FaCheck size={8}/>
                                            </div>
                                            Published
                                        </p>
                                    )}
                                </div>
                            </Td>

                            <Td className="text-sm font-medium text-gray-400 mb-5">
                                ₹{course.price}
                            </Td>

                            <Td className="text-sm font-medium text-gray-400 mb-5">
                                <button
                                disabled={loading}
                                onClick={()=>navigate(`/dashboard/edit-course/${course._id}`)}
                                title='Edit'
                                className="px-2 transition-all duration-200 hover:scale-110 hover:text-green-500"
                                >
                                    <FiEdit size={20}/>
                                </button>

                                <button
                                disabled={loading}
                                onClick={()=>{
                                    setConfirmationModal({
                                        text1: "Are you sure, you want to delete the course ?",
                                        text2: "All the data related to this course will be deleted",
                                        btn1Text : !loading ? "Delete" : "Loading...",
                                        btn2Text : "Cancel",
                                        btn1Handler : !loading
                                        ? () => handleDeleteCourse(course._id)
                                        : () => {},
                                        btn2Handler : !loading
                                        ? () => setConfirmationModal(null)
                                        : () => {},
                                    })
                                }}
                                title='Delete'
                                className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                                >
                                    <RiDeleteBin6Line size={20}/>
                                </button>
                            </Td>
                        </Tr>
                    ))
                )}
            </Tbody>
        </Table>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default CourseTable