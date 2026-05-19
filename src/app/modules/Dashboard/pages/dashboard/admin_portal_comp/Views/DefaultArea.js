import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import {
  BriefcaseBusiness,
  Handshake,
  HeartHandshake,
  HouseWifi,
  NotepadText,
  User,
  User2Icon,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
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
  setSummaryModalHeading,
  holidayList,
}) => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2 mt-2">
      <div className="col-span-4 space-y-2">
        <div className="grid grid-cols-2 lg:grid-cols-4  gap-x-2 gap-y-2 bg-white rounded-lg px-3 py-2">
          {/* dropdown area  */}
          {/* <div>
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
                summaryFilter?.subsidiaryId == ""
                  ? { value: "", label: "All" }
                  : allSubsidiaryList?.find(
                      (option) => option.value === summaryFilter?.subsidiaryId
                    ) || null
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allSubsidiaryList) ? allSubsidiaryList : []),
              ]}
            />
          </div> */}
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
                      (option) => option.value === summaryFilter.gradeId,
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
                      (option) => option.value === summaryFilter?.departmentId,
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
                      (option) => option.value === summaryFilter?.locationId,
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
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Total Active Employees"}
              value={summaryData?.activeEmployee || 0}
              keyName={"activeEmployee"}
              icon={<UserCheck className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Inactive Employees in current Fiscal Year"}
              value={summaryData?.inActiveEmployee || 0}
              keyName={"inActiveEmployee"}
              icon={<UserX className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Joined in current Fiscal Year"}
              value={summaryData?.newEmployee || 0}
              keyName={"newEmployee"}
              icon={<Handshake className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Employee On Probation"}
              value={summaryData?.probEmployee || 0}
              keyName={"probEmployee"}
              icon={<User2Icon className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Today Employees On Leave"}
              value={summaryData?.employeeOnLeave || 0}
              keyName={"employeeOnLeave"}
              icon={<HouseWifi className="w-5 h-5 text-white" />}
            />
            {/* <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Active Jobs"}
              value={summaryData?.openJobs || 0}
              keyName={"openJobs"}
              icon={<BriefcaseBusiness className="w-5 h-5 text-white" />}
            /> */}
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Active Applicants"}
              value={summaryData?.applicant || 0}
              keyName={"applicant"}
              icon={<Users className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Applicants Hired"}
              value={summaryData?.applicantHiredThisYear || 0}
              keyName={"applicantHiredThisYear"}
              icon={<HeartHandshake className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Applicants Finalization Phase"}
              value={summaryData?.applicantInFinalPhase || 0}
              keyName={"applicantInFinalPhase"}
              icon={<NotepadText className="w-5 h-5 text-white" />}
            />
          </div>
        </div>

        {/* chart area  */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts
              ?.filter((el) => el?.dashlet_type === "big_table" && el?.is_fav)
              ?.sort((a, b) => (b?.data?.length || 0) - (a?.data?.length || 0))
              ?.map((e, alertIdx) => {
                return (
                  <BigTable
                    setBigTableModalData={setBigTableModalData}
                    key={`big-${alertIdx}`}
                    expand={alertIdx == 0 || alertIdx == 1}
                    data={e}
                  />
                );
              })}
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-1 xl:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts
              ?.filter((el) => el?.dashlet_type === "chart" && el?.is_fav)
              ?.sort((a, b) => (b?.data?.length || 0) - (a?.data?.length || 0))
              ?.map((e, alertIdx) => {
                return (
                  <ChartData
                    expand={false}
                    key={`chart-${alertIdx}`}
                    data={e}
                  />
                );
              })}
        </div>
      </div>
      <div className="col-span-4 lg:col-span-1 grid-cols-3 lg:grid-cols-1 space-y-2">
        {allDashboardAlerts?.length > 0 &&
          allDashboardAlerts?.map((e, alertIdx) => {
            if (e?.dashlet_type === "small_table" && e?.is_fav) {
              const isFirstOfThisType =
                allDashboardAlerts
                  .filter(
                    (item) =>
                      item?.dashlet_type === "small_table" && item?.is_fav,
                  )
                  .findIndex((item) => item === e) === 0;
              return (
                <SmallTable
                  setSmallTableModalData={setSmallTableModalData}
                  key={`small-${alertIdx}`}
                  data={e}
                  expand={isFirstOfThisType}
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
