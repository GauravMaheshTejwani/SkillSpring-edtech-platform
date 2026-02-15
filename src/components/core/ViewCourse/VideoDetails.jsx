import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { markLectureAsCompleted } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const playerRef = useRef(null)
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length) {
      return;
    }

    if (!courseId || !sectionId || !subSectionId) {
      navigate("/dashboard/enrolled-courses");
    } else {
      const filteredData = courseSectionData.filter(
        (course) => course._id === sectionId,
      );


      const filteredVideoData = filteredData[0].SubSection?.filter(
        (data) => data._id === subSectionId,
      );


      setVideoData(filteredVideoData[0]);
      setVideoEnded(false);
    }
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const currentSubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSection?.findIndex((data) => data._id === sectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const noOfSubSections =
      courseSectionData?.[currentSectionIndex]?.subSection?.length;

    const currentSubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSection?.findIndex((data) => data._id === sectionId);

    if (
      currentSectionIndex === courseSectionData.length - 1 ||
      currentSubSectionIndex === noOfSubSections.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const noOfSubSections =
      courseSectionData?.[currentSectionIndex]?.subSection?.length;

    const currentSubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSection?.findIndex((data) => data._id === sectionId);

    if (currentSubSectionIndex !== noOfSubSections - 1) {
      //same section next video
      const nextSubSectionId =
        courseSectionData?.[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`,
      );
    } else {
      //different section ki first video
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[nextSectionId].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`,
      );
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const currentSubSectionIndex = courseSectionData?.[
      currentSectionIndex
    ]?.subSection?.findIndex((data) => data._id === sectionId);

    if (currentSubSectionIndex !== 0) {
      //same section previous video
      const prevSubSectionId =
        courseSectionData?.[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`,
      );
    } else {
      //different section ki last video
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSectionId =
        courseSectionData[prevSectionId].subSection[prevSubSectionLength]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`,
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);

    const res = await markLectureAsCompleted(
      { courseId: courseId, subSectionId: subSectionId },
      token,
    );

    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <div>No Data Found</div>
      ) : (
        <div className="relative aspect-video w-full">
        <ReactPlayer
          src={videoData?.videoUrl}
          ref={playerRef}
          width="100%"
          height="1000px"
          playing={false}
          muted={false}
          controls={true}
          onEnded={() => setVideoEnded(true)}
          config={{ file: { attributes: { playsInline: true } } }}
        />

          {videoEnded && (
            <div
                style={{
                    backgroundImage:
                        "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
                }}
                className="absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                />
              )}

              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    playerRef.current.currentTime = 0;
                    setVideoEnded(false);
                  }
                }
                }
                text={!loading ? "Rewatch" : "Loading..."}
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className="blackButton"
                  >
                      Prev
                  </button>

                  
                )}
              </div>

              <div>
                {!isLastVideo() && (
                  <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="blackButton"
                  >
                      Next
                  </button>
                )}
              </div>
            </div>
          )}
        
        </div>
      )}

      <div>
        <h1 className="mt-4 text-3xl font-semibold">
          {videoData?.title}
        </h1>
        <p className="pt-2 pb-6">
          {videoData?.description}
        </p>
      </div>


    </div>

  );
};

export default VideoDetails;
