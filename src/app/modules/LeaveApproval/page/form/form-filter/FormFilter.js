import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { initialFilter, requestFilter } from "../../FormUIHelper";
import { fetchAllLeaveType } from "../../../../../../_metronic/redux/dashboardActions";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
export const FormFilter = ({ loading, queryParams }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const {
    employeeList,
    levelList,
    allLeaveTypes,
    user,
    payrollData,
  } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      allLeaveTypes: state.dashboard.allLeaveTypes,
      payrollData: state.leave_approval.payrollData,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getEmployeeHierarchy(currentLevel));
  }, [currentLevel]);

  useEffect(() => {
    dispatch(actions.getPayrollMonth(user?.employeeIdMapping));
    dispatch(fetchAllLeaveType("allLeaveTypes", user?.employeeIdMapping));
  }, []);
  const prepareFilter = (queryParams, values) => {
    const newQueryParams = { ...queryParams };
    newQueryParams.filter = { ...values };
    return newQueryParams;
  };
  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  //Function to update filter in queryparams when any filter is selected or updated
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      formUIProps.setQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    let values = { ...queryParams.filter };
    if (payrollData) {
      values.leaveDate = {
        from: payrollData?.startDate,
        to: payrollData?.endDate,
      };
      values.reportingLevel = currentLevel;
    } else {
      values.leaveDate = {
        from: "",
        to: "",
      };
      values.reportingLevel = currentLevel;
    }
    applyFilter(values);
  }, [payrollData]);
  const updatedLeaveTypes = allLeaveTypes?.filter((e) => e.value !== null);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          queryParams?.filter
          // payrollData
          //   ? {
          //       ...queryParams?.filter,
          //       reportingLevel: currentLevel,
          //       leaveDate: {
          //         from: payrollData?.startDate,
          //         to: payrollData?.endDate,
          //       },
          //     }
          //   : {
          //       ...queryParams?.filter,
          //       reportingLevel: currentLevel,
          //     }
        }
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      marginTop: "15px",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <h6>Request Filter</h6>
                    <div className="from-group row">
                      {/* Reporting Level */}
                      <div className="col-12 col-md-12 row">
                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            component={SearchSelect}
                            onBlur={handleBlur}
                            name="reportingLevel"
                            label={<span>Reporting Level</span>}
                            onChange={({ value }) => {
                              setFieldValue("reportingLevel", value);
                              setCurrentLevel(value);
                            }}
                            value={
                              levelList?.find(
                                (opt) => opt?.value === values?.reportingLevel
                              ) || ""
                            }
                            autoComplete="off"
                            options={levelList}
                          />
                        </div>
                        {/* Request Raised For */}
                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            component={SearchSelect}
                            onBlur={handleBlur}
                            name="requestRaisedFor"
                            label={<span>Request Raised By</span>}
                            onChange={({ value }) => {
                              setFieldValue("requestRaisedFor", value);
                            }}
                            value={
                              employeeList?.find(
                                (opt) => opt.value === values?.requestRaisedFor
                              ) || ""
                            }
                            autoComplete="off"
                            options={employeeList}
                          />
                        </div>
                      </div>
                      {/* Request Status */}
                      <div className="col-12 col-md-12 row">
                        <div className="col-12 col-md-4 mt-3">
                          {/* Status Field  */}
                          <SearchSelect
                            name="requestStatus"
                            label={<span>Request Status</span>}
                            onChange={({ value }) => {
                              setFieldValue("requestStatus", value);
                            }}
                            value={
                              requestFilter?.find(
                                (opt) => opt.value === values?.requestStatus
                              ) || ""
                            }
                            autoComplete="off"
                            options={requestFilter}
                          />
                        </div>
                      </div>
                      {/* Leave Type */}
                      <div className="col-12 col-md-12 row">
                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            name="leaveTypes"
                            component={Select}
                            className={"form-control"}
                            placeholder=""
                            onBlur={handleBlur}
                            onChange={(e) => {
                              const value =
                                e.target.value == "Select"
                                  ? ""
                                  : Number(e.target.value);
                              setFieldValue("leaveTypes", e.target.value);
                            }}
                            label={<span> Leave Type</span>}
                            value={values.leaveTypes}
                            autoComplete="off"
                            children={CustomDropdown({
                              data: updatedLeaveTypes,
                              firstElement: { label: "All", value: "" },
                            })}
                          />
                        </div>
                      </div>
                      {/* Leave Date Failing */}
                      <div className="col-12 col-md-12 mt-4">
                        <h6>Leave Date falling between</h6>

                        <div className="from-group row">
                          <div className="col-12 col-md-4">
                            <Field
                              name="leaveDate.from"
                              component={DatePickerField}
                              dateFormat="dd-MMM-yyyy"
                              className="form-control"
                              label={<span>Date From</span>}
                              onChange={(date) => {
                                setFieldValue(
                                  "leaveDate.from",
                                  date ? date : ""
                                );
                              }}
                              autoComplete="off"
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <Field
                              name="leaveDate.to"
                              component={DatePickerField}
                              onBlur={handleBlur}
                              className="form-control"
                              dateFormat="dd-MMM-yyyy"
                              label={<span>Date To</span>}
                              onChange={(date) => {
                                setFieldValue("leaveDate.to", date ? date : "");
                              }}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Request Date Failing */}
                      <div className="col-12 col-md-12 mt-4">
                        <h6>Request Date falling between</h6>

                        <div className="from-group row">
                          <div className="col-12 col-md-4">
                            <Field
                              name="requestDate.from"
                              component={DatePickerField}
                              dateFormat="dd-MMM-yyyy"
                              className="form-control"
                              label={<span> Date From</span>}
                              onChange={(date) => {
                                setFieldValue(
                                  "requestDate.from",
                                  date ? date : ""
                                );
                              }}
                              autoComplete="off"
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <Field
                              name="requestDate.to"
                              component={DatePickerField}
                              onBlur={handleBlur}
                              className="form-control"
                              dateFormat="dd-MMM-yyyy"
                              label={<span> Date To</span>}
                              onChange={(date) => {
                                setFieldValue(
                                  "requestDate.to",
                                  date ? date : ""
                                );
                              }}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                // disabled={levelList?.length < 2}
                onClick={() => {
                  applyFilter(initialFilter.filter);
                  handleReset();
                }}
                className="btn btn-danger btn-elevate"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={() => handleSubmit()}
                disabled={
                  loading
                  // || levelList?.length < 2
                }
                className="btn btn-success btn-elevate"
              >
                Filter Record
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
};
