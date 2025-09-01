import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";

import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import StatsCard from "../StatsCard";
import {
  UserCheck,
  UserX,
  Handshake,
  CalendarClock,
  Mars,
  Venus,
  Cake,
} from "lucide-react";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";

const EmployeeArea = ({
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
  holidayList,
  setSummaryModalHeading,
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
          {/* stats card area  */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Active Employees"}
              value={summaryData?.activeEmployee || 0}
              keyName={"activeEmployee"}
              icon={<UserCheck className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Inactive Employees"}
              value={summaryData?.inActiveEmployee || 0}
              keyName={"inActiveEmployee"}
              icon={<UserX className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Joined this Year"}
              value={summaryData?.newEmployee || 0}
              keyName={"newEmployee"}
              icon={<Handshake className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Separated this Year"}
              value={summaryData?.leftEmployee || 0}
              keyName={"leftEmployee"}
              icon={<CalendarClock className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Male Employees"}
              value={summaryData?.maleEmployee || 0}
              keyName={"maleEmployee"}
              icon={<Mars className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Female Employees"}
              value={summaryData?.femaleEmployee || 0}
              keyName={"femaleEmployee"}
              icon={<Venus className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Average Age"}
              value={summaryData?.averageAgeEmployee || 0}
              keyName={"averageAgeEmployee"}
              icon={<Cake className="w-5 h-5 text-white" />}
            />
            {/* <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}

              name={"Applicants Final Phase"}
              value={summaryData?.applicantInFinalPhase || 0}
              keyName={"applicantInFinalPhase"}
              icon={<User className="w-5 h-5 text-white" />}
            /> */}
          </div>
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-4  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.dashlet_type === "chart" && e?.tab_key === "employee") {
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
                e?.tab_key === "employee" &&
                e?.dashlet_type === "big_table"
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
            if (
              e?.dashlet_type === "small_table" &&
              e?.tab_key === "employee"
            ) {
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

export default EmployeeArea;