import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getFileName, getUploadUrl } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { TimePickerField } from "../../../../../../_metronic/_partials/controls/forms/TimePickerField";
import { FetchAllFacilitatorEmployee, fetchCompanyEmployeesData, fetchCurrentParentTask, fetchMasterTicketType } from "../../../../Dashboard/_redux/dashboardActions";
import { CircleMinus, CirclePlus } from "lucide-react";

// percentage: Yup.string().required("Required*"),
const facilitator_ticket_creationEditSchema = (value, currentUser) => {
  return Yup.object()
    .shape({
      file: Yup.string().nullable(),
      // .required(VALIDATION_MESSAGES.required),

      assignTo: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),

      // ticketDescription: Yup.string()
      //   .nullable()
      //   .required(VALIDATION_MESSAGES.required),

      // assignByToBeSelected: Yup.number()
      //   .nullable()
      //   .when("assignTo", (assignTo, schema) => {
      //     if (Number(assignTo) === Number(currentUser) && !value.Id) {
      //       return schema
      //         .required("Assign By is required")
      //         .notOneOf(
      //           [Yup.ref("assignTo")],
      //           "Assign By cannot be the same as Assign To"
      //         );
      //     }

      //     return schema.notOneOf(
      //       [Yup.ref("assignTo")],
      //       "Assign By cannot be the same as Assign To"
      //     );
      //   }),

      assignByToBeSelected: Yup.number()
        .nullable()
        .when("assignTo", (assignTo, schema) => {
          if (Number(assignTo) === Number(currentUser) && !value.Id) {
            return schema
              .required("Assign By is required")
              .notOneOf(
                [Yup.ref("assignTo")],
                "Assign By cannot be the same as Assign To"
              );
          }

          return schema.notOneOf(
            [Yup.ref("assignTo")],
            "Assign By cannot be the same as Assign To"
          );
        }),

      priorityLevelId: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),

      ticketTypeId: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),

      dueDate: Yup.date()

        .nullable()
        .required(VALIDATION_MESSAGES.required),


      ticketDate: Yup.date()

        .nullable()
        .required(VALIDATION_MESSAGES.required),


      // timeRangeFrom: Yup.string()
      //   .when("timeRangeTo", {
      //     is: (value) => value !== null && value !== "",
      //     then: Yup.string().required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.string().notRequired(),
      //   }),

      // timeRangeTo: Yup.string()
      //   .when("timeRangeFrom", {
      //     is: (value) => value !== null && value !== "",
      //     then: Yup.string().required(VALIDATION_MESSAGES.required),
      //     otherwise: Yup.string().notRequired(),
      //   }),



      noOfHours: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),


      ticketStatus: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),

      // timeRangeFrom: Yup.string().test(
      //   "from-required-if-to",
      //   VALIDATION_MESSAGES.required,
      //   function (value) {
      //     const { timeRangeTo } = this.parent;
      //     if (timeRangeTo && !value) {
      //       return false;
      //     }
      //     return true;
      //   }
      // ),

      // timeRangeTo: Yup.string().test(
      //   "to-required-if-from",
      //   VALIDATION_MESSAGES.required,
      //   function (value) {
      //     const { timeRangeFrom } = this.parent;
      //     if (timeRangeFrom && !value) {
      //       return false;
      //     }
      //     return true;
      //   }
      // ),



      ticketDescription: Yup.string()
        .trim()
        .nullable()
        .required(VALIDATION_MESSAGES.required),


      // alertFromDate: Yup.string().nullable().when("isForAlert", {
      //   is: true,
      //   then: (schema) => schema.required(VALIDATION_MESSAGES.required),
      //   otherwise: (schema) => schema.notRequired(),

      // }),

      // alertEndDate: Yup.string().nullable().when("isForAlert", {
      //   is: true,
      //   then: (schema) => schema.required(VALIDATION_MESSAGES.required),
      //   otherwise: (schema) => schema.notRequired(),


      // }),

      alertFromDate: Yup.date()
        .nullable()
        .when("isForAlert", {
          is: true,
          then: (schema) =>
            schema
              .required(VALIDATION_MESSAGES.required)
              .test(
                "from-date-check",
                "Start Date must be earlier than End Date",
                function (value) {
                  const { alertEndDate } = this.parent;
                  if (!value || !alertEndDate) return true;
                  return new Date(value) <= new Date(alertEndDate);
                }
              ),
          otherwise: (schema) => schema.notRequired(),
        }),

      alertEndDate: Yup.date()
        .nullable()
        .when("isForAlert", {
          is: true,
          then: (schema) =>
            schema
              .required(VALIDATION_MESSAGES.required)
              .test(
                "end-date-check",
                "End Date must be later than Start Date",
                function (value) {
                  const { alertFromDate } = this.parent;
                  if (!value || !alertFromDate) return true;
                  return new Date(value) >= new Date(alertFromDate);
                }
              ),
          otherwise: (schema) => schema.notRequired(),
        }),
    }


    );
};

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading, setId, setReadMode, receiveMode, setReceiveMode, setEditMode, editMode,
}) {
  const dispatch = useDispatch();

  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (!formData.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
      dispatch(fetchMasterTicketType());
      dispatch(FetchAllFacilitatorEmployee(formData?.ticketStatus));
      dispatch(fetchCompanyEmployeesData());
      dispatch(fetchCurrentParentTask());
    }
  }, [dispatch, formData.Id]);

  const { currentState, userAccess, allEmployees, facilitatorEmployeeList, currentUser, allCompanyEmployeesData } = useSelector((state) => {
    return {
      currentState: state.facilitator_ticket_creation,
      userAccess: state?.auth?.userAccess["facilitator_ticket_creation"],
      allEmployees: state.dashboard.allEmployees,
      allCompanyEmployeesData: state.dashboard.allCompanyEmployeesData,
      facilitatorEmployeeList: state.dashboard.facilitatorEmployeeList,
      currentUser: state.auth.user,
    };
  }, shallowEqual);


  const ticketStatusOptions = [

    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "Send for Review" },
  ];




  const calculateHours = (fromTime, toTime) => {
    if (!fromTime || !toTime) return 0;

    // "13:45" → total minutes
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const fromMinutes = parseTime(fromTime);
    const toMinutes = parseTime(toTime);

    let diffMinutes = toMinutes - fromMinutes;

    //  JIRA concept: next day consider
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60;
    }

    return diffMinutes / 60;
  };


  // useEffect(()=>{

  //    if (facilitatorEmployeeList?.length == 1) {
  //     setFieldValue("assignTo", facilitatorEmployeeList[0].value);
  //   }

  // },[facilitatorEmployeeList])

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        remarks: !isUserForRead ? "" : formData.remarks || "",
        file: !isUserForRead ? "" : formData.file || "",
        ticketDescription: formData?.Master?.ticketDescription ?? "",
        ticketStatus: formData?.ticketStatus == null
          ? 1
          : isUserForRead
            ? formData.ticketStatus
            : formData?.initiator
              ? formData.ticketStatus
              : 2,
        // ticketStatus: !isUserForRead ? 1 : formData.ticketStatus || 1,
        // ticketStatus:!formData?.initiator && (formData?.ticketStatus === 1 || formData?.ticketStatus === 3)? 2: formData?.ticketStatus ?? 1,
        initiator: formData?.initiator ?? true,


      }}

      validationSchema={facilitator_ticket_creationEditSchema(formData, currentUser?.employeeIdMapping)}
      onSubmit={(values, { resetForm }) => {
        enableLoading();


        const clearForm = () => {

          resetForm();
          if (inputFile?.current) {
            inputFile.current.value = "";
          }
        };

        saveForm(values, clearForm, onHide);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange, handleReset }) => (
        <>

          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>

                {console.log("errors111", errors, values)}




                <div className="grid grid-cols-4 gap-x-3 gap-y-1">


                  <div className="">
                    <SearchSelect
                      name="ticketTypeId"
                      label={
                        <span>
                          Ticket Type<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || editMode || !values.initiator || receiveMode}
                      onChange={(e) => {
                        setFieldValue("ticketTypeId", e.value || null);
                        dispatch(FetchAllFacilitatorEmployee(e.value));
                        // setAssignTo(setFieldValue)
                        // if (facilitatorEmployeeList?.length === 1) {
                  
                        //   setFieldValue("assignTo", facilitatorEmployeeList[0].value);
                        // }
                      }}
                      value={
                        dashboard.allMasterTicketType.find(
                          (option) => option.value === values.ticketTypeId
                        ) || null
                      }

                      options={dashboard.allMasterTicketType}
                      error={errors.ticketTypeId}
                      touched={touched.ticketTypeId}
                    />
                  </div>




                  <div className="">
                    <SearchSelect
                      name="priorityLevelId"
                      label={
                        <span>
                          Priority Level<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || !values.initiator}
                      onChange={(e) => {
                        setFieldValue("priorityLevelId", e.value || null);
                      }}
                      value={
                        dashboard.priorityLevelList.find(
                          (option) => option.value === values.priorityLevelId
                        ) || null
                      }
                      options={dashboard.priorityLevelList}
                      error={errors.priorityLevelId}
                      touched={touched.priorityLevelId}
                    />
                  </div>



                  <div className="">
                    <SearchSelect
                      name="assignTo"
                      label={
                        <span>
                          Assign To<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      // Disable if read mode, no initiator, or auto-assigned
                      isDisabled={
                        isUserForRead || receiveMode || editMode ||
                        !values.initiator ||
                        facilitatorEmployeeList?.length === 1 || !values.ticketTypeId
                      }
                      onChange={(e) => {
                        setFieldValue("assignTo", e.value || null);
                      }}
                      // Auto-assign if only 1 record
                      value={
                        facilitatorEmployeeList?.length === 1
                          ? facilitatorEmployeeList[0]
                          : facilitatorEmployeeList?.find(option => option.value === values.assignTo) || null
                      }

                      options={facilitatorEmployeeList.map(op => ({
                        label: op.label,
                        value: op.value,
                        // isDisabled: String(op.value) == String(currentUser.employeeIdMapping)
                      }))}

                      error={errors.assignTo}
                      touched={touched.assignTo}
                    />
                  </div>

                  {Number(values?.assignTo) === Number(currentUser?.employeeIdMapping) && !formData.Id && (
                    <div className="">
                      <SearchSelect
                        name="assignByToBeSelected"
                        label={
                          <span>
                            Assign By<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        // Disable if read mode, no initiator, or auto-assigned
                        isDisabled={
                          isUserForRead || receiveMode || editMode ||
                          !values.initiator ||
                          facilitatorEmployeeList?.length === 1
                        }
                        onChange={(e) => {
                          setFieldValue("assignByToBeSelected", e.value || null);
                        }}
                        // Auto-assign if only 1 record
                        value={
                          facilitatorEmployeeList?.length === 1
                            ? facilitatorEmployeeList[0]
                            : facilitatorEmployeeList?.find(option => option.value === values.assignByToBeSelected) || null
                        }

                        options={facilitatorEmployeeList.map(op => ({
                          label: op.label,
                          value: op.value,

                        }))}

                        error={errors.assignByToBeSelected}
                        touched={touched.assignByToBeSelected}
                      />
                    </div>
                  )}









                </div>




                <div className="grid grid-cols-4 gap-x-3 gap-y-1">


                  {/*  AlertWork26326 { */}
                  <div className="">
                    <label>
                      {" "}
                      Start Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Ticket Date"
                      // selected={
                      //   values?.ticketDate ? new Date(values.ticketDate) : new Date()
                      // }
                      selected={
                        values?.ticketDate ? new Date(values.ticketDate) : null
                      }
                      onChange={(date) => {
                        setFieldValue("ticketDate", date)
                        setFieldValue("isForAlert", false)

                        setFieldValue("alertFromDate", "")
                        setFieldValue("alertEndDate", "")
                      }}
                      disabled={isUserForRead || !values.initiator}
                      dateFormat="dd-MMM-yyyy"
                      name="ticketDate"
                      autoComplete="off"
                      minDate={new Date().setDate(new Date().getDate() - 14)}
                      // maxDate={values?.dueDate || new Date().setDate(new Date().getDate() + 14)}
                      maxDate={new Date(Math.min(values?.dueDate ? new Date(values.dueDate).getTime() : new Date().setDate(new Date().getDate() + 14), new Date().setDate(new Date().getDate() + 14)))}
                    />

                    {touched.ticketDate && errors.ticketDate && (
                      <div className="invalid-feedback d-block">
                        {errors.ticketDate}
                      </div>
                    )}
                  </div>
                  {/* // AlertWork26326 } */}

                  <div className="">
                    <label>
                      {" "}
                      Due Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Due Date"
                      selected={
                        values?.dueDate ? new Date(values.dueDate) : null
                      }
                      onChange={(date) => {
                        setFieldValue("dueDate", date)
                        setFieldValue("isForAlert", false)

                        setFieldValue("alertFromDate", "")
                        setFieldValue("alertEndDate", "")
                      }}
                      disabled={isUserForRead || !values.initiator}
                      dateFormat="dd-MMM-yyyy"
                      name="dueDate"
                      autoComplete="off"
                      minDate={new Date(values.ticketDate)}
                    // maxDate={new Date().setDate(new Date().getDate() + 365)}
                    />

                    {touched.dueDate && errors.dueDate && (
                      <div className="invalid-feedback d-block">
                        {errors.dueDate}
                      </div>
                    )}
                  </div>





                  <div className="">
                    <label>
                      <span>
                        Estimated Hours
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    {/* <Field
                      name="noOfHours"
                      component={Input}
                      placeholder="Enter no of hours"
                      type="number"
                    /> */}

                    <Field
                      name="noOfHours"
                      component={Input}
                      placeholder="Enter no of hours"
                      type="number"

                      disabled={values?.timeRangeFrom || values?.timeRangeTo || !values?.initiator}
                    />

                  </div>



                  {!showAlert ? (
                    <span className="flex items-center gap-2 mt-6">
                      <CirclePlus
                        className="w-4 h-4 text-primary cursor-pointer "
                        onClick={() => setShowAlert(true)}
                      /> {" "}
                      Add Reminder
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 mt-6">
                      <CircleMinus
                        className="w-4 h-4 text-primary cursor-pointer "
                        onClick={() => setShowAlert(false)}
                      />
                      Hide Reminder
                    </span>
                  )}

                  {showAlert && (
                    <>

                      <div className="">
                        <label className="flex items-center gap-2 mt-3">
                          <Field
                            type="checkbox"
                            name="isForAlert"
                            disabled={!values.initiator || isUserForRead}
                            checked={values.isForAlert}
                            onChange={(e) => {
                              setFieldValue("isForAlert", e.target.checked)

                              setFieldValue("alertFromDate", "")
                              setFieldValue("alertEndDate", "")
                            }}
                          />
                          <span>
                            For Dashboard Reminder
                          </span>
                        </label>
                        {errors.isForAlert && touched.isForAlert && (
                          <div className="invalid-feedback">{errors.isForAlert}</div>
                        )}
                      </div>


                      <div className="">
                        <label>
                          {" "}
                          Reminder Start Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="Alert Start Date"

                          selected={
                            values?.alertFromDate ? new Date(values.alertFromDate) : null
                          }
                          onChange={(date) => setFieldValue("alertFromDate", date)}
                          disabled={isUserForRead || !values.initiator || !values.isForAlert}
                          dateFormat="dd-MMM-yyyy"
                          name="alertFromDate"
                          autoComplete="off"
                          minDate={new Date()}
                          maxDate={values?.alertEndDate}

                        />

                        {touched.alertFromDate && errors.alertFromDate && (
                          <div className="invalid-feedback d-block">
                            {errors.alertFromDate}
                          </div>
                        )}
                      </div>


                      <div className="">
                        <label>
                          {" "}
                          Reminder End Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="Due Date"
                          selected={
                            values?.alertEndDate ? new Date(values.alertEndDate) : null
                          }
                          onChange={(date) => setFieldValue("alertEndDate", date)}
                          disabled={isUserForRead || !values.initiator || !values.isForAlert}
                          dateFormat="dd-MMM-yyyy"
                          name="alertEndDate"
                          autoComplete="off"
                          minDate={new Date(values?.alertFromDate)}
                          maxDate={new Date(values?.dueDate)}
                        />

                        {touched.alertEndDate && errors.alertEndDate && (
                          <div className="invalid-feedback d-block">
                            {errors.alertEndDate}
                          </div>
                        )}
                      </div>
                    </>
                  )}


                </div>



                <div className="grid grid-cols-4 gap-x-3 gap-y-1">




                  <div className="col-span-3">
                    <Field
                      name="ticketDescription"
                      component={TextArea}
                      // disabled={receiveMode || formData?.Master?.ticketDescription}
                      disabled={isUserForRead || !values.initiator}
                      placeholder="Enter ticket description"
                      className="form-control" // Force full height
                      // value={receiveMode ? formData?.Master?.ticketDescription : values?.ticketDescription || formData?.Master?.ticketDescription ? formData?.Master?.ticketDescription : values?.ticketDescription}

                      label={
                        <span>
                          {" "}
                          Ticket Description
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div>

                    </div>
                  </div>

                  <div className="">
                    <SearchSelect
                      name="parentId"
                      label={
                        <span>
                          Parent Task
                        </span>
                      }
                      isDisabled={isUserForRead || editMode || !values.initiator || receiveMode}
                      onChange={(e) => {
                        setFieldValue("parentId", e.value || null);

                      }}
                      value={
                        dashboard.allCurrentParentTask?.find(
                          (option) => option.value === values.parentId
                        ) || null
                      }

                      options={dashboard?.allCurrentParentTask}

                    />
                  </div>



                  {/* {formData?.file && (
                    <div className="">
                      <label>   Attachment:</label>



                      {(formData?.file) && (
                        <div className="mt-2">
                          <label>Existing File:</label>

                          <a
                            href={
                              typeof (formData?.file) === "string"
                                ? getUploadUrl(formData?.file)
                                : URL.createObjectURL(formData?.file)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-primary text-sm"
                          >
                            {typeof (formData?.file) === "string"
                              ? getFileName(formData?.file)
                              : formData?.file}
                          </a>
                        </div>
                      )}

                    </div>

                  )} */}

                  {formData?.file && (
                    <div className="flex items-center gap-2">
                      <label className="whitespace-nowrap">Attachment:</label>

                      <a
                        href={
                          typeof formData?.file === "string"
                            ? getUploadUrl(formData?.file)
                            : URL.createObjectURL(formData?.file)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-primary text-sm whitespace-nowrap"
                      >
                        {typeof formData?.file === "string"
                          ? getFileName(formData?.file)
                          : formData?.file?.name}
                      </a>
                    </div>
                  )}




                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1">


                  {/* {receiveMode 
                    && ( */}
                  {/* <div className="">
                    <Field
                      name="remarks"
                      component={TextArea}
                      placeholder="Enter remarks"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Remarks

                        </span>
                      }
                      autoComplete="off"
                    />
                    <div>

                    </div>
                  </div> */}
                  {/* ) */}

                  {/* } */}


                </div>
                {values.receiver && (
                  <>
                    <hr />
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Sender Response
                    </h6>

                  </>)
                }

                <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                  {values.receiver && (

                    <>

                      <div className="">
                        <SearchSelect
                          name="assignBy"
                          label={
                            <span>
                              Sender
                            </span>
                          }
                          isDisabled={true}
                          onChange={(e) => {
                            setFieldValue("assignBy", e.value || null);
                          }}
                          value={
                            allCompanyEmployeesData?.find(option => option.value === values.assignBy) || null
                          }
                          options={allCompanyEmployeesData}

                        />
                        {!allCompanyEmployeesData?.find(
                          (option) => option.value === values.assignBy
                        ) && (
                            <p style={{ color: "red" }}>
                              This employee is inactive.
                            </p>
                          )}
                      </div>


                      <div className="col-span-3">
                        <Field
                          name="remarks"
                          component={TextArea}
                          disabled={true}
                          placeholder="Enter remarks"
                          className="form-control" // Force full height
                          value={values.receiver ? formData?.remarks : ""}
                          label={
                            <span>
                              {" "}
                              Sender Remarks

                            </span>
                          }
                          autoComplete="off"
                        />
                        <div>

                        </div>
                      </div>

                      <div className="">
                        <label htmlFor="ticketStatus">
                          Ticket Status<span style={{ color: "red" }}>*</span>

                        </label>

                        {/* <Field
                          name="ticketStatus"
                          as="select"
                          className="form-control"
                          disabled={true}
                         
                        >


                          {[

                            ...ticketStatusOptions, // This renders the rest of the options
                          ].map((option) => (
                            <option key={option.value} value={String(option.value)}
                              disabled={!values.initiator && (option.value === 1 || option.value === 3)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </Field> */}

                        <Field
                          name="ticketStatus"
                          as="select"
                          className="form-control"
                          disabled={true} // always read-only
                          value={formData?.ticketStatus ?? ""} // always show current formData
                        >
                          {[...ticketStatusOptions].map((option) => (
                            <option
                              key={option.value}
                              value={String(option.value)}
                              disabled={(!values?.initiator && (option.value === 1 || option.value === 3))}>
                              {option.label}
                            </option>
                          ))}
                        </Field>



                      </div>


                      {/* {formData?.file && (
                        <div className="">
                          <label>   Attachment</label>



                          {(formData?.file) && (
                            <div className="mt-2">
                              <label>Existing File:</label>

                              <a
                                href={
                                  typeof (formData?.file) === "string"
                                    ? getUploadUrl(formData?.file)
                                    : URL.createObjectURL(formData?.file)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-primary text-sm"
                              >
                                {typeof (formData?.file) === "string"
                                  ? getFileName(formData?.file)
                                  : formData?.file}
                              </a>
                            </div>
                          )}

                        </div>

                      )} */}


                      {formData?.file && (
                        <div className="flex items-center gap-2">
                          <label className="whitespace-nowrap">Attachment:</label>

                          <a
                            href={
                              typeof formData?.file === "string"
                                ? getUploadUrl(formData?.file)
                                : URL.createObjectURL(formData?.file)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-primary text-sm whitespace-nowrap"
                          >
                            {typeof formData?.file === "string"
                              ? getFileName(formData?.file)
                              : formData?.file?.name}
                          </a>
                        </div>
                      )}

                    </>


                  )}



                </div>
                <hr />

                {(values?.receiver || isUserForRead) && (
                  <>


                    <h6 className="font-bold mb-0 text-primary my-2">
                      My Response
                    </h6>

                  </>
                )}


                <div className="grid grid-cols-4 gap-x-3 gap-y-1">

                  {(!formData.isSelf) && (

                    <div className="col-span-3">
                      <Field
                        name="remarks"
                        component={TextArea}
                        placeholder="Enter remarks"
                        className="form-control" // Force full height

                        label={
                          <span>
                            {" "}
                            Remarks

                          </span>
                        }
                        autoComplete="off"
                      />


                    </div>

                  )}

                  <div className="">
                    <label htmlFor="ticketStatus">
                      Ticket Status<span style={{ color: "red" }}>*</span>

                    </label>

                    <Field
                      name="ticketStatus"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue(
                          "ticketStatus",
                          e.target.value === "N/A" ? null : e.target.value
                        );


                      }}
                    >


                      {[

                        ...ticketStatusOptions, // This renders the rest of the options
                      ].map((option) => (
                        <option key={option.value} value={String(option.value)}
                          disabled={!values.initiator && (option.value === 1 || option.value === 3)}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Field>

                    {errors.ticketStatus &&
                      touched.ticketStatus && (
                        <div className="invalid-feedback">
                          {errors.ticketStatus}
                        </div>
                      )}
                  </div>

                  <div className="">

                    <FileUpload
                      label={
                        <>
                          Attachment
                        </>
                      }
                      isEdit={isUserForRead}
                      id="file"
                      name="file"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}


                    />
                    {errors.file && touched.file && (
                      <div className="invalid-feedback">{errors.file}</div>
                    )}




                    {(values?.file) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.file) === "string"
                              ? getUploadUrl(values?.file)
                              : URL.createObjectURL(values?.file)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.file) === "string"
                            ? getFileName(values?.file)
                            : (values?.file)?.name}
                        </a>
                      </div>
                    )}

                  </div>




                </div>








              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isUserForRead ? (
              <button
                type="reset"
                onClick={() => {
                  setId("");
                  handleReset();
                  setReadMode(false)
                  setReceiveMode(false)
                  setEditMode(false)
                  onHide()

                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )}

            {!isUserForRead && (
              <button
                type="button"
                disabled={receiveMode && !allCompanyEmployeesData?.find(option => option.value === values.assignBy)}
                onClick={() => {

                  if (facilitatorEmployeeList?.length === 1) {
                    values.assignTo = facilitatorEmployeeList[0].value;
                  }
                  handleSubmit();
                  // setId("");
                  // handleReset();


                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
                }}

                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
