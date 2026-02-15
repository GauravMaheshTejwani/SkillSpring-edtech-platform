import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RequirementField = ({name, label, register, errors, setValue}) => {

    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([])
    const { editCourse, course } = useSelector((state)=> state.course);

    useEffect(()=>{
        register(name, {required: true})
    },[])

    useEffect(()=>{
        setValue(name, requirementList);
        if(editCourse){
            setRequirementList(course?.instructions);
            setValue(name, course?.instructions);
        }
    },[requirementList])

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList, requirement]);
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    }

  return (
    <div>
        <label className=' text-sm text-gray-50' htmlFor={name} >{label} <sup className=' text-pink-500'>*</sup></label>
        <div>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e)=>setRequirement(e.target.value)}
                className=' form-style w-full'
            />
            <button
            type='button'
            onClick={handleAddRequirement}
            className=' font-semibold text-yellow-400 mt-3'
            >
                Add
            </button>
        </div>

        {
            requirementList.length > 0 && (
                <ul className=' mt-2 list-inside list-disc'>
                    {
                        requirementList.map((requirement, index)=>{
                            <li key={index} className=' flex items-center text-gray-50'>
                                <span>{requirement}</span>
                                <button
                                type='button'
                                onClick={()=>handleRemoveRequirement(index)}
                                className=' ml-2 text-xs text-gray-400'
                                >
                                    Clear
                                </button>
                            </li>
                        })
                    }
                </ul>
            )
        }
        {
            errors[name] && (
                <span className='ml-2 text-xs tracking-wide text-pink-500'>
                    {label} is required
                </span>
            )
        }
    </div>
  )
}

export default RequirementField