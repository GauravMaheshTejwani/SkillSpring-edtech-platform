import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"
const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo: Logo2,
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo: Logo3,
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo: Logo4,
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
];

const TimelineSection = () => {
  return (
    <div>
        <div className='flex gap-15 items-center'>
            <div className='flex flex-col w-[45%] gap-10'>
                {
                    timeline.map((element, index) => {
                        return (
                            <div className='flex gap-6' key={index}>
                                <div className='w-[50px] h-[50px] bg-white flex items-center justify-center'>
                                    <img src={element.Logo}></img>
                                </div>
                                <div className='flex flex-col'>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='relative shadow-blue-200'>
                <img src={timelineImage} alt='timeLineImage' 
                className='shadow-white object-cover h-fit'></img>

                <div className='absolute bg-green-950 flex text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <div className='flex gap-5 items-center border-r border-green-200 px-7'>
                        <p className='text-3xl font-bold ml-2'>10</p>
                        <p className='text-green-200 text-sm mr-2'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold ml-2'>250</p>
                        <p className='text-green-200 text-sm mr-2'>Type of Courses</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default TimelineSection