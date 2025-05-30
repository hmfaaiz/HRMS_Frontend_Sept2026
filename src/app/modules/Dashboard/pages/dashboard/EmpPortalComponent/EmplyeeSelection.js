import React from "react";
import { Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { PendingRequestSelf } from "./PendingRequest";
export const EmployeeSelection = ({
  currentLevel,
  setCurrentLevel,
  selectedEmp,
  setSelectedEmp,
  employeeList,
  levelList,
  logedInEmpoyee,
  leaveApprovalCount,
  attendanceApprovalCount,
  loanApprovalCount
}) => {
  return (
    <div className="row">
      <div
        className="col-12 col-md-5"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <div className="">
          <div
            style={{
              backgroundColor: "rgb(235 243 255)",
              padding: "20px",
              borderRadius: "5px",
              border: "2px solid #adceff",
              width: "fit-content",
            }}
            className="mt-3"
          >
            <img
              name="profile_image"
              src={
                logedInEmpoyee?.profile_image
                  ? `${logedInEmpoyee?.profile_image}`
                  : toAbsoluteUrl("/media/users/profileImage.png")
              } // Fallback if no image
              alt="Profile"
              width={200}
              height={200}
              style={{
                borderRadius: "50%", // Make the image circular
                objectFit: "cover", // Ensure the image covers the entire area without distortion
              }}
              onError={(e) => {
                e.target.onerror = null; // Error loop rokne ke liye
                e.target.src = toAbsoluteUrl("/media/users/profileImage.png"); // Agar image load na ho toh fallback image set karo
              }}
            />
          </div>
          <h2 style={{ color: "green", marginTop: "10px" }}>
            {new Date().getHours() < 12
              ? "Good Morning"
              : new Date().getHours() < 18
              ? "Good Afternoon"
              : "Good Evening"}{" "}
            {logedInEmpoyee?.firstName} {logedInEmpoyee?.middleName}{" "}
            {logedInEmpoyee?.lastName}
          </h2>
        </div>

        <Formik
          enableReinitialize={true}
          initialValues={{
            selectedEmp: selectedEmp?.value,
            currentLevel,
          }}
        >
          {({ values, handleBlur, setFieldValue, handleReset }) => (
            <>
              <Form className="form form-label-right">
                <fieldset>

                  <div className="from-group row">
                    {/* Reporting Level */}
                    <div className="col-12 col-md-12 row">
                      <div className="col-12">
                        <div className="col-12 col-md-8 mt-3">
                          <Field
                            component={SearchSelect}
                            onBlur={handleBlur}
                            name="currentLevel"
                            label={<span>Reporting Levels</span>}
                            onChange={({ value }) => {
                              setFieldValue("currentLevel", value);
                              setCurrentLevel(value);
                            }}
                            value={
                              levelList?.find(
                                (opt) => opt?.value === values?.currentLevel
                              ) || ""
                            }
                            autoComplete="off"
                            options={levelList}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="col-12 col-md-8 mt-3">
                          <Field
                            component={SearchSelect}
                            onBlur={handleBlur}
                            name="selectedEmp"
                            label={<span>Employee</span>}
                            onChange={(e) => {
                              setFieldValue("selectedEmp", e?.value);
                              setSelectedEmp(e);
                            }}
                            value={
                              employeeList?.find(
                                (opt) => opt.value === values?.selectedEmp
                              ) || ""
                            }
                            autoComplete="off"
                            options={employeeList}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </Form>
            </>
          )}
        </Formik>
      </div>
      <div className="col-12 col-md-7 d-flex align-items-end">
        <PendingRequestSelf
          leaveApprovalCount={leaveApprovalCount}
          attendanceApprovalCount={attendanceApprovalCount}
          loanApprovalCount={loanApprovalCount}
        />
      </div>
    </div>
  );
};
