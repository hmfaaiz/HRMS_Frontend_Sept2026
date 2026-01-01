import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formActions";
import * as uiHelpers from "../FormUIHelpers";
import { useFromUIContext } from "../FormUIContext";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import {
  fetchAllDesignationByGradeId,
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Calendar1, LayoutList } from "lucide-react";
import {
  Checkbox,
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";
import { NumericFormat } from "react-number-format";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { toast } from "react-toastify";
import { amountFormat } from "../../../../../utils/common";

const FormValidation = Yup.object().shape({
  // entities is an array of rows
  entities: Yup.array().of(
    Yup.object().shape({
      isSelected: Yup.boolean(),
      finalIncrement: Yup.number()
        .nullable()
        .when("isSelected", {
          is: true,
          then: Yup.number()
            .required(VALIDATION_MESSAGES.required)
            .min(0, VALIDATION_MESSAGES.minZeroValue)
            .max(100, VALIDATION_MESSAGES.maxHundredValue),
          otherwise: Yup.number().notRequired(),
        }),
      finalRemarks: Yup.string().optional(),
      revisedSalary: Yup.number()
        .nullable()
        .when(["isSelected", "revisedBeforeSalary"], {
          is: (isSelected, revisedBeforeSalary) => isSelected === true,
          then: Yup.number()
            .required(VALIDATION_MESSAGES.required)
            .min(
              Yup.ref("revisedBeforeSalary"),
              "Cannot be less than current salary"
            )
            .max(9999999, "Max value is 9999999"),
          otherwise: Yup.number().notRequired(),
        }),
      revisedGradeId: Yup.string()
        .nullable()
        .when("isSelected", {
          is: true,
          then: Yup.string()
            .nullable()
            .required("Revised Grade is required"),
        }),
      revisedDesignationId: Yup.string()
        .nullable()
        .when("isSelected", {
          is: true,
          then: Yup.string()
            .nullable()
            .required("Revised Designation is required"),
        }),
      revisedEmployeeTypeId: Yup.string()
        .nullable()
        .when("isSelected", {
          is: true,
          then: Yup.string()
            .nullable()
            .required("Revised Employee Type is required"),
        }),
      revisedEmployeeStatusId: Yup.string()
        .nullable()
        .when("isSelected", {
          is: true,
          then: Yup.string()
            .nullable()
            .required("Revised Employee Status is required"),
        }),
      effectiveDate: Yup.date()
        .nullable()
        .when("isSelected", {
          is: true,
          then: Yup.date()
            .nullable()
            .required("Effective Date is required"),
          otherwise: Yup.date().nullable(),
        }),
    })
  ),
});

export function FormTable() {
  //Users UI Context
  const [designationsByGrade, setDesignationsByGrade] = useState({});
  const formUIContext = useFromUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openReadDialog: formUIContext.openReadDialog,
      openReadFiscalPeriodDialog: formUIContext.openReadFiscalPeriodDialog,
    };
  }, [formUIContext]);

  const {
    currentState,
    dashboard,
    listLoading,
    actionsLoading,
    userAccess,
  } = useSelector((state) => {
    return {
      currentState: state.appraisal_finalization,
      listLoading: state.appraisal_finalization?.listLoading,
      actionsLoading: state.appraisal_finalization?.actionsLoading,
      dashboard: state?.dashboard,
      userAccess: state?.auth?.userAccess["appraisal_finalization"],
    };
  }, shallowEqual);

  const isAccessForSave = userAccess?.find(
    (item) => item.componentName === "SaveAppraisalFinalization"
  );

  const isAccessForAppraisal = userAccess?.find(
    (item) => item.componentName === "FinalizedAppraisal"
  );

  const isAccessForEmail = userAccess?.find(
    (item) => item.componentName === "FinalizedAppraisalEmail"
  );

  const { totalCount, entities, salaryPolicy } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      formUIProps?.queryParams?.filter?.subsidiaryId &&
      formUIProps?.queryParams?.filter?.appraisalCategoryId
    ) {
      dispatch(actions.fetchAllAppraisalFinalization(formUIProps.queryParams));
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllFormsMenu(275, "allEmployeeStatus"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus2"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeDynamicChildMenus1")); // For EmployeeType
  }, [dispatch]);

  // Handle form submission for all buttons
  const handleSubmit = (values, { setSubmitting }, actionType) => {
    // First check if any rows are selected
    const selectedRows = values.filter((v) => v.isSelected);

    if (selectedRows.length === 0) {
      toast.error("Please select at least one employee.");
      setSubmitting(false);
      return;
    }

    // Call your API based on actionType
    switch (actionType) {
      case "save":
        // Filter only selected rows data
        const saveData = values
          .filter((v) => v.isSelected && !v?.isCompleted)
          .map((row) => ({
            ...row,
          }));
        // Call save API
        dispatch(actions.saveAppraisalFinalization(saveData)).then((el) => {
          dispatch(
            actions.fetchAllAppraisalFinalization(formUIProps.queryParams)
          );
        });
        break;
      case "appraisal":
        // Filter only selected rows data
        const appraisalData = values
          .filter((v) => v.isSelected && !v?.isCompleted)
          .map((row) => ({
            ...row,
          }));
        // Call finalize appraisal API
        dispatch(actions.finalizedAppraisal(appraisalData)).then(() => {
          dispatch(
            actions.fetchAllAppraisalFinalization(formUIProps.queryParams)
          );
        });
        break;
      case "email":
        const emailData = values
          .filter((v) => v.isSelected && v?.isCompleted)
          .map((row) => ({
            ...row,
          }));
        // Call generate email API
        dispatch(actions.generateAppraisalEmail(emailData)).then(() => {
          dispatch(
            actions.fetchAllAppraisalFinalization(formUIProps.queryParams)
          );
        });
        break;
      case "download":
        const downloadData = values
          .filter((v) => v.isSelected && v?.isCompleted)
          .map((row) => ({
            ...row,
          }));
        // Call download increment letter API
        dispatch(actions.downloadIncrementLetter(downloadData)).then(() => {
          dispatch(
            actions.fetchAllAppraisalFinalization(formUIProps.queryParams)
          );
        });
        break;
      default:
        break;
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (!entities?.length) return;
    const designationListthroughGrade = async () => {
      entities?.forEach(async (e, i) => {
        if (!designationsByGrade[e?.revisedGradeId]) {
          const designation = await dispatch(
            fetchAllDesignationByGradeId(e?.revisedGradeId)
          );
          setDesignationsByGrade({
            ...designationsByGrade,
            [e?.revisedGradeId]: designation,
          });
        }
      });
    };
    designationListthroughGrade();
  }, [entities]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ entities }}
      validationSchema={FormValidation}
    >
      {({ values, setFieldValue, isValid, errors, touched, isSubmitting }) => {
        // Check if any rows are con
        const hasSelectedRowsIsCompleted = values.entities?.some(
          (v) => v.isSelected && v?.isCompleted
        );
        const hasSelectedRowsIsNotCompleted = values.entities?.some(
          (v) => v.isSelected && !v?.isCompleted
        );

        return (
          <fieldset disabled={listLoading || actionsLoading}>
            <Form>
              <FieldArray name="entities">
                {() => {
                  return (
                    <div className="mt-4">
                      <div className="w-full overflow-x-auto">
                        <div className="react-bootstrap-table scrollbar-fancy">
                          <table
                            className="table table-head-custom table-vertical-center table-hover"
                            style={{ tableLayout: "fixed", minWidth: "1800px" }}
                          >
                            <thead>
                              <tr className="custom-table-header">
                                <th className="w-8">
                                  <Checkbox
                                    disabled={!values.entities?.length}
                                    checked={
                                      values.entities?.length > 0 &&
                                      values.entities?.length ===
                                        values.entities?.filter(
                                          (row) => row?.isSelected
                                        )?.length
                                    }
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      values.entities.forEach((_, index) => {
                                        setFieldValue(
                                          `entities.${index}.isSelected`,
                                          checked
                                        );
                                      });
                                    }}
                                  />
                                </th>
                                <th className="w-24">Code</th>
                                <th className="w-44">Name</th>
                                <th className="w-48">Designation</th>
                                <th className="w-28">Increment %</th>
                                <th className="w-28">Manager Rec.</th>
                                <th className="w-40">Final Increment %</th>
                                <th className="w-80">Final Remarks</th>
                                {/* <th className="w-44">
                                  Actucal{" "}
                                  {salaryPolicy == "Basic to Gross"
                                    ? "Basic"
                                    : "Gross"}{" "}
                                  Salary
                                </th> */}
                                <th className="w-52">
                                  {salaryPolicy == "Basic to Gross"
                                    ? "Basic"
                                    : "Gross"}{" "}
                                  Salary (Before)
                                </th>
                                <th className="w-44">
                                  {salaryPolicy == "Basic to Gross"
                                    ? "Basic"
                                    : "Gross"}{" "}
                                  Salary (after Revision)
                                </th>
                                <th className="w-52">Revised Grade</th>
                                <th className="w-60">Revised Designation</th>
                                <th className="w-64">Revised Employee Type</th>
                                <th className="w-64">
                                  Revised Employee Status
                                </th>
                                <th className="w-60">
                                  Appraisal Effective Date
                                </th>
                                <th className="w-20">Status</th>
                                <th className="w-28">Email Status</th>
                                <th className="text-right w-12">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.entities?.length > 0 &&
                                values.entities?.map((e, i) => {
                                  return (
                                    <tr key={i}>
                                      <td>
                                        <Checkbox
                                          onChange={(e) =>
                                            setFieldValue(
                                              `entities.${i}.isSelected`,
                                              e.target.checked
                                            )
                                          }
                                          isSelected={e?.isSelected}
                                        />
                                      </td>
                                      <td>{e?.Employee?.employeeCode || ""}</td>
                                      <td>
                                        {e?.Employee?.firstName || ""}{" "}
                                        {e?.Employee?.middleName || ""}{" "}
                                        {e?.Employee?.lastName || ""}
                                      </td>
                                      <td>
                                        {e?.Employee?.designation?.formName ||
                                          ""}
                                      </td>
                                      <td>
                                        {e?.AppraisalReview
                                          ?.recommendedIncrement || ""}
                                      </td>
                                      <td>
                                        {e?.AppraisalReview
                                          ?.incrementPercentageRecommendedByManager ||
                                          ""}
                                      </td>
                                      <td>
                                        <Field
                                          name={`entities.${i}.finalIncrement`}
                                        >
                                          {({ field, form }) => {
                                            const salary = Number(
                                              values.entities[i]?.salary || 0
                                            );
                                            return (
                                              <NumericFormat
                                                disabled={
                                                  !e?.isSelected ||
                                                  e?.isCompleted
                                                }
                                                value={field.value}
                                                className="form-control"
                                                thousandSeparator
                                                onValueChange={({ value }) => {
                                                  setFieldValue(
                                                    `entities.${i}.finalIncrement`,
                                                    value
                                                  );
                                                }}
                                                onBlur={() => {
                                                  const increment = Number(
                                                    values.entities[i]
                                                      .finalIncrement || 0
                                                  );
                                                  const newSalary = Number(
                                                    salary +
                                                      (salary * increment) / 100
                                                  ).toFixed(2);
                                                  setFieldValue(
                                                    `entities.${i}.revisedSalary`,
                                                    newSalary
                                                  );
                                                }}
                                              />
                                            );
                                          }}
                                        </Field>
                                        <ErrorMessage
                                          name={`entities.${i}.finalIncrement`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          name={`entities.${i}.finalRemarks`}
                                        >
                                          {({ field, form }) => (
                                            <input
                                              {...field}
                                              disabled={
                                                !e?.isSelected || e?.isCompleted
                                              }
                                              type="text"
                                              className={`form-control ${
                                                form.errors?.entities?.[i]
                                                  ?.finalRemarks &&
                                                form.touched?.entities?.[i]
                                                  ?.finalRemarks
                                                  ? "is-invalid"
                                                  : ""
                                              }`}
                                            />
                                          )}
                                        </Field>
                                        <ErrorMessage
                                          name={`entities.${i}.finalRemarks`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      {/* <td>{e?.salary || ""}</td> */}
                                      <td>
                                        {amountFormat(
                                          e?.revisedBeforeSalary,
                                          true
                                        ) || ""}
                                      </td>
                                      <td>
                                        <Field
                                          name={`entities.${i}.revisedSalary`}
                                        >
                                          {({ field, form }) => {
                                            const salary = Number(
                                              values.entities[i]?.salary || 0
                                            );
                                            return (
                                              <NumericFormat
                                                disabled={
                                                  !e?.isSelected ||
                                                  e?.isCompleted
                                                }
                                                value={field.value}
                                                className="form-control"
                                                thousandSeparator
                                                onValueChange={({ value }) => {
                                                  setFieldValue(
                                                    `entities.${i}.revisedSalary`,
                                                    value
                                                  );
                                                }}
                                                onBlur={() => {
                                                  const revisedSalary = Number(
                                                    values.entities[i]
                                                      .revisedSalary || 0
                                                  );
                                                  const increment = (
                                                    ((revisedSalary - salary) /
                                                      salary) *
                                                    100
                                                  ).toFixed(2);
                                                  setFieldValue(
                                                    `entities.${i}.finalIncrement`,
                                                    increment
                                                  );
                                                }}
                                              />
                                            );
                                          }}
                                        </Field>
                                        <ErrorMessage
                                          name={`entities.${i}.revisedSalary`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      <td>
                                        <SearchSelect
                                          name={`entities.${i}.revisedGradeId`}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `entities.${i}.revisedGradeId`,
                                              e?.value || null
                                            );
                                            if (
                                              !designationsByGrade[e?.value]
                                            ) {
                                              let designation = dispatch(
                                                fetchAllDesignationByGradeId(
                                                  e?.value
                                                )
                                              );
                                              setDesignationsByGrade({
                                                ...designationsByGrade,
                                                [e?.value]: designation,
                                              });
                                            }
                                            setFieldValue(
                                              `entities.${i}.revisedDesignationId`,
                                              null
                                            );
                                          }}
                                          value={
                                            dashboard?.allEmployeegradeList?.find(
                                              (el) =>
                                                el?.value === e?.revisedGradeId
                                            ) || null
                                          }
                                          options={
                                            dashboard?.allEmployeegradeList
                                          }
                                          isDisabled={
                                            !e?.isSelected || e?.isCompleted
                                          }
                                        />
                                        <ErrorMessage
                                          name={`entities.${i}.revisedGradeId`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      <td>
                                        <SearchSelect
                                          name={`entities.${i}.revisedDesignationId`}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `entities.${i}.revisedDesignationId`,
                                              e?.value || null
                                            );
                                          }}
                                          value={
                                            (designationsByGrade?.[
                                              e?.revisedGradeId
                                            ]?.length > 0 &&
                                              designationsByGrade?.[
                                                e?.revisedGradeId
                                              ]?.find(
                                                (el) =>
                                                  el?.value ===
                                                  e?.revisedDesignationId
                                              )) ||
                                            null
                                          }
                                          options={
                                            designationsByGrade?.[
                                              e?.revisedGradeId
                                            ] || []
                                          }
                                          isDisabled={
                                            !e?.isSelected || e?.isCompleted
                                          }
                                        />
                                        <ErrorMessage
                                          name={`entities.${i}.revisedDesignationId`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      <td>
                                        <SearchSelect
                                          name={`entities.${i}.revisedEmployeeTypeId`}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `entities.${i}.revisedEmployeeTypeId`,
                                              e?.value || null
                                            );
                                          }}
                                          value={
                                            [
                                              ...dashboard?.allEmpTypeDynamicChildMenus1,
                                              ...dashboard?.allEmpTypeDynamicChildMenus2,
                                            ]?.find(
                                              (el) =>
                                                el?.value ===
                                                e?.revisedEmployeeTypeId
                                            ) || null
                                          }
                                          options={[
                                            ...dashboard?.allEmpTypeDynamicChildMenus1,
                                            ...dashboard?.allEmpTypeDynamicChildMenus2,
                                          ]}
                                          isDisabled={
                                            !e?.isSelected || e?.isCompleted
                                          }
                                        />
                                        <ErrorMessage
                                          name={`entities.${i}.revisedEmployeeTypeId`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      <td>
                                        <SearchSelect
                                          name={`entities.${i}.revisedEmployeeStatusId`}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `entities.${i}.revisedEmployeeStatusId`,
                                              e?.value || null
                                            );
                                          }}
                                          value={
                                            dashboard?.allEmployeeStatus?.find(
                                              (el) =>
                                                el?.value ===
                                                e?.revisedEmployeeStatusId
                                            ) || null
                                          }
                                          options={dashboard?.allEmployeeStatus}
                                          isDisabled={
                                            !e?.isSelected || e?.isCompleted
                                          }
                                        />
                                        <ErrorMessage
                                          name={`entities.${i}.revisedEmployeeStatusId`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      <td>
                                        <Field
                                          name={`entities.${i}.effectiveDate`}
                                          component={DatePickerField}
                                          withPortal
                                          type="date"
                                          popperProps={{
                                            strategy: "fixed",
                                          }}
                                          dateFormat="dd-MMM-yyyy"
                                          className={`form-control z-10 ${
                                            errors?.entities?.[i]
                                              ?.effectiveDate &&
                                            touched?.entities?.[i]
                                              ?.effectiveDate
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          autoComplete="off"
                                          disabled={
                                            !e?.isSelected || e?.isCompleted
                                          }
                                          onChange={(e) => {
                                            setFieldValue(
                                              `entities.${i}.effectiveDate`,
                                              e
                                            );
                                          }}
                                        />
                                        <ErrorMessage
                                          name={`entities.${i}.effectiveDate`}
                                          component="div"
                                          className="invalid-feedback d-block"
                                        />
                                      </td>
                                      {/* <td>
                                        <Field
                                          name={`entities.${i}.effectiveDate`}
                                        >
                                          {({ field, form }) => (
                                            <DatePicker
                                              selected={
                                                field.value
                                                  ? new Date(field.value)
                                                  : null
                                              }
                                              onChange={(date) =>
                                                setFieldValue(field.name, date)
                                              }
                                              dateFormat="dd-MMM-yyyy"
                                              className="form-control"
                                              disabled={
                                                !e?.isSelected || e?.isCompleted
                                              }
                                              popperContainer={({ children }) =>
                                                document.getElementById(
                                                  "root-portal"
                                                ) || document.body
                                              }
                                              popperClassName="z-[9999]"
                                              popperPlacement="bottom-start"
                                              showPopperArrow={false}
                                            />
                                          )}
                                        </Field>
                                      </td> */}
                                      <td>
                                        <span
                                          className={
                                            e?.isCompleted
                                              ? "text-approved font-bold"
                                              : "text-pending font-bold"
                                          }
                                        >
                                          {e?.isCompleted
                                            ? "Finalized"
                                            : "Pending"}
                                        </span>
                                      </td>
                                      <td>
                                        <span
                                          className={
                                            e?.isEmailSend
                                              ? "text-approved font-bold"
                                              : "text-pending font-bold"
                                          }
                                        >
                                          {e?.isEmailSend ? "Send" : "Not Send"}
                                        </span>
                                      </td>
                                      <td className="text-right gap-2">
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="products-edit-tooltip">
                                              View Ratings (Appraisal Period)
                                            </Tooltip>
                                          }
                                        >
                                          <a
                                            className="mx-1"
                                            onClick={() =>
                                              formUIProps.openReadDialog(
                                                e?.AppraisalReview?.Id
                                              )
                                            }
                                          >
                                            <LayoutList className="w-4 h-4 text-black cursor-pointer" />
                                          </a>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="products-edit-tooltip">
                                              View Ratings (Fiscal Period)
                                            </Tooltip>
                                          }
                                        >
                                          <a
                                            onClick={() =>
                                              formUIProps.openReadFiscalPeriodDialog(
                                                e?.AppraisalReview?.Id
                                              )
                                            }
                                          >
                                            <Calendar1 className="w-4 h-4 text-black cursor-pointer" />
                                          </a>
                                        </OverlayTrigger>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </FieldArray>
              <div className="flex gap-2 justify-end mt-2">
                {isAccessForSave && (
                  <button
                    type="button"
                    disabled={
                      listLoading ||
                      actionsLoading ||
                      !isValid ||
                      !hasSelectedRowsIsNotCompleted ||
                      isSubmitting
                    }
                    className="btn btn-primary"
                    onClick={() =>
                      handleSubmit(
                        values.entities,
                        {
                          setSubmitting: (val) => {
                            /* handle */
                          },
                        },
                        "save"
                      )
                    }
                  >
                    Save Selected Appraisal
                    {(listLoading || actionsLoading || isSubmitting) && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}
                {isAccessForAppraisal && (
                  <button
                    type="button"
                    disabled={
                      listLoading ||
                      actionsLoading ||
                      !isValid ||
                      !hasSelectedRowsIsNotCompleted ||
                      isSubmitting
                    }
                    className="btn btn-primary"
                    onClick={() =>
                      handleSubmit(
                        values.entities,
                        {
                          setSubmitting: (val) => {
                            /* handle */
                          },
                        },
                        "appraisal"
                      )
                    }
                  >
                    Finalized Selected Appraisal
                    {(listLoading || actionsLoading || isSubmitting) && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}
                {isAccessForEmail && (
                  <button
                    type="button"
                    disabled={
                      listLoading ||
                      actionsLoading ||
                      !isValid ||
                      !hasSelectedRowsIsCompleted ||
                      isSubmitting
                    }
                    className="btn btn-primary"
                    onClick={() =>
                      handleSubmit(
                        values.entities,
                        {
                          setSubmitting: (val) => {
                            /* handle */
                          },
                        },
                        "email"
                      )
                    }
                  >
                    Generate Email for Selected Employees
                    {(listLoading || actionsLoading || isSubmitting) && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  disabled={
                    listLoading ||
                    actionsLoading ||
                    !isValid ||
                    !hasSelectedRowsIsCompleted ||
                    isSubmitting
                  }
                  className="btn btn-primary"
                  onClick={() =>
                    handleSubmit(
                      values.entities,
                      {
                        setSubmitting: (val) => {
                          /* handle */
                        },
                      },
                      "download"
                    )
                  }
                >
                  Download Increment Letter
                  {(listLoading || actionsLoading || isSubmitting) && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              </div>
            </Form>
          </fieldset>
        );
      }}
    </Formik>
  );
}
