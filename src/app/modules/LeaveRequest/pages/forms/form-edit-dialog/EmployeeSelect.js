import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Select } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../_redux/formActions";
export function EmployeeSelect({
  actionsLoading,
  setId,
  setemployeeId,
  employeeId,
  currentLevel,
  setCurrentLevel,
}) {
  //Get all Employee list from dashboard global state
  const dispatch = useDispatch();
  const { employeeList, levelList } = useSelector(
    (state) => ({
      employeeList: state.leave_request.employeeList,
      levelList: state.leave_request.levelList,
    }),
    shallowEqual
  );
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(employeeList?.map((item) => [item.value, item]));
  }, [employeeList]);

  useEffect(() => {
    dispatch(actions.getEmployeeHierarchy(currentLevel));
  }, [currentLevel]);

  useEffect(() => {
    if (employeeId == "" && employeeList?.length > 0) {
      setemployeeId(employeeList[0]?.value);
    }
  }, [employeeList, employeeId]);

  return (
    <>
      {/* Formik Starts */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          employeeId: employeeList[0]?.value || "",
          currentLevel: levelList[0]?.value || 0,
        }}
      >
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
                <div className="from-group row">
                  <div className="col-12 col-md-12 row p-0 m-0">
                    <div className="col-12 col-md-3 mt-3">
                      <Field
                        name="currentLevel"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value === "--Select--" ? "" : Number(e.value);
                          setCurrentLevel(value);
                          setFieldValue("currentLevel", value); // <- Important!
                        }}
                        label={<span>Reporting Level</span>}
                        value={
                          levelList?.find(
                            (opt) => opt.value === values.currentLevel
                          ) || "0"
                        }
                        autoComplete="off"
                        options={levelList}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="employeeId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "--Select--" ? "" : Number(e.value);
                        setFieldValue("employeeId", value);
                        setemployeeId(value);
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
                      options={employeeList}
                    />
                    {!values.employeeId && (
                      <CustomErrorLabel
                        touched={true}
                        error={VALIDATION_MESSAGES.required}
                      />
                    )}
                  </div>
                  {/* Employee Id Dropdown Ends */}
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
