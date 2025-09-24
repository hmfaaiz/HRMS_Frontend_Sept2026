import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";

import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import StatsCard from "../StatsCard";
import { HouseWifi, ClockArrowUp } from "lucide-react";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";
const LeaveArea = ({
  allSubsidiaryList,
  allLocationChildMenus,
  allParentDept,
  allEmployeegradeList,
  summaryFilter,
  setSummaryFilter,
  allDashboardAlerts,
  summaryData,
  setSmallTableModalData,
  setBigTableModalData,
  setSummaryModalHeading,
  holidayList,
}) => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2 mt-2">
      <div className="col-span-4 space-y-2">
        <div className="grid grid-cols-2 lg:grid-cols-4  gap-x-2 gap-y-2 bg-white rounded-lg px-3 py-2">
          {/* dropdown area  */}
         
          <div>
            <SearchSelect
              name="gradeId"
              isDisabled={!allEmployeegradeList}
              label={<span>Grade</span>}
              onChange={(e) =>
                setSummaryFilter({
                  ...summaryFilter,
                  gradeId: e.value,
                })
              }
              value={
                summaryFilter?.gradeId == ""
                  ? { value: "", label: "All" }
                  : allEmployeegradeList?.find(
                      (option) => option.value === summaryFilter.gradeId
                    ) || null
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allEmployeegradeList)
                  ? allEmployeegradeList
                  : []),
              ]}
            />
          </div>
          <div>
            <SearchSelect
              name="departmentId"
              isDisabled={!allParentDept}
              label={<span>Department</span>}
              onChange={(e) =>
                setSummaryFilter({
                  ...summaryFilter,
                  departmentId: e.value,
                })
              }
              value={
                summaryFilter?.departmentId == ""
                  ? { value: "", label: "All" }
                  : allParentDept?.find(
                      (option) => option.value === summaryFilter?.departmentId
                    ) || null
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allParentDept) ? allParentDept : []),
              ]}
            />
          </div>
          <div>
            <SearchSelect
              name="locationId"
              isDisabled={!allLocationChildMenus}
              label={<span>Location</span>}
              onChange={(e) =>
                setSummaryFilter({
                  ...summaryFilter,
                  locationId: e.value,
                })
              }
              value={
                summaryFilter?.locationId == ""
                  ? { value: "", label: "All" }
                  : allLocationChildMenus?.find(
                      (option) => option.value === summaryFilter?.locationId
                    ) || null
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allLocationChildMenus)
                  ? allLocationChildMenus
                  : []),
              ]}
            />
          </div>
          <div></div>
          {/* stats card area  */}
          {/* <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Total Active Employees"}
              value={summaryData?.activeEmployee || 0}
              keyName={"activeEmployee"}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Inactive Employees in current Fiscal Year"}
              value={summaryData?.inActiveEmployee || 0}
              keyName={"inActiveEmployee"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div> */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Leave Request"}
              value={summaryData?.pendingLeavesRequest || 0}
              keyName={"pendingLeavesRequest"}
              icon={<ClockArrowUp className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Today Employees On Leave"}
              value={summaryData?.employeeOnLeave || 0}
              keyName={"employeeOnLeave"}
              icon={<HouseWifi className="w-5 h-5 text-white" />}
            />
          </div>
          {/* <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Active Jobs"}
              value={summaryData?.openJobs || 0}
              keyName={"openJobs"}
              icon={<Briefcase className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Active Applicants"}
              value={summaryData?.applicant || 0}
              keyName={"applicant"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div> */}
          {/* <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Applicants Hired"}
              value={summaryData?.applicantHiredThisYear || 0}
              keyName={"applicantHiredThisYear"}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Applicants Final Phase"}
              value={summaryData?.applicantInFinalPhase || 0}
              keyName={"applicantInFinalPhase"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div> */}
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-1 xl:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.dashlet_type === "chart" && e?.tab_key === "leave") {
                return <ChartData key={`chart-${alertIdx}`} data={e} />;
              }
              return null;
            })}
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.tab_key === "leave" && e?.dashlet_type === "big_table") {
                return (
                  <BigTable
                    setBigTableModalData={setBigTableModalData}
                    key={`big-${alertIdx}`}
                    data={e}
                  />
                );
              }
              return null;
            })}
        </div>
      </div>
      <div className="col-span-4 lg:col-span-1 grid-cols-3 lg:grid-cols-1 space-y-2">
        {allDashboardAlerts?.length > 0 &&
          allDashboardAlerts?.map((e, alertIdx) => {
            if (e?.dashlet_type === "small_table" && e?.tab_key === "leave") {
              return (
                <SmallTable
                  setSmallTableModalData={setSmallTableModalData}
                  key={`small-${alertIdx}`}
                  data={e}
                />
              );
            }
            return null;
          })}
        <HolidayTable entities={holidayList?.length > 0 ? holidayList : []} />
      </div>
    </div>
  );
};

export default LeaveArea;
