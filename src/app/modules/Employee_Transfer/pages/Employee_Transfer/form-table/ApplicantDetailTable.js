import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import * as actions from "../../../_redux/redux-Actions";

export function ApplicantsDetailTable({ row }) {
  const dispatch = useDispatch();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    dispatch(actions.fetchApplicantsForVacancy(row.Id))
      .then((data) => {
        setApplicants(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load applicants.");
        setLoading(false);
      });
  }, [row.Id, dispatch]);

  // Loading 
  if (loading) {
    return (
      <div style={{ padding: "16px 32px", background: "#f8f9fa" }}>
        <div className="d-flex align-items-center">
          <span className="spinner spinner-sm spinner-primary mr-2"></span>
          
        </div>
      </div>
    );
  }

  //Error 
  if (error) {
    return (
      <div style={{ padding: "16px 32px", background: "#fff5f5" }}>
        <span style={{ color: "#dc3545", fontSize: "13px" }}>{error}</span>
      </div>
    );
  }

  //Empty
  if (!applicants.length) {
    return (
      <div
        style={{
          padding: "20px 32px",
          background: "#f8f9fa",
          borderLeft: "3px solid #dee2e6",
        }}
      >
        <span style={{ color: "#6c757d", fontSize: "8px", fontStyle: "italic" }}>
          No applicants found for this vacancy.
        </span>
      </div>
    );
  }

  //Table
  return (
    <div
      style={{
        padding: "16px 32px 20px 48px",
        background: "#f0f4ff",
        borderLeft: "4px solid #3699FF",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        
      </div>

      {/* Sub-table */}
      <div className="table-responsive">
        <table
          className="table table-sm table-bordered"
          style={{
            background: "#fff",
            borderRadius: "6px",
            overflow: "hidden",
            fontSize: "12px",
            marginBottom: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#e8f0fe",
                color: "#3c4369",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
              }}
            >
              <th style={{ padding: "8px 12px", width: "40px" }}>#</th>
              <th style={{ padding: "8px 12px" }}>Applicant Code</th>
              <th style={{ padding: "8px 12px" }}>Full Name</th>
              <th style={{ padding: "8px 12px" }}>Personal Email</th>
              <th style={{ padding: "8px 12px" }}>Cell No.</th>
              <th style={{ padding: "8px 12px" }}>Application Date</th>
              <th style={{ padding: "8px 12px" }}>Application Status</th>
              {/* <th style={{ padding: "8px 12px", textAlign: "center" }}>
                Active Vacancy
              </th> */}
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => {
              const vacancyRecord = (
                applicant.details_applicant_vacancy || []
              ).find((v) => v.EmployeeTransferId === parseInt(row.Id));

              const isActive = vacancyRecord?.activeCV;
              const applicationStatus =
                vacancyRecord?.ApplicationStatus?.formName || "N/A";
              const applicationDate = vacancyRecord?.applicationDate || "";

              const rowBg = index % 2 === 0 ? "#fff" : "#fafbff";

              return (
                <tr
                  key={applicant.Id}
                  style={{ background: rowBg, transition: "background 0.15s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eef3ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = rowBg)
                  }
                >
                  <td style={{ padding: "7px 12px", color: "#6c757d" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "7px 12px", fontWeight: 600 }}>
                    {applicant.applicantCode || "—"}
                  </td>
                  <td style={{ padding: "7px 12px" }}>
                    {applicant.FullName ||
                      [
                        applicant.firstName,
                        applicant.middleName,
                        applicant.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                      "—"}
                  </td>
                  <td style={{ padding: "7px 12px" }}>
                    {applicant.email_personal || "—"}
                  </td>
                  <td style={{ padding: "7px 12px" }}>
                    {applicant.phone_cell || "—"}
                  </td>
                  <td style={{ padding: "7px 12px" }}>
                    {applicationDate
                      ? (() => {
                          try {
                            return format(new Date(applicationDate), "dd-MMM-yyyy");
                          } catch {
                            return applicationDate;
                          }
                        })()
                      : "—"}
                  </td>
                  <td style={{ padding: "7px 12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background:
                          applicationStatus === "N/A" ? "#e9ecef" : "#e8f5e9",
                        color:
                          applicationStatus === "N/A" ? "#6c757d" : "#2e7d32",
                      }}
                    >
                      {applicationStatus}
                    </span>
                  </td>
                  {/* <td style={{ padding: "7px 12px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: isActive ? "#28a745" : "#dee2e6",
                      }}
                      title={isActive ? "Active Vacancy" : "Not Active"}
                    />
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}