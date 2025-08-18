import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Accordion, Card, Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { initialFilter, requestFilter } from "../../FormUIHelper";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { KeyboardArrowDown } from "@material-ui/icons";
export const FormFilter = ({ loading, queryParams }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { employeeList, levelList, user } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getEmployeeHierarchy(currentLevel));
  }, [currentLevel]);

  useEffect(() => {
    dispatch(actions.getPayrollMonth(user?.employeeIdMapping));
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
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...queryParams?.filter, reportingLevel: currentLevel }}
      onSubmit={(values) => {
        applyFilter(values);
      }}
    >
      {({ values, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset>
                <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
                <div className="grid grid-cols-12 gap-4">
                  {/* Reporting Level */}
                  <div className="col-span-4 sm:col-span-3">
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
                  <div className="col-span-4 sm:col-span-3">
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
                  {/* Request Status */}
                  <div className="col-span-4 sm:col-span-3">
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
                  {/* Request Date Failing */}
                  <div className="col-span-12 sm:col-span-6">
                    <p className="text-sm mb-0 text-black font-semibold">
                      Request Date falling between
                    </p>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="col-span-1">
                        <Field
                          name="requestDate.from"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          className="form-control"
                          label={<span>From</span>}
                          onChange={(date) => {
                            setFieldValue("requestDate.from", date ? date : "");
                          }}
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-span-1">
                        <Field
                          name="requestDate.to"
                          component={DatePickerField}
                          onBlur={handleBlur}
                          className="form-control"
                          dateFormat="dd-MMM-yyyy"
                          label={<span>To</span>}
                          onChange={(date) => {
                            setFieldValue("requestDate.to", date ? date : "");
                          }}
                          autoComplete="off"
                        />
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
  );
};
