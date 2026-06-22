import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { CirclePlus, Trash2 } from "lucide-react";
import { formatDates } from "../../../../../utils/common";
import * as actions from "../../../_redux/redux-Actions";
import { fetchAllTicketStatus } from "../../../../Dashboard/_redux/dashboardActions";
/* ---------------- VALIDATION ---------------- */

const formSchema = Yup.object().shape({
  sprintOwnerEmpId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  sprintDescription: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  from: Yup.date().required(VALIDATION_MESSAGES.required),
  to: Yup.date()
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from"), "To date cannot be before From date"),
  SprintDetail: Yup.array()
    .of(
      Yup.object().shape({
        ticketId: Yup.number()
          .nullable()
          .typeError(VALIDATION_MESSAGES.required)
          .required(VALIDATION_MESSAGES.required),
      }),
    )
    .min(1, "Add at least one"),
});

/* ---------------- COMPONENT ---------------- */

export function FormEditForm({
  saveForm,
  dataForEdit,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  projectId,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  const [viewBacklogTickets, setViewBackLogTickets] = useState(false);
  const { dashboard, project_sprint } = useSelector((state) => state);

  /* -------- FETCH MASTER DATA -------- */

  useEffect(() => {
    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllTicketStatus());
  }, [dispatch]);

  useEffect(() => {
    if (dataForEdit?.Id) {
      dispatch(actions.fetchLinkedTickets(dataForEdit?.projectId));
    }
    if (projectId) {
      dispatch(actions.fetchLinkedTickets(projectId));
    }

    if (!projectId && !dataForEdit?.Id) {
      onHide();
    }
  }, [dataForEdit, projectId]);

  /* ---------------- FORM ---------------- */

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...dataForEdit,
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        const payload = {
          ...values,
          from: values?.from ? formatDates(values?.from, "dd-MMM-yyyy") : null,
          to: values?.to ? formatDates(values?.to, "dd-MMM-yyyy") : null,
        };
        enableLoading();
        saveForm(payload);
      }}
    >
      {({ handleSubmit, setFieldValue, values, errors, touched, isValid }) => (
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
                  {/* Project CODE */}
                  {id && (
                    <div>
                      <Field
                        name="sprintCode"
                        component={Input}
                        disabled
                        label={
                          <span>
                            Sprint Code <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                    </div>
                  )}

                  {/* Sprint Owner */}
                  <div>
                    <SearchSelect
                      name="sprintOwnerEmpId"
                      label={
                        <span>
                          Sprint Owner <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={dashboard?.allEmployees?.find(
                        (el) => el?.value === values?.sprintOwnerEmpId,
                      )}
                      options={dashboard.allEmployees || []}
                      error={errors.sprintOwnerEmpId}
                      touched={touched.sprintOwnerEmpId}
                      onChange={(e) => {
                        setFieldValue("sprintOwnerEmpId", e.value);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <div>
                      <Field
                        name="from"
                        component={DatePickerField}
                        disabled={isUserForRead || actionsLoading}
                        dateFormat="dd-MMM-yyyy"
                        label={
                          <span>
                            {" "}
                            Date From<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={async (date) => {
                          setFieldValue("from", date);
                        }}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <Field
                        name="to"
                        component={DatePickerField}
                        disabled={isUserForRead || actionsLoading}
                        dateFormat="dd-MMM-yyyy"
                        label={
                          <span>
                            {" "}
                            Date To<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={async (date) => {
                          setFieldValue("to", date);
                        }}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Field
                    name="sprintDescription"
                    component={TextArea}
                    label={
                      <span>
                        Sprint Description{" "}
                        <span style={{ color: "red" }}>*</span>{" "}
                      </span>
                    }
                  />
                </div>
                <LinkedTicketTable
                  isEdit={isUserForRead}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  values={values}
                  ticketList={project_sprint?.allTicket || []}
                  ticketStatus={dashboard?.allTicketStatus || []}
                  Id={id}
                />
                <hr />
                {!id && project_sprint?.previousTicket?.length ? (
                  <div className="flex justify-end items-end">
                    <button
                      type="button"
                      onClick={() => setViewBackLogTickets(!viewBacklogTickets)}
                      className="btn btn-primary"
                    >
                      View BackLog Tickets
                    </button>
                  </div>
                ) : null}
                {viewBacklogTickets ? (
                  <BackLogsTicketTable
                    ticketList={project_sprint?.previousTicket}
                  />
                ) : null}
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
                disabled={!isValid}
              >
                Save
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

const LinkedTicketTable = ({
  isEdit,
  values,
  errors,
  touched,
  setFieldValue,
  ticketList,
  ticketStatus,
  Id,
}) => {
  return (
    <FieldArray name="SprintDetail">
      {({ remove, push }) => (
        <>
          <div className="flex justify-between items-center mt-1 max-h-44 overflow-y-auto scrollbar-fancy">
            <h6 className="font-bold mb-0 text-primary">Linked Ticket</h6>
            {!isEdit && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  push({
                    Id: null,
                    ticketId: null,
                  })
                }
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            )}
          </div>

          <div className="w-full max-h-64 overflow-auto scrollbar-fancy">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <td className="min-w-52">Ticket</td>
                    <td>Ticket Description</td>
                    <td className="min-w-36">Ticket Status</td>
                    <td>Assign To</td>
                    <td className="text-right">Action</td>
                  </tr>
                </thead>
                <tbody>
                  {values?.SprintDetail?.length > 0 &&
                    values.SprintDetail.map((row, index) => {
                      const selectedTicket = ticketList?.find(
                        (e) => Number(e?.Id) === Number(row?.ticketId),
                      );

                      const options =
                        ticketList
                          ?.filter((v) =>
                            !values?.Id
                              ? !v?.isDisabled
                              : values?.SprintDetail?.find(
                                  (m) => m?.ticketId == v?.Id,
                                ) || !v?.isDisabled,
                          )
                          ?.map((e) => {
                            const selectedInAnotherRow = values?.SprintDetail?.some(
                              (el, elIndex) =>
                                elIndex !== index &&
                                Number(el?.ticketId) === Number(e.Id),
                            );

                            return {
                              ...e,
                              value: e?.Id,
                              label: `${e?.ticketCode}-${
                                e?.ticketDescription?.length > 25
                                  ? `${e.ticketDescription.slice(0, 25)}...`
                                  : e.ticketDescription || ""
                              }`,
                              isDisabled: selectedInAnotherRow,
                            };
                          }) || [];

                      const selectedOption =
                        options.find(
                          (opt) => Number(opt.value) === Number(row?.ticketId),
                        ) || null;

                      return (
                        <tr key={row.rowId || row.Id || index}>
                          <td>
                            <Field
                              name={`SprintDetail[${index}].ticketId`}
                              component={SearchSelect}
                              className={
                                errors.SprintDetail?.[index]?.ticketId &&
                                touched.SprintDetail?.[index]?.ticketId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `SprintDetail[${index}].ticketId`,
                                  e?.value ? Number(e.value) : "",
                                );
                              }}
                              error={errors.SprintDetail?.[index]?.ticketId}
                              touched={touched.SprintDetail?.[index]?.ticketId}
                              isDisabled={isEdit}
                              value={selectedOption}
                              options={options}
                            />

                            {errors.SprintDetail?.[index]?.ticketId &&
                              touched.SprintDetail?.[index]?.ticketId && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={errors.SprintDetail?.[index]?.ticketId}
                                />
                              )}
                          </td>

                          <td>{selectedTicket?.ticketDescription || ""}</td>
                          <td>
                            {Id && !isEdit ? (
                              <>
                                {" "}
                                <Field
                                  name={`SprintDetail[${index}].Ticket.ticketStatusId`}
                                  component={SearchSelect}
                                  className={
                                    errors.SprintDetail?.[index]?.Ticket
                                      .ticketStatusId &&
                                    touched.SprintDetail?.[index]?.Ticket
                                      .ticketStatusId
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  onChange={(e) => {
                                    setFieldValue(
                                      `SprintDetail[${index}].Ticket.ticketStatusId`,
                                      e?.value ? Number(e.value) : "",
                                    );
                                  }}
                                  error={
                                    errors.SprintDetail?.[index]?.Ticket
                                      .ticketStatusId
                                  }
                                  touched={
                                    touched.SprintDetail?.[index]?.Ticket
                                      .ticketStatusId
                                  }
                                  isDisabled={isEdit}
                                  value={ticketStatus?.find(
                                    (el) =>
                                      el.value == row?.Ticket.ticketStatusId,
                                  )}
                                  options={ticketStatus}
                                />
                                {errors.SprintDetail?.[index]?.Ticket
                                  .ticketStatusId &&
                                  touched.SprintDetail?.[index]?.Ticket
                                    .ticketStatusId && (
                                    <CustomErrorLabel
                                      touched={true}
                                      error={
                                        errors.SprintDetail?.[index]?.Ticket
                                          .ticketStatusId
                                      }
                                    />
                                  )}{" "}
                              </>
                            ) : (
                              selectedTicket?.TicketStatus?.statusName || ""
                            )}
                          </td>
                          <td>{selectedTicket?.AssignToEmp?.name || ""}</td>

                          <td className="text-right">
                            {!isEdit && (
                              <button
                                disabled={isEdit}
                                className="border-none bg-transparent"
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {errors?.SprintDetail &&
                typeof errors?.SprintDetail == "string" && (
                  <span className="invalid-feedback">
                    {errors?.SprintDetail}
                  </span>
                )}
            </div>
          </div>
        </>
      )}
    </FieldArray>
  );
};

const BackLogsTicketTable = ({ ticketList }) => {
  return (
    <>
      <div className="flex justify-between items-center mt-1 max-h-44 overflow-y-auto scrollbar-fancy">
        <h6 className="font-bold mb-0 text-primary">BackLog Ticket</h6>
      </div>

      <div className="w-full max-h-64 overflow-auto scrollbar-fancy">
        <div className="react-bootstrap-table table-responsive">
          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
            <thead>
              <tr className="custom-table-header">
                <td className="min-w-44">Ticket</td>
                <td>Ticket Description</td>
                <td>Ticket Status</td>
                <td>Assign To</td>
              </tr>
            </thead>
            <tbody>
              {ticketList?.length > 0 &&
                ticketList.map((row, index) => {
                  return (
                    <tr key={row?.Id || index}>
                      <td>
                        {row?.ticketCode}-{row?.ticketDescription}
                      </td>
                      <td>{row?.ticketDescription || ""}</td>
                      <td>{row?.TicketStatus?.statusName || ""}</td>
                      <td>{row?.AssignToEmp?.name || ""}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
