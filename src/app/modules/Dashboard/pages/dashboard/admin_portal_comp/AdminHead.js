import React from "react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Megaphone, Star } from "lucide-react";
import Marquee from "react-fast-marquee";

const options = [
  {
    title: "Default View",
    key: "default",
  },
  {
    title: "Employee",
    key: "employee",
  },
  {
    title: "Leave",
    key: "leave",
  },
  {
    title: "Attendance",
    key: "attendance",
  },
  {
    title: "Payroll",
    key: "payroll",
  },
  {
    title: "Recruitment",
    key: "recruitment",
  },
];

const AdminHead = ({
  activeTab,
  handleChange,
  announcement,
  allSubsidiaryList,
  summaryFilter,
  setSummaryFilter,
}) => {
  return (
    // <div className="grid grid-cols-5 gap-x-2 gap-y-2">
    //   <div className="col-span-4 content-center px-3 py-2 rounded-lg bg-white">
    //     <div className="grid grid-cols-5 gap-x-2 gap-y-2">
    //       <SearchSelect
    //         options={options.map((el) => {
    //           return {
    //             value: el?.key,
    //             label: el?.title,
    //           };
    //         })}
    //         value={
    //           options
    //             ?.map((el) => ({
    //               value: el?.key,
    //               label: el?.title,
    //             }))
    //             ?.find((opt) => opt.value === activeTab) || ""
    //         }
    //         onChange={(e) => {
    //           handleChange(e);
    //         }}
    //         className="col-span-1"
    //       />

    //       <div className="px-2 py-1 bg-tlight rounded-md col-span-4 flex items-center gap-1">
    //         <Megaphone className="text-black w-4 h-4 mr-1 stroke-3" />
    //         <h6 className="font-bold mb-0 text-primary">Announcements</h6>
    //         <Marquee
    //           className="content-center ml-5"
    //           speed={20}
    //           gradient={false}
    //           pauseOnHover={true}
    //         >
    //           {announcement?.length > 0 &&
    //             announcement?.map((e) => (
    //               <label className="text-sm mx-2 font-medium text-black">
    //                 <Star className="w-3 h-3 text-black ms-1" />{" "}
    //                 {e?.ticker_description}
    //               </label>
    //             ))}
    //         </Marquee>
    //       </div>
    //     </div>
    //   </div>
    //   {/* Reminder part  */}
    //   <div className="col-span-1 px-3 py-2 rounded-lg bg-white">
    //     <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
    //       Reminders
    //     </h5>
    //   </div>
    // </div>
    <div className="space-y-2">
      {/* <div className="px-3 py-2 rounded-lg bg-white">
        <div className="px-2 py-1 bg-tlight w-full rounded-md flex items-center gap-1">
          <Megaphone className="text-black w-4 h-4 mr-1 stroke-3" />
          <h6 className="font-bold mb-0 text-primary">Announcements</h6>
          <Marquee
            className="content-center ml-5"
            speed={20}
            gradient={false}
            pauseOnHover={true}
          >
            {announcement?.length > 0 &&
              announcement?.map((e, i) => (
                <label
                  key={i}
                  className="text-sm mx-2 font-medium text-black flex items-center"
                >
                  <Star className="w-3 h-3 text-black ms-1" />{" "}
                  {e?.ticker_description}
                </label>
              ))}
          </Marquee>
        </div>
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
        <div className="col-span-1 lg:col-span-4 content-center px-3 py-2 rounded-lg bg-white">
          <div className="grid grid-cols-2  lg:grid-cols-5 gap-2">
            {/* First dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <label class="whitespace-nowrap">Dashboard View : </label>
              <div className="w-full">
                <SearchSelect
                  options={options.map((el) => ({
                    value: el?.key,
                    label: el?.title,
                  }))}
                  value={
                    options
                      ?.map((el) => ({ value: el?.key, label: el?.title }))
                      ?.find((opt) => opt.value === activeTab) || ""
                  }
                  onChange={(e) => handleChange(e)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Subsidiary dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <label class="whitespace-nowrap">Subsidiary : </label>
              <div className="w-full">
                <SearchSelect
                  name="subsidiaryId"
                  isDisabled={!allSubsidiaryList}
                  onChange={(e) =>
                    setSummaryFilter({
                      ...summaryFilter,
                      subsidiaryId: e.value,
                      departmentId: "",
                    })
                  }
                  value={
                    summaryFilter?.subsidiaryId === ""
                      ? { value: "", label: "All" }
                      : allSubsidiaryList?.find(
                          (option) =>
                            option.value === summaryFilter?.subsidiaryId
                        ) || null
                  }
                  options={[
                    { value: "", label: "All" },
                    ...(Array.isArray(allSubsidiaryList)
                      ? allSubsidiaryList
                      : []),
                  ]}
                />
              </div>
            </div>
            {/* Announcements - moves on top for mobile */}
            <div className="px-2 py-1 bg-tlight w-full col-span-3 rounded-md flex items-center gap-1">
              <Megaphone className="text-black w-4 h-4 lg:mr-1 stroke-3" />
              <h6 className="font-bold max-lg:hidden mb-0 text-primary">Announcements</h6>
              <Marquee
                className="content-center ml-1 lg:ml-5"
                speed={20}
                gradient={false}
                pauseOnHover={true}
              >
                {announcement?.length > 0 &&
                  announcement?.map((e, i) => (
                    <label
                      key={i}
                      className="text-sm mx-2 font-medium text-black flex items-center"
                    >
                      <Star className="w-3 h-3 text-black ms-1" />{" "}
                      {e?.ticker_description}
                    </label>
                  ))}
              </Marquee>
            </div>
          </div>
        </div>
        <div className="col-span-1 px-3 py-2 rounded-lg bg-white hidden lg:block">
          <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
            Reminders
          </h5>
        </div>
      </div>
    </div>
  );
};

export default AdminHead;
