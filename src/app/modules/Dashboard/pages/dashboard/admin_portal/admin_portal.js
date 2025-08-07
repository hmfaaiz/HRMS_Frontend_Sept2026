import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { BigTable } from "../admin_portal_comp/BigTable";
import * as actions from "../../../_redux/dashboardActions";
import { useDispatch } from "react-redux";
import ChartData from "../admin_portal_comp/Chart";
import SmallTable from "../admin_portal_comp/SmallTable";
import {
  fetchAllFormsMenu,
  fetchAllParentDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { BriefcaseBusiness, Users } from "lucide-react";

const panels = [
  {
    title: "Employee",
    key: "Employee",
    resourceId: 1784,
  },
  {
    title: "Leave",
    key: "Leave Management",
    resourceId: 308,
  },
  {
    title: "Attendance",
    key: "Attendance Management",
    resourceId: 1726,
  },
  {
    title: "Payroll",
    key: "Payroll",
    resourceId: 252,
  },
  {
    title: "Recruitment",
    key: "Recruitment",
    resourceId: 1893,
  },
];

export const AdminPortal = () => {
  const dispatch = useDispatch();

  const userAccess = useSelector((state) => state.auth?.userAccess || {});
  const user = useSelector((state) => state.auth?.user || {});
  const dashboard = useSelector((state) => state.dashboard || []);

 

  const [activeKey, setActiveKey] = useState("0"); // Default to Employee
  const [empSummaryFilter, setEmpSummaryFilter] = useState({
    subsidiaryId: user?.EmployeeMapping?.subsidiaryId || "",
    gradeId: "",
    departmentId: "",
    locationId: "",
  });

  const [recruitmentSummaryFilter, setRecruitmentSummaryFilter] = useState({
    subsidiaryId: user?.EmployeeMapping?.subsidiaryId || "",
    designationId: "",
    departmentId: "",
    locationId: "",
  });

  const {
    allDashboardAlerts,
    allSubsidiaryList,
    allEmployeegradeList,
    allLocationChildMenus,
    allDesignations,
    allParentDept,
    recruitmentSummary,
    employeeSummary,
  } = dashboard;

  const filteredPanels = panels.filter((panel) =>
    Object.keys(userAccess).includes(panel.key)
  );
  const handleToggle = (key) => {
    setActiveKey(key === activeKey ? "1" : key);
  };

  useEffect(() => {
    dispatch(actions.fetchDashboardAlert());
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllParentDept());
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, []);

  useEffect(() => {
    dispatch(actions.fetchEmployeeSummary(empSummaryFilter));
  }, [empSummaryFilter]);

  useEffect(() => {
    dispatch(actions.fetchRecruitmentSummary(recruitmentSummaryFilter));
  }, [recruitmentSummaryFilter]);

  return (
    <div className="mt-3">
      <div className="row">
        {filteredPanels.map((panel, idx) => {
          const key = `${idx}`;
          const isActive = activeKey === key;

          return (
            <div className="col-md-2-5 mb-2" key={key}>
              <Card onClick={() => handleToggle(key)}>
                <Card.Header
                  style={{
                    cursor: "pointer",
                    backgroundColor: isActive ? "#0093dd" : "gray",
                    color: "#ffffff",
                    padding: "1rem",
                    borderRadius: "5px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                  className="d-flex justify-content-between align-items-center p-3"
                >
                  <span>{panel.title}</span>
                  <KeyboardArrowDown
                    style={{
                      transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Card.Header>
              </Card>
            </div>
          );
        })}
      </div>

      <div style={{ background: "transparent" }} className="row">
        <div className="col-12">
          {filteredPanels.map((panel, idx) => {
            const key = `${idx}`;
            if (activeKey !== key) return null;

            return (
              <div key={key} className="row align-items-start mt-3">
                {/* Left Side: Filters + BigTable */}
                <div className="col-md-9">
                  {/* Filters */}
                  {panel.key == "Employee" && (
                    <div
                      className="row my-3"
                      style={{
                        backgroundColor: "rgb(235 243 255)",
                        padding: "0px 10px",
                        borderRadius: "5px",
                        margin: "0px",
                        border: "2px solid #adceff",
                      }}
                    >
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="subsidiaryId"
                          isDisabled={!allSubsidiaryList}
                          label={<span>Subsidiary</span>}
                          onChange={(e) =>
                            setEmpSummaryFilter({
                              ...empSummaryFilter,
                              subsidiaryId: e.value,
                            })
                          }
                          value={
                            allSubsidiaryList?.find(
                              (e) => e?.value === empSummaryFilter?.subsidiaryId
                            ) || ""
                          }
                          options={[
                            { value: "", label: "All" },
                            ...(Array.isArray(allSubsidiaryList)
                              ? allSubsidiaryList
                              : []),
                          ]}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="gradeId"
                          isDisabled={!allEmployeegradeList}
                          label={<span>Grade</span>}
                          onChange={(e) =>
                            setEmpSummaryFilter({
                              ...empSummaryFilter,
                              gradeId: e.value,
                            })
                          }
                          value={
                            allEmployeegradeList?.find(
                              (e) => e?.value === empSummaryFilter?.gradeId
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
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="departmentId"
                          isDisabled={!allParentDept}
                          label={<span>Department</span>}
                          onChange={(e) =>
                            setEmpSummaryFilter({
                              ...empSummaryFilter,
                              departmentId: e.value,
                            })
                          }
                          value={
                            allParentDept?.find(
                              (e) => e?.value === empSummaryFilter?.departmentId
                            ) || ""
                          }
                          options={[
                            { value: "", label: "All" },
                            ...(Array.isArray(allParentDept)
                              ? allParentDept
                              : []),
                          ]}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="locationId"
                          isDisabled={!allLocationChildMenus}
                          label={<span>Location</span>}
                          onChange={(e) =>
                            setEmpSummaryFilter({
                              ...empSummaryFilter,
                              locationId: e.value,
                            })
                          }
                          value={
                            allLocationChildMenus?.find(
                              (e) => e?.value === empSummaryFilter?.locationId
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
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {employeeSummary?.activeEmployee || 0}
                          </p>
                          <p>Total Employees</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {" "}
                            {employeeSummary?.inActiveEmployee || 0}
                          </p>
                          <p>Inactive Employees</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {employeeSummary?.newEmployee || 0}
                          </p>
                          <p>New Joiners</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {employeeSummary?.employeeOnLeave || 0}
                          </p>
                          <p>Employees on Leave</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {panel.key == "Recruitment" && (
                    <div
                      className="row my-3"
                      style={{
                        backgroundColor: "rgb(235 243 255)",
                        padding: "0px 10px",
                        borderRadius: "5px",
                        margin: "0px",
                        border: "2px solid #adceff",
                      }}
                    >
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="subsidiaryId"
                          isDisabled={!allSubsidiaryList}
                          label={<span>Subsidiary</span>}
                          onChange={(e) =>
                            setRecruitmentSummaryFilter({
                              ...recruitmentSummaryFilter,
                              subsidiaryId: e.value,
                            })
                          }
                          value={
                            allSubsidiaryList?.find(
                              (e) =>
                                e?.value ===
                                recruitmentSummaryFilter?.subsidiaryId
                            ) || ""
                          }
                          options={[
                            { value: "", label: "All" },
                            ...(Array.isArray(allSubsidiaryList)
                              ? allSubsidiaryList
                              : []),
                          ]}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="designationId"
                          isDisabled={!allDesignations}
                          label={<span>Designation</span>}
                          onChange={(e) =>
                            setRecruitmentSummaryFilter({
                              ...recruitmentSummaryFilter,
                              designationId: e.value,
                            })
                          }
                          value={
                            allDesignations?.find(
                              (e) =>
                                e?.value ===
                                recruitmentSummaryFilter?.designationId
                            ) || ""
                          }
                          options={[
                            { value: "", label: "All" },
                            ...(Array.isArray(allDesignations)
                              ? allDesignations
                              : []),
                          ]}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="departmentId"
                          isDisabled={!allParentDept}
                          label={<span>Department</span>}
                          onChange={(e) =>
                            setRecruitmentSummaryFilter({
                              ...recruitmentSummaryFilter,
                              departmentId: e.value,
                            })
                          }
                          value={
                            allParentDept?.find(
                              (e) =>
                                e?.value ===
                                recruitmentSummaryFilter?.departmentId
                            ) || ""
                          }
                          options={[
                            { value: "", label: "All" },
                            ...(Array.isArray(allParentDept)
                              ? allParentDept
                              : []),
                          ]}
                        />
                      </div>
                      <div className="col-md-3 mb-2">
                        <SearchSelect
                          name="locationId"
                          isDisabled={!allLocationChildMenus}
                          label={<span>Location</span>}
                          onChange={(e) =>
                            setRecruitmentSummaryFilter({
                              ...recruitmentSummaryFilter,
                              locationId: e.value,
                            })
                          }
                          value={
                            allLocationChildMenus?.find(
                              (e) =>
                                e?.value ===
                                recruitmentSummaryFilter?.locationId
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
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <BriefcaseBusiness size={"25px"} />
                          <p class="h3 my-2">
                            {recruitmentSummary?.openJobs || 0}
                          </p>
                          <p>Open Jobs</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {" "}
                            {recruitmentSummary?.applicant || 0}
                          </p>
                          <p>Total Applicant</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {recruitmentSummary?.applicantInApplicationPhase ||
                              0}
                          </p>
                          <p>Application Phase</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {recruitmentSummary?.applicantInEvaluationPhase ||
                              0}
                          </p>
                          <p>Evaluation Phase</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {recruitmentSummary?.applicantInFinalPhase || 0}
                          </p>
                          <p>Final Phase</p>
                        </div>
                      </div>
                      <div className="col-md-3 mb-2">
                        <div
                          style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            margin: "4px 5px",
                            padding: "10px",
                          }}
                        >
                          <Users size={"25px"} />
                          <p class="h3 my-2">
                            {recruitmentSummary?.applicantHiredThisYear || 0}
                          </p>
                          <p>Hired This Year</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {allDashboardAlerts.map((e, alertIdx) => {
                    if (
                      e?.dashlet_type === "chart" &&
                      e?.master_Id === panels[activeKey]?.resourceId &&
                      panel?.key == "Recruitment"
                    ) {
                      return <ChartData key={`chart-${alertIdx}`} data={e} />;
                    }
                    return null;
                  })}
                  {allDashboardAlerts.map((e, alertIdx) => {
                    if (
                      e?.dashlet_type === "chart" &&
                      panel?.key !== "Recruitment" &&
                      e?.master_Id != "1893"
                    ) {
                      return <ChartData key={`chart-${alertIdx}`} data={e} />;
                    }
                    return null;
                  })}
                  {/* Big Table */}
                  {allDashboardAlerts.map((e, alertIdx) => {
                    if (
                      e?.master_Id === panels[activeKey]?.resourceId &&
                      e?.dashlet_type === "big_table"
                    ) {
                      return <BigTable key={`big-${alertIdx}`} data={e} />;
                    }
                    return null;
                  })}
                </div>

                {/* Right Side: Charts + Small Tables */}
                <div className="col-md-3">
                  {allDashboardAlerts.map((e, alertIdx) => {
                    if (
                      e?.dashlet_type === "small_table" &&
                      panel?.key !== "Recruitment" &&
                      e?.master_Id != "1893"
                    ) {
                      return <SmallTable key={`small-${alertIdx}`} data={e} />;
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
