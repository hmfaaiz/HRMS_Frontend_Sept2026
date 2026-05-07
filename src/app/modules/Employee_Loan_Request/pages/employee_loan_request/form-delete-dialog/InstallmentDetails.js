import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import * as actions from "../../../_redux/redux-Actions";
import PatternLoanDetailListForm from "../form-edit-dialog/LoanDetailList";

export function InstallmentDetails({ id, status, show, onHide }) {

    const loanInstallmentSchema = Yup.object().shape({
        details: Yup.array()
            .of(
                Yup.object().shape({
                    amount_received: Yup.number()
                        .typeError("Only numbers are allowed")
                        .required("Amount is required")
                        .min(0, "Amount cannot be negative")
                })
            )
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
            ),
    });

    useEffect(() => {
        dispatch(actions.fetchmoduledata(id));

    }, [id, dispatch, show])



    const dispatch = useDispatch();

    const { currentState } = useSelector((state) => ({
        currentState: state.employee_loan_request,
    }), shallowEqual);

    const { userForEdit } = currentState;

    useEffect(() => {
        if (!id) {
            onHide();
        }
    }, [id]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
            size="xl"
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
                    list: userForEdit?.details || [],
                }}
                validationSchema={loanInstallmentSchema}
                onSubmit={(values) => {
                    console.log("FORM VALUES", values);
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
                                onClick={onHide}
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