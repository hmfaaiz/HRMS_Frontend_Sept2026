import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import StatsCard from "../StatsCard";
import { PackageOpen, UserCheck, UserX, ArchiveX } from "lucide-react";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";
const AssetsArea = ({
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

          {/* <div>
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
          <div></div> */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Total Assets"}
              value={summaryData?.totalAssets || 0}
              keyName={"totalAssets"}
              icon={<PackageOpen className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Assigned Assets"}
              value={summaryData?.assignedAssets || 0}
              keyName={"assignedAssets"}
              icon={<UserCheck className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Unassigned Assets"}
              value={summaryData?.unAssignedAssets || 0}
              keyName={"unAssignedAssets"}
              icon={<UserX className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Assets Expire This Year"}
              value={summaryData?.assetsExpireThisYear || 0}
              keyName={"assetsExpireThisYear"}
              icon={<ArchiveX className="w-5 h-5 text-white" />}
            />
          </div>
        </div>
        {(() => {
          const sortedBigTables =
            allDashboardAlerts
              ?.filter(
                (el) => el?.dashlet_type === "big_table" && el?.tab_key == "9",
              )
              ?.sort(
                (a, b) => (b?.data?.length || 0) - (a?.data?.length || 0),
              ) || [];

          const sortedCharts =
            allDashboardAlerts
              ?.filter(
                (el) => el?.dashlet_type === "chart" && el?.tab_key == "9",
              )
              ?.sort(
                (a, b) => (b?.data?.length || 0) - (a?.data?.length || 0),
              ) || [];

          const dashboardItems = [...sortedBigTables, ...sortedCharts];

          const leftItems = dashboardItems.filter((_, i) => i % 2 === 0);
          const rightItems = dashboardItems.filter((_, i) => i % 2 !== 0);

          const renderItem = (e, i, side) => {
            if (e?.dashlet_type === "big_table") {
              return (
                <BigTable
                  key={`big-${side}-${i}`}
                  setBigTableModalData={setBigTableModalData}
                  expand={i === 0}
                  data={e}
                />
              );
            }

            return (
              <ChartData key={`chart-${side}-${i}`} expand={false} data={e} />
            );
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">
              <div className="space-y-2">
                {leftItems.map((e, i) => renderItem(e, i, "left"))}
              </div>

              <div className="space-y-2">
                {rightItems.map((e, i) => renderItem(e, i, "right"))}
              </div>
            </div>
          );
        })()}
      </div>
      <div className="col-span-4 lg:col-span-1 grid-cols-3 lg:grid-cols-1 space-y-2">
        {allDashboardAlerts?.length > 0 &&
          allDashboardAlerts?.map((e, alertIdx) => {
            if (e?.dashlet_type === "small_table" && e?.tab_key == "9") {
              const isFirstOfThisType =
                allDashboardAlerts
                  .filter(
                    (item) =>
                      item?.dashlet_type === "small_table" &&
                      item?.tab_key == "9",
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

export default AssetsArea;
