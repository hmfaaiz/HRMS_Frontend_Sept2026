import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { BigTable } from "../admin_portal_comp/BigTable";
import * as actions from "../../../_redux/dashboardActions";
import { useDispatch } from "react-redux";
import ChartData from "../admin_portal_comp/Chart";
import SmallTable from "../admin_portal_comp/SmallTable";
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
  const userAccess = useSelector((state) => state.auth?.userAccess || {});

  const allDashboardAlerts = useSelector(
    (state) => state.dashboard?.allDashboardAlerts || []
  );

  const filteredPanels = panels.filter((panel) =>
    Object.keys(userAccess).includes(panel.key)
  );

  const handleToggle = (key) => {
    setActiveKey(key === activeKey ? null : key);
  };

  useEffect(() => {
    dispatch(actions.fetchDashboardAlert());
  }, []);

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

      {filteredPanels.map((panel, idx) => {
        const key = `${idx}`;
        if (activeKey !== key) return null;

        return (
          <div
            style={{ background: "transparent" }}
            className="row"
            key={`detail-${key}`}
          >
            <div className="col-12">
              <div className="row">
                <div className="col-md-9">
                  {allDashboardAlerts.length > 0 &&
                    allDashboardAlerts.map((e) => {
                      if (
                        e?.master_Id === panels[activeKey]?.resourceId &&
                        e?.dashlet_type === "big_table"
                      ) {
                        return <BigTable data={e} />;
                      }
                    })}
                </div>
                <div className="col-md-3">
                  {allDashboardAlerts.length > 0 &&
                    allDashboardAlerts.map((e) => {
                      if (e?.master_Id === panels[activeKey]?.resourceId) {
                        if (e?.dashlet_type === "chart") {
                          return <ChartData data={e} />;
                        } else if (e?.dashlet_type === "small_table") {
                          return <SmallTable data={e} />;
                        }
                      }
                    })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
