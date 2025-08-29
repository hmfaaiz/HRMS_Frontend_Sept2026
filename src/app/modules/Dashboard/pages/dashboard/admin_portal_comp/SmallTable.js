import React from "react";
import { PeriodType } from "../EmpUIHelper";

const SingleCard = ({ data, setSmallTableModalData }) => {
  let theme = data?.theme_class;
  const getHeading = () => {
    if (data?.isPeriodType) {
      if (PeriodType[data?.PeriodType]) {
        return `${data.dashlet_name} In ${PeriodType[data?.PeriodType]}`;
      } else {
        return `${data.dashlet_name} In Next ${data?.days} Days`;
      }
    } else {
      return data?.dashlet_name;
    }
  };
  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <h6 className="font-bold mb-0 text-primary">{getHeading()}</h6>
      <div
        className={
          data?.data.length > 0
            ? "space-y-3 my-2 max-h-[19rem] overflow-auto px-1"
            : `space-y-0 my-2 max-h-6 overflow-auto`
        }
      >
        {data?.data.length > 0 ? (
          data?.data.map((person) => (
            <div key={person?.Id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={person?.profile_image}
                  alt={person?.Employee_Name}
                  className="object-cover rounded-sm w-10 h-10"
                />
                <div>
                  <div className="text-sm text-black font-normal">
                    {person?.Employee_Name}
                  </div>
                  <div className="text-xs text-black font-normal">
                    {person?.Designation}
                  </div>
                  {/* <div style={{ fontSize: "12px", color: "#888" }}>
                    {person.departmentName}
                  </div> */}
                </div>
              </div>
              <div className={`text-sm font-semibold m-0 ${theme}`}>
                <span>{person?.main_value}</span>
              </div>
            </div>
          ))
        ) : (
          <label className="text-center">No Record Available</label>
        )}
      </div>
      <lable
        className={
          data?.data.length > 0
            ? `text-black cursor-pointer font-medium underline text-xs hover:text-tprimary flex justify-end`
            : `text-gray-500 cursor-not-allowed font-medium text-xs flex justify-end`
        }
        // className="text-black cursor-pointer text-right font-medium underline text-xs hover:text-tprimary flex justify-end"
        onClick={() => setSmallTableModalData(data)}
      >
        Expand
      </lable>
    </div>
  );
};

export default function SmallTable({ data, setSmallTableModalData }) {
  return (
    <SingleCard data={data} setSmallTableModalData={setSmallTableModalData} />
  );
}
