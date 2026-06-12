import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import {
  ClipboardCheck,
  ClipboardCopy,
  ClipboardPaste,
  Clipboard,
  BadgeDollarSign,
  WalletCards,
  PiggyBank,
} from "lucide-react";
import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";
import DoubleLineChart from "../DoubleLineChart";

const BudgetArea = ({
  allSubsidiaryList,
  allLocationChildMenus,
  summaryFilter,
  allParentDept,
  allEmployeegradeList,
  allDesignations,
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
        <div className="grid grid-cols-2 lg:grid-cols-4  gap-x-2 gap-y-2 bg-white rounded-lg px-3 py-2">
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
              name="designationId"
              isDisabled={!allDesignations}
              label={<span>Designation</span>}
              onChange={(e) =>
                setSummaryFilter({
                  ...summaryFilter,
                  designationId: e.value,
                })
              }
              value={
                summaryFilter?.designationId == ""
                  ? { value: "", label: "All" }
                  : allDesignations?.find(
                      (option) => option.value === summaryFilter.designationId,
                    ) || null
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allDesignations) ? allDesignations : []),
              ]}
            />
          </div>
          <div></div>
          <div></div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Total Request"}
              value={summaryData?.totalBudgetRecord || 0}
              keyName={"totalBudgetRecord"}
              icon={<Clipboard className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Pending Request"}
              value={summaryData?.pendingBudget || 0}
              keyName={"pendingBudget"}
              icon={<ClipboardPaste className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Approved Request"}
              value={summaryData?.approvedBudget || 0}
              keyName={"approvedBudget"}
              icon={<ClipboardCheck className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Rejected Request"}
              value={summaryData?.rejectedBudget || 0}
              keyName={"rejectedBudget"}
              icon={<ClipboardCopy className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Total Budget"}
              value={summaryData?.totalBudget || 0}
              isAmountFormat={true}
              keyName={"totalBudget"}
              icon={<BadgeDollarSign className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Utilized Budget"}
              isAmountFormat={true}
              value={Number(summaryData?.utilizedBudget) || 0}
              keyName={"utilizedBudget"}
              icon={<WalletCards className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Remaining Budget"}
              value={summaryData?.unUtilizedBudget || 0}
              isAmountFormat={true}
              keyName={"unUtilizedBudget"}
              icon={<PiggyBank className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Total Hiring"}
              value={summaryData?.totalHired || 0}
              keyName={"totalHired"}
              icon={<WalletCards className="w-5 h-5 text-white" />}
            />
          </div>
        </div>
        {/* chart area  */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts
              ?.filter(
                (el) => el?.tab_key == "6" && el?.dashlet_type == "big_table",
              )
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
        <div className="grid grid-cols-1 xl:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts
              ?.filter(
                (el) => el?.tab_key == "6" && el?.dashlet_type == "chart",
              )
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
        </div> */}

        {(() => {
          const sortedBigTables =
            allDashboardAlerts
              ?.filter(
                (el) => el?.dashlet_type === "big_table" && el?.tab_key == "8",
              )
              ?.sort(
                (a, b) => (b?.data?.length || 0) - (a?.data?.length || 0),
              ) || [];

          const sortedCharts =
            allDashboardAlerts
              ?.filter(
                (el) => el?.dashlet_type === "chart" && el?.tab_key == "8",
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

            return e?.twoLineChart ? (
              <DoubleLineChart
                key={`chart-${side}-${i}`}
                expand={false}
                data={e}
              />
            ) : (
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
            if (e?.dashlet_type === "small_table" && e?.tab_key == "8") {
              const isFirstOfThisType =
                allDashboardAlerts
                  .filter(
                    (item) =>
                      item?.dashlet_type === "small_table" &&
                      item?.tab_key == "6",
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

export default BudgetArea;
