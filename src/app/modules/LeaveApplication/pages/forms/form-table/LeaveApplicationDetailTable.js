import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import * as actions from "../../../_redux/formActions";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  Input,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { format } from "date-fns";
import { Field, FieldArray, Formik } from "formik";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";

// Validation Schema
const formValidation = Yup.object().shape({
  leaveApplicationDetail: Yup.array().of(
    Yup.object().shape({
      day: Yup.number()
        .required(VALIDATION_MESSAGES.required)
        .oneOf([1, 0.5, 0], "Days must be either 1 or 0.5"),
    })
  ),
});

export const LeaveApplicationDetailTable = ({
  show,
  onHide,
  leaveId,
  handleSubmit,
}) => {
  const dispatch = useDispatch();

  const {
    detailLoading,
    leaveApplicationDetail,
    detailUpdateLoading,
  } = useSelector(
    (state) => ({
      leaveApplicationDetail: state.leave_application.leaveApplicationDetail,
      detailLoading: state.leave_application.detailLoading,
      detailUpdateLoading: state?.leave_application?.detailUpdateLoading,
    }),
    shallowEqual
  );
  useEffect(() => {
    if (!leaveId) {
      onHide();
      return;
    }
    dispatch(actions?.fetchLeaveDetail(leaveId));
  }, [leaveId]);

  return (
    <Modal
      size="xl"
      show={show}
      dialogClassName="modal-75vw"
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {detailLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          <h6 className="font-bold mb-0 text-primary">
            Leave Application Detail
          </h6>
        </Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize={true}
        initialValues={{
          leaveApplicationDetail: leaveApplicationDetail || [],
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          handleSubmit(values?.leaveApplicationDetail, onHide);
        }}
      >
        {({ touched, errors, values, handleSubmit }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {!detailLoading && (
                <FieldArray name="leaveApplicationDetail">
                  {() => (
                    <div className="w-full overflow-auto max-h-[80vh] scrollbar-fancy">
                      <div className="react-bootstrap-table table-responsive">
                        <table  className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <thead>
                             <tr className="custom-table-header">
                              <td>Date</td>
                              <td>Leave Type</td>
                              <td>Day</td>
                              <td>Cancel</td>
                            </tr>
                          </thead>
                          <tbody>
                            {values.leaveApplicationDetail?.map(
                              (row, index) => (
                                <tr key={index}>
                                  <td>
                                    {row?.date
                                      ? format(
                                          new Date(row.date),
                                          "dd-MMM-yyyy"
                                        )
                                      : ""}
                                  </td>
                                  <td>
                                    {row?.t_leave_application?.t_leave_type
                                      ?.name || ""}
                                  </td>
                                  <td>
                                    <Field
                                      name={`leaveApplicationDetail[${index}].day`}
                                    >
                                      {({ field, form }) => (
                                        <>
                                          <input
                                            {...field}
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.5"
                                            disabled={
                                              form.values
                                                .leaveApplicationDetail?.[index]
                                                ?.isCancel ||
                                              form.values
                                                .leaveApplicationDetail?.[index]
                                                ?.isOldCancel
                                            }
                                            className={
                                              errors.leaveApplicationDetail?.[
                                                index
                                              ]?.day &&
                                              touched.leaveApplicationDetail?.[
                                                index
                                              ]?.day
                                                ? "form-control is-invalid"
                                                : "form-control"
                                            }
                                            onChange={(e) => {
                                              const value = parseFloat(
                                                e.target.value
                                              );
                                              form.setFieldValue(
                                                `leaveApplicationDetail[${index}].day`,
                                                isNaN(value) ? "" : value
                                              );
                                            }}
                                          />
                                          {errors.leaveApplicationDetail?.[
                                            index
                                          ]?.day &&
                                            touched.leaveApplicationDetail?.[
                                              index
                                            ]?.day && (
                                              <CustomErrorLabel
                                                touched={true}
                                                error={
                                                  errors
                                                    .leaveApplicationDetail?.[
                                                    index
                                                  ]?.day
                                                }
                                              />
                                            )}
                                        </>
                                      )}
                                    </Field>
                                  </td>
                                  <td className="text-center">
                                    <Field
                                      name={`leaveApplicationDetail[${index}].isCancel`}
                                    >
                                      {({ field, form }) => (
                                        <input
                                          type="checkbox"
                                          {...field}
                                          checked={field.value || false}
                                          disabled={
                                            form.values
                                              .leaveApplicationDetail?.[index]
                                              ?.isOldCancel
                                          }
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              form.setFieldValue(
                                                `leaveApplicationDetail[${index}].day`,
                                                0
                                              );
                                            } else {
                                              form.setFieldValue(
                                                `leaveApplicationDetail[${index}].day`,
                                                1
                                              );
                                            }
                                            form.setFieldValue(
                                              `leaveApplicationDetail[${index}].isCancel`,
                                              e.target.checked
                                            );
                                          }}
                                          // className="form-check-input"
                                        />
                                      )}
                                    </Field>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </FieldArray>
              )}
            </Modal.Body>

            <Modal.Footer>
              <button
                type="submit"
                onClick={() => {
                  onHide();
                }}
                // disabled={detailUpdateLoading}
                className="btn btn-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={detailUpdateLoading}
                className="btn btn-primary btn-elevate"
              >
                Save
                {detailUpdateLoading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  );
};
