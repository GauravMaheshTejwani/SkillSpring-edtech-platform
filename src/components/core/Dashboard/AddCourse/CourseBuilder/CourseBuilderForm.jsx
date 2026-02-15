import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setStep,
  setCourse,
  setEditCourse,
} from "../../../../../slices/courseSlice";
import {
  updateSection,
  createSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { AiOutlinePlusCircle } from "react-icons/ai";
import NestedView from "./NestedView";

const CourseBuilderForm = () => {
  const { token } = useSelector((state) => state.auth);
  const [editSectionName, setEditSectionName] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);

  const goToNext = () => {
    if (course.courseContent.length > 0) {
      if (
        course.courseContent.some((section) => section.SubSection.length > 0)
      ) {
        dispatch(setStep(3));
      } else {
        toast.error("Please add atleast one lesson to each section");
      }
    } else {
      toast.error("Please add atleast one section to continue");
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let result = null;
    setLoading(true);
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
          sectionId: editSectionName,
        },
        token,
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token,
      );
    }

    if (result) {
      dispatch(setCourse(result));
      setValue("sectionName", "");
      setEditSectionName(false);
    }
    setLoading(false);
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      setEditSectionName(false);
      setValue("sectionName", "");
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-gray-700 bg-gray-800 p-6">
      <p className="text-2xl font-semibold text-gray-50">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
        <label className="text-sm text-gray-50" htmlFor="sectionName">
          Section Name <sup className=" text-pink-500">*</sup>
        </label>
        <input
          id="sectionName"
          placeholder="Add a section to build your Course"
          name="sectionName"
          className="form-style w-full"
          {...register("sectionName", { required: true })}
        />

        {errors.sectionName && (
          <p className="ml-2 text-xs tracking-wide text-pink-500">
            Section Name is required
          </p>
        )}

        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            className="flex items-center border border-yellow-400 bg-transparent cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-gray-900 undefined"
          >
            <span className=" text-yellow-400">
              {editSectionName ? "Edit Section Name" : "Create Section"}
            </span>
            <AiOutlinePlusCircle size={20} className="text-yellow-400" />
          </button>

          {editSectionName && (
            <button
              onClick={() => {
                setEditSectionName(false);
                setValue("sectionName", "");
              }}
              type="button"
              className="text-sm text-gray-400 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div className="flex justify-end gap-x-3">
        <button
          onClick={() => {
            dispatch(setEditCourse(true));
            dispatch(setStep(1));
          }}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-gray-400 py-[8px] px-[20px] font-semibold text-gray-900"
        >
          Back
        </button>

        <button
          onClick={goToNext}
          className="flex items-center bg-yellow-400 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-gray-900 undefined"
        >
          <span>Next</span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
