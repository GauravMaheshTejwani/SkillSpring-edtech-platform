import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStar from "../../common/RatingStar";
import GetAvgRating from "../../../utils/avgRating";

function CatalogCard({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReview);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className=" mb-4 hover:scale-[1.03] transition-all duration-200 z-50 ">
      <Link to={`/courses/${course._id}`}>
        <div>
          <div>
            <img
              src={course?.thumbnail}
              alt="course thumbnail"
              className={`${Height}  rounded-xl object-cover`}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-sm md:text-xl text-gray-50">{course?.name}</p>
            <p className="text-[12px] md:text-xl text-gray-50">
              By{" "}
              <span className="text-yellow-300">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </span>
            </p>
            <div className="flex gap-x-3">
              <span className="text-yellow-300">{avgReviewCount || 0}</span>
              <RatingStar Review_Count={avgReviewCount} />
              <span className=" md:block hidden md:text-xl text-gray-50">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-sm md:text-xl text-gray-50">
              Rs. {course?.price}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CatalogCard;
