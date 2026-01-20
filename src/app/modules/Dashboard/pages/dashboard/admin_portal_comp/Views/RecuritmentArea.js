import React from "react";
import { SearchSelect } from "../../../../../../../_metronic/_helpers/SearchSelect";
import StatsCard from "../StatsCard";
import {
  NotepadText,
  HeartHandshake,
  Users,
  BriefcaseBusiness,
  FileUser,
  ListCheck,
} from "lucide-react";
import ChartData from "../Chart";
import { BigTable } from "../BigTable";
import SmallTable from "../SmallTable";
import { HolidayTable } from "../../EmpPortalComponent/HolidayCalendar";

const RecuritmentArea = ({
  allSubsidiaryList,
  allLocationChildMenus,
  allParentDept,
  summaryFilter,
  setSummaryFilter,
  allDashboardAlerts,
  allDesignations,
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
          </div> */}
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
                      (option) => option.value === summaryFilter?.designationId
                    ) || null
              }
              options={[
                { value: "", label: "All" },
                ...(Array.isArray(allDesignations) ? allDesignations : []),
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
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Active Jobs"}
              value={summaryData?.openJobs || 0}
              keyName={"openJobs"}
              icon={<BriefcaseBusiness className="w-5 h-5 text-white" />}
            />
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
              name={"Application Phase"}
              value={summaryData?.applicantInApplicationPhase || 0}
              keyName={"applicantInApplicationPhase"}
              icon={<FileUser className="w-5 h-5 text-white" />}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            <StatsCard
              summaryFilter={summaryFilter}
              setSummaryModalHeading={setSummaryModalHeading}
              name={"Evaluation Phase"}
              value={summaryData?.applicantInEvaluationPhase || 0}
              keyName={"applicantInEvaluationPhase"}
              icon={<ListCheck className="w-5 h-5 text-white" />}
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
        <div className="grid grid-cols-1 xl:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (e?.dashlet_type === "chart" && e?.tab_key == "5") {
                return <ChartData key={`chart-${alertIdx}`} data={e} />;
              }
              return null;
            })}
        </div>
        {/* chart area  */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-x-2 gap-y-2">
          {allDashboardAlerts?.length > 0 &&
            allDashboardAlerts?.map((e, alertIdx) => {
              if (
                e?.tab_key == "5" &&
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
      <div className="col-span-4 lg:col-span-1 grid-cols-3 lg:grid-cols-1 space-y-2">
        {allDashboardAlerts?.length > 0 &&
          allDashboardAlerts?.map((e, alertIdx) => {
            if (
              e?.dashlet_type === "small_table" &&
              e?.tab_key == "5"
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

export default RecuritmentArea;
