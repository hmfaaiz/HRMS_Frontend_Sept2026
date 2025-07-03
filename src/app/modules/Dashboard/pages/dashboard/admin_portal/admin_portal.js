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
import { Users } from "lucide-react";

const panels = [
  {
    title: "Employee Management",
    key: "Employee",
    resourceId: 1784,
  },
  {
    title: "Leave Management",
    key: "Leave Management",
    resourceId: 308,
  },
  {
    title: "Attendance Management",
    key: "Attendance Management",
    resourceId: 1726,
  },
  {
    title: "Payroll Management",
    key: "Payroll",
    resourceId: 252,
  },
];

export const AdminPortal = () => {
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("0"); // Default to Employee
  const [filter, setFilter] = useState({
    subsidiaryId: "",
    gradeId: "",
    departmentId: "",
    locationId: "",
  });

  const userAccess = useSelector((state) => state.auth?.userAccess || {});

  const dashboard = useSelector((state) => state.dashboard || []);

  const {
    allDashboardAlerts,
    allSubsidiaryList,
    allEmployeegradeList,
    allLocationChildMenus,
    allParentDept,
  } = dashboard;

  const filteredPanels = panels.filter((panel) =>
    Object.keys(userAccess).includes(panel.key)
  );

  const handleToggle = (key) => {
    setActiveKey(key === activeKey ? null : key);
  };

  useEffect(() => {
    dispatch(actions.fetchDashboardAlert());
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllParentDept());
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, []);

  useEffect(() => {
    dispatch(actions.fetchEmployeeSummary(filter));
  }, [filter]);

  return (
    <div className="mt-3">
      <div className="row">
        {filteredPanels.map((panel, idx) => {
          const key = `${idx}`;
          const isActive = activeKey === key;

          return (
            <div className="col-md-3 mb-2" key={key}>
              <Card onClick={() => handleToggle(key)}>
                <Card.Header
                  style={{
                    cursor: "pointer",
                    backgroundColor: isActive ? "#0093dd" : "#333333",
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
                  <div
                    className="row mb-3"
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
                          setFilter({ ...filter, subsidiaryId: e.value })
                        }
                        value={
                          allSubsidiaryList?.find(
                            (e) => e?.value === filter?.subsidiaryId
                          ) || ""
                        }
                        options={allSubsidiaryList}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <SearchSelect
                        name="gradeId"
                        isDisabled={!allEmployeegradeList}
                        label={<span>Grade</span>}
                        onChange={(e) =>
                          setFilter({ ...filter, gradeId: e.value })
                        }
                        value={
                          allEmployeegradeList?.find(
                            (e) => e?.value === filter?.gradeId
                          ) || ""
                        }
                        options={allEmployeegradeList}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <SearchSelect
                        name="departmentId"
                        isDisabled={!allParentDept}
                        label={<span>Department</span>}
                        onChange={(e) =>
                          setFilter({ ...filter, departmentId: e.value })
                        }
                        value={
                          allParentDept?.find(
                            (e) => e?.value === filter?.departmentId
                          ) || ""
                        }
                        options={allParentDept}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <SearchSelect
                        name="locationId"
                        isDisabled={!allLocationChildMenus}
                        label={<span>Location</span>}
                        onChange={(e) =>
                          setFilter({ ...filter, locationId: e.value })
                        }
                        value={
                          allLocationChildMenus?.find(
                            (e) => e?.value === filter?.locationId
                          ) || ""
                        }
                        options={allLocationChildMenus}
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
                        <p class="h3 my-2">500</p>
                        <p>Total Employee</p>
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
                        <p class="h3 my-2">500</p>
                        <p>Total Employee</p>
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
                        <p class="h3 my-2">500</p>
                        <p>Total Employee</p>
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
                        <p class="h3 my-2">500</p>
                        <p>Total Employee</p>
                      </div>
                    </div>
                  </div>

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
                    if (e?.dashlet_type === "chart") {
                      return <ChartData key={`chart-${alertIdx}`} data={e} />;
                    } else if (e?.dashlet_type === "small_table") {
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
