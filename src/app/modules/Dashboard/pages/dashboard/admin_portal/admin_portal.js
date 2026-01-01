import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../_redux/dashboardActions";
import {
  fetchAllFormsMenu,
  fetchAllParentDept,
  fetchAllSubsidiaryData,
  getActiveFiscalYear,
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
import SeparationArea from "../admin_portal_comp/Views/SeparationArea";
import AppraisalArea from "../admin_portal_comp/Views/AppraisalArea";

export const AdminPortal = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user || {});
  const dashboard = useSelector((state) => state.dashboard || {});

  const [activeTab, setActiveTab] = useState("default");

  const [summaryFilter, setSummaryFilter] = useState({
    subsidiaryId: "",
    gradeId: "",
    departmentId: "",
    designationId: "",
    locationId: "",
    appraisalPeriodId: "",
    appraisalCategoryId: "",
  });

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
    appraisalPeriodBySubList,
    allAppraisalCategory,
  } = dashboard;

  const [bigTableModalData, setBigTableModalData] = useState(null);
  const [smallTableModalData, setSmallTableModalData] = useState(null);
  const [summaryModalHeading, setSummaryModalHeading] = useState("");

  /* ===============================
     1️ INITIAL STATIC DATA
  ================================ */
  useEffect(() => {
    dispatch(actions.fetchAnnouncementData());
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
    dispatch(actions.fetchHolidayDetail());
  }, [dispatch]);
  /* ===============================
     2️ SET DEFAULT SUBSIDIARY
  ================================ */
  useEffect(() => {
    if (!allSubsidiaryList?.length || !user?.EmployeeMapping?.subsidiaryId)
      return;

    const subs = allSubsidiaryList.find(
      (s) => s.value === user.EmployeeMapping.subsidiaryId
    );

    if (subs) {
      setSummaryFilter((prev) => ({
        ...prev,
        subsidiaryId: subs.value,
      }));
    }
  }, [allSubsidiaryList, user?.EmployeeMapping?.subsidiaryId]);

  /* ===============================
     3️ APPRAISAL DEFAULTS
     Set appraisalPeriodId & appraisalCategoryId before fetching alerts
  ================================ */
  useEffect(() => {
    if (activeTab !== "appraisal") return;

    setSummaryFilter((prev) => ({
      ...prev,
      appraisalPeriodId:
        appraisalPeriodBySubList?.find((e) => e?.isActive)?.value ??
        appraisalPeriodBySubList?.[0]?.value ??
        "",
      appraisalCategoryId: allAppraisalCategory?.[0]?.value ?? "",
    }));
  }, [activeTab, appraisalPeriodBySubList, allAppraisalCategory]);

  /* ===============================
     4️ FETCH DASHBOARD ALERTS + DEPTS
  ================================ */
  useEffect(() => {
    // For appraisal, wait until both values exist
    // if (
    //   activeTab === "appraisal" &&
    //   (!summaryFilter.appraisalPeriodId || !summaryFilter.appraisalCategoryId)
    // )
    //   return;

    dispatch(
      actions.fetchDashboardAlert({
        subsidiaryId: summaryFilter.subsidiaryId,
        activeTab,
        appraisalPeriodId: summaryFilter.appraisalPeriodId,
        appraisalCategoryId: summaryFilter.appraisalCategoryId,
      })
    );
    if (!summaryFilter.subsidiaryId) return;
    dispatch(fetchAllParentDept(summaryFilter.subsidiaryId));
  }, [
    dispatch,
    summaryFilter.subsidiaryId,
    activeTab,
    summaryFilter.appraisalPeriodId,
    summaryFilter.appraisalCategoryId,
  ]);

  /* ===============================
     5️ SUMMARY DATA (CONTROLLED)
  ================================ */
  useEffect(() => {
    // if (!summaryFilter.subsidiaryId) return;

    dispatch(actions.fetchSummary(summaryFilter));
  }, [
    dispatch,
    summaryFilter.subsidiaryId,
    summaryFilter.gradeId,
    summaryFilter.departmentId,
    summaryFilter.designationId,
    summaryFilter.locationId,
    summaryFilter.appraisalPeriodId,
    summaryFilter.appraisalCategoryId,
  ]);

  /* ===============================
     6️ FISCAL YEAR & APPRAISAL PERIODS
  ================================ */
  useEffect(() => {
    if (!summaryFilter.subsidiaryId) return;

    dispatch(
      getActiveFiscalYear("activeFiscalYear", summaryFilter.subsidiaryId)
    );

    if (activeTab === "appraisal") {
      dispatch(
        actions.fetchAllAppraisalPeriodDataBySubsidiaryId(
          summaryFilter.subsidiaryId
        )
      );
    }
  }, [dispatch, summaryFilter.subsidiaryId, activeTab]);

  /* ===============================
     TAB CHANGE HANDLER
  ================================ */
  const handleTabChange = (e) => {
    setActiveTab(e.value);
    setSummaryFilter((prev) => ({
      ...prev,
      gradeId: "",
      departmentId: "",
      designationId: "",
      locationId: "",
      appraisalPeriodId: "",
      appraisalCategoryId: "",
    }));
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <>
      {" "}
      <AdminHead
        announcement={announcement}
        handleChange={handleTabChange}
        activeTab={activeTab}
        allSubsidiaryList={allSubsidiaryList}
        summaryFilter={summaryFilter}
        setSummaryFilter={setSummaryFilter}
        dashboard={dashboard}
      />{" "}
      {activeTab === "default" ? (
        <DefaultArea
          allSubsidiaryList={allSubsidiaryList}
          summaryFilter={summaryFilter}
          allLocationChildMenus={allLocationChildMenus}
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
      ) : activeTab === "leave" ? (
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
      ) : activeTab === "attendance" ? (
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
      ) : activeTab === "payroll" ? (
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
      ) : activeTab === "separation" ? (
        <SeparationArea
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
      ) : activeTab === "appraisal" ? (
        <AppraisalArea
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
      ) : null}
      <BigTableModal
        show={bigTableModalData}
        data={bigTableModalData}
        onHide={() => {
          setBigTableModalData(null);
        }}
      />{" "}
      <SmallTableModal
        show={smallTableModalData}
        data={smallTableModalData}
        onHide={() => {
          setSmallTableModalData(null);
        }}
      />{" "}
      <StatsCardModal
        show={summaryDetailData}
        data={summaryDetailData}
        heading={summaryModalHeading}
        onHide={() => {
          setSummaryModalHeading("");
          dispatch(actions.fetchSummaryDetail());
        }}
      />{" "}
    </>
  );
};
