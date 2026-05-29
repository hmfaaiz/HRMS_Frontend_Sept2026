import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import { User, Briefcase, DollarSign, IdCardLanyard } from "lucide-react";
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
  summaryFilter,
}) => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2 mt-2">
      <div className="col-span-4 space-y-2">
        <div className="grid grid-cols-2 lg:grid-cols-4  gap-x-2 gap-y-2 bg-white rounded-lg px-3 py-2">
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
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Active Loans"}
              value={summaryData?.activeLoan || 0}
              keyName={"activeLoan"}
              icon={<DollarSign className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"EOBI Entitled"}
              value={summaryData?.eobiEmployee || 0}
              keyName={"eobiEmployee"}
              icon={<IdCardLanyard className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Social Security Entitled"}
              value={summaryData?.socialSecurityEmployee || 0}
              keyName={"socialSecurityEmployee"}
              icon={<IdCardLanyard className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Provident Fund Entitled"}
              value={summaryData?.pfEmployee || 0}
              keyName={"pfEmployee"}
              icon={<IdCardLanyard className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Gratuity Entitled"}
              value={summaryData?.gratuityEmployee || 0}
              keyName={"gratuityEmployee"}
              icon={<IdCardLanyard className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Overtime Entitled"}
              value={summaryData?.overTimeEmployee || 0}
              keyName={"overTimeEmployee"}
              icon={<IdCardLanyard className="w-5 h-5 text-white" />}
            />
          </div>
        </div>
        {(() => {
          const sortedBigTables =
            allDashboardAlerts
              ?.filter(
                (el) => el?.dashlet_type === "big_table" && el?.tab_key == "4",
              )
              ?.sort(
                (a, b) => (b?.data?.length || 0) - (a?.data?.length || 0),
              ) || [];

          const sortedCharts =
            allDashboardAlerts
              ?.filter(
                (el) => el?.dashlet_type === "chart" && el?.tab_key == "4",
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
            if (e?.dashlet_type === "small_table" && e?.tab_key == "4") {
              const isFirstOfThisType =
                allDashboardAlerts
                  .filter(
                    (item) =>
                      item?.dashlet_type === "small_table" &&
                      item?.tab_key == "4",
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

export default PayrollArea;
