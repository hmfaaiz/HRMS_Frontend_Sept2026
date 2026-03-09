import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";

import { useDispatch, useSelector } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllProjects,
  fetchAllTicket,
  fetchAllTicketStatus,
} from "../../../../Dashboard/_redux/dashboardActions";
import * as actions from "../../../_redux/redux-Actions";
import {
  formatDates,
  getFileName,
  getUploadUrl,
  PriorityType,
  TicketType,
} from "../../../../../utils/common";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";

/* ---------------- COMPONENT ---------------- */
export function FormEditForm({
  saveForm,
  dataForEdit,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
  query,
}) {
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const { dashboard } = useSelector((state) => state);
  const [formData, setFormData] = useState({});
  const { auth } = useSelector((state) => state);

  const [defCode, setDefCode] = useState(null);

  /* -------- FETCH MASTER DATA -------- */

  // Dynamic validation schema using useMemo
  // Dynamic validation schema using useMemo
  const formSchema = useMemo(() => {
    return Yup.object().shape({
      projectId: Yup.string()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      ticketDescription: Yup.string()
        .nullable()
        .required(VALIDATION_MESSAGES.required)
        .matches(/^[A-Za-z\s.-]+$/, "Name must only contain letters."),

      ticketSummary: Yup.string()
        .nullable()
        .optional(),

      ticketTypeId: Yup.string()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      // Start Date - Conditional based on ticketTypeId
      startDate: Yup.date()
        .nullable()
        .typeError("Invalid date")
        .when("ticketTypeId", {
          is: (ticketTypeId) => ticketTypeId != "1",
          then: (schema) => schema.required(VALIDATION_MESSAGES.required),
          otherwise: (schema) => schema.optional(),
        }),

      // Due Date - Conditional based on ticketTypeId and defCode.policy
      dueDate: Yup.date()
        .nullable()
        .typeError("Invalid date")
        .when("ticketTypeId", {
          is: (ticketTypeId) => ticketTypeId != "1",
          then: (schema) =>
            schema
              .when([], {
                is: () => defCode?.policy == 1,
                then: (s) => s.required(VALIDATION_MESSAGES.required),
                otherwise: (s) => s.optional(),
              })
              .test(
                "dueDate-not-before-startDate",
                VALIDATION_MESSAGES.endDateMustBeAfterStartDate,
                function(dueDate) {
                  const { startDate } = this.parent;
                  if (!dueDate || !startDate) return true;

                  // compare date-only (ignore time)
                  const d = new Date(dueDate);
                  const s = new Date(startDate);
                  d.setHours(0, 0, 0, 0);
                  s.setHours(0, 0, 0, 0);

                  return d >= s; //  18 >= 18 allowed, 17 < 18 => error
                },
              ),
          otherwise: (schema) => schema.optional(),
        }),

      priority: Yup.string()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      ticketStatusId: Yup.string()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      assignToEmpId: Yup.string()
        .nullable()
        .optional(),

      reportToEmpId: Yup.string()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      parentEpicId: Yup.string()
        .nullable()
        .when("ticketTypeId", {
          is: (ticketTypeId) =>
            ["2", "3", "4", "5"].includes(String(ticketTypeId)),
          then: (sch) => sch.required(VALIDATION_MESSAGES.required),
          otherwise: (sch) => sch.optional(),
        }),

      parentTaskId: Yup.string()
        .nullable()
        .when("ticketTypeId", {
          is: (ticketTypeId) => ["4", "5"].includes(String(ticketTypeId)),
          then: (sch) => sch.required(VALIDATION_MESSAGES.required),
          otherwise: (sch) => sch.optional(),
        }),

      noOfHours: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
    });
  }, [defCode]); // Recreate schema when defCode changes

  useEffect(() => {
    dispatch(fetchAllTicketStatus());
    dispatch(fetchAllTicket());
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);
  useEffect(() => {
    if (!auth?.user?.employeeIdMapping) return;

    dispatch(fetchAllProjects(auth?.user?.employeeIdMapping));
  }, [auth?.user?.employeeIdMapping]);

  useEffect(() => {
    updateData();
  }, [id, query, dataForEdit]);

  const updateData = async () => {
    if (!id) {
      if (query && Object?.keys(query)?.length) {
        let res = await dispatch(
          actions.getLatestTicketNumBaseOnProjectId(query?.projectId),
        );
        setDefCode(res);
        setFormData({
          ...dataForEdit,
          ...query,
        });
      } else {
        setFormData({
          ...dataForEdit,
        });
      }
    } else {
      setFormData({
        ...dataForEdit,
      });
    }
  };

  /* ---------------- FORM ---------------- */
  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...formData,
        reportToEmpId: !id
          ? auth?.user?.employeeIdMapping
          : formData?.reportToEmpId,
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,
          startDate: values.startDate
            ? formatDates(values.startDate, "dd-MMM-yyyy")
            : null,
          dueDate: values.dueDate
            ? formatDates(values.dueDate, "dd-MMM-yyyy")
            : null,
        };
        saveForm(payload);
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        validateForm,
        setTouched,
        setValues,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
                  {/* Ticket CODE */}
                  {id && (
                    <div>
                      <Field
                        name="ticketCode"
                        component={Input}
                        disabled
                        label={
                          <span>
                            Ticket Code <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                    </div>
                  )}
                  {/* Project */}
                  <div>
                    <SearchSelect
                      name="projectId"
                      label={
                        <span>
                          Project <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        dashboard?.allProjects?.find(
                          (el) => el?.value == values?.projectId,
                        ) || null
                      }
                      options={dashboard.allProjects || []}
                      error={errors.projectId}
                      isDisabled={id}
                      touched={touched.projectId}
                      onChange={async (e) => {
                        if (e?.value) {
                          setFieldValue("projectId", e.value);
                          let res = await dispatch(
                            actions.getLatestTicketNumBaseOnProjectId(e?.value),
                          );
                          setDefCode(res);
                          setFieldValue("ticketTypeId", "");
                          setFieldValue("parentEpicId", null);
                          setFieldValue("parentTaskId", null);
                        }
                      }}
                    />
                  </div>

                  {/* Ticket Description */}
                  <div className="col-span-2 sm:col-span-3">
                    <Field
                      name="ticketDescription"
                      component={Input}
                      maxLength={200}
                      label={
                        <span>
                          Ticket Description{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>
                  {/* Ticket SUmmary */}
                  <div className="col-span-2 sm:col-span-3">
                    <Field
                      name="ticketSummary"
                      component={TextArea}
                      label={<span>Ticket Summary </span>}
                    />
                  </div>
                  {/* Ticket Type */}
                  <div>
                    <SearchSelect
                      name="ticketTypeId"
                      label={
                        <span>
                          Ticket Type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        TicketType?.find(
                          (el) => el?.value == values?.ticketTypeId,
                        ) || null
                      }
                      options={TicketType || []}
                      error={errors.ticketTypeId}
                      touched={touched.ticketTypeId}
                      onChange={(e) => {
                        setFieldValue("ticketTypeId", e?.value);
                        setFieldValue("parentEpicId", null);
                        setFieldValue("parentTaskId", null);
                      }}
                    />
                  </div>
                  {/* Ticket Dates  */}
                  {/* Ticket Dates - Updated labels */}
                  <div className="grid grid-cols-2 gap-x-3">
                    <div>
                      <Field
                        name="startDate"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        disabled={isUserForRead}
                        onChange={(date) => {
                          setFieldValue("startDate", date);
                        }}
                        label={
                          <span>
                            Start Date
                            {defCode?.policy && values.ticketTypeId != 1 ? ( // Show * only when policy is true
                              <span style={{ color: "red" }}>*</span>
                            ) : (
                              ""
                            )}
                          </span>
                        }
                      />
                    </div>
                    <div>
                      <Field
                        name="dueDate"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        disabled={isUserForRead}
                        onChange={(date) => {
                          setFieldValue("dueDate", date);
                        }}
                        label={
                          <span>
                            Due Date
                            {defCode?.policy && values.ticketTypeId != 1 ? ( // Show * only when policy is true
                              <span style={{ color: "red" }}>*</span>
                            ) : (
                              ""
                            )}
                          </span>
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3">
                    <div>
                      <Field
                        label={
                          <span>
                            No.of Hours
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        name="noOfHours"
                        component={Input}
                        placeholder="Enter no of hours"
                        type="number"
                      />
                    </div>
                    <div>
                      <SearchSelect
                        name="priority"
                        label={
                          <span>
                            Priority <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          PriorityType?.find(
                            (el) => el?.value == values?.priority,
                          ) || null
                        }
                        options={PriorityType || []}
                        error={errors.priority}
                        touched={touched.priority}
                        onChange={(e) => {
                          setFieldValue("priority", e.value);
                        }}
                      />
                    </div>
                  </div>
                  {/* Ticket Status */}
                  <div>
                    <SearchSelect
                      name="ticketStatusId"
                      label={
                        <span>
                          Ticket Status<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        dashboard?.allTicketStatus?.find(
                          (el) => el?.value == values?.ticketStatusId,
                        ) || null
                      }
                      options={dashboard.allTicketStatus || []}
                      error={errors.ticketStatusId}
                      touched={touched.ticketStatusId}
                      onChange={(e) => {
                        setFieldValue("ticketStatusId", e.value);
                      }}
                    />
                  </div>
                  {/* Ticket Assign */}
                  <div>
                    <SearchSelect
                      name="assignToEmpId"
                      label={<span>Assign To</span>}
                      value={
                        [
                          { label: "Select", value: null },
                          ...dashboard?.allEmployees,
                        ]?.find((el) => el?.value === values?.assignToEmpId) ||
                        null
                      }
                      options={
                        [
                          { label: "Select", value: null },
                          ...dashboard?.allEmployees,
                        ] || []
                      }
                      error={errors.assignToEmpId}
                      touched={touched.assignToEmpId}
                      onChange={(e) => {
                        setFieldValue("assignToEmpId", e.value);
                      }}
                    />
                  </div>
                  {/* Ticket Owner */}
                  <div>
                    <SearchSelect
                      name="reportToEmpId"
                      label={
                        <span>
                          Report To <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        [, ...dashboard?.allEmployees]?.find(
                          (el) => el?.value === values?.reportToEmpId,
                        ) || null
                      }
                      options={[, ...dashboard?.allEmployees] || []}
                      error={errors.reportToEmpId}
                      touched={touched.reportToEmpId}
                      onChange={(e) => {
                        setFieldValue("reportToEmpId", e.value);
                      }}
                    />
                  </div>
                  {/* Parent Epic */}
                  {(values?.ticketTypeId == 2 ||
                    values?.ticketTypeId == 3 ||
                    values?.ticketTypeId == 4 ||
                    values?.ticketTypeId == 5) && (
                    <div>
                      <SearchSelect
                        name="parentEpicId"
                        label={
                          <span>
                            Parent EPIC <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        disabled={values?.ticketTypeId != 1}
                        value={
                          dashboard?.allTicket
                            ?.filter(
                              (el) =>
                                el?.ticketType == 1 &&
                                el?.projectId == values?.projectId,
                            )
                            ?.find((el) => el?.value == values?.parentEpicId) ||
                          null
                        }
                        options={
                          dashboard?.allTicket?.filter(
                            (el) =>
                              el?.ticketType == 1 &&
                              el?.projectId == values?.projectId,
                          ) || []
                        }
                        error={errors.parentEpicId}
                        touched={touched.parentEpicId}
                        onChange={(e) => {
                          setFieldValue("parentEpicId", e.value);
                        }}
                      />
                    </div>
                  )}
                  {/* Parent Task */}
                  {(values?.ticketTypeId == 4 || values?.ticketTypeId == 5) && (
                    <div>
                      <SearchSelect
                        name="parentTaskId"
                        label={
                          <span>
                            {values?.ticketTypeId == 4
                              ? "Linked Task"
                              : "Parent Task"}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        disabled={
                          values?.ticketTypeId != 4 || values?.ticketTypeId != 5
                        }
                        value={
                          dashboard?.allTicket
                            ?.filter(
                              (el) =>
                                el?.ticketType == 3 &&
                                el?.parentEpicId == values.parentEpicId,
                            )
                            ?.find((el) => el?.value == values?.parentTaskId) ||
                          null
                        }
                        options={
                          dashboard?.allTicket?.filter(
                            (el) =>
                              el?.ticketType == 3 &&
                              el?.parentEpicId == values.parentEpicId,
                          ) || []
                        }
                        error={errors.parentTaskId}
                        touched={touched.parentTaskId}
                        onChange={(e) => {
                          setFieldValue("parentTaskId", e.value);
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <FileUpload
                      label={<>Attachment</>}
                      id="file"
                      name="file"
                      type="file"
                      isEdit={isUserForRead}
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}
                    />

                    {(formData?.file || values?.file) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.file || formData?.file) === "string"
                              ? getUploadUrl(values?.file || formData?.file)
                              : URL.createObjectURL(
                                  values?.file || formData?.file,
                                )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.file || formData?.file) === "string"
                            ? getFileName(values?.file || formData?.file)
                            : values?.file?.name || formData?.file}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={onHide} className="btn btn-light">
              {isUserForRead ? "OK" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Save
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}
            {!isUserForRead && !id && (
              <button
                type="button"
                onClick={() => {
                  validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      enableLoading();
                      const payload = {
                        ...values,
                        startDate: values.startDate
                          ? formatDates(values.startDate, "dd-MMM-yyyy")
                          : null,
                        dueDate: values.dueDate
                          ? formatDates(values.dueDate, "dd-MMM-yyyy")
                          : null,
                      };
                      saveForm(payload, true, setValues);
                    } else {
                      setTouched(
                        Object.keys(errors).reduce(
                          (acc, key) => ({ ...acc, [key]: true }),
                          {},
                        ),
                      );
                    }
                  });
                }}
                className="btn btn-primary"
              >
                Save & Add More
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
