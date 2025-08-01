import React, { useEffect, useState } from "react";
import {  Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {  Form, Modal } from "react-bootstrap";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

const formValidation = Yup.object().shape({
  from_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from_date"), "Date to date cannot be before Date from date"),
});

export function FormCard() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [bodyValues, setBodyValues] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const customSubmit = (values) => {
    let formattedFromDate = formatDates(values?.from_date, "yyyy-MM-dd");
    let formattedToDate = formatDates(values?.to_date, "yyyy-MM-dd");

    dispatch(
      actions.fetchLeaves(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
  };

  const { currentState, user, payrollData } = useSelector((state) => {
    return {
      currentState: state?.team_leave_calender,
      payrollData: state?.team_leave_calender.payrollData,
      user: state?.auth?.user,
    };
  });

  const { leaveCalendar } = currentState;

  useEffect(() => {
    dispatch(actions.getPayrollMonth(user?.employeeIdMapping));
  }, [user]);

  useEffect(() => {
    if (payrollData) {
      setBodyValues({
        from_date: payrollData?.startDate || "",
        to_date: payrollData?.endDate || "",
      });
      setIsDataLoaded(true);
    }
  }, [payrollData]);

  useEffect(() => {
    if (isDataLoaded) {
      customSubmit(bodyValues);
    }
  }, [isDataLoaded, bodyValues]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="lg:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/leave-request/read-all-leave-request",
              },
              {
                name: "Approval",
                link: "/leave-approval/read-all-leave-approval",
              },
              {
                name: "Workflow Status",
                link: "/leave-workflow-status/read-all-leave-workflow-status",
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden lg:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/leave-request/read-all-leave-request",
              },
              {
                name: "Approval",
                link: "/leave-approval/read-all-leave-approval",
              },
              {
                name: "Workflow Status",
                link: "/leave-workflow-status/read-all-leave-workflow-status",
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <Formik
            enableReinitialize={true}
            initialValues={{
              from_date: bodyValues?.from_date || null,
              to_date: bodyValues?.to_date || null,
            }}
            validationSchema={formValidation}
          >
            {({ setFieldValue, handleReset, values }) => {
              return (
                <>
                  <Form className="form form-label-right">
                    <fieldset>
                      <h6>Filter Record</h6>
                      {/* Employee Selector */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        <div className="col-span-1">
                          <label>
                            From Date
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <DatePicker
                            className="form-control"
                            placeholder="From Date "
                            selected={
                              values?.from_date
                                ? new Date(values.from_date)
                                : null
                            }
                            onChange={(date) => {
                              setFieldValue("from_date", date);
                              setFieldValue("to_date", date); // Sync from_date and to_date
                            }}
                            timeInputLabel="Time:"
                            dateFormat="dd-MMM-yyyy"
                            // showTimeInput
                            name="from_date"
                            autoComplete="off"
                          />
                        </div>
                        {/* Date To Selector */}
                        <div className="col-span-1">
                          <label>
                            Date To<span style={{ color: "red" }}>*</span>
                          </label>
                          <DatePicker
                            className="form-control"
                            placeholder="To Date "
                            selected={
                              values?.to_date ? new Date(values.to_date) : null
                            }
                            onChange={(date) => {
                              setFieldValue("to_date", date);
                            }}
                            timeInputLabel="Time:"
                            dateFormat="dd-MMM-yyyy"
                            // showTimeInput
                            name="to_date"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </Form>

                  <Modal.Footer>
                    <button
                      type="button"
                      onClick={() => {
                        handleReset();
                        dispatch(actions.clearEvents()); // Reset form and clear events
                      }}
                      className="btn btn-light"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        // customSubmit({ ...values, from_date: formattedFromDate, to_date: formattedToDate });
                        customSubmit(values);
                      }}
                      disabled={!values.from_date || !values.to_date}
                      className="btn btn-success"
                    >
                      Filter Record
                    </button>
                  </Modal.Footer>
                </>
              );
            }}
          </Formik>
          {leaveCalendar && leaveCalendar.length > 0 && <FormTable />}
        </div>
      </div>
    </div>
  );
}
