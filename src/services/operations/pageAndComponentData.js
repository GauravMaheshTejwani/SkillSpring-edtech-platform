import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { categories } from "../api";

export const getCatalogaPageData = async(categoryId) => {
  let result = [];
  try{
        const response = await apiConnector("POST", categories.CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});
        if(!response.data.success)
            throw new Error("Could not Fetch Category page data error",
            response);

         result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error("No Course added to this category yet");
    result = error.response?.data;
  }
  return result;
}

