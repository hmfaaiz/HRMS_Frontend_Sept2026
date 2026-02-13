import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import PatternListForm from "./PatternListForm";
import { fetchAllEmployeesWithNoPermissionData } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  loadMasterChecklistByEmployee,
  fetchEmployeeChecklistByEmployee,
} from "../../../_redux/redux-Actions";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { Eye, XCircle } from "lucide-react";

const employeeChecklistSchema = Yup.object().shape({
  employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
  isApproved: Yup.number().nullable(), // Added for approval status
  list: Yup.array().of(
    Yup.object().shape({
      departmentId: Yup.mixed().when("isNew", {
        is: true,
        then: Yup.mixed(),
        otherwise: Yup.number().required(VALIDATION_MESSAGES.required),
      }),
      taskName: Yup.string().when("isNew", {
        is: true,
        then: Yup.string(),
        otherwise: Yup.string().required(VALIDATION_MESSAGES.required),
      }),
      taskStatus: Yup.string().when("isNew", {
        is: true,
        then: Yup.string(),
        otherwise: Yup.string().required(VALIDATION_MESSAGES.required),
      }),
      completionDate: Yup.string().when("taskStatus", {
        is: "Completed",
        then: Yup.string().required(
          "Completion date is required when task status is Completed",
        ),
        otherwise: Yup.string().nullable(),
      }),
      remarks: Yup.string().nullable(),
    }),
  ),
});

export function FormEditForm({
  saveForm,
  data,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
  actionsLoading,
  setPanelMode,
  panelMode,
}) {
  const dispatch = useDispatch();
  const { dashboard, employee_onboarding_checklist } = useSelector(
    (state) => state,
  );

  useEffect(() => {
    dispatch(
      fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList"),
    );
  }, [dispatch]);

  const usedEmployeeIds = employee_onboarding_checklist?.entities?.results?.map(
    (r) => r.employeeId,
  );

  const employeeOptions =
    dashboard?.allEmployeesWithNoPermissionList?.map((emp) => ({
      ...emp,
      isDisabled:
        usedEmployeeIds?.includes(emp.value) && emp.value !== data?.employeeId,
    })) || [];

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...data,
        list: (data?.list || []).map((item) => ({
          ...item,
          isFromMasterChecklist: !!item.masterChecklistId, // Dynamically set based on masterChecklistId
          originalTaskStatus: item.taskStatus || "", // Track original status
        })),
        isApproved: data?.isApproved || 0,
        actionType: "SAVE", 
      }}
      validationSchema={employeeChecklistSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                <div className="grid md:grid-cols-9 gap-x-3 gap-y-1">
                  <div className="col-span-3">
                    <SearchSelect
                      name="employeeId"
                      label={
                        <span>
                          Employee<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead || data.dataIsExist}
                      value={
                        employeeOptions.find(
                          (opt) => opt.value === values.employeeId,
                        ) || null
                      }
                      onChange={async (e) => {
                        const employeeId = e?.value || null;
                        setFieldValue("employeeId", employeeId);

                        if (!employeeId) {
                          if (!data?.dataIsExist) setFieldValue("list", []);
                          return;
                        }

                        const masterTasks = await dispatch(
                          loadMasterChecklistByEmployee({ employeeId }),
                        );
                        const employeeTasks = await dispatch(
                          fetchEmployeeChecklistByEmployee(employeeId),
                        );

                        const safeMaster = Array.isArray(masterTasks)
                          ? masterTasks
                          : [];
                        const safeEmployee = Array.isArray(employeeTasks)
                          ? employeeTasks
                          : [];

                        const employeeTaskMap = {};
                        safeEmployee.forEach((t) => {
                          employeeTaskMap[
                            `${t.departmentId}_${t.taskName}`
                          ] = t;
                        });

                        const mergedList = safeMaster.map((task, idx) => {
                          const key = `${task.departmentId}_${task.taskName}`;
                          const empTask = employeeTaskMap[key];

                          return {
                            masterChecklistId: task.Id,
                            departmentId: task.departmentId,
                            taskName: task.taskName,
                            taskDescription: task.taskDescription,
                            attachmentPath: task.attachmentPath || null,
                            attachment: null,
                            responsibleEmployeeId:
                              empTask?.responsibleEmployeeId || "",
                            taskStatus: empTask?.taskStatus || "",
                            completionDate: empTask?.completionDate || "",
                            remarks: empTask?.remarks || "",
                            sno: idx + 1,
                            isFromMasterChecklist: true,
                            originalTaskStatus: empTask?.taskStatus || "", // Track original status
                          };
                        });

                        safeEmployee.forEach((task) => {
                          const exists = safeMaster.some(
                            (m) =>
                              m.departmentId === task.departmentId &&
                              m.taskName === task.taskName,
                          );
                          if (!exists) {
                            mergedList.push({
                              ...task,
                              isFromMasterChecklist: false,
                              sno: mergedList.length + 1,
                              originalTaskStatus: task.taskStatus || "", // Track original status
                            });
                          }
                        });

                        setFieldValue("list", mergedList);
                      }}
                      options={employeeOptions}
                      placeholder="Select Employee"
                      error={errors.employeeId}
                      touched={touched.employeeId}
                    />
                  </div>

                  <div className="mt-6 col-span-1">
                    {panelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                        disabled={!values.employeeId}
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}
                  </div>
                </div>

                <EmployeeProfile
                  employeeId={values.employeeId}
                  panelMode={panelMode}
                />
                <hr />

                <PatternListForm
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  isdataForRead={isdataForRead}
                  isApproved={values.isApproved} // Pass approval status
                />
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button className="btn btn-light btn-elevate" onClick={onHide}>
              Cancel
            </button>

            {!isdataForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={
                  !values.list?.length ||
                  values.list.some(
                    (row) =>
                      !row.departmentId ||
                      !row.taskName ||
                      !row.taskStatus ||
                      (row.taskStatus === "Completed" && !row.completionDate),
                  )
                }
              >
                Save{" "}
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}

            {!isdataForRead && data?.dataIsExist && (
              <button
                type="submit"
                className="btn btn-primary btn-elevate"
                disabled={
                  isdataForRead ||
                  values.list?.some(
                    (item) => item?.taskStatus === "Not Completed",
                  ) // Disable if any task is not completed
                }
                onClick={() => {
                  setFieldValue("isApproved", 1); // Set approval
                  handleSubmit(); // Submit form
                }}
              >
                Finalize
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
