import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div>
      <div className="text-4xl font-semibold text-center">
        Unlock the
        <HighlightText text={"Power of Code"}></HighlightText>
      </div>

      <p className="text-center text-gray-300 text-sm mt-3">
        Learn to built anything you can imagine
      </p>

      <div className="flex rounded-full bg-gray-800 mb-5 mt-5 border-gray-100 px-1 py-1">
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-[16px] flex flex-row items-center gap-2 ${
                currentTab === element
                  ? " bg-gray-900 text-gray-50 font-medium"
                  : " text-gray-300"
              } rounded-full transition-all duration-200 cursor-pointer hover:bg-gray-900 hover:text-gray-50 px-7 py-2`}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          );
        })}
      </div>
      <div className="realtive lg:h-[150px]">

        <div className=" absolute flex gap-9 w-full justify-center mt-5 flex-wrap lg:absolute right-0 left-0 mr-auto ml-auto">
          {
            courses.map((element, index) => {
              return(
                <CourseCard 
                  key={index}
                  cardData = {element}
                  currentCard = {currentCard}
                  setCurrentCard = {setCurrentCard}
                />
              )
            })
          }
        </div>
      </div>

      {/* <div className=" absolute flex gap-9 w-full justify-center mt-5 flex-wrap lg:absolute right-0 left-0 mr-auto ml-auto">
        {
          courses.map((element, index) => {
            return(
              <CourseCard 
                key={index}
                cardData = {element}
                currentCard = {currentCard}
                setCurrentCard = {setCurrentCard}
              />
            )
          })
        }
      </div> */}
    </div>
  );
};

export default ExploreMore;
