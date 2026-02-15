import React from "react";
import { useEffect } from "react";
import { apiConnector } from ".././services/apiconnector";
import { categories } from "../services/api";
import { getCatalogaPageData } from "../services/operations/pageAndComponentData";
import { useParams } from "react-router-dom";
import { useState } from "react";
import CatalogCard from "../components/core/Catelog/CatalogCard";
import CourseSlider from "../components/core/Catelog/CourseSlider";

function Catalog() {

  const Catalog = useParams();
  const catalogName = Catalog.catalog.split("-").join(" ").toUpperCase()
  const [categoryId, setcategoryID] = useState(null);
  const [category, setCategory] = useState([]);
  const [activeOption, setActiveOption] = useState(1);
  const [CatalogPageData, setCatalogPageData] = useState(null);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET",categories.CATEGORIES_API);
      const category_Id = result?.data?.allCategories.filter((item) => item.name === catalogName)[0]._id;
      setcategoryID(category_Id);

      const item = result?.data?.allCategories.filter((item) => item.name === catalogName)[0];
      setCategory(item);
    } catch (error) {
      console.log("Could not fetch the category list", error);
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, [Catalog]);

  const fetchCatelogPageData = async() => {
    if(categoryId){
        const result = await getCatalogaPageData(categoryId);
        setCatalogPageData(result);
    }

  }

  useEffect(()=>{
    fetchCatelogPageData();
  },[categoryId])

  return (
    <div>
      <div className=' box-content bg-gray-800 px-4'>
      <div className='mx-auto flex min-h-[260px]  flex-col justify-center gap-4 '>
        <p className='text-sm text-gray-300'>Home / Catalog / <span className='text-yellow-25'>{catalogName}</span> </p>
        <p className='text-3xl text-gray-50'>{catalogName}</p>
        <p className='max-w-[870px] text-gray-200'>
          {category?.description}
        </p>
      </div>
      </div>

      <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading'>
        Courses to get you started
        </h2>
        <div className='my-4 flex border-b border-b-gray-600 text-sm'>
          <button onClick={()=>{setActiveOption(1)}}  className={activeOption===1? `px-4 py-2 border-b border-b-yellow-300 text-yellow-300 cursor-pointer`:`px-4 py-2 text-gray-50 cursor-pointer` }>Most Populer</button>
          <button onClick={()=>{setActiveOption(2)}} className={activeOption===1?'px-4 py-2 text-gray-50 cursor-pointer':'px-4 py-2 border-b border-b-yellow-300 text-yellow-300 cursor-pointer'}>New</button>
        </div>
        <CourseSlider Courses={CatalogPageData?.data?.selectedCategory?.courses}/>        
      </div>

      <div className=' mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
          Similar to {catalogName}
        </h2>
        <CourseSlider Courses={CatalogPageData?.data?.differentCategories}/>
      </div>
      
      <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
          Frequently Bought Together
          </h2>
          <div className='grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4'>
            {
              CatalogPageData?.data?.mostSellingCourses?.map((item,index)=>(
                <CatalogCard key={index} course={item} Height={"h-[100px] lg:h-[400px]"} />
              ))
            }
          </div>
      </div>

    </div>
  )


  

}

export default Catalog;
