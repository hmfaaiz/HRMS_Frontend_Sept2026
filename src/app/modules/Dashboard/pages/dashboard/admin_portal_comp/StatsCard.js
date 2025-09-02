import React from "react";
import { useDispatch } from "react-redux";
import { fetchSummaryDetail } from "../../../_redux/dashboardActions";
const StatsCard = ({
  icon,
  name,
  value,
  summaryFilter,
  keyName,
  setSummaryModalHeading,
}) => {
  const dispatch = useDispatch();
  // Handle card click event
  const handleCardClick = () => {
    dispatch(fetchSummaryDetail(summaryFilter, keyName));
    setSummaryModalHeading(name);
  };
  return (
    <div className="bg-tsecondary p-2 rounded-lg space-y-1">
      <span className="bg-tprimary p-2 rounded-full flex items-center justify-center w-8 h-8">
        {icon}
      </span>
      <p className="m-0 text-tprimary font-bold text-lg">{value || 0}</p>
      <p className="m-0 text-tprimary font-bold text-sm">{name}</p>

      {
        value > 0 ?
          <div
            className={
              `text-black cursor-pointer font-medium underline text-xs hover:text-tprimary`
            }
            onClick={handleCardClick}
          >
            View All
          </div> :
          <div
            className={
              `text-gray-500 cursor-not-allowed font-medium text-xs`
            }
          >
            View All
          </div>
      }
    </div>
  );
};

export default StatsCard;
