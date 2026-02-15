import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex gap-20 items-center'>
            <div className='w-[50%] items-end'>
                <img
                    src={Instructor}
                    alt='Instructor'
                    className='shadow-white w-full'
                ></img>
            </div>

            <div className='w-[50%] flex flex-col gap-10'>
                <div className='text-4xl font-semibold w-[40%]'>
                    Become an
                    <HighlightText text={"Instructor"}/>
                </div>
                <p className=' font-medium text-[16px] w-[90%] text-gray-400'>
                    Instructors from around the world teach millions of students on SkillSpring. 
                    We provide the tools and skills to teach what you love.
                </p>

                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex gap-2 items-center text-white'>
                        Start Learning Today
                        <FaArrowRight/> 
                    </div>
                </CTAButton>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InstructorSection