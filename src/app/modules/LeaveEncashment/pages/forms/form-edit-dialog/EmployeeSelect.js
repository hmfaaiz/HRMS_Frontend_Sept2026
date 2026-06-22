import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Select } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Eye, XCircle } from "lucide-react";

export function EmployeeSelect({
  actionsLoading,
  setemployeeId,
  setId,
  setyearId,
  setPanelMode,
  panelMode,
}) {
  const dispatch = useDispatch();
  //Get all Employee list from dashboard global state
  const { allEmployees, allFiscalYears } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
      allFiscalYears: state.dashboard.allFiscalYears,
    }),
    shallowEqual
  );

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);
  const { activeFiscalYear } = useSelector((state) => state.dashboard);
  return (
    <>
      {/* Formik Starts */}
      <Formik enableReinitialize={true} initialValues={{}}>
        {({ errors, values, handleBlur, setFieldValue }) => (
          <>
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            {/* Form Starts */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  {/* Employee Id Dropdown Starts */}
                  <div className="col-span-1">
                    <div>
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("employeeId", value);
                          setemployeeId(value); //Set Employee Id in context for server
                          const selectedEmp = allEmployees.find(
                            (emp) => emp.value === value
                          );
                          dispatch(
                            getActiveFiscalYear(
                              "activeFiscalYear",
                              selectedEmp?.subsidiaryId
                            )
                          );
                          setId(""); //Clear Edit values on Employee Change
                        }}
                        label={
                          <span>
                            {" "}
                            Employee<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          allEmployeesMap?.get(values?.employeeId || "") || ""
                        }
                        autoComplete="off"
                        // options={allEmployees}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allEmployees) ? allEmployees : []),
                        ]}
                      />
                      {!values.employeeId && (
                        <CustomErrorLabel
                          touched={true}
                          error={VALIDATION_MESSAGES.required}
                        />
                      )}
                    </div>
                  </div>

                  {/* Employee Id Dropdown Ends */}

                  {/* Employee Id Dropdown Starts */}
                  <div className="col-span-1">
                    {/* <Field
                      name="yearId"
                      component={Select}
                      className={
                        values.employeeId && !values.yearId
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.target.value == "Select"
                            ? ""
                            : Number(e.target.value);
                        setFieldValue("yearId", value);
                        setyearId(value); //Set Employee Id in context for server
                        setId(""); //Clear Edit values on Employee Change
                      }}
                      label={
                        <span>
                          {" "}
                          Year<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={values.yearId}
                      autoComplete="off"
                      children={CustomDropdown({
                        data: allFiscalYears,
                        firstElement: { label: "Select", value: "" },
                      })}
                    /> */}
                    <Field
                      name="yearId"
                      component={SearchSelect}
                      className={
                        values.employeeId && !values.yearId
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e?.value;
                        setFieldValue("yearId", value);
                        setyearId(value); //Set Employee Id in context for server
                        setId(""); //Clear Edit values on Employee Change
                      }}
                      label={
                        <span>
                          {" "}
                          Year<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                   value={
                      allFiscalYears?.find(fy => fy?.value === values?.yearId) || null
                     }
                      autoComplete="off"
                      options={allFiscalYears?.map((fy) => ({
                         ...fy,
                       isDisabled: fy.isActive === false, // 👈 mark inactive years disabled
                    }))}
                    />
                    {/* {
                      values.employeeId && !values.yearId && <CustomErrorLabel touched={true} error={VALIDATION_MESSAGES.required || ""} />
                    } */}

                    {values.employeeId !== null &&
                      values.employeeId !== undefined &&
                      values.employeeId !== "" &&
                      !values.yearId && (
                        <CustomErrorLabel
                          touched={true}
                          error={VALIDATION_MESSAGES.required}
                        />
                      )}
                  </div>
                  {/* Employee Id Dropdown Ends */}
                  <div className="mt-6">
                    {panelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}
                  </div>

                  {/* <div className="text-xs text-black">
                    {activeFiscalYear
                      ? (() => {
                          return (
                            <div>
                              <div>
                                <b>Active Fiscal Year -</b>{" "}
                                {activeFiscalYear?.label}
                              </div>
                              <div>
                                <b>Active Payroll Month -</b>{" "}
                                {activeFiscalYear?.payrollMonthLabel}
                              </div>
                            </div>
                          );
                        })()
                      : null}
                  </div> */}
                </div>
              </fieldset>
            </Form>
            {/* Form Ends */}
          </>
        )}
      </Formik>
      {/* Formik Ends */}
    </>
  );
}
