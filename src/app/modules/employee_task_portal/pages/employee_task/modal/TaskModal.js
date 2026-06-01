import React, { useEffect, useState, useMemo } from "react";
import { Modal, Form } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  TextArea,
  Input,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { useFormUIContext } from "../FormUIContext";

const taskValidationSchema = Yup.object().shape({
  taskStatus: Yup.string().required(VALIDATION_MESSAGES.required),
  remarks: Yup.string().trim().required(VALIDATION_MESSAGES.required),
});

const clearanceValidationSchema = Yup.object().shape({
  clearanceProvided: Yup.string().required(VALIDATION_MESSAGES.required),
  remarks: Yup.string().trim().required(VALIDATION_MESSAGES.required),
});

export function TaskModal({ taskId, show, onHide, isViewOnly }) {
  const [loading, setLoading] = useState(false);

  const [localIsViewOnly, setLocalIsViewOnly] = useState(isViewOnly);

  useEffect(() => {
    if (show) {
      setLocalIsViewOnly(isViewOnly);
    }
  }, [show, isViewOnly]);

  const isReadOnly = localIsViewOnly;

  const dispatch = useDispatch();

  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => ({
    panelMode: formUIContext.panelMode,
    setPanelMode: formUIContext.setPanelMode,
    employeeId: formUIContext.employeeId,
    setEmployeeId: formUIContext.setEmployeeId,
    taskType: formUIContext.taskType,
    queryParams: formUIContext.queryParams,
    taskFilter: formUIContext.taskFilter,
    exitClearanceFilter: formUIContext.exitClearanceFilter,
  }), [formUIContext]);

  const isExitClearance = formUIProps.taskType === "exit_clearance";

  const { taskForModal, actionsLoading } = useSelector(
    (state) => ({
      taskForModal: state.employee_task_portal.taskForModal,
      actionsLoading: state.employee_task_portal.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (taskId && show) {
      if (isExitClearance) {
        dispatch(actions.fetchExitClearanceTaskById(taskId));
      } else {
        dispatch(actions.fetchEmployeeTaskById(taskId));
      }
    }
  }, [taskId, show, dispatch, isExitClearance]);

  useEffect(() => {
    if (!show) {
      dispatch(actions.clearTaskForModal());
      formUIProps.setPanelMode(false);
    }
  }, [show, dispatch, formUIProps]);

  // Onboarding uses EmployeeDetail; exit clearance uses EmployeeProfile
  const employee = taskForModal?.EmployeeDetail || taskForModal?.EmployeeProfile;

  useEffect(() => {
    if (employee?.Id) {
      formUIProps.setEmployeeId(employee.Id);
    }
  }, [employee?.Id, formUIProps]);

  // Map stored DB value back to dropdown label for view mode
  const viewTaskStatus = taskForModal?.taskStatus || "";
  const viewClearanceProvided =
    taskForModal?.isClearanceProvided === 1
      ? "Yes"
      : taskForModal?.isClearanceProvided === 2
      ? "Not Required"
      : "No";

  const initialValues = isExitClearance
    ? {
        clearanceProvided: isReadOnly ? viewClearanceProvided : "",
        remarks: isReadOnly ? taskForModal?.remarks || "" : "",
      }
    : {
        taskStatus: isReadOnly ? viewTaskStatus : "",
        remarks: isReadOnly ? taskForModal?.remarks || taskForModal?.taskDescription || "" : "",
      };

  const handleSubmit = (values) => {
    if (isReadOnly) return;
    setLoading(true);

    const submitAction = isExitClearance
      ? actions.handleExitClearance
      : actions.handleEmployeeTask;

    const fetchAction = isExitClearance
      ? actions.fetchExitClearanceTasks
      : actions.fetchEmployeeTasks;

    const payload = isExitClearance
      ? {
          id: taskId,
          remarks: values.remarks,
          clearanceProvided: values.clearanceProvided, // "Yes" | "No" | "Not Required"
        }
      : {
          id: taskId,
          remarks: values.remarks,
          taskStatus: values.taskStatus, // "Completed" | "Not Required"
        };

    dispatch(submitAction(payload))
      .then(() => {
        setLoading(false);
        onHide();
        const refetchFilter = isExitClearance
          ? formUIProps.exitClearanceFilter
          : formUIProps.taskFilter;
        dispatch(fetchAction({ ...formUIProps.queryParams, filter: refetchFilter }));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      size="lg"
      centered
      dialogClassName="recommendation-modal"
      show={show}
      onHide={onHide}
    >
      {actionsLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title className="text-black font-bold text-[1.25rem]">
          {isReadOnly
            ? "View Task"
            : isExitClearance
            ? "Submit Clearance"
            : "Submit Task"}
        </Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={
          !isReadOnly
            ? isExitClearance
              ? clearanceValidationSchema
              : taskValidationSchema
            : undefined
        }
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <>
            <Modal.Body className="p-0">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}

              <Form className="d-flex">

                <div
                  className={`flex-none w-64 bg-light p-3 border-end ${formUIProps.panelMode ? "d-block" : "d-none"
                    }`}
                >
                  <EmployeeProfile
                    employeeId={formUIProps.employeeId}
                    panelMode={formUIProps.panelMode}
                  />
                </div>

                <div className="flex-1 p-4">
                  <fieldset disabled={isReadOnly}>

                    {/* ── Onboarding: Task Status dropdown ── */}
                    {!isExitClearance && (
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Task Status{" "}
                          {!isReadOnly && <span style={{ color: "red" }}>*</span>}
                        </label>
                        <select
                          className="form-control form-select"
                          style={{ width: "150px" }}
                          value={values.taskStatus}
                          onChange={(e) => setFieldValue("taskStatus", e.target.value)}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Completed">Completed</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                        {errors.taskStatus && touched.taskStatus && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                            {errors.taskStatus}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Exit Clearance: Clearance Provided dropdown ── */}
                    {isExitClearance && (
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Clearance Provided{" "}
                          {!isReadOnly && <span style={{ color: "red" }}>*</span>}
                        </label>
                        <select
                          className="form-control form-select"
                          style={{ width: "150px" }}
                          value={values.clearanceProvided}
                          onChange={(e) => setFieldValue("clearanceProvided", e.target.value)}
                        >
                          <option value="">-- Select --</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                        {errors.clearanceProvided && touched.clearanceProvided && (
                          <div className="invalid-feedback d-block" style={{ fontSize: "12px" }}>
                            {errors.clearanceProvided}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Remarks ── */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Remarks{" "}
                        {!isReadOnly && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </label>
                      <Field
                        name="remarks"
                        component={TextArea}
                        rows={3}
                        className="form-control"
                        placeholder="Enter Remarks"
                      />
                    </div>
                  </fieldset>
                </div>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <button
                type="button"
                className="btn btn-light btn-elevate"
                onClick={onHide}
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>

              {!isReadOnly && (
                <button
                  type="button"
                  className="btn btn-primary btn-elevate"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {isExitClearance ? "Submit Clearance" : "Submit Task"}
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white" />
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  );
}
