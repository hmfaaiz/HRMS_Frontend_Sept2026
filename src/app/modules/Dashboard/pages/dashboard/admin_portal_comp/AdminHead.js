import React from "react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Megaphone, Star } from "lucide-react";
import Marquee from "react-fast-marquee";

const options = [
  {
    title: "Default View",
    key: "default",
    resourceId: null,
  },
  {
    title: "Employee",
    key: "employee",
    resourceId: 1784,
  },
  {
    title: "Leave",
    key: "leave_management",
    resourceId: 308,
  },
  {
    title: "Attendance",
    key: "attendance_management",
    resourceId: 1726,
  },
  {
    title: "Payroll",
    key: "payroll",
    resourceId: 252,
  },
  {
    title: "Recruitment",
    key: "recruitment",
    resourceId: 1893,
  },
];


const AdminHead = ({ activeTab, handleChange, announcement }) => {
  
  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-2">
      <div className="col-span-4 content-center px-3 py-2 rounded-lg bg-white">
        <div className="grid grid-cols-5 gap-x-2 gap-y-2">
          <SearchSelect
            options={options.map((el) => {
              return {
                value: el?.key,
                label: el?.title,
              };
            })}
            value={
              options
                ?.map((el) => ({
                  value: el?.key,
                  label: el?.title,
                }))
                ?.find((opt) => opt.value === activeTab) || ""
            }
            onChange={(e) => {
              handleChange(e)
            }}
            className="col-span-1"
          />

          <div className="px-2 py-1 bg-tlight rounded-md col-span-4 flex items-center gap-1">
            <Megaphone className="text-black w-4 h-4 mr-1 stroke-3" />
            <h6 className="font-bold mb-0 text-primary">Announcements</h6>
            <Marquee
              className="content-center ml-5"
              speed={20}
              gradient={false}
              pauseOnHover={true}
            >
              {announcement?.length > 0 &&
                announcement?.map((e) => (
                  <label className="text-sm mx-2 font-medium text-black">
                    <Star className="w-3 h-3 text-black ms-1" />{" "}
                    {e?.ticker_description}
                  </label>
                ))}
            </Marquee>
          </div>
        </div>
      </div>
      {/* Reminder part  */}
      <div className="col-span-1 px-3 py-2 rounded-lg bg-white">
        <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
          Reminders
        </h5>
      </div>
    </div>
  );
};

export default AdminHead;
