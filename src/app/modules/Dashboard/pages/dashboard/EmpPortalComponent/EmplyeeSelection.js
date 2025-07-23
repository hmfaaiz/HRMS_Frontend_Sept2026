import React from "react";
import { Field, Formik } from "formik";
import { Form } from "react-bootstrap";
// import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { PendingRequestSelf } from "./PendingRequest";
import SVG from "react-inlinesvg";
export const EmployeeSelection = ({
  currentLevel,
  setCurrentLevel,
  selectedEmp,
  setSelectedEmp,
  employeeList,
  setShowEmpDetail,
  showEmpDetail,
  levelList,
  logedInEmpoyee,
  leaveApprovalCount,
  attendanceApprovalCount,
  loanApprovalCount,
}) => {
  return (
    <div className="row justify-content-between">
      <div
        className="col-12 col-md-5"
        style={{ marginTop: "5px", marginBottom: "5px" }}
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
            onClick={() => setShowEmpDetail(!showEmpDetail)}
          >
            <img
              name="profile_image"
              src={
                logedInEmpoyee?.profile_image
                  ? `${logedInEmpoyee?.profile_image}`
                  : toAbsoluteUrl("/media/users/profileImage.png")
              } // Fallback if no image
              alt="Profile"
              width={130}
              height={130}
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
          <h2 style={{ marginTop: "5px" }}>
            {logedInEmpoyee?.firstName} {logedInEmpoyee?.middleName}{" "}
            {logedInEmpoyee?.lastName}{" "}
          </h2>
          <span
            style={{ fontSize: "14px" }}
            className="svg-icon svg-icon-md text-sm svg-icon-primary px-3 py-2 rounded-lg bg-secondary cursor-pointer"
            onClick={() => setShowEmpDetail(!showEmpDetail)}
          >
            View Detail
            <SVG
              className={"ml-2"}
              src={toAbsoluteUrl(
                showEmpDetail
                  ? "/media/svg/icons/Communication/CancelButton.svg"
                  : "/media/svg/icons/Communication/AddButton.svg"
              )}
            />
          </span>
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
                      {/* <div className="col-12">
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
                      </div> */}
                    </div>
                  </div>
                </fieldset>
              </Form>
            </>
          )}
        </Formik>
      </div>
      <div className="col-12 col-md-5 d-flex align-items-end">
        <PendingRequestSelf
          leaveApprovalCount={leaveApprovalCount}
          attendanceApprovalCount={attendanceApprovalCount}
          loanApprovalCount={loanApprovalCount}
        />
      </div>
    </div>
  );
};
