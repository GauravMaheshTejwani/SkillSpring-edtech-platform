import toast from "react-hot-toast";
import { categories, courseEndPoints } from "../api";
import { apiConnector } from "../apiconnector";

const {
  COURSE_DETAILS_API,
  LECTURE_COMPLETION_API,
  GET_INSTRUCTOR_ALL_COURSES_API,
  CREATE_RATING_API,
  CREATE_CATEGORY_API,
  EDIT_COURSE_API,
  CREATE_COURSE_API,
  UPDATE_SECTION_API,
  CREATE_SECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  CREATE_SUBSECTION_API,
  ADD_COURSE_TO_CATEGORY_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  SEARCH_COURSES_API
} = courseEndPoints;

export const fetchCourseDetails = async (courseId, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    },
    {
      Authorisation: `Bearer ${token}`,
    }
  
  );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data[0];
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const markLectureAsCompleted = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.message) {
      throw new Error(response.data.error);
    }

    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (data, token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_ALL_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch instructor courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error("Couldnot create Rating");
    }

    toast.success("Rating Posted");
    success = true;
  } catch (error) {
    success = false;
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};

export const createCategory = async (data, token) => {
  const toastId = toast.loading("Loading....");
  let success = false;

  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Create Category");
    }

    toast.success("Category Created");
    success = true;
  } catch (error) {
    success = false;
    console.log(error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return success;
};

export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", categories.CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.allCategories;
  } catch (error) {
    console.log(error);
    toast.error(error?.message);
  }
  return result;
};

export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    toast.success("Course Details Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }

  toast.dismiss(toastId);
  return result;
};

export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Course Details Added Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }

    toast.success("Course Section Created");
    result = response?.data?.updatedCourse;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }

    toast.success("Course Section Updated");
    result = response?.data?.updatedCourse;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }

    toast.success("Course Section Deleted");
    result = response?.data?.updatedCourse;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture");
    }

    toast.success("Lecture Deleted");
    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }

    toast.success("Lecture Updated");
    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Uploading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }

    toast.success("Lecture Added");
    result = response?.data?.updatedCourse;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const addCourseToCategory = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector(
      "POST",
      ADD_COURSE_TO_CATEGORY_API,
      data,
      {
        Authorisation: `Bearer ${token}`,
      },
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course To Category");
    }
    toast.success("Course Added To Category");
    success = true;
  } catch (error) {
    success = false;
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};

export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorisation: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
};

export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorisation: `Bearer ${token}`,
      },
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    result = error.response.data;
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const searchCourses = async (searchQuery) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", SEARCH_COURSES_API, {
      searchQuery: searchQuery,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Search Courses");
    }

    result = response?.data?.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
