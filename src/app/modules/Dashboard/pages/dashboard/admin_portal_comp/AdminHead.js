import React from "react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Megaphone, Star } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { updateDefaultSubsidiary } from "../../../_redux/dashboardActions";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";

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
  {
    title: "Separation",
    key: "separation",
  },
  {
    title: "Appraisal",
    key: "appraisal",
  },
];

const AdminHead = ({
  activeTab,
  handleChange,
  announcement,
  allSubsidiaryList,
  summaryFilter,
  setSummaryFilter,
  dashboard,
}) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="space-y-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          <div className="col-span-1 lg:col-span-4 content-center px-3 py-2 rounded-lg bg-white">
            <div
              className={
                activeTab !== "appraisal"
                  ? "grid grid-cols-2  lg:grid-cols-5 gap-2"
                  : "grid grid-cols-2  lg:grid-cols-4 gap-2"
              }
            >
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
                    onChange={(e) => {
                      setSummaryFilter({
                        ...summaryFilter,
                        subsidiaryId: e.value,
                        departmentId: "",
                        appraisalPeriodId: "",
                      });
                      dispatch(updateDefaultSubsidiary(e?.value || null)).then(
                        () => {
                          dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
                        }
                      );
                    }}
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
              {activeTab !== "appraisal" && (
                <div className="px-2 py-1 bg-tlight w-full col-span-3 rounded-md flex items-center gap-1">
                  <Megaphone className="text-black w-4 h-4 lg:mr-1 stroke-3" />
                  <h6 className="font-bold max-lg:hidden mb-0 text-primary">
                    Announcements
                  </h6>
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
              )}
              {/* appraisal period dropdown once appraisal area is active  */}
              {activeTab === "appraisal" && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <label class="whitespace-nowrap">Appraisal Period : </label>
                  <div className="w-full">
                    <SearchSelect
                      name="appraisalPeriodId"
                      isDisabled={
                        !allSubsidiaryList || !summaryFilter?.subsidiaryId
                      }
                      onChange={(e) =>
                        setSummaryFilter({
                          ...summaryFilter,
                          appraisalPeriodId: e.value,
                        })
                      }
                      value={
                        dashboard?.appraisalPeriodBySubList?.find(
                          (option) =>
                            option?.value === summaryFilter?.appraisalPeriodId
                        ) ||
                        dashboard?.appraisalPeriodBySubList?.find(
                          (option) => option?.isActive
                        ) ||
                        null
                      }
                      options={dashboard?.appraisalPeriodBySubList}
                    />
                  </div>
                </div>
              )}
              {/* appraisal category id */}
              {activeTab === "appraisal" && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <label class="whitespace-nowrap">Appraisal Category : </label>
                  <div className="w-full">
                    <SearchSelect
                      name="appraisalCategoryId"
                      isDisabled={!allSubsidiaryList}
                      onChange={(e) =>
                        setSummaryFilter({
                          ...summaryFilter,
                          appraisalCategoryId: e.value,
                        })
                      }
                      value={
                        (dashboard?.allAppraisalCategory?.length > 0 &&
                          dashboard?.allAppraisalCategory?.find(
                            (option) =>
                              option.value ===
                              summaryFilter?.appraisalCategoryId
                          )) ||
                        dashboard?.allAppraisalCategory?.[0] ||
                        null
                      }
                      options={dashboard?.allAppraisalCategory}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 px-3 py-2 rounded-lg bg-white hidden lg:block">
            <h5 className="m-0 text-black font-bold text-base sm:text-lg py-1">
              Reminders
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHead;
