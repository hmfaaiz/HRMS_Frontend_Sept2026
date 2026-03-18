import React, { useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as actions from "../../../_redux/redux-Actions";
import { Input, TextArea } from "../../../../../../_metronic/_partials/controls";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, formatNumberWithCommas } from "../../../../../utils/common";

const EMPTY_USER = {
  Id: "",
  employeeId: "",
  loan_typeId: "",
  employee_loan_requestId: "",
  payrollMonthId: "",
  payment_date: "",
  payment_amount: "",
  payment_reference_no: "",
  loan_outstanding_balance_after: "",
  deduct_in_active_payroll: false,
  remarks: "",
};

const toSafe = (obj) =>
  Object.fromEntries(
    Object.entries({ ...EMPTY_USER, ...obj }).map(([k, v]) => [
      k,
      v === null || v === undefined ? "" : v,
    ])
  );

const buildSchema = (maxAmount) =>
  Yup.object().shape({
    employeeId:     Yup.mixed().required(VALIDATION_MESSAGES.required),
    loan_typeId:    Yup.mixed().required(VALIDATION_MESSAGES.required),
    payment_date:   Yup.mixed().required(VALIDATION_MESSAGES.required),
    payment_amount: Yup.number()
      .typeError(VALIDATION_MESSAGES.required)
      .min(1, VALIDATION_MESSAGES.minOneValue)
      .test(
        "max-outstanding",
        `Payment amount cannot exceed outstanding balance (${formatNumberWithCommas(maxAmount)})`,
        (val) => {
          if (!val || maxAmount == null || maxAmount === 0) return true;
          return Number(val) <= Number(maxAmount);
        }
      )
      .required(VALIDATION_MESSAGES.required),
  });

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  loading,
  setIds,
  isEdit,
  disableLoading,
  formUIProps,
}) {
  const dispatch = useDispatch();
  const safeUser = toSafe(user);

  // ── Lock original outstanding from saved record ───────────────────────────
  // original = loan_outstanding_balance_after + payment_amount
  // e.g. 9,000 + 1,000 = 10,000
  // Stored in a ref so Redux overwrites never affect it.
  const lockedOutstandingRef = useRef(null);
  const lockedForIdRef = useRef(null);

  if (isEdit && safeUser.Id && safeUser.Id !== lockedForIdRef.current) {
    const balanceAfter  = parseFloat(safeUser.loan_outstanding_balance_after) || 0;
    const paymentAmount = parseFloat(safeUser.payment_amount) || 0;
    lockedOutstandingRef.current = balanceAfter + paymentAmount;
    lockedForIdRef.current = safeUser.Id;
  }

  if (!isEdit && lockedForIdRef.current !== null) {
    lockedOutstandingRef.current = null;
    lockedForIdRef.current = null;
  }

  const { loanOutstanding, activeFiscalYear } = useSelector(
    (state) => ({
      loanOutstanding:  state.cash_payment_against_loan?.loanOutstanding ?? null,
      activeFiscalYear: state.dashboard?.activeFiscalYear,
    }),
    shallowEqual
  );

  const maxAmount = (() => {
    if (isEdit) {
      const locked = lockedOutstandingRef.current;
      if (locked != null && locked > 0) return locked;
      return loanOutstanding?.loanOutstanding != null
        ? Number(loanOutstanding.loanOutstanding)
        : null;
    }
    return loanOutstanding?.loanOutstanding != null
      ? Number(loanOutstanding.loanOutstanding)
      : null;
  })();

  const calcBalanceAfter = (paymentAmount) => {
    const outstanding = maxAmount ?? 0;
    const after = outstanding - Number(paymentAmount || 0);
    return after >= 0 ? after : 0;
  };

  const isDisabled = isUserForRead || actionsLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={safeUser}
      validationSchema={isUserForRead ? undefined : buildSchema(maxAmount)}
      onSubmit={(values, { resetForm }) => {
        if (isUserForRead) return;
        const payload = {
          ...values,
          payment_date: values.payment_date
            ? formatDates(new Date(values.payment_date), "yyyy-MM-dd")
            : null,
          employee_loan_requestId:
            loanOutstanding?.employee_loan_requestId ||
            values.employee_loan_requestId ||
            null,
          payrollMonthId:
  activeFiscalYear?.payrollMonthId ??
  activeFiscalYear?.Id ??
  values.payrollMonthId ??
  null,
        };
        saveForm(payload, resetForm);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, setFieldTouched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isDisabled || maxAmount === 0}>

                {/* Active Payroll Month */}
                <div className="d-flex justify-content-end mb-2">
                  <div style={{ fontSize: "10px" }}>
                    <span className="font-bold">Active Payroll Month:</span>{" "}
                    <span className="font-weight-bold">
                      {activeFiscalYear?.payrollMonthLabel || "—"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-8 gap-x-3 mt-3">

                  {/* Payment Date */}
                  <div>
                    <label>
                      Payment Date {!isUserForRead && <span style={{ color: "red" }}>*</span>}
                    </label>
                    <DatePicker
                      className={`form-control${
                        !isUserForRead && errors.payment_date && touched.payment_date
                          ? " is-invalid" : ""
                      }`}
                      placeholderText="Select Date"
                      selected={values.payment_date ? new Date(values.payment_date) : null}
                      onChange={(date) => setFieldValue("payment_date", date || "")}
                      dateFormat="dd-MMM-yyyy"
                      maxDate={new Date()}
                      showPopperArrow={false}
                      autoComplete="off"
                      disabled={isDisabled}
                    />
                    {!isUserForRead && errors.payment_date && touched.payment_date && (
                      <div className="text-danger mt-1" style={{ fontSize: "0.85em" }}>
                        {errors.payment_date}
                      </div>
                    )}
                  </div>

                  {/* Payment Amount */}
                  <div>
                    <AmountInput
                      field={{ name: "payment_amount", value: values.payment_amount }}
                      form={{ touched, errors, setFieldValue, setFieldTouched }}
                      label={
                        <span>
                          Payment Amount {!isUserForRead && <span style={{ color: "red" }}>*</span>}
                        </span>
                      }
                      placeholder="Enter payment amount"
                      disabled={isDisabled}
                      onChange={(val) => {
                        if (isUserForRead) return;
                        const num = Number(val) || "";
                        if (maxAmount != null && num !== "" && num > maxAmount) return;
                        setFieldValue("payment_amount", num);
                        setFieldValue(
                          "loan_outstanding_balance_after",
                          num !== "" ? calcBalanceAfter(num) : ""
                        );
                      }}
                    />
                    {maxAmount != null && (
                      <small className="d-block mt-1" style={{ fontStyle: "italic" }}>
                        Outstanding Amount:{" "}
                        <strong style={{ color: maxAmount === 0 ? "#e74c3c" : "#c0392b" }}>
  {maxAmount === 0
    ? "0 — No outstanding balance"
    : formatNumberWithCommas(maxAmount)}
</strong>
                      </small>
                    )}
                  </div>

                  {/* Payment Reference No */}
                  <div>
                    <Field
                      name="payment_reference_no"
                      component={Input}
                      placeholder="Enter reference no."
                      label="Payment Reference No."
                      type="text"
                      disabled={isDisabled}
                    />
                  </div>

                  {/* Loan Outstanding Balance (After) — read-only */}
                  <div>
                    <AmountInput
                      field={{
                        name: "loan_outstanding_balance_after",
                        value: values.loan_outstanding_balance_after,
                      }}
                      form={{ touched, errors, setFieldValue, setFieldTouched }}
                      label="Loan Outstanding Balance (After)"
                      disabled={true}
                    />
                  </div>

                  {/* Deduct checkbox */}
                  <div className="d-flex align-items-center mt-5" style={{ gap: "10px" }}>
                    <input
                      type="checkbox"
                      id="deduct_in_active_payroll"
                      checked={!!values.deduct_in_active_payroll}
                      onChange={(e) => {
                        if (isUserForRead) return;
                        setFieldValue("deduct_in_active_payroll", e.target.checked);
                      }}
                      disabled={isDisabled}
                      style={{ width: 16, height: 16, cursor: isDisabled ? "not-allowed" : "pointer" }}
                    />
                    <label
                      htmlFor="deduct_in_active_payroll"
                      className="mb-0 font-weight-bold"
                      style={{
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Deduction Loan installment in Active Payroll Month
                    </label>
                  </div>

                </div>

                {/* Remarks */}
                <div className="grid grid-cols-1 mt-3">
                  <Field
                    name="remarks"
                    component={TextArea}
                    placeholder="Enter remarks"
                    label="Remarks"
                    type="text"
                    disabled={isDisabled}
                  />
                </div>

              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / Close — resets everything including employee & loan dropdowns */}
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light btn-elevate"
            >
              {isUserForRead ? "Close" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
disabled={loading || maxAmount === 0}
title={maxAmount === 0 ? "No outstanding balance remaining" : undefined}              >
                Save
                {loading && <span className="ml-3 mr-3 spinner spinner-white" />}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}