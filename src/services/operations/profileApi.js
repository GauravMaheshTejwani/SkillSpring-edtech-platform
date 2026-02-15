import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndPoints, settingEndpoints } from "../api";
import { logout } from "./authApi";
import { setProgress } from "../../slices/loadingBarSlice";

export  async function getInstructorData(token) {
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("GET", profileEndPoints.GET_INSTRUCTOR_DATA_API, null, 
            {
                Authorization: `Bearer ${token}`
            }
        )
        result = response?.data?.courses;
    } catch (error) {
        console.log("Get instructor dashboard data API error ", error);
        toast.error("Could notget instructor data")
    }
    toast.dismiss(toastId);
    return result;
}

export async function updateProfilePicture(token, profilePic){
    const toastId = toast.loading("Loading...");
    try {
        const formData = new FormData();
        formData.append("profilePic",profilePic);
        const response = await apiConnector("PUT", settingEndpoints.UPDATE_PROFILE_PICTURE, formData,
            {
                Authorisation: `Bearer ${token}`
            }
        );

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Profile Picture Updated Successfully");

        const imageUrl = response.data.data.image;

        localStorage.setItem("user", JSON.stringify({...JSON.parse(localStorage.getItem("user")), image: imageUrl}));

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}

export async function updateAdditionalDetails(token, additionalDetails){
    const {firstName, lastName, dateOfBirth, gender, contactNumber, about} = additionalDetails;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("PUT", settingEndpoints.UPDATE_PROFILE_API, 
            {
                firstName,
                lastName,
                gender,
                dateOfBirth,
                contactNumber,
                about
            },
            {
                Authorization: `Bearer ${token}`,
            }
        )

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Additional Details Updated Successfully");

        const user = JSON.parse(localStorage.getItem("user"));
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.additionalDetails.dateOfBirth = dateOfBirth  || user.additionalDetails.dateOfBirth;
        user.additionalDetails.contactNumber = contactNumber || user.additionalDetails.contactNumber;
        user.additionalDetails.about = about || user.additionalDetails.about;
        user.additionalDetails.gender=gender
        localStorage.setItem("user",JSON.stringify(user));

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}

export async function updatePassword(token, password) {
    const {oldPassword, confirmPassword, newPassword} = password;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", settingEndpoints.CHANE_PASSWORD_API, 
            {
                oldPassword,
                newPassword,
                confirmPassword,
            },
            {
                Authorization: `Bearer ${token}`
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        toast.success("Password Updated Successfully");

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    toast.dismiss(toastId)
}

export async function deleteAccount(token, dispatch, navigate) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("DELETE", settingEndpoints.DELETE_PROFILE_API, null, 
            {
                Authorization: `Bearer ${token}`
            }
        )

        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        toast.success("Account Deleted Successfully");

        dispatch(logout(navigate))

    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
    toast.dismiss(toastId)
}

export async function getUserCourses(token, dispatch) {

    const toastId = toast.loading("Loading...");
    dispatch(setProgress);
    let result = [];

    try {
        const response = await apiConnector("GET", profileEndPoints.GET_USER_ENROLLED_COURSES_API, null, 
            {
                Authorization : `Bearer ${token}`
            }
        )

        if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data.data;
    } catch (error) {
        console.log(error);
        toast.error("Could not get enrolled Courses");
    }

    toast.dismiss(toastId);
    dispatch(setProgress(100));
    return result;
    
}