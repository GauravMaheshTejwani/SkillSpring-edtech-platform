// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = "/api/app/v1";

export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};

export const courseEndPoints = {
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  GET_INSTRUCTOR_ALL_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  ADD_COURSE_TO_CATEGORY_API: BASE_URL + "/course/addCourseToCategory",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails",
  SEARCH_COURSES_API: BASE_URL + "/course/searchCourse"
};

export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_PAYMENT: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

export const ratingEndPoints = {
  REVIEW_DETAILS_API: BASE_URL + "/course/getReviews",
};

export const profileEndPoints = {
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
};

export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

export const settingEndpoints = {
  CHANE_PASSWORD_API: BASE_URL + "/auth/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  UPDATE_PROFILE_PICTURE: BASE_URL + "/profile/updateProfilePicture",
};

export const ContactUsEndpoints = {
  CONTACT_US_API: BASE_URL + "/contact/contactUs"
}