import { Field, FieldArray } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
function PatternLoanDetailListForm({
    values,
    setFieldValue,
    errors,
    touched,
    isdataForRead,
}) {



    const snapshotRef = useRef({});
    useEffect(() => {
        if (!values?.details?.length) return;

        values.details.forEach((item, index) => {

            setFieldValue(`details[${index}].sno`, index + 1);

            // 🔥 create local snapshot (ONLY ONCE)
            if (!snapshotRef.current[index]) {
                snapshotRef.current[index] = Number(item.amount_received);
            }

            setFieldValue(
                `details[${index}].base_amount`,
                snapshotRef.current[index]
            );
        });

    }, []);
    const { activeFiscalYear } = useSelector((state) => state.dashboard);

    // safe access (API sometimes nested or direct)
    const currentMonth =
        activeFiscalYear?.data?.payrollMonth?.startDate ||
        activeFiscalYear?.payrollMonth?.startDate;

    // safe parser (handles "27-Feb-2025")
    const parseDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== "string") return 0;

        const parts = dateStr.split("-");
        if (parts.length !== 3) return 0;

        const [day, month, year] = parts;

        return new Date(`${year}-${month}-${day}`).getTime();
    };

    // normalized current month
    const currentMonthTime = parseDate(currentMonth);

    // disable logic
    const isDisabled = (rowDate) => {
        const rowTime = parseDate(rowDate);

        if (!rowTime || !currentMonthTime) return false;

        return rowTime < currentMonthTime;
    };
    const [monthlyInstallmentsLimit, setMonthlyInstallmentsLimit] = useState();

    const recalcInstallments = (list, changedIndex) => {

        let updated = [...list];

        const entered = Number(updated[changedIndex].amount_received);

        const totalLoan = values?.total_loan_amount;

        const deducted = updated.reduce((sum, item) => {
            if (item.is_deducted) {
                return sum + (
                    Number(item.amount_received || 0) +
                    Number(item.cash_payment || 0)
                );
            }
            return sum;
        }, 0);

        let remaining = Number(totalLoan) - deducted;

        // lock current row
        updated[changedIndex] = {
            ...updated[changedIndex],
            amount_received: entered
        };

        updated = updated.slice(0, changedIndex + 1);

        remaining = remaining - entered;

        let date = new Date(updated[changedIndex].payroll_month_date);

        const perInstallment = entered;

        while (remaining > 0) {

            const nextAmount = Math.min(perInstallment, remaining);

            date = new Date(date);
            date.setMonth(date.getMonth() + 1);

            updated.push({
                payroll_month_date: date.toISOString(),
                amount_received: nextAmount,
                running_balance: remaining - nextAmount,
                is_deducted: false,
            });

            remaining -= nextAmount;
        }

        return updated;
    };

    const formatMonth = (dateStr) => {
        if (!dateStr) return "";

        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };
    const currentMonthFormatted = currentMonthTime
        ? new Date(currentMonthTime).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        : "";
    const isCurrentMonth = (rowDate) => {
        return formatMonth(rowDate) === currentMonthFormatted;
    };

    const { currentState } = useSelector((state) => ({
        currentState: state.employee_loan_request,
    }), shallowEqual);


    const { userForEdit, loan_config_details_permission } = currentState;



    // useEffect(() => {
    //     let monthlyInstallment = 0;
    //     if (userForEdit && loan_config_details_permission) {



    //         let loandetails = currentState?.loan_config_details_permission?.loanDetails?.details?.find(
    //             (item) => item.loan_typeId === values?.loan_typeId
    //         );


    //         if (loandetails?.max_no_of_installment_for_loan) {
    //             monthlyInstallment = loandetails?.max_no_of_installment_for_loan;
    //         }
    //     }
    //     setMonthlyInstallmentsLimit(monthlyInstallment);
    //     console.log("monthlyInstallment11112222", values?.loan_typeId, loan_config_details_permission, monthlyInstallment)
    // }, [loan_config_details_permission]);

    return (
        <>
            <FieldArray name="details">
                {({ remove, push }) => (
                    <>


                        <div style={{
                            backgroundColor: "#ffffff",
                            height: "350px",
                            padding: "10px",
                            overflow: "scroll",
                        }}>

                            <div className="react-bootstrap-table table-responsive">
                                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                    <thead>
                                        <tr className="custom-table-header">
                                            <td className="w-[40px]">S.No.</td>
                                            <td className="w-[140px]">Payroll Month</td>
                                            <td className="w-[140px]">Installment Amount</td>

                                            {/* <td className="w-[140px]">Cash Payment</td> */}
                                            <td className="w-[100px]">Deducted</td>

                                            <td className="text-right">Action</td>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {values?.details?.map((row, index) => (
                                            <tr key={index}>
                                                {/* SNO */}
                                                <td>
                                                    <Field
                                                        name={`details[${index}].sno`}
                                                        value={index + 1}
                                                        type="number"
                                                        className="form-control"
                                                        disabled
                                                    />
                                                </td>

                                                {/* Payroll Month */}
                                                <td>
                                                    <Field
                                                        type="text"
                                                        disabled
                                                        name={`details[${index}].payroll_month_date`}
                                                        className={
                                                            errors.details?.[index]?.payroll_month_date &&
                                                                touched.details?.[index]?.payroll_month_date
                                                                ? "form-control is-invalid"
                                                                : "form-control"
                                                        }
                                                        value={
                                                            row?.payroll_month_date
                                                                ? new Date(row.payroll_month_date).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })
                                                                : ""
                                                        }
                                                    />

                                                    {errors?.details?.[index]?.payroll_month_date &&
                                                        touched?.details?.[index]?.payroll_month_date && (
                                                            <div className="invalid-feedback">
                                                                {errors.details[index].payroll_month_date}
                                                            </div>
                                                        )}
                                                </td>


                                                <td>
                                                    <Field
                                                        type="number"
                                                        name={`details[${index}].amount_received`}
                                                        className={
                                                            errors.details?.[index]?.amount_received &&
                                                                touched.details?.[index]?.amount_received
                                                                ? "form-control is-invalid"
                                                                : "form-control"
                                                        }
                                                        disabled={values?.details?.[index]?.is_deducted ||
                                                            isDisabled(row?.payroll_month_date)}
                                                        value={row?.amount_received || ""}
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                `details[${index}].amount_received`,
                                                                e.target.value
                                                            )

                                                            setFieldValue(`details[${index}].is_dirty`, true);
                                                        }

                                                        }
                                                    />

                                                    {errors?.details?.[index]?.amount_received &&
                                                        touched?.details?.[index]?.amount_received && (
                                                            <div className="invalid-feedback">
                                                                {errors.details[index].amount_received}
                                                            </div>
                                                        )}
                                                </td>

                                                {/* Running Balance */}
                                                {/* <td>
                                                    <Field
                                                        type="number"
                                                        name={`details[${index}].running_balance`}
                                                        className={
                                                            errors.details?.[index]?.running_balance &&
                                                                touched.details?.[index]?.running_balance
                                                                ? "form-control is-invalid"
                                                                : "form-control"
                                                        }
                                                        disabled
                                                        value={row?.running_balance || ""}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `details[${index}].running_balance`,
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    {errors?.details?.[index]?.running_balance &&
                                                        touched?.details?.[index]?.running_balance && (
                                                            <div className="invalid-feedback">
                                                                {errors.details[index].running_balance}
                                                            </div>
                                                        )}
                                                </td> */}

                                                {/* Cash Payment */}
                                                {/* <td>
                                                    <Field
                                                        type="number"
                                                        name={`details[${index}].cash_payment`}
                                                        className={
                                                            errors.details?.[index]?.cash_payment &&
                                                                touched.details?.[index]?.cash_payment
                                                                ? "form-control is-invalid"
                                                                : "form-control"
                                                        }
                                                        disabled
                                                        value={row?.cash_payment || ""}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `details[${index}].cash_payment`,
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                    {errors?.details?.[index]?.cash_payment &&
                                                        touched?.details?.[index]?.cash_payment && (
                                                            <div className="invalid-feedback">
                                                                {errors.details[index].cash_payment}
                                                            </div>
                                                        )}
                                                </td> */}

                                                {/* Deducted */}
                                                <td>
                                                    <Checkbox
                                                        isSelected={row?.is_deducted}
                                                        name={`details[${index}].is_deducted`}
                                                        disabled
                                                        checked={!!row?.is_deducted}
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                `details[${index}].is_deducted`,
                                                                e.target.checked
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                {isCurrentMonth(row.payroll_month_date) ? (

                                                    <td className="text-right">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-success"
                                                            disabled={!row.is_dirty}
                                                            onClick={() => {
                                                                const updated = recalcInstallments(values.details, index);

                                                                setFieldValue("details", updated);

                                                                // 🔥 reset all dirty flags after calculation
                                                                updated.forEach((_, i) => {
                                                                    setFieldValue(`details[${i}].is_dirty`, false);
                                                                });
                                                            }}
                                                        >
                                                            Calculate
                                                        </button>
                                                    </td>

                                                ) : (
                                                    <td className="text-right text-muted">
                                                        -
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </FieldArray>


            {typeof errors?.details === "string" && (
                <div className="text-danger mt-3 font-bold">
                    {errors.details}
                </div>
            )}
        </>
    );
}

export default PatternLoanDetailListForm;