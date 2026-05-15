import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import { Hourglass, ListChecks, ListCheck } from "lucide-react";
import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";

const AppraisalArea = ({
  allSubsidiaryList,
  allLocationChildMenus,
  summaryFilter,
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
              name={"No. of Appraisal Published"}
              value={summaryData?.surveyPublish || 0}
              keyName={"surveyPublish"}
              icon={<ListChecks className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"No. of Appraisal Submitted"}
              value={summaryData?.surveySubmitted || 0}
              keyName={"surveySubmitted"}
              icon={<ListCheck className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"No. of Appraisal Pending"}
              value={summaryData?.surveyPending || 0}
              keyName={"surveyPending"}
              icon={<Hourglass className="w-5 h-5 text-white" />}
            />
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Appraisal Rating Finalized"}
              value={summaryData?.surveyRatingFinalized || 0}
              keyName={"surveyRatingFinalized"}
              icon={<Hourglass className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Appraisal Finalized"}
              value={summaryData?.surveyFinalized || 0}
              keyName={"surveyFinalized"}
              icon={<Hourglass className="w-5 h-5 text-white" />}
            />
          </div>
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-2 gap-y-2">
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
                    expand={
                      alertIdx == 0 ||
                      alertIdx == 1
                    }
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
        </div>
      </div>
      <div className="col-span-4 lg:col-span-1 grid-cols-3 lg:grid-cols-1 space-y-2">
        {allDashboardAlerts?.length > 0 &&
          allDashboardAlerts?.map((e, alertIdx) => {
            if (e?.dashlet_type === "small_table" && e?.tab_key == "6") {
              return (
                <SmallTable
                  setSmallTableModalData={setSmallTableModalData}
                  key={`small-${alertIdx}`}
                  data={e}
                  expand={alertIdx == 1}
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

export default AppraisalArea;
