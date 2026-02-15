const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  return (
    <div>
      <button
        className={`flex flex-col  w-[360px] p-5 gap-1 cursor-pointer  ${
          currentCard === cardData.heading
            ? "bg-white text-gray-700 shadow-[12px_12px_0px] shadow-[#FFD60A]"
            : "bg-gray-700 text-slate-400"
        }`}
        onClick={() => {
          setCurrentCard(cardData.heading);
        }}
      >
        <div className=" flex flex-col text-center p-2 border-b-2 border-gray-100 border-dashed">
          <p
            className={` text-xl font-bold text-left mb-2 ${
              currentCard === cardData.heading
                ? "text-black"
                : "text-slate-50 "
            }`}
          >
            {cardData.heading}
          </p>
          <p className=" text-left mb-6 text-base ">{cardData.description}</p>
        </div>
        <div className=" flex justify-between w-full p-3">
          <p>{cardData.level}</p>
          <p>{cardData.lessionNumber} Lessons</p>
        </div>
      </button>
    </div>
  );
};

export default CourseCard;
