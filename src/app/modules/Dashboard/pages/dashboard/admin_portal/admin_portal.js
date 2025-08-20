import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as actions from "../../../_redux/dashboardActions";
import { useDispatch } from "react-redux";
import {
  fetchAllFormsMenu,
  fetchAllParentDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";

import AdminHead from "../admin_portal_comp/AdminHead";
import EmployeeArea from "../admin_portal_comp/Views/EmployeeArea";
import LeaveArea from "../admin_portal_comp/Views/LeaveArea";
import AttendanceArea from "../admin_portal_comp/Views/AttendanceArea";
import RecuritmentArea from "../admin_portal_comp/Views/RecuritmentArea";
import PayrollArea from "../admin_portal_comp/Views/PayrollArea";
import DefaultArea from "../admin_portal_comp/Views/DefaultArea";
import BigTableModal from "../admin_portal_comp/ExpandViews/BigTableModal";
import SmallTableModal from "../admin_portal_comp/ExpandViews/SmallTableModal";
import StatsCardModal from "../admin_portal_comp/ExpandViews/StatsCardModal";

export const AdminPortal = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  //for dropdown of tab intially default
  const [activeTab, setActiveTab] = useState("default"); // Default to Employee

  const [bigTableModalData, setBigTableModalData] = useState(null);
  const [smallTableModalData, setSmallTableModalData] = useState(null);
  const [summaryModalHeading , setSummaryModalHeading] = useState("");
  const [summaryFilter, setSummaryFilter] = useState({
    subsidiaryId: user?.EmployeeMapping?.subsidiaryId || "",
    gradeId: "",
    departmentId: "",
    designationId: "",
    locationId: "",
  });

  const user = useSelector((state) => state.auth?.user || {});
  const dashboard = useSelector((state) => state.dashboard || []);


  const {
    allDashboardAlerts,
    allSubsidiaryList,
    allEmployeegradeList,
    allLocationChildMenus,
    allDesignations,
    allParentDept,
    summaryData,
    summaryDetailData,
    announcement,
    holidayList,
  } = dashboard;

  useEffect(() => {
    setIsLoading(true);
    dispatch(actions.fetchDashboardAlert());
    dispatch(actions.fetchAnnouncementData());
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllParentDept());
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(actions.fetchHolidayDetail());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(actions.fetchSummary(summaryFilter));
    setIsLoading(false);
  }, [summaryFilter]);

  const handleTabChange = (e) => {
    setSummaryFilter({
      subsidiaryId: user?.EmployeeMapping?.subsidiaryId || "",
      gradeId: "",
      departmentId: "",
      designationId: "",
      locationId: "",
    });
    setActiveTab(e?.value);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <>
          <AdminHead
            announcement={announcement}
            handleChange={handleTabChange}
            activeTab={activeTab}
          />
          {activeTab === "default" ? (
            <DefaultArea
              allSubsidiaryList={allSubsidiaryList}
              allLocationChildMenus={allLocationChildMenus}
              summaryFilter={summaryFilter}
              allParentDept={allParentDept}
              setSummaryFilter={setSummaryFilter}
              allEmployeegradeList={allEmployeegradeList}
              allDashboardAlerts={allDashboardAlerts}
              summaryData={summaryData}
              setBigTableModalData={setBigTableModalData}
              setSmallTableModalData={setSmallTableModalData}
              setSummaryModalHeading={setSummaryModalHeading}
              holidayList={holidayList}
            />
          ) : activeTab === "employee" ? (
            <EmployeeArea
              allSubsidiaryList={allSubsidiaryList}
              allLocationChildMenus={allLocationChildMenus}
              summaryFilter={summaryFilter}
              allParentDept={allParentDept}
              setSummaryFilter={setSummaryFilter}
              allEmployeegradeList={allEmployeegradeList}
              allDashboardAlerts={allDashboardAlerts}
              summaryData={summaryData}
              setBigTableModalData={setBigTableModalData}
              setSmallTableModalData={setSmallTableModalData}
              setSummaryModalHeading={setSummaryModalHeading}
              holidayList={holidayList}
            />
          ) : activeTab === "leave_management" ? (
            <LeaveArea
              allSubsidiaryList={allSubsidiaryList}
              allLocationChildMenus={allLocationChildMenus}
              summaryFilter={summaryFilter}
              allParentDept={allParentDept}
              setSummaryFilter={setSummaryFilter}
              allEmployeegradeList={allEmployeegradeList}
              allDashboardAlerts={allDashboardAlerts}
              summaryData={summaryData}
              setBigTableModalData={setBigTableModalData}
              setSmallTableModalData={setSmallTableModalData}
              setSummaryModalHeading={setSummaryModalHeading}
              holidayList={holidayList}
            />
          ) : activeTab === "attendance_management" ? (
            <AttendanceArea
              allSubsidiaryList={allSubsidiaryList}
              allLocationChildMenus={allLocationChildMenus}
              summaryFilter={summaryFilter}
              allParentDept={allParentDept}
              setSummaryFilter={setSummaryFilter}
              allEmployeegradeList={allEmployeegradeList}
              allDashboardAlerts={allDashboardAlerts}
              summaryData={summaryData}
            />
          ) : activeTab === "recruitment" ? (
            <RecuritmentArea
              allSubsidiaryList={allSubsidiaryList}
              allLocationChildMenus={allLocationChildMenus}
              allDesignations={allDesignations}
              summaryFilter={summaryFilter}
              allParentDept={allParentDept}
              setSummaryFilter={setSummaryFilter}
              allEmployeegradeList={allEmployeegradeList}
              allDashboardAlerts={allDashboardAlerts}
              summaryData={summaryData}
              setBigTableModalData={setBigTableModalData}
              setSmallTableModalData={setSmallTableModalData}
              setSummaryModalHeading={setSummaryModalHeading}
              holidayList={holidayList}
            />
          ) : (
            <PayrollArea
              allSubsidiaryList={allSubsidiaryList}
              allLocationChildMenus={allLocationChildMenus}
              summaryFilter={summaryFilter}
              allParentDept={allParentDept}
              setSummaryFilter={setSummaryFilter}
              allEmployeegradeList={allEmployeegradeList}
              allDashboardAlerts={allDashboardAlerts}
              summaryData={summaryData}
              setBigTableModalData={setBigTableModalData}
              setSmallTableModalData={setSmallTableModalData}
              setSummaryModalHeading={setSummaryModalHeading}
              holidayList={holidayList}
            />
          )}
          <BigTableModal
            show={bigTableModalData}
            data={bigTableModalData}
            onHide={() => {
              setBigTableModalData(null);
            }}
          />
          <SmallTableModal
            show={smallTableModalData}
            data={smallTableModalData}
            onHide={() => {
              setSmallTableModalData(null);
            }}
          />
          <StatsCardModal
            show={summaryDetailData}
            data={summaryDetailData}
            heading={summaryModalHeading}
            onHide={() => {
              setSummaryModalHeading("");
              dispatch(actions.fetchSummaryDetail());
            }}
          />
        </>
      )}
    </>
  );
};
