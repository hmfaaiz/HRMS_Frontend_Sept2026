import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  amountLimitDynamic,
  formatDates,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";

import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { fetchExitReasonData } from "../../../../Dashboard/_redux/dashboardActions";

export const getSeparationEditSchema = () => {
  return Yup.object().shape({
    exitTypeId: Yup.number().required(VALIDATION_MESSAGES.required),

    exitReasonId: Yup.number().required(VALIDATION_MESSAGES.required),

    resignationDate: Yup.date().required(VALIDATION_MESSAGES.required),

    lastWorkingDate: Yup.date()
      .required(VALIDATION_MESSAGES.required)
      .min(
        Yup.ref("resignationDate"),
        "Last working day cannot be before resignation date"
      ),

    noticePeriodDays: Yup.number().required(VALIDATION_MESSAGES.required),
    exitRemark: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
  });
};

export function FormEditForm({
  saveForm,
  formData,
  loading,
  empAuthorityList,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const inputFile = useRef(null);
  const [dateOfJoining, setDateOfJoining] = useState("");

  //drop down
  useEffect(() => {
    dispatch(fetchAllFormsMenu(526, "allExitTypeList"));
  }, [dispatch]);

  useEffect(() => {
    if (formData?.exitTypeId) {
      dispatch(fetchExitReasonData(formData?.exitTypeId));
    }
  }, [formData?.exitTypeId]);

  const getServicePeriod = (start, end) => {
    if (!start || !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        0
      ).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    //  Inclusive calculation
    days += 1;

    const maxDaysInMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      0
    ).getDate();
    if (days > maxDaysInMonth) {
      days -= maxDaysInMonth;
      months += 1;

      if (months >= 12) {
        months -= 12;
        years += 1;
      }
    }

    return `${years} Year(s), ${months} Month(s), ${days} Day(s)`;
  };

  useEffect(() => {
    if (formData?.Employee) {
      let selectedEmp = formData?.Employee;
      setDateOfJoining(selectedEmp?.dateOfJoining);
      getServicePeriod(dateOfJoining, formData.lastWorkingDate);
    }
  }, [formData?.Employee]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...formData, employeetatus: 1 }}
      validationSchema={getSeparationEditSchema(formData)}
      onSubmit={async (values) => {
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleReset,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {loading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right" autoComplete="off">
              <fieldset
                disabled={
                  values?.request_status === "P" ||
                  values?.request_status === "A"
                }
              >
                <div>
                  <div className="flex justify-between">
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Leaving Reasons
                    </h6>
                    <div>
                      {values?.request_status === "P" && (
                        <div className="text-sm text-black text-right w-full">
                          Request Status:{" "}
                          <span className="text-pending font-bold">
                            Pending
                          </span>
                        </div>
                      )}
                      {values?.request_status === "A" && (
                        <div className="text-sm text-black text-right w-full">
                          Request Status:{" "}
                          <span className="text-approved font-bold">
                            Approved
                          </span>
                        </div>
                      )}
                      {values?.request_remarks && (
                        <div className="text-sm text-black text-right w-full">
                          Request Remarks:{" "}
                          <span className=" font-bold">
                            {values?.request_remarks}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-x-3 mt-1">
                    <div>
                      <SearchSelect
                        name="exitTypeId"
                        label={
                          <span>
                            Exit Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={
                          values?.request_status === "P" ||
                          values?.request_status === "A"
                        }
                        onChange={(e) => {
                          setFieldValue("exitTypeId", e.value || null);
                          dispatch(fetchExitReasonData(e.value));
                        }}
                        value={
                          dashboard?.allExitTypeList?.find(
                            (option) => option?.value == values?.exitTypeId
                          ) || null
                        }
                        options={dashboard?.allExitTypeList}
                        error={errors.exitTypeId}
                        touched={touched.exitTypeId}
                      />
                    </div>

                    <div>
                      <SearchSelect
                        name="exitReasonId"
                        label={
                          <span>
                            Exit Reason<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={
                          values?.request_status === "P" ||
                          values?.request_status === "A"
                        }
                        onChange={(e) => {
                          setFieldValue("exitReasonId", e.value || null);
                        }}
                        value={
                          dashboard?.allExitReasonList?.find(
                            (option) => option?.value == values?.exitReasonId
                          ) || null
                        }
                        options={dashboard?.allExitReasonList}
                        error={errors.exitReasonId}
                        touched={touched.exitReasonId}
                      />
                    </div>

                    <div></div>
                  </div>
                  <div className="grid lg:grid-cols-3 gap-x-3 mt-1">
                    <div className="md:col-span-2">
                      <Field
                        name="exitRemark"
                        component={TextArea}
                        placeholder="Enter exit remarks"
                        label={
                          <span>
                            Remarks<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        className="form-control " // Force full height
                        autoComplete="off"
                      />
                    </div>
                    <div className=""></div>
                  </div>
                </div>

                <hr></hr>

                <div>
                  <h6 className="font-bold mb-0 text-primary">
                    Resignation & Notice Period Information
                  </h6>

                  <div className="grid lg:grid-cols-6 gap-x-3">
                    <div>
                      <label>
                        Resignation Submission Date{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Resignation Submission Date"
                        disabled={true}
                        component={DatePickerField}
                        selected={
                          values?.resignationDate
                            ? new Date(values.resignationDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("resignationDate", selectedDate);
                          if (date && values.lastWorkingDate) {
                            const diffDays =
                              Math.floor(
                                (new Date(values.lastWorkingDate) -
                                  new Date(date)) /
                                  (1000 * 60 * 60 * 24)
                              ) + 1; // inclusive of last day

                            setFieldValue("noticePeriodDays", diffDays);
                          }
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="resignationDate"
                        autoComplete="off"
                        maxDate={new Date()}
                        minDate={new Date(dateOfJoining)}
                      />
                    </div>
                    <div>
                      <label>
                        Last Working Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        className="form-control"
                        placeholder="Last Working date"
                        component={DatePickerField}
                        selected={
                          values?.lastWorkingDate
                            ? new Date(values.lastWorkingDate)
                            : null
                        }
                        onChange={(date) => {
                          let selectedDate = formatDates(date, "yyyy-MM-dd");
                          setFieldValue("lastWorkingDate", selectedDate);
                          getServicePeriod(dateOfJoining, selectedDate);
                          if (values.resignationDate && date) {
                            const diffDays =
                              Math.floor(
                                (new Date(date) -
                                  new Date(values.resignationDate)) /
                                  (1000 * 60 * 60 * 24)
                              ) + 1; // inclusive
                            setFieldValue("noticePeriodDays", diffDays);
                          }
                        }}
                        dateFormat="dd-MMM-yyyy"
                        name="lastWorkingDate"
                        autoComplete="off"
                        // maxDate={new Date()}
                        minDate={new Date(dateOfJoining)}
                      />
                    </div>
                    <div>
                      <Field
                        name="noticePeriodDays"
                        component={Input}
                        disabled={true}
                        placeholder="Auto notice period in days"
                        label={<span>Notice Period Days</span>}
                        value={
                          values.resignationDate && values.lastWorkingDate
                            ? Math.floor(
                                (new Date(values.lastWorkingDate) -
                                  new Date(values.resignationDate)) /
                                  (1000 * 60 * 60 * 24)
                              ) + 1
                            : ""
                        }
                        autoComplete="off"
                        type="number"
                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(
                            e.target.value,
                            3
                          ); // Limit to 3 digits
                        }}
                      />
                    </div>
                    <div>
                      <Field
                        name="totalServicePeriod"
                        component={Input}
                        placeholder="Auto total service period"
                        label={<span>Total Service Period</span>}
                        value={
                          dateOfJoining && values.lastWorkingDate
                            ? getServicePeriod(
                                dateOfJoining,
                                values.lastWorkingDate
                              )
                            : ""
                        }
                        autoComplete="off"
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-6 gap-x-3">
                  <div className="col-span-1">
                    <FileUpload
                      label={<>Resignation Letter Attachment</>}
                      id="file"
                      name="file"
                      type="file"
                      disabled={
                        values?.request_status === "P" ||
                        values?.request_status === "A"
                      }
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("resignationAttachment", file);
                      }}
                    />
                    {errors.resignationAttachment &&
                      touched.resignationAttachment && (
                        <div className="invalid-feedback">
                          {errors.resignationAttachment}
                        </div>
                      )}

                    {/* </label> */}

                    {/* Show existing file if any */}
                    {/* {formData?.resignationAttachment || values?.resignationAttachment && (
                      <div className="mt-2">
                        <strong>Existing File: </strong>
                        <a
                          href={getUploadUrl(formData?.resignationAttachment ||  values?.resignationAttachment)}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {getFileName(formData?.resignationAttachment ||  values?.resignationAttachment)}
                        </a>
                      </div>
                    )} */}

                    {(formData?.resignationAttachment ||
                      values?.resignationAttachment) && (
                      <div className="mt-2">
                        <strong>Existing File: </strong>
                        <a
                          href={
                            typeof (
                              values?.resignationAttachment ||
                              formData?.resignationAttachment
                            ) === "string"
                              ? getUploadUrl(
                                  values?.resignationAttachment ||
                                    formData?.resignationAttachment
                                )
                              : URL.createObjectURL(
                                  values?.resignationAttachment ||
                                    formData?.resignationAttachment
                                )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {typeof (
                            values?.resignationAttachment ||
                            formData?.resignationAttachment
                          ) === "string"
                            ? getFileName(
                                values?.resignationAttachment ||
                                  formData?.resignationAttachment
                              )
                            : values?.resignationAttachment?.name ||
                              formData?.resignationAttachment}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <>
              <button
                type="reset"
                disabled={
                  values?.request_status === "P" ||
                  values?.request_status === "A"
                }
                onClick={() => {
                  handleReset();
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  empAuthorityList?.length === 0 ||
                  loading ||
                  values?.request_status === "P" ||
                  values?.request_status === "A"
                }
                onClick={() => {
                  handleSubmit();
                }}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
