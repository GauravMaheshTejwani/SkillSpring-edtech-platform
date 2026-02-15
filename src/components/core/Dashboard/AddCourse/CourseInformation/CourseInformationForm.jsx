import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { setStep, setCourse, setEditCourse} from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import  IconBtn  from "../../../../common/IconBtn";
import ChipInput from './ChipInput';
import RequirementField from './RequirementField';
import Upload from './Upload';

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors},
    } = useForm();

    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.auth);
    const {course, editCourse} = useSelector((state)=>state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(()=>{
        const getCategories = async () => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length > 0){
                setCourseCategories(categories);
            }
            setLoading(false);
        }
        getCategories();

        if(editCourse){
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatYouWillLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail);
        }

    },[])

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseImage !== course.thumbnail ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() )
            return true;
        else
            return false;
    }

    const onSubmit = async (data) => {

        if(editCourse){

            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId", course._id);

                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName", data.courseTitle);
                }

                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc);
                }

                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice);
                }

                if(currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits);
                }

                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory);
                }

                if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements));
                }

                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if(result){
                    dispatch(setCourse(result));
                    dispatch(setStep(2));
                    dispatch(setEditCourse(false));
                }
                
            }
            else {
                toast.error("No changes made so far");
            }
            return;
        }

        //create new course
        const formData = new FormData();
        formData.append("courseName", data.courseTitle);
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("whatYouWillLearn", data.courseBenefits);
        formData.append("category", data.courseCategory);
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("status", COURSE_STATUS.DRAFT);
        formData.append("tag", JSON.stringify(data.courseTags));
        formData.append("thumbnailImage", data.courseImage);

        setLoading(true);
        const result = await addCourseDetails(formData, token);
        if(result){
            dispatch(setStep(2));
            dispatch(setCourse(result));
        }
        setLoading(false);
    }

  return (
    <div>
        <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-8 rounded-md border-[1px] border-gray-700 bg-gray-800 p-6'
        >
            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-gray-50' htmlFor='courseTitle'>Course Title<sup className=' text-pink-500'>*</sup></label>
                <input
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle", {required:true})}
                className=' form-style w-full'
                ></input>
                {
                    errors.courseTitle && (
                        <span className=' ml-2 text-xs tracking-wide text-pink-500'>Course Title is Required**</span>
                    )
                }
            </div>

            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-gray-50' htmlFor='courseShortDesc'>Course Short Description<sup className=' text-pink-500'>*</sup></label>
                <input
                id='courseShortDesc'
                placeholder='Enter Course Description'
                {...register("courseShortDesc", {required:true})}
                className=' form-style resize-x-none min-h-[130px] w-full'
                ></input>
                {
                    errors.courseShortDesc && (
                        <span className=' ml-2 text-xs tracking-wide text-pink-500'>Course Description is Required**</span>
                    )
                }
            </div>

            <div className='relative flex flex-col space-y-2'>
                <label className='text-sm text-gray-50' htmlFor='coursePrice'>Course Price<sup className='text-pink-200'>*</sup></label>
                <input
                    id='coursePrice'
                    placeholder='Enter Course Price'
                    {...register("coursePrice", {
                        required:true,
                        valueAsNumber:true
                    })}
                    className='form-style w-full !pl-12'
                />
                <HiOutlineCurrencyRupee size={30}  className='absolute top-7 text-gray-400'/>
                {
                    errors.coursePrice && (
                        <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Price is Required**</span>
                    )
                }
            </div>

            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-gray-50' htmlFor='courseCategory'>Course Category <sup className=' text-pink-500'>*</sup></label>
                <select 
                disabled={editCourse} 
                className='form-style w-full'
                id='courseCategory'
                defaultValue=""
                {...register("courseCategory", {required:true})}
                >
                    <option>Choose a Category</option>

                    {
                        !loading && courseCategories.map((category, index)=> (
                            <option key={index} value={category?.id}>
                                {category?.name}
                            </option>
                        ))
                    }
                </select>
                {errors.courseCategory && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>
                        Course Category is Required
                    </span>
                )}
            </div>

            <ChipInput
                label="Tags"
                name="courseTags"
                placeholder="Enter tags and press enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues = {getValues}
            />

            <Upload
                name={"courseImage"}
                label={"CourseImage"}
                register={register}
                errors={errors}
                setValue={setValue}
            />

            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-gray-50'>Benefits of the course<sup className='text-pink-200'>*</sup></label>
                <textarea
                id='coursebenefits'
                placeholder='Enter Benefits of the course'
                {...register("courseBenefits", {required:true})}
                className='form-style resize-x-none min-h-[130px] w-full'
                />
                {errors.courseBenefits && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>
                        Benefits of the course are required**
                    </span>
                )}
            </div>

            <RequirementField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />

            <div>
                {
                    editCourse && (
                        <button
                        onClick={() => dispatch(setStep(2))}
                        >
                            Continue Without Saving
                        </button>
                    )
                }

                <IconBtn
                    type={"submit"}
                    text={!editCourse ? "Next" : "Save Changes"}
                />
            </div>

        </form>
    </div>
  )
}

export default CourseInformationForm