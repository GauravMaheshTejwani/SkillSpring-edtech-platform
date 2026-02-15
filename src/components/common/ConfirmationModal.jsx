import React from 'react'
import IconBtn from './IconBtn'

function ConfirmationModal({modalData}) {
  return (
    <div>
        <div className=' w-11/12 max-w-[350px] rounded-lg border
                    border-gray-400 bg-gray-800 p-6 z-50 fixed 
                    left-[50%] top-[50%] -translate-x-1/2 -translate-0-y-1/2'>
            <p className=' text-2xl font-semibold text-gray-50'>
                {modalData.text1}
            </p>
            <p className=' mt-3 mb-5 leading-6 text-gray-400'>
                {modalData.text2}
            </p>
            <div className=' flex items-center gap-x-4'>
                <IconBtn
                    onclick={modalData?.btn1Handler}
                    text={modalData?.btn1Text}
                />
                <button className=' flex items-center bg-gray-200 cursor-pointer 
                                    gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 
                                    md:px-5 font-semibold text-gray-900'
                        onClick={modalData?.btn2Handler}>
                    {modalData?.btn2Text}
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationModal