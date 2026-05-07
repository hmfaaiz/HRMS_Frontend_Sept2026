import React, { useEffect} from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

import * as actions from "../../../_redux/redux-Actions";
import PatternLoanDetailListForm from "../form-edit-dialog/LoanDetailList";

export function InstallmentDetails({ id, status, show, onHide }) {



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