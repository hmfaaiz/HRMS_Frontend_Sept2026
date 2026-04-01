import React from "react";
import { PeriodType } from "../EmpUIHelper";
import { useSelector } from "react-redux";

const SingleCard = ({ data, setSmallTableModalData }) => {
  let theme = data?.theme_class;
  const dashboard = useSelector((state) => state.dashboard || []);
  const getHeading = () => {
    if (!data) return "";

    let name = data.dashlet_name || "";
    // Handle period type name override
    if (data.isPeriodType) {
      const periodLabel = PeriodType[data.PeriodType];

      if (periodLabel) {
        name = `${name} In ${periodLabel}`;
      } else {
        const type = data.sequenceStatus == "0" ? "Next" : "Last";
        name = `${name} In ${type} ${data.days} Days`;
      }
    }

    // Add trend label
    if (data.trendValue) {
      const label =
        data.trendValue == 1
          ? dashboard?.activeFiscalYear?.label
          : dashboard?.activeFiscalYear?.payrollMonthLabel;

      name = `${name} - ${label ?? ""}`;
    }

    return name;
  };
  return (
    <div className="bg-white w-full rounded-lg px-3 py-2">
      <h6 className="font-bold mb-0 text-primary">{getHeading()}</h6>
      <div
        className={
          data?.data.length > 0
            ? "space-y-3 my-2 max-h-[19rem] overflow-auto scrollbar-fancy px-1"
            : `space-y-0 my-2 max-h-6 scrollbar-fancy`
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
                <span>
                  {
                    person?.main_value
                    // ? format(new Date(person?.main_value), "dd-MMM-yyyy")
                    // : ""
                  }
                </span>
              </div>
            </div>
          ))
        ) : (
          <label className="text-center">No Record Available</label>
        )}
      </div>
      <div className="text-right w-full flex justify-end">
        {data?.data.length > 0 ? (
          <label
            className={`text-black cursor-pointer w-fit font-medium underline text-xs hover:text-tprimary flex justify-end`}
            onClick={() => setSmallTableModalData(data)}
          >
            Expand
          </label>
        ) : (
          <label
            className={`text-gray-500 cursor-not-allowed w-fit font-medium text-xs flex justify-end`}
          >
            Expand
          </label>
        )}
      </div>
    </div>
  );
};

export default function SmallTable({ data, setSmallTableModalData }) {
  return (
    <SingleCard data={data} setSmallTableModalData={setSmallTableModalData} />
  );
}
