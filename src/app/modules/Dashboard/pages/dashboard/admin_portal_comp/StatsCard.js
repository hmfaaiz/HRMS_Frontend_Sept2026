import React from "react";

const StatsCard = ({ icon, name, value }) => {
  return (
    <div className="bg-tsecondary p-2 rounded-lg space-y-1">
      <span className="bg-tprimary p-2 rounded-full flex items-center justify-center w-8 h-8">
        {icon}
      </span>
      <p className="m-0 text-tprimary font-bold text-lg">{value || 0}</p>
      <p className="m-0 text-tprimary font-bold text-sm">{name}</p>
    </div>
  );
};

export default StatsCard;
