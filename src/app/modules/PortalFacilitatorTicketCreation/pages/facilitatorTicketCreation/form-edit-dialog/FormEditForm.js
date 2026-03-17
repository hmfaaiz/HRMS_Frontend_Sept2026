import React, { useEffect, useRef } from "react";
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
import { FetchAllFacilitatorEmployee, fetchCompanyEmployeesData, fetchMasterTicketType } from "../../../../Dashboard/_redux/dashboardActions";

// percentage: Yup.string().required("Required*"),
const facilitator_ticket_creationEditSchema = (value, currentUser) => {
  return Yup.object()
    .shape({
      file: Yup.string().nullable(),
      // .required(VALIDATION_MESSAGES.required),

      assignTo: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),

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


      timeRangeFrom: Yup.string()
        .when("timeRangeTo", {
          is: (value) => value !== null && value !== "",
          then: Yup.string().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.string().notRequired(),
        }),

      timeRangeTo: Yup.string()
        .when("timeRangeFrom", {
          is: (value) => value !== null && value !== "",
          then: Yup.string().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.string().notRequired(),
        }),



      noOfHours: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),


      ticketStatus: Yup.number()

        .nullable()
        .required(VALIDATION_MESSAGES.required),

      timeRangeFrom: Yup.string().test(
        "from-required-if-to",
        VALIDATION_MESSAGES.required,
        function (value) {
          const { timeRangeTo } = this.parent;
          if (timeRangeTo && !value) {
            return false;
          }
          return true;
        }
      ),

      timeRangeTo: Yup.string().test(
        "to-required-if-from",
        VALIDATION_MESSAGES.required,
        function (value) {
          const { timeRangeFrom } = this.parent;
          if (timeRangeFrom && !value) {
            return false;
          }
          return true;
        }
      ),



      ticketDescription: Yup.string()
        .trim()
        .nullable(),
      // .required(VALIDATION_MESSAGES.required),

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
  loading, setId, setReadMode, receiveMode, setReceiveMode
}) {
  const dispatch = useDispatch();

  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  useEffect(() => {
    if (!formData.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
      dispatch(fetchMasterTicketType());
      dispatch(FetchAllFacilitatorEmployee(formData?.ticketStatus));
      dispatch(fetchCompanyEmployeesData());
    }
  }, [dispatch, formData.Id]);

  const { currentState, userAccess, allEmployees, facilitatorEmployeeList, currentUser,allCompanyEmployeesData } = useSelector((state) => {
    return {
      currentState: state.portal_ticket_creation,
      userAccess: state?.auth?.userAccess["portal_ticket_creation"],
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
        ticketStatus: !formData?.ticketStatus
          ? 1
          : formData?.isUserForRead
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

        saveForm(values, clearForm);
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



                <div className="grid grid-cols-8 gap-x-3 gap-y-1">

                  <div className="">
                    <SearchSelect
                      name="ticketTypeId"
                      label={
                        <span>
                          Ticket Type<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || !values.initiator || receiveMode}
                      onChange={(e) => {
                        setFieldValue("ticketTypeId", e.value || null);
                        dispatch(FetchAllFacilitatorEmployee(e.value));
                        // setAssignTo(setFieldValue)
                        // if (facilitatorEmployeeList?.length === 1) {
                        //   console.log("Auto-assigning:", facilitatorEmployeeList[0].value);
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
                        isUserForRead || receiveMode ||
                        !values.initiator ||
                        facilitatorEmployeeList?.length === 1
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

                  {Number(values?.assignTo) === Number(currentUser?.employeeIdMapping) && !formData.Id &&(
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
                          isUserForRead || receiveMode ||
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




                  <div className="">
                    <label>
                      {" "}
                      Ticket Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Ticket Date"
                      selected={
                        values?.ticketDate ? new Date(values.ticketDate) : new Date()
                      }
                      disabled={true}
                      dateFormat="dd-MMM-yyyy"
                      name="ticketDate"
                      autoComplete="off"
                      minDate={new Date()}
                      maxDate={new Date()}
                    />

                    {touched.ticketDate && errors.ticketDate && (
                      <div className="invalid-feedback d-block">
                        {errors.ticketDate}
                      </div>
                    )}
                  </div>

                  <div className="">
                    <label>
                      {" "}
                      Due Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Job Date"
                      selected={
                        values?.dueDate ? new Date(values.dueDate) : null
                      }
                      onChange={(date) => setFieldValue("dueDate", date)}
                      disabled={isUserForRead || !values.initiator}
                      dateFormat="dd-MMM-yyyy"
                      name="dueDate"
                      autoComplete="off"
                      minDate={new Date()}
                    // maxDate={new Date()}
                    />

                    {touched.dueDate && errors.dueDate && (
                      <div className="invalid-feedback d-block">
                        {errors.dueDate}
                      </div>
                    )}
                  </div>






                  <div>
                    <label>
                      <span>From Time</span>
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      // disabled={!values.initiator}
                      name="timeRangeFrom"
                      step="60"   //  minutes only (no seconds)
                      value={values.timeRangeFrom || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("timeRangeFrom", val);

                        const hours = calculateHours(val, values.timeRangeTo);
                        setFieldValue("noOfHours", hours.toFixed(2));
                      }}
                    />
                  </div>



                  <div>
                    <label>
                      <span>To Time</span>
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      // disabled={!values.initiator}
                      name="timeRangeTo"
                      step="60"
                      value={values.timeRangeTo || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("timeRangeTo", val);

                        const hours = calculateHours(values.timeRangeFrom, val);
                        setFieldValue("noOfHours", hours.toFixed(2));
                      }}
                    />
                  </div>


                  <div className="">
                    <label>
                      <span>
                        No.of Hours
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

                      disabled={values.timeRangeFrom || values.timeRangeTo}
                    />

                  </div>
                </div>




                <div className="grid grid-cols-8 gap-x-3 gap-y-1">


                  {/* <div className="">
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
                        <div className="text-danger">
                          {errors.ticketStatus}
                        </div>
                      )}
                  </div> */}

                  <div className="col-span-3">
                    <Field
                      name="ticketDescription"
                      component={TextArea}
                      disabled={receiveMode || formData?.Master?.ticketDescription}
                      placeholder="Enter ticket description"
                      className="form-control" // Force full height
                      value={receiveMode ? formData?.Master?.ticketDescription : values?.ticketDescription || formData?.Master?.ticketDescription ? formData?.Master?.ticketDescription : values?.ticketDescription}

                      label={
                        <span>
                          {" "}
                          Ticket Description
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div>

                    </div>
                  </div>

                  {formData?.file && (
                    <div className="">
                      <label>   Attachment</label>

                      {/* <FileUpload
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


                    /> */}
                      {/* {errors.file && touched.file && (
                      <div className="invalid-feedback">{errors.file}</div>
                    )} */}




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

                <div className="grid grid-cols-8 gap-x-3 gap-y-1">
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
                              disabled={!values.initiator && (option.value === 1 || option.value === 3)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </Field>



                      </div>


                      {formData?.file && (
                        <div className="">
                          <label>   Attachment</label>

                          {/* <FileUpload
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


                    /> */}
                          {/* {errors.file && touched.file && (
                      <div className="invalid-feedback">{errors.file}</div>
                    )} */}




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

                <div className="grid grid-cols-8 gap-x-3 gap-y-1">

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
                    <div>

                    </div>
                  </div>



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
            {/* {!isUserForRead ? ( */}
            <button
              type="reset"
              onClick={() => {
                setId("");
                handleReset();
                setReadMode(false)
                setReceiveMode(false)

                if (inputFile?.current) {
                  inputFile.current.value = "";
                }
              }}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            {/* ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )} */}

            {!isUserForRead && (
              <button
                type="button"
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
