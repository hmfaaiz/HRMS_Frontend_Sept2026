import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import { User, Briefcase } from "lucide-react";
import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";

const PayrollArea = ({
  allSubsidiaryList,
  allLocationChildMenus,
  allParentDept,
  allEmployeegradeList,
  setSummaryFilter,
  allDashboardAlerts,
  summaryData,
  setSmallTableModalData,
  setSummaryModalHeading,
  setBigTableModalData,
  holidayList,
}) => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2 mt-2">
      <div className="col-span-4 space-y-2">
        {/*         <div className="grid grid-cols-2 lg:grid-cols-4  gap-x-2 gap-y-2 bg-white rounded-lg px-3 py-2">
          
          <div>
            <SearchSelect
              name="gradeId"
              isDisabled={!allEmployeegradeList}
              label={<span>Grade</span>}
              onChange={(e) =>
                setSummaryFilter({
                  ...setSummaryFilter,
                  gradeId: e.value,
                })
              }
              value={
                allEmployeegradeList?.find(
                  (e) => e?.value === setSummaryFilter?.gradeId
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
                  ...setSummaryFilter,
                  departmentId: e.value,
                })
              }
              value={
                allParentDept?.find(
                  (e) => e?.value === setSummaryFilter?.departmentId
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
                  ...setSummaryFilter,
                  locationId: e.value,
                })
              }
              value={
                allLocationChildMenus?.find(
                  (e) => e?.value === setSummaryFilter?.locationId
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
          <div></div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Total Active Employees"}
              value={summaryData?.activeEmployee || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"activeEmployee"}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Inactive Employees in current Fiscal Year"}
              value={summaryData?.inActiveEmployee || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"inActiveEmployee"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"New Employees"}
              value={summaryData?.newEmployee || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"newEmployee"}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Today Employees On Leave"}
              value={summaryData?.employeeOnLeave || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"employeeOnLeave"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Active Jobs"}
              value={summaryData?.openJobs || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"openJobs"}
              icon={<Briefcase className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Active Applicants"}
              value={summaryData?.applicant || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"applicant"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              name={"Applicants Hired"}
              value={summaryData?.applicantHiredThisYear || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"applicantHiredThisYear"}
              icon={<User className="w-5 h-5 text-white" />}
            />
            <StatsCard
              name={"Applicants Final Phase"}
              value={summaryData?.applicantInFinalPhase || 0}
              setSummaryModalHeading={setSummaryModalHeading}
              keyName={"applicantInFinalPhase"}
              icon={<User className="w-5 h-5 text-white" />}
            />
          </div>
        </div> */}
        {/* chart area  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.dashlet_type === "chart" && e?.tab_key === "payroll") {
                return <ChartData key={`chart-${alertIdx}`} data={e} />;
              }
              return null;
            })}
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.tab_key === "payroll" && e?.dashlet_type === "big_table") {
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
            if (e?.dashlet_type === "small_table" && e?.tab_key === "payroll") {
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

export default PayrollArea;
