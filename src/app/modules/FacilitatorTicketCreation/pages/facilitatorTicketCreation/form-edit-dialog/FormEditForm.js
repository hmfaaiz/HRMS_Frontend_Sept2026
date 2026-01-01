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
// percentage: Yup.string().required("Required*"),
const facilitator_ticket_creationEditSchema = Yup.object().shape({


  empAttachment: Yup.string().nullable()
    .required(VALIDATION_MESSAGES.required),

  docName: Yup.string()
    .trim()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


  ticketDescription: Yup.string()
    .trim()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading, setId, setReadMode
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  useEffect(() => {
    if (!formData.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(545, "allTicketTypeList"));
      dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
    }
  }, [dispatch, formData.Id]);

  const { currentState, userAccess, allEmployees } = useSelector((state) => {
    return {
      currentState: state.facilitator_ticket_creation,
      userAccess: state?.auth?.userAccess["facilitator_ticket_creation"],
      allEmployees: state.dashboard.allEmployees
    };
  }, shallowEqual);


  const ticketStatusOptions = [
    { value: 1, label: "Open                                                                                                      |V					" },
    { value: 0, label: "Closed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      validationSchema={facilitator_ticket_creationEditSchema}
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


                <div className="grid grid-cols-3 gap-x-3 gap-y-1">

                  <div className="col-span-6 lg:col-span-4">
                    <SearchSelect
                      name="ticketTypeId"
                      label={
                        <span>
                          Ticket Type
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("ticketTypeId", e.value || null);
                      }}
                      value={
                        dashboard.allTicketTypeList.find(
                          (option) => option.value === values.ticketTypeId
                        ) || null
                      }
                      options={dashboard.allTicketTypeList}
                      error={errors.ticketTypeId}
                      touched={touched.ticketTypeId}
                    />
                  </div>


                  <div className="">
                    <SearchSelect
                      name="priorityLevelId"
                      label={
                        <span>
                          Priority Level
                        </span>
                      }
                      isDisabled={isUserForRead}
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
                          Assign To
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("assignTo", e.value || null);
                      }}
                      value={
                        allEmployees?.find(option => option.value === values.employeeId) || null
                      }
                      options={allEmployees}
                      error={errors.assignTo}
                      touched={touched.assignTo}
                    />
                  </div>

                  <div className="">
                    <Field
                      name="ticketDescription"
                      component={TextArea}
                      placeholder="Enter ticket description"
                      className="form-control" // Force full height
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
                      disabled={true}
                      dateFormat="dd-MMM-yyyy"
                      name="dueDate"
                      autoComplete="off"
                      minDate={new Date()}
                      maxDate={new Date()}
                    />

                    {touched.dueDate && errors.dueDate && (
                      <div className="invalid-feedback d-block">
                        {errors.dueDate}
                      </div>
                    )}
                  </div>

                  <div className="">
                    <label>
                      {" "}
                      Ticket Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Ticket Date"
                      selected={
                        values?.ticketDate ? new Date(values.ticketDate) : null
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
                    <TimePickerField
                      className="form-control"

                      name="timeRangeFrom"
                      label={
                        <span>
                          {" "}
                          Time Range From
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        values?.timeRangeFrom ? values.timeRangeFrom : ""
                      }
                      onChange={(val) => {
                        setFieldValue("timeRangeFrom", val);
                      }}
                      onBlur={() => setFieldTouched("timeRangeFrom", true)}
                      touched={touched.timeRangeFrom}
                      errors={errors.timeRangeFrom}
                    />
                  </div>


                  <div className="">
                    <TimePickerField
                      className="form-control"

                      name="timeRangeTo"
                      label={
                        <span>
                          {" "}
                          Time Range To
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        values?.timeRangeTo ? values.timeRangeTo : ""
                      }
                      onChange={(val) => {
                        setFieldValue("timeRangeTo", val);
                      }}
                      onBlur={() => setFieldTouched("timeRangeTo", true)}
                      touched={touched.timeRangeTo}
                      errors={errors.timeRangeTo}
                    />
                  </div>


                  <div className="">
                    <label>
                      <span>
                        No.of Hours
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="noOfHours"
                      component={Input}
                      placeholder="Enter no of hours"
                      type="number"
                    />
                  </div>


                  <div className="">

                    <FileUpload
                      label={
                        <>
                          Attachment<span style={{ color: "red" }}>*</span>
                        </>
                      }
                      id="file"
                      name="file"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("empAttachment", file);
                      }}


                    />
                    {errors.empAttachment && touched.empAttachment && (
                      <div className="invalid-feedback">{errors.empAttachment}</div>
                    )}




                    {(formData?.empAttachment || values?.empAttachment) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.empAttachment || formData?.empAttachment) === "string"
                              ? getUploadUrl(values?.empAttachment || formData?.empAttachment)
                              : URL.createObjectURL(values?.empAttachment || formData?.empAttachment)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.empAttachment || formData?.empAttachment) === "string"
                            ? getFileName(values?.empAttachment || formData?.empAttachment)
                            : (values?.empAttachment)?.name || formData?.empAttachment}
                        </a>
                      </div>
                    )}

                  </div>


                  <div className="">
                    <label htmlFor="ticketStatus">
                      Ticket Status

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
                        <option key={option.value} value={option.value}>
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
