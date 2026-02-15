import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  FreeMode,
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import { Rating } from "react-simple-star-rating";
import { apiConnector } from "../../../services/apiconnector";
import { ratingEndPoints } from "../../../services/api";
import { FaStar } from "react-icons/fa";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      const response = await apiConnector(
        "GET",
        ratingEndPoints.REVIEW_DETAILS_API,
      );
      const { data } = response;
      if (data?.success) {
        setReviews(data?.data);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="text-white w-full px-2">
      <div className="my-10 max-w-[1200px] mx-auto">
        <Swiper
          className="w-full"
          spaceBetween={25}
          speed={800}
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          modules={[FreeMode, Pagination, Navigation, Autoplay]}
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="min-h-[220px] flex flex-col gap-3 bg-gray-800 p-4 text-sm text-gray-50 rounded-md shadow-md h-full">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user[0]?.image
                        ? review?.user[0]?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="user"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-gray-50">{`${review?.user[0]?.firstName} ${review?.user[0]?.lastName}`}</h1>
                    <h2 className="text-[12px] font-medium text-gray-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                {/* Review Text */}
                <p className="font-medium text-gray-50">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")}...`
                    : review?.review}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-auto">
                  <h3 className="font-semibold text-yellow-400">
                    {review.rating.toFixed(1)}
                  </h3>
                  <div className="rating-wrapper">
                    <Rating
                      initialValue={review?.rating}
                      readonly={true}
                      size={20}
                      fillColor="#ffd700"
                      emptyColor="#d1d5db"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
