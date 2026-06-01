import { Field, FieldArray } from "formik";
import React, { useEffect } from "react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  formatDates,
  getUploadUrl,
  getFileName,
} from "../../../../../utils/common";
import { CirclePlus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import "react-datepicker/dist/react-datepicker.css";
import {
  fetchAllDept,
  fetchAllEmployeesWithNoPermissionData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { Checkbox } from "@material-ui/core";

function PatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  isdataForRead,
  isApproved,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const taskStatusOptions = [
    { value: "Completed", label: "Completed" },
    { value: "Not Completed", label: "Not Completed" },
    { value: "Not Needed", label: "Not Needed" },
  ];

  const columnWidths = {
    sno: "5px",
    department: "350px",
    taskName: "300px",
    taskDescription: "500px",
    attachment: "100px",
    responsibleEmployee: "450px",
    taskStatus: "270px",
    returnableAssets: "50px",
    completionDate: "120px",
    remarks: "400px",
    action: "5px",
  };

  useEffect(() => {
    dispatch(fetchAllDept());
    dispatch(
      fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList"),
    );
  }, [dispatch]);

  // Auto-update S.No
  useEffect(() => {
    (values.list || []).forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list, setFieldValue]);

  return (
    <FieldArray name="list">
      {({ insert, remove, push }) => (
        <>
          <div className="flex justify-end items-center text-right mb-2">
            <button
              disabled={!values.employeeId || isdataForRead}
              type="button"
              className="btn btn-primary btn-elevate"
              onClick={() =>
                push({
                  masterChecklistId: null,
                  departmentId: "",
                  taskName: "",
                  taskDescription: "",
                  attachment: null,
                  attachmentPath: null,
                  responsibleEmployeeId: "",
                  taskStatus: "", // NO DEFAULT - EMPTY
                  returnableAssets: false,
                  completionDate: "",
                  remarks: "",
                  sno: "",
                  isEmailSend: false,
                  isFromMasterChecklist: false,
                  originalTaskStatus: "",
                })
              }
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <th style={{ width: columnWidths.sno }}>S.No.</th>
                    <th style={{ width: columnWidths.department }}>
                      Department<span style={{ color: "red" }}>*</span>
                    </th>
                    <th style={{ width: columnWidths.taskName }}>
                      Task Name<span style={{ color: "red" }}>*</span>
                    </th>
                    <th style={{ width: columnWidths.taskDescription }}>
                      Task Description
                    </th>
                    <th style={{ width: columnWidths.attachment }}>
                      Attachment
                    </th>
                    <th style={{ width: columnWidths.responsibleEmployee }}>
                      Assign to Employee<span style={{ color: "red" }}>*</span>
                    </th>
                    <th style={{ width: columnWidths.returnableAssets }}>
                      Returnable Assets
                    </th>
                    <th style={{ width: columnWidths.taskStatus }}>
                      Task Status
                    </th>
                    <th style={{ width: columnWidths.completionDate }}>
                      Completion Date
                    </th>
                    <th style={{ width: columnWidths.remarks }}>Remarks</th>
                    <th
                      style={{ width: columnWidths.action }}
                      className="text-right"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(values.list || []).length > 0 ? (
                    values.list.map((row, index) => {
                      // Filter task status options based on original status
                      const filteredTaskStatusOptions =
                        row.originalTaskStatus === "Completed"
                          ? taskStatusOptions.filter(
                            (opt) => opt.value === "Completed",
                          )
                          : taskStatusOptions;

                      return (
                        <tr key={index}>
                          <td style={{ width: columnWidths.sno }}>
                            <Field
                              name={`list[${index}].sno`}
                              value={index + 1}
                              disabled
                              className="form-control"
                            />
                          </td>

                          <td style={{ width: columnWidths.department }}>
                            <SearchSelect
                              name={`list[${index}].departmentId`}
                              isDisabled={
                                isdataForRead || row.isFromMasterChecklist
                              }
                              options={dashboard.allDept || []}
                              value={
                                dashboard.allDept?.find(
                                  (opt) => opt.value === row.departmentId,
                                ) || null
                              }
                              onChange={(selected) => {
                                setFieldValue(
                                  `list[${index}].departmentId`,
                                  selected?.value || "",
                                );
                                setFieldValue(
                                  `list[${index}].responsibleEmployeeId`,
                                  "",
                                );
                              }}
                              placeholder="Select Department"
                            />
                            {touched?.list?.[index]?.departmentId &&
                              errors?.list?.[index]?.departmentId && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {errors.list[index].departmentId}
                                </div>
                              )}
                          </td>

                          <td style={{ width: columnWidths.taskName }}>
                            <Field
                              name={`list[${index}].taskName`}
                              placeholder="Enter Task"
                              value={row.taskName || ""}
                              disabled={
                                isdataForRead || row.isFromMasterChecklist
                              }
                              className="form-control"
                            />
                            {touched?.list?.[index]?.taskName &&
                              errors?.list?.[index]?.taskName && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {errors.list[index].taskName}
                                </div>
                              )}
                          </td>

                          <td style={{ width: columnWidths.taskDescription }}>
                            <Field
                              name={`list[${index}].taskDescription`}
                              placeholder="Enter.."
                              value={row.taskDescription || ""}
                              disabled={
                                isdataForRead || row.isFromMasterChecklist
                              }
                              className="form-control"
                            />
                          </td>

                          <td style={{ width: columnWidths.attachment }}>
                            {!row.attachmentPath &&
                              !row.attachment &&
                              !isdataForRead &&
                              !row.isFromMasterChecklist && (
                                <FileUpload
                                  id={`file_input_employee_${index}`} // FIXED: Add unique ID
                                  name={`list[${index}].attachment`} // FIXED: Add unique name
                                  type="file"
                                  className="form-control"
                                  disabled={
                                    isdataForRead || row.isFromMasterChecklist
                                  }
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      setFieldValue(
                                        `list[${index}].attachment`,
                                        file,
                                      );
                                    }
                                  }}
                                  label={null}
                                />
                              )}

                            {(row.attachmentPath || row.attachment) && (
                              <a
                                href={
                                  row.attachment instanceof File
                                    ? URL.createObjectURL(row.attachment)
                                    : getUploadUrl(row.attachmentPath)
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline line-clamp-1"
                                style={{ fontSize: "12px" }}
                              >
                                {row.attachment instanceof File
                                  ? row.attachment.name
                                  : getFileName(row.attachmentPath)}
                              </a>
                            )}
                          </td>

                          <td
                            style={{ width: columnWidths.responsibleEmployee }}
                          >
                            <SearchSelect
                              name={`list[${index}].responsibleEmployeeId`}
                              isDisabled={isdataForRead || !row.departmentId}
                              options={dashboard.allEmployeesWithNoPermissionList?.filter(
                                (emp) =>
                                  emp.departmentId === row.departmentId &&
                                  emp.value !== values.employeeId,
                              )}
                              value={
                                dashboard.allEmployeesWithNoPermissionList?.find(
                                  (emp) =>
                                    emp.value === row.responsibleEmployeeId,
                                ) || null
                              }
                              onChange={(selected) =>
                                setFieldValue(
                                  `list[${index}].responsibleEmployeeId`,
                                  selected?.value || "",
                                )
                              }
                              placeholder="Select Employee"
                            />
                            {touched?.list?.[index]?.responsibleEmployeeId &&
                              errors?.list?.[index]?.responsibleEmployeeId && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {errors.list[index].responsibleEmployeeId}
                                </div>
                              )}
                          </td>

                          <td style={{ width: columnWidths.returnableAssets }}>
                            <input
                              type="checkbox"
                              name={`list[${index}].returnableAssets`}
                              checked={row.returnableAssets || false}
                              onChange={(e) =>
                                setFieldValue(`list[${index}].returnableAssets`, e.target.checked)
                              }
                              disabled={isdataForRead || isApproved === 1}
                            />
                          </td>

                          <td style={{ width: columnWidths.taskStatus }}>
                            <SearchSelect
                              name={`list[${index}].taskStatus`}
                              isDisabled={isdataForRead || isApproved === 1}
                              options={filteredTaskStatusOptions}
                              value={
                                filteredTaskStatusOptions.find(
                                  (opt) => opt.value === row.taskStatus,
                                ) || null
                              }
                              onChange={(selected) => {
                                setFieldValue(
                                  `list[${index}].taskStatus`,
                                  selected.value,
                                );

                                // Clear completion date if status changes away from "Completed"
                                if (selected.value !== "Completed") {
                                  setFieldValue(
                                    `list[${index}].completionDate`,
                                    "",
                                  );
                                }
                              }}
                              placeholder="Select Status"
                            />
                          </td>

                          <td style={{ width: columnWidths.completionDate }}>
                            <DatePicker
                              className="form-control"
                              placeholderText="Select Date"
                              disabled={
                                isdataForRead || row.taskStatus !== "Completed"
                              }
                              selected={
                                row.completionDate
                                  ? new Date(row.completionDate)
                                  : null
                              }
                              onChange={(date) =>
                                setFieldValue(
                                  `list[${index}].completionDate`,
                                  formatDates(date, "yyyy-MM-dd"),
                                )
                              }
                              dateFormat="dd-MMM-yyyy"
                            />
                            {touched?.list?.[index]?.completionDate &&
                              errors?.list?.[index]?.completionDate && (
                                <div
                                  className="text-danger"
                                  style={{ fontSize: "12px" }}
                                >
                                  {errors.list[index].completionDate}
                                </div>
                              )}
                          </td>

                          <td style={{ width: columnWidths.remarks }}>
                            <Field
                              name={`list[${index}].remarks`}
                              value={row.remarks || ""}
                              disabled={isdataForRead}
                              onChange={(e) =>
                                setFieldValue(
                                  `list[${index}].remarks`,
                                  e.target.value,
                                )
                              }
                              className="form-control"
                              placeholder="Remarks"
                            />
                          </td>

                          <td
                            style={{ width: columnWidths.action }}
                            className="text-right"
                          >
                            {!isdataForRead && !row.isFromMasterChecklist && (
                              <button
                                type="button"
                                className="border-none bg-transparent"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        No tasks added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </FieldArray>
  );
}

export default PatternListForm;
