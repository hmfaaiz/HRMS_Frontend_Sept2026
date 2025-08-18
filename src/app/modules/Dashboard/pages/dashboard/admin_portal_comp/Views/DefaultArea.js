import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import { Briefcase, User } from "lucide-react";
import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";

const DefaultArea = ({
  allSubsidiaryList,
  allLocationChildMenus,
  allParentDept,
  allEmployeegradeList,
  allDashboardAlerts,
  summaryFilter,
  setSummaryFilter,
  summaryData,
  setBigTableModalData,
  setSmallTableModalData,
  holidayList,
}) => {
  return (
    <div className="grid grid-cols-5 gap-x-2 gap-y-2 mt-2">
      <div className="col-span-4 space-y-2">
        <div className="grid grid-cols-4  gap-x-2 gap-y-2 bg-white rounded-lg px-3 py-2">
          {/* dropdown area  */}
          <div>
            <SearchSelect
              name="subsidiaryId"
              isDisabled={!allSubsidiaryList}
              label={<span>Subsidiary</span>}
              onChange={(e) =>
                setSummaryFilter({
                  ...summaryFilter,
                  subsidiaryId: e.value,
                })
              }
              value={
                allSubsidiaryList?.find(
                  (e) => e?.value === summaryFilter?.subsidiaryId
                ) || ""
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allSubsidiaryList) ? allSubsidiaryList : []),
              ]}
            />
          </div>
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
                allEmployeegradeList?.find(
                  (e) => e?.value === summaryFilter?.gradeId
                ) || ""
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
                allParentDept?.find(
                  (e) => e?.value === summaryFilter?.departmentId
                ) || ""
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
                allLocationChildMenus?.find(
                  (e) => e?.value === summaryFilter?.locationId
                ) || ""
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allLocationChildMenus)
                  ? allLocationChildMenus
                  : []),
              ]}
            />
          </div>
          {/* stats card area  */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Active Employees"}
              value={summaryData?.activeEmployee || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Inactive Employees"}
              value={summaryData?.inActiveEmployee || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"New Employees"}
              value={summaryData?.newEmployee || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Employees On Leave"}
              value={summaryData?.employeeOnLeave || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Active Jobs"}
              value={summaryData?.openJobs || 0}
              icon={<Briefcase className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Active Applicants"}
              value={summaryData?.applicant || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Applicants Hired"}
              value={summaryData?.applicantHiredThisYear || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Applicants Final Phase"}
              value={summaryData?.applicantInFinalPhase || 0}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-4  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.dashlet_type === "chart" && e?.is_fav) {
                return <ChartData key={`chart-${alertIdx}`} data={e} />;
              }
              return null;
            })}
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-4  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (
                // e?.master_Id === panels[activeKey]?.resourceId &&
                e?.dashlet_type === "big_table" &&
                e?.is_fav
              ) {
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
      <div className="col-span-1 space-y-2">
        {allDashboardAlerts?.length > 0 &&
          allDashboardAlerts?.map((e, alertIdx) => {
            if (e?.dashlet_type === "small_table" && e?.is_fav) {
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

export default DefaultArea;
