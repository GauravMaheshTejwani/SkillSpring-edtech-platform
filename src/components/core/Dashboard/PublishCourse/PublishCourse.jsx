import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { COURSE_STATUS } from "../../../../utils/constants";
import { setEditCourse, setStep } from "../../../../slices/courseSlice";
import {
  addCourseToCategory,
  editCourseDetails,
} from "../../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();

  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToMyCourse = () => {
    navigate("/dashboard/my-course");
  };

  const handlePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      goToMyCourse();
      setLoading(false);
      dispatch(setStep(1));
      dispatch(setEditCourse(null));
      return;
    }

    const formData = new FormData();

    formData.append("courseId", course._id);
    formData.append(
      "status",
      getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT,
    );

    const result = await editCourseDetails(formData, token);
    const category_id = course.category;
    const addCourseCategory = await addCourseToCategory(
      { categoryId: category_id, courseId: course._id },
      token,
    );

    if (result && addCourseCategory) {
      goToMyCourse();
    } else {
      toast.error("Something went wrong");
    }

    if (addCourseCategory) {
      dispatch(setStep(1));
      dispatch(setEditCourse(null));
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    handlePublish(data);
  };

  return (
    <div>
      <div className="rounded-md border-[1px] border-gray-700 bg-gray-800 p-6">
        <p className="text-2xl font-semibold text-gray-50">Publish Course</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6 mb-8">
            <label
              htmlFor="public"
              className="inline-flex items-center text-lg"
            >
              <input
                defaultChecked={false}
                type="checked"
                id="public"
                name="public"
                className="border-gray-300 h-4 w-4 rounded bg-gray-500 text-gray-400 focus:ring-2 focus:ring-gray-50"
                {...register("public")}
              />
              <span className="ml-2 text-gray-400">
                Make this course as public
              </span>
            </label>
          </div>

          <div className="ml-auto flex max-w-max items-center gap-x-4">
            <button
              disabled={loading}
              onClick={goBack}
              type="button"
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-gray-300 py-[8px] px-[20px] font-semibold text-gray-900"
            >
              Back
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex items-center bg-yellow-400 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-gray-900 undefined"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishCourse;
