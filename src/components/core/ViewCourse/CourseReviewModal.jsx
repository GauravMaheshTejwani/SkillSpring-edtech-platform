import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
//import RatingStars from "react-rating-stars-component";
import {Rating} from "react-simple-star-rating"
import { createRating } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  });

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token,
    );

    setReviewModal(false);
  };

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
  };

  return (
    <div>
      <div className=' z-50 my-10 w-11/12 max-w-[700px] rounded-lg border border-gray-400 bg-gray-800 fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2'>
        {/* Modal Header */}
        <div className='flex items-center justify-between rounded-t-lg bg-gray-700 p-5'>
          <p className='text-xl font-semibold text-gray-50'>Add Reveiw</p>
          <button className=' text-xl text-gray-50' onClick={() => setReviewModal(false)}>Close</button>
        </div>

        {/* Modal Body */}
        <div className='p-5'>
          <div className='flex items-center justify-center gap-x-4'>
            <img
              src={user?.image}
              alt="user Image"
              className=" aspect-square w-[50px] rounded-full object-cover"
            />

            <div>
              <p className='font-semibold text-gray-50'>
                {user?.firstName} {user?.lastName}
              </p>
              <p className='text-sm text-gray-50'>Posting Publicly</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" mt-6 flex flex-col items-center"
          >
            {/* <RatingStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            /> */}

            <div className="rating-wrapper">
              <Rating
                initialValue={0}
                onClick={ratingChanged}
                size={24}
                fillColor="#ffd700"
                emptyColor="#d1d5db"
              />
            </div>
            
            

            <div className="flex w-11/12 flex-col space-y-2">
              <label htmlFor="courseExperience" className="text-sm text-gray-50">Add Your Experience {" "}<span className="text-pink-600">*</span>{" "}</label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Experience"
                {...register("courseExperience", { required: true })}
                className="form-style min-h-[130px] w-full"
              />

              {errors.courseExperience && (
                <span className="text-pink-600 text-[12px]">Please add your experience</span>
              )}
            </div>

            {/* Cancel and save Button */}
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button onClick={() => setReviewModal(false)}
               className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500"
              >Cancel</button>
              <IconBtn text="save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
