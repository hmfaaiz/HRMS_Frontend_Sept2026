import React from "react";

const TCard = ({ name = "", children }) => {
  return (
    <div className="space-y-2">
      <div className="px-3 py-2 rounded-lg bg-white">
        <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
          {name}
        </h5>
      </div>
      <div className="px-3 py-2 rounded-lg bg-white">{children}</div>
    </div>
  );
};

export default TCard;
