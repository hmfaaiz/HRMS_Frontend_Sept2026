import React from "react";
const StatsCard = ({ icon, name, value, handleCardClick }) => {
  return (
    <div className="bg-tsecondary p-2 rounded-lg space-y-1 flex flex-col">
      <span className="bg-tprimary p-2 rounded-full flex items-center justify-center w-8 h-8">
        {icon}
      </span>
      <p className="m-0 text-tprimary font-bold text-lg">{value || 0}</p>
      <p className="m-0 text-tprimary font-bold text-sm">{name}</p>

      {value > 0 ? (
        <div
          className={`text-black cursor-pointer w-fit font-medium underline mt-auto text-xs hover:text-tprimary`}
          onClick={handleCardClick}
        >
          View All
        </div>
      ) : (
        <div
          className={`text-gray-500 cursor-not-allowed w-fit mt-auto font-medium text-xs`}
        >
          View All
        </div>
      )}
    </div>
  );
};

export default StatsCard;
