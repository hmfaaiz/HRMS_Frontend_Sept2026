import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import {
  CardBody,
  DatePickerField,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { format } from "date-fns";
import { formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import TCard from "../../../../../utils/common-modules/TCard";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  from_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from_date"), "'To Date' should not be less than 'From Date'."),
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
      actions.fetchAttendances(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
  };

  const { currentState, dashboard } = useSelector((state) => {
    return {
      currentState: state?.attendance_calendar,
      dashboard: state?.dashboard,
    };
  });

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  const { attendanceCalendar } = currentState;

  const setInitialValues = (firstSubsidiary) => {
    setBodyValues({
      from_date: firstSubsidiary?.payrollMonth?.startDate || "",
      to_date: firstSubsidiary?.payrollMonth?.endDate || "",
      subsidiaryId: firstSubsidiary?.value || "",
    });
    setIsDataLoaded(true); // Mark data as loaded
    dispatch(fetchAllActiveEmployeesBySubsidiary(firstSubsidiary?.value));
  };

  useEffect(() => {
    if (dashboard.allSubsidiaryList && dashboard.allSubsidiaryList.length > 0) {
      const firstSubsidiary = dashboard.allSubsidiaryList[0];
      dispatch(fetchAllDept(dashboard.allSubsidiaryList[0].value));
      setInitialValues(firstSubsidiary);
    }
  }, [dashboard.allSubsidiaryList]);

  useEffect(() => {
    // Automatically submit when data is loaded
    if (isDataLoaded && bodyValues?.subsidiaryId) {
      customSubmit(bodyValues);
    }
  }, [isDataLoaded, bodyValues]);

  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}></CardHeader>

    //     <Formik
    //       enableReinitialize={true}
    //       initialValues={{
    //         from_date: bodyValues?.from_date || new Date(),
    //         to_date: bodyValues?.to_date || null,
    //         subsidiaryId: bodyValues?.subsidiaryId || null,
    //         employeeId: null, // Default null for employeeId
    //       }}
    //       validationSchema={formValidation}
    //       // onSubmit={(values) => {

    //       //   customSubmit(values);
    //       // }}
    //     >
    //       {({
    //         handleSubmit,
    //         handleBlur,
    //         setFieldValue,
    //         handleReset,
    //         values,
    //         touched,
    //         errors,
    //       }) => {
    //         // Handle subsidiaryId change to reset all fields
    //         const handleSubsidiaryChange = (e) => {
    //           const selectedValue = e.value || null;

    //           Object.keys(values).forEach((key) => {
    //             setFieldValue(key, null); // Reset each field to null
    //           });

    //           // Set the newly selected subsidiaryId
    //           setFieldValue("subsidiaryId", selectedValue);
    //           dispatch(fetchAllDept(selectedValue));
    //           setInitialValues(
    //             dashboard?.allSubsidiaryList?.find(
    //               (option) => option?.value === selectedValue
    //             ) || null
    //           );
    //         };

    //         return (
    //           <>
    //             <Modal.Body className="overlay overlay-block cursor-default">
    //               <Form className="form form-label-right">
    //                 <fieldset>
    //                   <div
    //                     style={{
    //                       backgroundColor: "rgb(235 243 255)",
    //                       marginTop: "15px",
    //                       padding: "20px",
    //                       borderRadius: "5px",
    //                       border: "2px solid #adceff",
    //                     }}
    //                   >
    //                     <h6>Attendance Calendar</h6>

    //                     <div className="form-group row">
    //                       {/* Subsidiary Selector */}
    //                       <div className="col-12 col-md-4 mt-3">
    //                         <SearchSelect
    //                           name="subsidiaryId"
    //                           label={
    //                             <span>
    //                               Subsidiary
    //                               <span style={{ color: "red" }}>*</span>
    //                             </span>
    //                           }
    //                           onChange={handleSubsidiaryChange} // Call the dynamic reset handler
    //                           value={
    //                             dashboard?.allSubsidiaryList?.find(
    //                               (option) =>
    //                                 option?.value === values?.subsidiaryId
    //                             ) || null
    //                           }
    //                           options={dashboard?.allSubsidiaryList}
    //                           error={errors.subsidiaryId}
    //                           touched={touched.subsidiaryId}
    //                         />
    //                       </div>

    //                       <div className="col-12 col-md-4 mt-3">
    //                         <Field
    //                           name="departmentId"
    //                           component={SearchSelect}
    //                           onBlur={handleBlur}
    //                           onChange={(e) => {
    //                             const value =
    //                               e.value == "Select"
    //                                 ? ""
    //                                 : Number(e.value);
    //                             setFieldValue("departmentId", value);
    //                           }}
    //                           label={<span> Department</span>}
    //                           value={
    //                             dashboard?.allDept?.find(
    //                               (option) =>
    //                                 option?.value === values?.departmentId
    //                             ) || null
    //                           }
    //                           // options={dashboard?.allDept}
    //                           options={[
    //                             { label: "Select", value: "" },
    //                             ...(Array.isArray(dashboard?.allDept)
    //                               ? dashboard?.allDept
    //                               : []),
    //                           ]}
    //                           error={errors.departmentId}
    //                           touched={touched.departmentId}
    //                         />
    //                       </div>
    //                     </div>

    //                     {/* Employee Selector */}
    //                     <div className="form-group row">
    //                       <div className="col-12 col-md-4 mt-3">
    //                         <SearchSelect
    //                           name="employeeId"
    //                           label={<span>Employee</span>}
    //                           onChange={(e) => {
    //                             setFieldValue("employeeId", e.value || null);
    //                           }}
    //                           value={
    //                             dashboard?.allEmployees?.find(
    //                               (option) =>
    //                                 option?.value === values?.employeeId
    //                             ) || null
    //                           }
    //                           // options={dashboard?.allEmployees}
    //                           options={[
    //                             { label: "Select", value: "" },
    //                             ...(values?.departmentId
    //                               ? dashboard?.allEmployees?.filter(
    //                                   (emp) =>
    //                                     emp?.departmentId ===
    //                                     values.departmentId
    //                                 )
    //                               : dashboard?.allEmployees),
    //                           ]}
    //                           error={errors.employeeId}
    //                           touched={touched.employeeId}
    //                         />
    //                       </div>

    //                       <div className="col-12 col-md-4 mt-3">
    //                         <label>
    //                           From<span style={{ color: "red" }}>*</span>
    //                         </label>
    //                         <DatePicker
    //                           className="form-control"
    //                           placeholder="From "
    //                           selected={
    //                             values?.from_date
    //                               ? new Date(values.from_date)
    //                               : null
    //                           }
    //                           onChange={(date) => {
    //                             setFieldValue("from_date", date);
    //                             setFieldValue("to_date", date); // Sync from_date and to_date
    //                           }}
    //                           timeInputLabel="Time:"
    //                           dateFormat="dd-MMM-yyyy"
    //                           // showTimeInput
    //                           name="from_date"
    //                           autoComplete="off"
    //                         />
    //                       </div>

    //                       {/* Date To Selector */}
    //                       <div className="col-12 col-md-4 mt-3">
    //                         <label>
    //                           Date To<span style={{ color: "red" }}>*</span>
    //                         </label>
    //                         <DatePicker
    //                           className="form-control"
    //                           placeholder="To "
    //                           selected={
    //                             values?.to_date
    //                               ? new Date(values.to_date)
    //                               : null
    //                           }
    //                           onChange={(date) => {
    //                             setFieldValue("to_date", date);
    //                           }}
    //                           timeInputLabel="Time:"
    //                           dateFormat="dd-MMM-yyyy"
    //                           // showTimeInput
    //                           name="to_date"
    //                           autoComplete="off"
    //                         />
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </fieldset>
    //               </Form>
    //             </Modal.Body>

    //             <Modal.Footer className="justify-content-between">
    //               <div className="d-flex justify-content-center ">
    //                 <div className="d-flex align-items-center m-3">
    //                   <span className="dot bg_custom_color_25 me-2"></span>{" "}
    //                   Present
    //                 </div>
    //                 <div className="d-flex align-items-center m-3">
    //                   <span className="dot bg_custom_color_15 me-2"></span>{" "}
    //                   Absent
    //                 </div>
    //                 <div className="d-flex align-items-center m-3">
    //                   <span className="dot bg_custom_color_16 me-2"></span> Half
    //                   day
    //                 </div>
    //                 <div className="d-flex align-items-center m-3">
    //                   <span className="dot bg_custom_color_1 me-2"></span> Leave
    //                 </div>

    //                 <div className="d-flex align-items-center m-3">
    //                   <span className="dot bg_custom_color_22 me-2"></span> Day
    //                   Off / Holiday
    //                 </div>
    //                 <div className="d-flex align-items-center m-3">
    //                   <span className="dot bg_custom_color_26 me-2"></span> Late
    //                   In / Early Out
    //                 </div>
    //               </div>

    //               <div>
    //                 <button
    //                   type="button"
    //                   onClick={() => {
    //                     handleReset();
    //                     dispatch(actions.clearEvents()); // Reset form and clear events
    //                   }}
    //                   className="btn btn-danger btn-elevate m-2"
    //                 >
    //                   Cancel
    //                 </button>

    //                 <button
    //                   onClick={() => {
    //                     // customSubmit({ ...values, from_date: formattedFromDate, to_date: formattedToDate });
    //                     customSubmit(values);
    //                   }}
    //                   disabled={!values.from_date || !values.to_date}
    //                   className="btn btn-success btn-elevate m-2"
    //                 >
    //                   Filter Record
    //                 </button>
    //               </div>
    //             </Modal.Footer>
    //           </>
    //         );
    //       }}
    //     </Formik>

    //     <CardBody>
    //       {attendanceCalendar && attendanceCalendar.length > 0 && <FormTable />}
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            from_date: bodyValues?.from_date || new Date(),
            to_date: bodyValues?.to_date || null,
            subsidiaryId: bodyValues?.subsidiaryId || null,
            employeeId: null, // Default null for employeeId
          }}
          validationSchema={formValidation}
          // onSubmit={(values) => {

          //   customSubmit(values);
          // }}
        >
          {({
            handleSubmit,
            handleBlur,
            setFieldValue,
            handleReset,
            values,
            touched,
            errors,
          }) => {
            // Handle subsidiaryId change to reset all fields
            const handleSubsidiaryChange = (e) => {
              const selectedValue = e.value || null;

              Object.keys(values).forEach((key) => {
                setFieldValue(key, null); // Reset each field to null
              });

              // Set the newly selected subsidiaryId
              setFieldValue("subsidiaryId", selectedValue);
              dispatch(fetchAllDept(selectedValue));
              setInitialValues(
                dashboard?.allSubsidiaryList?.find(
                  (option) => option?.value === selectedValue
                ) || null
              );
            };

            return (
              <>
                <Form className="form form-label-right">
                  <fieldset>
                    <h6 className="font-bold mb-0 text-primary my-2 mt-4">
                      Filter
                    </h6>

                    <div className="grid-cols-3 md:grid-cols-5 grid gap-x-3 gap-y-1">
                      {/* Subsidiary Selector */}
                      <div>
                        {/* <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={handleSubsidiaryChange} // Call the dynamic reset handler
                          value={
                            dashboard?.allSubsidiaryList?.find(
                              (option) => option?.value === values?.subsidiaryId
                            ) || null
                          }
                          options={dashboard?.allSubsidiaryList}
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                        /> */}
                        <SubsidiarySelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={handleSubsidiaryChange}
                          error={errors?.subsidiaryId}
                          touched={touched?.subsidiaryId}
                          currentValue={values?.subsidiaryId}
                          initializeSubsidiary={handleSubsidiaryChange}
                        />
                      </div>

                      <div>
                        <Field
                          name="departmentId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "Select" ? "" : Number(e.value);
                            setFieldValue("departmentId", value);
                          }}
                          label={<span> Department</span>}
                          value={
                            dashboard?.allDept?.find(
                              (option) => option?.value === values?.departmentId
                            ) || null
                          }
                          // options={dashboard?.allDept}
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(dashboard?.allDept)
                              ? dashboard?.allDept
                              : []),
                          ]}
                          error={errors.departmentId}
                          touched={touched.departmentId}
                        />
                      </div>
                      <div>
                        <SearchSelect
                          name="employeeId"
                          label={<span>Employee</span>}
                          onChange={(e) => {
                            setFieldValue("employeeId", e.value || null);
                          }}
                          value={
                            dashboard?.allEmployees?.find(
                              (option) => option?.value === values?.employeeId
                            ) || null
                          }
                          // options={dashboard?.allEmployees}
                          options={[
                            { label: "Select", value: "" },
                            ...(values?.departmentId
                              ? dashboard?.allEmployees?.filter(
                                  (emp) =>
                                    emp?.departmentId === values.departmentId
                                )
                              : dashboard?.allEmployees),
                          ]}
                          error={errors.employeeId}
                          touched={touched.employeeId}
                        />
                      </div>

                      <div>
                        <label>
                          From<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="From "
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
                      <div>
                        <label>
                          Date To<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="To "
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

                <Modal.Footer className="justify-content-between">
                  <div className="d-flex justify-content-center ">
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_25 me-2"></span>{" "}
                      Present
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_15 me-2"></span>{" "}
                      Absent
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_16 me-2"></span> Half
                      day
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_1 me-2"></span> Leave
                    </div>

                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_22 me-2"></span> Day
                      Off / Holiday
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_26 me-2"></span> Late
                      In / Early Out
                    </div>
                  </div>

                  <div>
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
                      className="btn btn-primary btn-elevate m-2"
                    >
                      Filter
                    </button>
                  </div>
                </Modal.Footer>
              </>
            );
          }}
        </Formik>
      </div>
      {attendanceCalendar && attendanceCalendar.length > 0 && <FormTable />}
    </TCard>
    // </>
  );
}
