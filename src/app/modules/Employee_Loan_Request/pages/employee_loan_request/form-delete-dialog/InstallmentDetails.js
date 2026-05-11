import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import * as actions from "../../../_redux/redux-Actions";
import PatternLoanDetailListForm from "../form-edit-dialog/LoanDetailList";
import { formatDates } from "../../../../../utils/common";
import { useFormUIContext } from "../FormUIContext";

export function InstallmentDetails({ id, status, show, onHide }) {

    const FormUIContext = useFormUIContext();



    const formUIProps = useMemo(() => {
        return {

            setIds: FormUIContext.setIds,

        };
    }, [FormUIContext]);

    const [monthlyInstallmentsLimit, setMonthlyInstallmentsLimit] = useState();
    // const loanInstallmentSchema = Yup.object().shape({
    //     details: Yup.array()
    //         .of(
    //             Yup.object().shape({
    //                 amount_received: Yup.number()
    //                     .typeError("Only numbers are allowed")
    //                     .required("Amount is required")
    //                     .min(0, "Amount cannot be negative")
    //             })
    //         )
    //         .test(
    //             "remaining-check",
    //             "Installment exceeds remaining loan amount",
    //             function (details) {
    //                 const { total_loan_amount } = this.parent;

    //                 if (!Array.isArray(details)) return true;

    //                 let remaining = Number(total_loan_amount || 0);

    //                 for (let i = 0; i < details.length; i++) {
    //                     const val = Number(details[i]?.amount_received || 0);

    //                     if (val > remaining) {
    //                         return this.createError({
    //                             path: `details[${i}].amount_received`,
    //                             message: "Amount exceeds remaining loan balance",
    //                         });
    //                     }

    //                     remaining -= val;
    //                 }

    //                 return true;
    //             }
    //         )

    //         .test(
    //             "minimum-total-check",
    //             "Total installment is less than loan amount",
    //             function (details) {
    //                 const { total_loan_amount } = this.parent;

    //                 if (!Array.isArray(details)) return true;

    //                 const totalLoan = Number(total_loan_amount || 0);

    //                 const totalPaid = details.reduce((sum, item) => {
    //                     return sum + Number(item?.amount_received || 0);
    //                 }, 0);

    //                 if (totalPaid < totalLoan) {
    //                     return this.createError({
    //                         path: "details",
    //                         message: "Total installment is less than loan amount",
    //                     });
    //                 }

    //                 return true;
    //             }
    //         )

    //         .test(
    //             "monthly-limit-check",
    //             "Monthly installment limit exceeded",
    //             function (details) {

    //                 const limit = this.options.context?.monthlyInstallmentsLimit;

    //                 if (!limit) return true;


    //                 if (details.length > limit) {
    //                     return this.createError({
    //                         path: "details",
    //                         message: `Max ${limit} installments allowed only`,
    //                     });
    //                 }

    //                 return true;
    //             }
    //         )

    //     ,
    // });


    const loanInstallmentSchema = (monthlyInstallmentsLimit) =>
        Yup.object().shape({
            details: Yup.array()
                .of(
                    Yup.object().shape({
                        amount_received: Yup.number()
                            .typeError("Only numbers are allowed")
                            .required("Amount is required")
                            .min(0, "Amount cannot be negative"),
                    })
                )

                // remaining balance validation
                .test(
                    "remaining-check",
                    "Installment exceeds remaining loan amount",
                    function (details) {

                        const { total_loan_amount } = this.parent;

                        if (!Array.isArray(details)) return true;

                        let remaining = Number(total_loan_amount || 0);

                        for (let i = 0; i < details.length; i++) {

                            const val = Number(details[i]?.amount_received || 0);

                            if (val > remaining) {
                                return this.createError({
                                    path: `details[${i}].amount_received`,
                                    message: "Amount exceeds remaining loan balance",
                                });
                            }

                            remaining -= val;
                        }

                        return true;
                    }
                )

                // total must equal loan amount
                .test(
                    "minimum-total-check",
                    "Total installment is less than loan amount",
                    function (details) {

                        const { total_loan_amount } = this.parent;

                        if (!Array.isArray(details)) return true;

                        const totalLoan = Number(total_loan_amount || 0);

                        const totalPaid = details.reduce((sum, item) => {
                            return sum + Number(item?.amount_received || 0);
                        }, 0);

                        if (totalPaid < totalLoan) {
                            return this.createError({
                                path: "details",
                                message: "Total installment is less than loan amount",
                            });
                        }

                        return true;
                    }
                )

                // max installment limit validation
                .test(
                    "monthly-limit-check",
                    "Monthly installment limit exceeded",
                    function (details) {

                        const limit = monthlyInstallmentsLimit;

                        if (!limit) return true;

                        if (details.length > limit) {
                            return this.createError({
                                path: "details",
                                message: `Max ${limit} installments allowed only`,
                            });
                        }

                        return true;
                    }
                ),
        });

    useEffect(() => {
        dispatch(actions.fetchmoduledata(id));
        console.log('fetchmoduledata11111')

    }, [id, dispatch, show])


    const dispatch = useDispatch();

    const { currentState } = useSelector((state) => ({
        currentState: state.employee_loan_request,
    }), shallowEqual);

    const { userForEdit, loan_config_details_permission } = currentState;
    console.log("currentState1111", currentState)
    useEffect(() => {
        if (!id) {
            onHide();
        }
    }, [id]);





    useEffect(() => {
        let monthlyInstallment = 0;
        if (userForEdit && loan_config_details_permission) {



            let loandetails = currentState?.loan_config_details_permission?.loanDetails?.details?.find(
                (item) => item.loan_typeId === userForEdit?.loan_typeId
            );


            if (loandetails?.max_no_of_installment_for_loan) {
                monthlyInstallment = loandetails?.max_no_of_installment_for_loan;
            }
        }
        setMonthlyInstallmentsLimit(monthlyInstallment);
        console.log("monthlyInstallmen777777", userForEdit?.loan_typeId, loan_config_details_permission, monthlyInstallment)
    }, [userForEdit, loan_config_details_permission]);



    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    Update Installments
                </Modal.Title>
            </Modal.Header>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    ...userForEdit,
                    details: userForEdit?.details || [],
                }}
                // validationSchema={loanInstallmentSchema}
                validationSchema={loanInstallmentSchema(monthlyInstallmentsLimit)}
                context={{
                    monthlyInstallmentsLimit,
                }}
                onSubmit={async (values) => {

                    const payload = {
                        Id: values.Id,   // sirf master id
                        details: values.details.map(({ amount_received, is_deducted, payroll_month_date }) => ({
                            is_deducted,
                            amount_received,

                            payroll_month_date: payroll_month_date ? formatDates(payroll_month_date, "dd-MMM-yyyy") : null,
                        }))
                    };

                    await dispatch(actions.updateLoanInstallments(payload, onHide));
                    formUIProps.setIds("");
                }}
            >



                {({
                    values,
                    setFieldValue,
                    errors,
                    touched,
                    handleSubmit,
                }) => (
                    <>
                        <Modal.Body>

                            <PatternLoanDetailListForm
                                values={values}
                                setFieldValue={setFieldValue}
                                errors={errors}
                                touched={touched}
                                isdataForRead={false}
                            />

                        </Modal.Body>

                        <Modal.Footer>
                            <button
                                type="button"
                                onClick={() => {
                                   onHide(); 
                                    formUIProps.setIds("");

                                }
                                }
                                className="btn btn-light btn-elevate"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn btn-primary btn-elevate"
                            >
                                Save
                            </button>
                        </Modal.Footer>
                    </>
                )}
            </Formik>
        </Modal>
    );
}