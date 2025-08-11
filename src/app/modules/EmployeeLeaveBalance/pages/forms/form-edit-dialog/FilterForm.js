import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { Select } from "../../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { Modal } from "react-bootstrap";
import {
  fetchAllFiscalYearData,
  fetchAllLeaveType,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

export function FilterForm({ filters, setfilters, dropdownData, dispatch }) {
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(
      dropdownData?.allEmployees?.map((item) => [item.value, item])
    );
  }, [dropdownData?.allEmployees]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={filters}>
        {({ errors, touched, values, handleBlur, setFieldValue }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    {/* Employee Field Start */}
                    <div>
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          if (value) {
                            dispatch(fetchAllLeaveType("allLeaveTypes", value));
                            dispatch(
                              fetchAllFiscalYearData("allFiscalYears", value)
                            );
                          }
                          setFieldValue("employeeId", value);
                          setfilters({
                            ...filters,
                            employeeId: value,
                            leaveType: "",
                          });
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
                        options={dropdownData.allEmployees}
                      />
                      {errors.employeeId && touched.employeeId && (
                        <CustomErrorLabel
                          touched={true}
                          error={errors.employeeId}
                        />
                      )}
                    </div>
                    {/* Employee Field End */}

                    {/* Leave Type Field Start */}
                    <div>
                      <Field
                        name="leaveType"
                        disabled={!values.employeeId}
                        component={Select}
                        className={
                          errors.leaveType && touched.leaveType
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
                          setFieldValue("leaveType", value);
                          setfilters({ ...filters, leaveType: value });
                        }}
                        label={
                          <span>
                            {" "}
                            Leave Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.leaveType}
                        autoComplete="off"
                        children={CustomDropdown({
                          data: values.employeeId
                            ? dropdownData.allLeaveTypes
                            : [{ label: "Select", value: null }],
                        })}
                      />
                      {errors.leaveType && touched.leaveType && (
                        <CustomErrorLabel
                          touched={true}
                          error={errors.leaveType}
                        />
                      )}
                    </div>
                    {/* Leave Type Field End */}

                    {/* Year Field Start */}
                    <div>
                      <Field
                        name="yearId"
                        component={Select}
                        disabled={!values.employeeId}
                        className={
                          errors.yearId && touched.yearId
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
                          setfilters({ ...filters, yearId: value });
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
                          data: dropdownData.allFiscalYears,
                          firstElement: { label: "Select", value: null },
                        })}
                      />
                      {errors.yearId && touched.yearId && (
                        <CustomErrorLabel
                          touched={true}
                          error={errors.yearId}
                        />
                      )}
                    </div>
                    {/* Year Field End */}
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
          </>
        )}
      </Formik>
    </>
  );
}
