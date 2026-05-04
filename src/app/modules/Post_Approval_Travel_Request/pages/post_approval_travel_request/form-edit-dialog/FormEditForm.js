import React, { useMemo, useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  fetchAllFormsMenu,
  getActiveFiscalYear,
  fetchAllPayrollMonthYearList,
} from "../../../../../../_metronic/redux/dashboardActions";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";
import DatePicker from "react-datepicker";
import { Trash2, CirclePlus, X } from "lucide-react";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { NumericFormat } from "react-number-format";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import {
  uploadImage,
  getAllReimbursementConfigPolicy,
} from "../../../_redux/redux-Crud";
import {
  getUploadUrl,
  getFileName,
  formatDates,
} from "../../../../../utils/common";
import { checkCanApproveRequest } from "../../../_redux/redux-Actions";
import { postApprovalTravelRequestSlice } from "../../../_redux/redux-Slice";
const { actions } = postApprovalTravelRequestSlice;

export function FormEditForm({
  employeeId,
  travelRequestId,
  employeeDetails,
  onCancel,
  saveForm,
  user,
  isReadOnly,
  formUIProps,
}) {
  const dispatch = useDispatch();
  const isApprovingRef = React.useRef(false);
  const [employeeData, setEmployeeData] = useState({});
  const [policies, setPolicies] = useState([]);

  const {
    dashboard,
    auth,
    approvedEmployeeList,
    activeFiscalYear,
    canApprove,
  } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      auth: state.auth,
      approvedEmployeeList:
        state.post_approval_travel_request.approvedEmployeeList,
      activeFiscalYear: state.dashboard.activeFiscalYear,
      canApprove: state.post_approval_travel_request.canApprove,
    }),
    shallowEqual,
  );

  // ── Fetch employee profile for joining date ──
  useEffect(() => {
    if (employeeId) {
      getEmployeeProfileById(employeeId)
        .then((res) => {
          if (res?.data?.data) setEmployeeData(res.data.data);
        })
        .catch(() => setEmployeeData({}));
    } else {
      setEmployeeData({});
    }
  }, [employeeId]);

  // ── Fetch active fiscal year ──
  useEffect(() => {
    const subsidiaryId =
      employeeDetails?.subsidiaryId || employeeData?.subsidiaryId;
    if (subsidiaryId) {
      dispatch(getActiveFiscalYear("activeFiscalYear", subsidiaryId));
    }
  }, [employeeDetails?.subsidiaryId, employeeData?.subsidiaryId, dispatch]);

  // ── Fetch payroll month list ──
  useEffect(() => {
    if (employeeData?.subsidiaryId) {
      dispatch(
        fetchAllPayrollMonthYearList(
          { subsidiaryId: employeeData.subsidiaryId, employeeId },
          "allPayrollMonthYearList",
        ),
      );
    }
  }, [employeeData?.subsidiaryId, employeeId, dispatch]);

  // ── Fetch reimbursement config policies ──
  useEffect(() => {
    const empId = employeeId || formUIProps?.employeeId?.value;
    if (!empId) return;
    getAllReimbursementConfigPolicy({ Id: empId })
      .then((res) => {
        setPolicies(res?.data?.data?.policies || []);
      })
      .catch(() => setPolicies([]));
  }, [employeeId, formUIProps?.employeeId?.value]);

  // ── Fetch expense type list ──
  useEffect(() => {
    dispatch(fetchAllFormsMenu(202, "allReimbursementTypeList"));
  }, [dispatch]);

  useEffect(() => {
    if (user?.Id || user?.id) {
      const recordId = user.Id || user.id;
      dispatch(checkCanApproveRequest(recordId));
    } else {
      dispatch(actions.canApproveSet({ canApprove: false }));
    }
  }, [user?.Id, user?.id, dispatch]);

  // ── Min date: later of payroll start or joining date ──
  const getMinDate = () => {
    const payrollStart = activeFiscalYear?.payrollMonth?.startDate
      ? new Date(activeFiscalYear.payrollMonth.startDate)
      : null;
    const joiningDate = employeeData?.dateOfJoining
      ? new Date(employeeData.dateOfJoining)
      : null;
    if (payrollStart && joiningDate) {
      return payrollStart > joiningDate ? payrollStart : joiningDate;
    }
    return payrollStart || joiningDate || null;
  };

  // ── Max date: today ──
  const getMaxDate = () => new Date();

  // ── Expense type options filtered by policy ──
  const expenseTypeOptions = useMemo(() => {
    const list = dashboard?.allReimbursementTypeList || [];
    if (!policies.length) return list;
    return list.filter((option) =>
      policies.some(
        (item) => Number(item.reimbursement_typeId) === Number(option.value),
      ),
    );
  }, [dashboard?.allReimbursementTypeList, policies]);

  const preApprovalRecord = useMemo(() => {
    if (!employeeId || !travelRequestId || !approvedEmployeeList) return null;
    const emp = approvedEmployeeList.find((e) => e.Id === employeeId);
    return (
      emp?.list?.find((t) => t.Id === travelRequestId)?._fullRecord || null
    );
  }, [employeeId, travelRequestId, approvedEmployeeList]);

  const isRoleApprover = useMemo(() => {
    return auth?.user?.roleId !== undefined;
  }, [auth]);

  const formValidation = Yup.object().shape({
    expenseDetails: Yup.array()
      .of(
        Yup.object().shape({
          expenseDate: Yup.date()
            .typeError(VALIDATION_MESSAGES.required)
            .required(VALIDATION_MESSAGES.required),
          expenseTypeId: Yup.string().required(VALIDATION_MESSAGES.required),
          amount: Yup.number()
            .required(VALIDATION_MESSAGES.required)
            .min(0, VALIDATION_MESSAGES.minOneValue),
          description: Yup.string().nullable(),
        }),
      )
      .min(1, "At least one expense row is required"),
    perDayRate: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(0, VALIDATION_MESSAGES.minOneValue),
    eligibleDays: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(0, VALIDATION_MESSAGES.minOneValue),
    advanceReceived: Yup.number().nullable(),
    remarks: Yup.string().nullable(),
  });

  const defaultTravelDays = useMemo(() => {
    if (!preApprovalRecord?.Master?.length) return 0;
    const first = preApprovalRecord.Master[0];
    const last = preApprovalRecord.Master[preApprovalRecord.Master.length - 1];
    if (!first?.fromDate || !last?.toDate) return 0;
    const start = new Date(first.fromDate);
    const end = new Date(last.toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }, [preApprovalRecord]);

  const initialValues = useMemo(() => {
    if (user && (user.Id || user.id)) {
      return {
        ...user,
        pay_in_payroll_forId: user.pay_in_payroll_forId || null,
        fullySettled: user.fullySettled || false,
        expenseDetails:
          user.ExpDetail?.map((e) => ({
            id: e.Id,
            expenseDate: e.expenseDate ? new Date(e.expenseDate) : null,
            expenseTypeId: String(e.expenseTypeId || ""),
            description: e.description || "",
            amount: e.amount || 0,
            attachment: e.attachment || "",
          })) || [],
        perDayRate: user.perDayRate || 0,
        eligibleDays: user.eligibleDays || 0,
        totalDaAmount: user.totalDaAmount || 0,
        advanceReceived: user.advanceReceived || 0,
        totalClaimAmount: user.totalClaimAmount || 0,
        netPayableRecoverable: user.netPayableRecoverable || 0,
        remarks: user.remarks || "",
      };
    }

    const defaultRate = preApprovalRecord?.dailyAllowanceRate || 0;
    const defaultDays = defaultTravelDays;
    const defaultDaAmount = defaultRate * defaultDays;
    const defaultAdvance = preApprovalRecord?.advanceRequired
      ? preApprovalRecord.advanceAmount || 0
      : 0;

    return {
      employeeId: employeeId || "",
      preApprovalTravelRequestId: travelRequestId || "",
      pay_in_payroll_forId: null,
      fullySettled: false,
      expenseDetails: [
        {
          expenseDate: null,
          expenseTypeId: "",
          description: "",
          amount: "",
          attachment: "",
        },
      ],
      perDayRate: "",
      eligibleDays: defaultDays,
      totalDaAmount: "",
      advanceReceived: defaultAdvance,
      totalClaimAmount: "",
      netPayableRecoverable: defaultDaAmount - defaultAdvance,
      remarks: "",
    };
  }, [user, employeeId, travelRequestId, preApprovalRecord, defaultTravelDays]);

  const emptyExpenseRow = {
    expenseDate: null,
    expenseTypeId: "",
    description: "",
    amount: 0,
    attachment: "",
  };

  return (
    <div className="mt-4">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={formValidation}
        onSubmit={async (values) => {
          const expenseDetailsWithPaths = await Promise.all(
            (values.expenseDetails || []).map(async (exp) => {
              let attachmentPath =
                typeof exp.attachment === "string" && exp.attachment
                  ? exp.attachment
                  : null;

              if (exp.attachment instanceof File) {
                try {
                  const formData = new FormData();
                  formData.append("file", exp.attachment);
                  const res = await uploadImage(formData);
                  attachmentPath = res?.data?.filename || null;
                } catch (err) {
                  console.error("File upload failed:", err);
                }
              }

              // ── Safe date formatting ──
              let formattedDate = null;
              if (exp.expenseDate) {
                const dt = new Date(exp.expenseDate);
                if (!isNaN(dt.getTime())) {
                  formattedDate = `${dt.getFullYear()}-${String(
                    dt.getMonth() + 1,
                  ).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
                }
              }

              return {
                ...(exp.id ? { id: exp.id } : {}),
                expenseDate: formattedDate,
                expenseTypeId: exp.expenseTypeId,
                description: exp.description,
                amount: parseFloat(exp.amount) || 0,
                attachment: attachmentPath,
              };
            }),
          );

          const payload = {
            id: user?.Id || user?.id,
            companyId: employeeDetails?.companyId || user?.companyId,
            subsidiaryId: employeeDetails?.subsidiaryId || user?.subsidiaryId,
            employeeId: employeeId || user?.employeeId,
            preApprovalTravelRequestId:
              travelRequestId || user?.preApprovalTravelRequestId,
            fullySettled: values.fullySettled || false,

            pay_in_payroll_forId: values.pay_in_payroll_forId || null,
            perDayRate: values.perDayRate,
            eligibleDays: values.eligibleDays,
            totalDaAmount: values.totalDaAmount,
            advanceReceived: values.advanceReceived,
            totalClaimAmount: values.totalClaimAmount,
            netPayableRecoverable: values.netPayableRecoverable,
            remarks: values.remarks,
            ...(isApprovingRef.current ? { approved_status: 1 } : {}),
            ExpDetail: expenseDetailsWithPaths,
          };

          isApprovingRef.current = false;
          if (saveForm) saveForm(payload);
        }}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          submitForm,
          isSubmitting,
        }) => (
          <FormInner
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            submitForm={submitForm}
            isSubmitting={isSubmitting}
            isReadOnly={isReadOnly}
            isRoleApprover={isRoleApprover}
            user={user}
            onCancel={onCancel}
            isApprovingRef={isApprovingRef}
            emptyExpenseRow={emptyExpenseRow}
            expenseTypeOptions={expenseTypeOptions}
            dashboard={dashboard}
            getMinDate={getMinDate}
            getMaxDate={getMaxDate}
            canApprove={canApprove}
          />
        )}
      </Formik>
    </div>
  );
}

function FormInner({
  values,
  setFieldValue,
  errors,
  touched,
  submitForm,
  isSubmitting,
  isReadOnly,
  isRoleApprover,
  user,
  onCancel,
  isApprovingRef,
  emptyExpenseRow,
  expenseTypeOptions,
  dashboard,
  getMinDate,
  getMaxDate,
  canApprove,
}) {
  // ── DA total calculation ──
  useEffect(() => {
    const da =
      (parseFloat(values.perDayRate) || 0) *
      (parseFloat(values.eligibleDays) || 0);
    setFieldValue("totalDaAmount", da);
  }, [values.perDayRate, values.eligibleDays, setFieldValue]);

  // ── Expense row total ──
  const expenseTotal = useMemo(() => {
    return (values.expenseDetails || []).reduce(
      (sum, e) => sum + (parseFloat(e.amount) || 0),
      0,
    );
  }, [values.expenseDetails]);

  // ── Final calculation ──
  useEffect(() => {
    const total = (parseFloat(values.totalDaAmount) || 0) + expenseTotal;
    const net = total - (parseFloat(values.advanceReceived) || 0);
    setFieldValue("totalClaimAmount", total);
    setFieldValue("netPayableRecoverable", net);
  }, [
    values.totalDaAmount,
    values.advanceReceived,
    expenseTotal,
    setFieldValue,
  ]);

  return (
    <Form className="form form-label-right">
      {/* EXPENSE DETAILS */}
      <div className="mb-6">
        <h6 className="text-primary font-bold mb-3">Expense Details</h6>

        <FieldArray name="expenseDetails">
          {(arrayHelpers) => (
            <>
              {!isReadOnly && (
                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => arrayHelpers.push({ ...emptyExpenseRow })}
                  >
                    <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                    Add
                  </button>
                </div>
              )}

              <div
                className="react-bootstrap-table table-responsive"
                style={{ overflowX: "auto" }}
              >
                <table className="table table-head-custom table-vertical-center table-hover">
                  <thead className="custom-table-header">
                    <tr>
                      <td style={{ width: "120px" }}>
                        Date <span className="text-danger">*</span>
                      </td>
                      <td style={{ minWidth: "130px" }}>
                        Expense Type <span className="text-danger">*</span>
                      </td>
                      <td style={{ minWidth: "450px" }}>Description</td>
                      <td style={{ width: "120px" }}>
                        Amount <span className="text-danger">*</span>
                      </td>
                      <td style={{ minWidth: "100px" }}>Attachment</td>
                      {!isReadOnly && <td style={{ minWidth: "50px" }}></td>}
                    </tr>
                  </thead>
                  <tbody>
                    {values.expenseDetails.map((exp, index) => (
                      <tr key={index}>
                        {/* Date */}
                        <td>
                          <DatePicker
                            className="form-control"
                            disabled={isReadOnly}
                            selected={
                              exp.expenseDate ? new Date(exp.expenseDate) : null
                            }
                            onChange={(val) =>
                              setFieldValue(
                                `expenseDetails.${index}.expenseDate`,
                                val,
                              )
                            }
                            dateFormat="dd-MMM-yyyy"
                            autoComplete="off"
                            placeholderText="Select Date"
                            minDate={getMinDate()}
                            maxDate={getMaxDate()}
                            popperClassName="z-[9999]"
                            popperPlacement="bottom"
                          />
                          {errors.expenseDetails?.[index]?.expenseDate &&
                            touched.expenseDetails?.[index]?.expenseDate && (
                              <div className="form-feedBack text-xs mt-1">
                                {errors.expenseDetails[index].expenseDate}
                              </div>
                            )}
                        </td>

                        {/* Expense Type */}
                        <td>
                          <Field
                            as="select"
                            name={`expenseDetails.${index}.expenseTypeId`}
                            className="form-control"
                            disabled={isReadOnly}
                          >
                            <option value="">Select</option>
                            {expenseTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Field>
                          {errors.expenseDetails?.[index]?.expenseTypeId &&
                            touched.expenseDetails?.[index]?.expenseTypeId && (
                              <div className="form-feedBack text-xs mt-1">
                                {errors.expenseDetails[index].expenseTypeId}
                              </div>
                            )}
                        </td>

                        {/* Description */}
                        <td>
                          <Field
                            name={`expenseDetails.${index}.description`}
                            className="form-control"
                            placeholder="Description"
                            disabled={isReadOnly}
                          />
                        </td>

                        {/* Amount */}
                        <td>
                          <NumericFormat
                            name={`expenseDetails.${index}.amount`}
                            className="form-control"
                            placeholder="0"
                            thousandSeparator
                            allowNegative={false}
                            isAllowed={({ value }) => value.length <= 10}
                            disabled={isReadOnly}
                            value={exp.amount}
                            onValueChange={(valuesObj) =>
                              setFieldValue(
                                `expenseDetails.${index}.amount`,
                                valuesObj.value,
                              )
                            }
                          />
                          {errors.expenseDetails?.[index]?.amount &&
                            touched.expenseDetails?.[index]?.amount && (
                              <div className="form-feedBack text-xs mt-1">
                                {errors.expenseDetails[index].amount}
                              </div>
                            )}
                        </td>

                        {/* Attachment */}
                        <td>
                          {isReadOnly ? (
                            exp.attachment ? (
                              <a
                                href={getUploadUrl(exp.attachment)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary text-xs"
                              >
                                {getFileName(exp.attachment)}
                              </a>
                            ) : (
                              "—"
                            )
                          ) : (
                            <div className="no-file-label">
                              {!exp.attachment && (
                                <FileUpload
                                  id={`expenseDetails.${index}.attachment`}
                                  name={`expenseDetails.${index}.attachment`}
                                  label=""
                                  type="file"
                                  accept=".jpeg,.jpg,.png,.pdf"
                                  isEdit={false}
                                  fileName=""
                                  onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    setFieldValue(
                                      `expenseDetails.${index}.attachment`,
                                      file || null,
                                    );
                                  }}
                                />
                              )}

                              {exp.attachment && (
                                <div className="flex items-center gap-1">
                                  <a
                                    href={
                                      exp.attachment instanceof File
                                        ? URL.createObjectURL(exp.attachment)
                                        : getUploadUrl(exp.attachment)
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-xs truncate"
                                    style={{ maxWidth: "110px" }}
                                  >
                                    {exp.attachment instanceof File
                                      ? exp.attachment.name
                                      : getFileName(exp.attachment)}
                                  </a>
                                  <button
                                    type="button"
                                    className="bg-transparent border-0 p-0 flex-shrink-0"
                                    title="Remove attachment"
                                    onClick={() => {
                                      setFieldValue(
                                        `expenseDetails.${index}.attachment`,
                                        null,
                                      );
                                      const fileInput = document.getElementById(
                                        `expenseDetails.${index}.attachment`,
                                      );
                                      if (fileInput) fileInput.value = "";
                                    }}
                                  >
                                    <X className="w-3 h-3 text-danger cursor-pointer" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Delete row */}
                        {!isReadOnly && (
                          <td className="text-center align-middle">
                            {values.expenseDetails.length > 1 && (
                              <button
                                type="button"
                                className="bg-transparent border-0 p-0"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}

                    {/* Total Amount row */}
                    <tr>
                      <td
                        colSpan={3}
                        className="text-right font-bold py-2 pr-3"
                      >
                        Total Amount
                      </td>
                      <td className="font-bold">
                        <NumericFormat
                          className="form-control bg-light font-bold"
                          value={expenseTotal}
                          thousandSeparator
                          displayType="input"
                          disabled
                        />
                      </td>
                      <td colSpan={isReadOnly ? 1 : 2} />
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </FieldArray>
      </div>

      {/* DA CALCULATION */}
      <div className="border-t pt-4 mb-6">
        <h6 className="text-primary font-bold mb-3">DA Calculation</h6>
        <div className="grid grid-cols-12 gap-x-3 gap-y-3 items-end">
          {/* Payroll Month */}
          <div className="col-span-6 md:col-span-1">
            <label className="block mb-1 text-sm">Payroll Month</label>
            {isReadOnly ? (
              <input
                className="form-control bg-light"
                value={
                  dashboard?.allPayrollMonthYearList?.find(
                    (o) => o.value === values.pay_in_payroll_forId,
                  )?.label ||
                  user?.PayrollMonth?.name ||
                  "—"
                }
                disabled
              />
            ) : (
              <select
                className="form-control"
                style={{ backgroundColor: "#eefbff" }}
                value={values.pay_in_payroll_forId || ""}
                onChange={(e) =>
                  setFieldValue(
                    "pay_in_payroll_forId",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">Select</option>
                {(dashboard?.allPayrollMonthYearList || [])
                  .filter((o) => o.isActive)
                  .map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Per Day Rate */}
          <div className="col-span-6 md:col-span-1">
            <label className="block mb-1 text-sm">
              Per Day Rate <span className="text-danger">*</span>
            </label>
            <NumericFormat
              name="perDayRate"
              className="form-control"
              style={{
                backgroundColor: isReadOnly ? undefined : "#eefbff",
              }}
              placeholder="0"
              thousandSeparator
              allowNegative={false}
              isAllowed={({ value }) => value.length <= 9}
              disabled={isReadOnly}
              value={values.perDayRate}
              onValueChange={(valuesObj) =>
                setFieldValue("perDayRate", valuesObj.value)
              }
            />
            {errors.perDayRate && touched.perDayRate && (
              <div className="form-feedBack text-xs mt-1">
                {errors.perDayRate}
              </div>
            )}
          </div>

          {/* Eligible Days */}
          <div className="col-span-6 md:col-span-1">
            <label className="block mb-1 text-sm">
              Eligible Days <span className="text-danger">*</span>
            </label>
            <Field
              type="number"
              name="eligibleDays"
              className="form-control"
              style={{
                backgroundColor: isReadOnly ? undefined : "#eefbff",
              }}
              placeholder="0"
              min="0"
              disabled
              onInput={(e) => {
                e.target.value = e.target.value.slice(0, 4);
              }}
            />
            {errors.eligibleDays && touched.eligibleDays && (
              <div className="form-feedBack text-xs mt-1">
                {errors.eligibleDays}
              </div>
            )}
          </div>

          {/* Total DA Amount */}
          <div className="col-span-6 md:col-span-1">
            <label className="block mb-1 text-sm">Total DA Amount</label>
            <NumericFormat
              className="form-control bg-light"
              value={values.totalDaAmount}
              thousandSeparator
              displayType="input"
              disabled
            />
          </div>
        </div>
      </div>

      {/* ── FINAL CALCULATION ── */}
      <div className="border-t pt-4 mb-6">
        <h6 className="text-primary font-bold mb-3">Final Calculation</h6>

        <div className="grid grid-cols-12 gap-x-3 gap-y-3 mb-3">
          <div className="col-span-12 md:col-span-1">
            <label className="block mb-1">Advance Received</label>
            <NumericFormat
              name="advanceReceived"
              className="form-control bg-light"
              placeholder="0"
              thousandSeparator
              allowNegative={false}
              isAllowed={({ value }) => value.length <= 12}
              disabled={true}
              value={values.advanceReceived}
              onValueChange={(valuesObj) =>
                setFieldValue("advanceReceived", valuesObj.value)
              }
            />
          </div>

          {/* Total Claim Amount */}
          <div className="col-span-12 md:col-span-1">
            <label className="block mb-1">Total Claim Amount</label>
            <NumericFormat
              className="form-control bg-light"
              value={values.totalClaimAmount}
              thousandSeparator
              displayType="input"
              disabled
            />
          </div>

          {/* Net Payable / Recoverable */}
          <div className="col-span-12 md:col-span-2">
            <label className="block mb-1">Net Payable / Recoverable</label>
            <NumericFormat
              className={`form-control bg-light font-bold ${
                values.netPayableRecoverable < 0
                  ? "text-danger"
                  : "text-success"
              }`}
              value={values.netPayableRecoverable}
              thousandSeparator
              displayType="input"
              disabled
            />
            {values.netPayableRecoverable < 0 && (
              <small className="text-danger">Recoverable from employee</small>
            )}
            {values.netPayableRecoverable >= 0 && (
              <small className="text-success">Payable to employee</small>
            )}
          </div>

          {!isReadOnly && Number(user?.approved_status) === 0 && (
            <div className="col-span-12 md:col-span-2 flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="fullySettled"
                checked={values.fullySettled || false}
                onChange={(e) =>
                  setFieldValue("fullySettled", e.target.checked)
                }
                className="w-4 h-4 cursor-pointer flex-shrink-0"
              />
              <label
                htmlFor="fullySettled"
                className=" cursor-pointer mb-0"
              >
                Travel Expense fully settled by the employee
              </label>
            </div>
          )}
        </div>

        {/* Row 2 — Remarks */}
        <div className="grid grid-cols-12 gap-x-3">
          <div className="col-span-12 md:col-span-5">
            <label className="block mb-1">Remarks</label>
            <Field
              as="textarea"
              name="remarks"
              className="form-control"
              style={{
                backgroundColor: isReadOnly ? undefined : "#eefbff",
                height: "70px",
              }}
              rows="2"
              placeholder="Enter remarks..."
              maxLength={500}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </div>

      {/* FORM ACTIONS */}
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            className="btn btn-light btn-sm px-6"
            onClick={onCancel}
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>

          {!isReadOnly && (
            <button type="submit" className="btn btn-primary btn-sm px-8">
              Save
            </button>
          )}

          {/* Approve button — visible to ALL when pending */}
          {!isReadOnly && Number(user?.approved_status) === 0 && (
            <button
              type="button"
              className={`btn btn-sm px-8 ${
                values.fullySettled && canApprove
                  ? "btn-success"
                  : "btn-secondary"
              }`}
              disabled={isSubmitting || !values.fullySettled || !canApprove}
              title={
                !values.fullySettled
                  ? "Mark as 'Fully Settled' to enable approval"
                  : !canApprove
                  ? "You are not authorized to approve this request"
                  : "Approve this request"
              }
              onClick={() => {
                if (!values.fullySettled || !canApprove) return;
                isApprovingRef.current = true;
                submitForm();
              }}
            >
              Approve
              {!values.fullySettled && (
                <span className="ml-2 text-xs opacity-75">
                  (Fully Settle first)
                </span>
              )}
              {values.fullySettled && !canApprove && (
                <span className="ml-2 text-xs opacity-75">
                  (Not Authorized)
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </Form>
  );
}
