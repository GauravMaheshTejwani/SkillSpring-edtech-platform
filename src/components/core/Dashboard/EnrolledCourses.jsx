import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserCourses } from "../../../services/operations/profileApi";
import ProgressBar from "@ramonak/react-progress-bar";

const EnrolledCourses = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(undefined);
  const [progressData, setProgressData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const getEnrolledCourses = async () => {
    setLoading(true);
    const response = await getUserCourses(token, dispatch);
    setLoading(false);
    setEnrolledCourses(response?.courses);
    setProgressData(response?.courseProgress);
  };

  const totalNoOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach((section) => {
      total += section.subSection.length;
    });
    return total;
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh)] w-full justify-center items-center">
        <div className=" animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <div className="text-3xl text-gray-300">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div>Loading....</div>
      ) : !enrolledCourses.length ? (
        <p className=" grid h-[10vh] w-full place-content-center text-gray-50">
          You have not enrolled in any of course yet
        </p>
      ) : (
        <div className="my-8 text-gray-50">
          <div className="flex rounded-t-lg bg-gray-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3"></p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {enrolledCourses.map((course, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(
                  `/dashboard/enrolled-courses/view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.courseContent[0].SubSection[0]}`,
                );
              }}
              className="flex items-center border border-gray-700 rounded-none"
            >
              <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3">
                <img
                  className="h-14 w-14 rounded-lg object-cover"
                  src={course.thumbnail}
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300 hidden md:block">
                    {course.courseDescription.length > 50
                      ? course.courseDescription.slice(0, 50) + "...."
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>

              <div className="flex w-1/5 flex-col gap-2 px-1 py-3">
                {progressData?.map((progress, index) => {
                  if (progress?.CourseID === course._id) {
                    return (
                      <div key={index}>
                        <p>
                          Completed : {progress?.completedVideos?.length} /{" "}
                          {totalNoOfLectures(course)}
                        </p>
                        <ProgressBar
                          completed={
                            (progress?.completedVideos?.length /
                              totalNoOfLectures(course)) *
                            100
                          }
                          total={progress?.total}
                          height="8px"
                          isLabelVisible={false}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
