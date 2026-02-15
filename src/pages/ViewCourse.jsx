import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
function ViewCourse() {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseDetail = async () => {
      const courseDetail = await fetchCourseDetails(courseId, token);
      dispatch(setCourseSectionData(courseDetail.courseContent));
      dispatch(setEntireCourseData(courseDetail));
      if(courseDetail.completedVideos) {
        dispatch(setCompletedLectures(courseDetail.completedVideos));
      }
        
      let lectures = 0;
      courseDetail?.courseContent?.forEach((sec) => {
        lectures += sec.SubSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    setCourseDetail();
  }, []);

  return (
    <div >
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
          <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto mx-6">
            <Outlet />
          </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
      
    </div>
  );
}

export default ViewCourse;
