import { Field, FieldArray } from "formik";
import React, { useEffect } from "react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
    formatDates,
    getUploadUrl,
    getFileName,
} from "../../../../../utils/common";
import { Trash2, View } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import "react-datepicker/dist/react-datepicker.css";
import {
    fetchAllDept,
    fetchAllEmployeesWithNoPermissionData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { fetchEmployeeOnboardingChecklist } from "../../../_redux/redux-Actions";

function OnboardChecklistForm({
    values,
    setFieldValue,
    errors,
    touched,
    isdataForRead,
    isApproved,
}) {

    const dispatch = useDispatch();
    const { dashboard } = useSelector((state) => state);

    const { employeeOnboardingChecklist } = useSelector(
        (state) => state.exit_clearance || {}
    );

    const columnWidths = {
        sno: "5px",
        department: "350px",
        taskName: "300px",
        taskDescription: "500px",
        notRequired: "100px",
        returnDate: "120px",
        remarks: "400px",
        action: "100px",
    };

    // Fetch departments and employees
    useEffect(() => {
        dispatch(fetchAllDept());
        dispatch(
            fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList")
        );
    }, [dispatch]);

    // Auto-update S.No
    useEffect(() => {
        if (values.onboardChecklist && values.onboardChecklist.length > 0) {
            values.onboardChecklist.forEach((_, index) => {
                setFieldValue(`onboardChecklist[${index}].sno`, index + 1);
            });
        }
    }, [values.onboardChecklist, setFieldValue]);
    // Fetch onboarding checklist when employee is selected
    useEffect(() => {
        if (values.employeeId) {
            dispatch(fetchEmployeeOnboardingChecklist(values.employeeId));
        }
    }, [values.employeeId, dispatch]);

    // Populate form when API data arrives
    useEffect(() => {
        if (
            employeeOnboardingChecklist?.list?.length > 0 &&
            employeeOnboardingChecklist?.employeeId === values.employeeId &&
            (!values.onboardChecklist || values.onboardChecklist.length === 0)
        ) {
            const mappedData = employeeOnboardingChecklist.list.map((item, index) => ({
                Id: item.Id,
                sno: index + 1,
                departmentId: item.departmentId,
                taskName: item.taskName,
                taskDescription: item.taskDescription,
                attachmentPath: item.attachmentPath,
                notRequired: item.notRequired || false,
                returnDate: item.assetReturnDate || "",
                remarks: item.assetReturnRemarks || "",
                isFromMasterChecklist: true,
                originalTaskStatus: item.taskStatus,
            }));
            setFieldValue("onboardChecklist", mappedData);
        }
    }, [employeeOnboardingChecklist, setFieldValue, values.employeeId, values.onboardChecklist?.length]);
    return (
        <FieldArray name="onboardChecklist">
            {({ remove }) => (
                <>

                    <div className="w-full overflow-x-auto">
                        <h6 className="font-bold mb-0 text-primary mt-2">
                            Returnable Item
                        </h6>
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
                                        <th style={{ width: columnWidths.notRequired }}>
                                            Not Required
                                        </th>
                                        <th style={{ width: columnWidths.returnDate }}>Return Date</th>
                                        <th style={{ width: columnWidths.remarks }}>Remarks</th>
                                        <th style={{ width: columnWidths.action }} className="text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(values.onboardChecklist || []).length > 0 ? (
                                        values.onboardChecklist.map((row, index) => (
                                            <tr key={index}>
                                                {/* S.No */}
                                                <td style={{ width: columnWidths.sno }}>
                                                    <Field
                                                        name={`onboardChecklist[${index}].sno`}
                                                        value={index + 1}
                                                        disabled
                                                        className="form-control"
                                                    />
                                                </td>

                                                {/* Department */}
                                                <td style={{ width: columnWidths.department }}>
                                                    <SearchSelect
                                                        name={`onboardChecklist[${index}].departmentId`}
                                                        isDisabled={
                                                            isdataForRead || row.isFromMasterChecklist
                                                        }
                                                        options={dashboard.allDept || []}
                                                        value={
                                                            dashboard.allDept?.find(
                                                                (opt) => opt.value === row.departmentId
                                                            ) || null
                                                        }
                                                        onChange={(selected) => {
                                                            setFieldValue(
                                                                `onboardChecklist[${index}].departmentId`,
                                                                selected?.value || ""
                                                            );
                                                        }}
                                                        placeholder="Select Department"
                                                    />
                                                    {touched?.onboardChecklist?.[index]?.departmentId &&
                                                        errors?.onboardChecklist?.[index]?.departmentId && (
                                                            <div className="text-danger" style={{ fontSize: "12px" }}>
                                                                {errors.onboardChecklist[index].departmentId}
                                                            </div>
                                                        )}
                                                </td>

                                                {/* Task Name */}
                                                <td style={{ width: columnWidths.taskName }}>
                                                    <Field
                                                        name={`onboardChecklist[${index}].taskName`}
                                                        placeholder="Enter Task"
                                                        value={row.taskName || ""}
                                                        disabled={
                                                            isdataForRead || row.isFromMasterChecklist
                                                        }
                                                        className="form-control"
                                                    />
                                                    {touched?.onboardChecklist?.[index]?.taskName &&
                                                        errors?.onboardChecklist?.[index]?.taskName && (
                                                            <div className="text-danger" style={{ fontSize: "12px" }}>
                                                                {errors.onboardChecklist[index].taskName}
                                                            </div>
                                                        )}
                                                </td>

                                                {/* Task Description */}
                                                <td style={{ width: columnWidths.taskDescription }}>
                                                    <Field
                                                        name={`onboardChecklist[${index}].taskDescription`}
                                                        placeholder="Enter.."
                                                        value={row.taskDescription || ""}
                                                        disabled={
                                                            isdataForRead || row.isFromMasterChecklist
                                                        }
                                                        className="form-control"
                                                    />
                                                </td>


                                                {/* notRequired Checkbox */}
                                                <td style={{ width: columnWidths.notRequired }}>
                                                    <input
                                                        type="checkbox"
                                                        name={`onboardChecklist[${index}].notRequired`}
                                                        checked={row.notRequired || false}
                                                        onChange={(e) => {
                                                            setFieldValue(
                                                                `onboardChecklist[${index}].notRequired`,
                                                                e.target.checked
                                                            );
                                                            if (e.target.checked) {
                                                                setFieldValue(`onboardChecklist[${index}].returnDate`, "");
                                                                setFieldValue(`onboardChecklist[${index}].remarks`, "");
                                                            }
                                                        }}
                                                        disabled={isdataForRead || isApproved === 1}
                                                    />
                                                </td>

                                                {/* Return Date */}
                                                <td style={{ width: columnWidths.returnDate }}>
                                                    <DatePicker
                                                        className="form-control"
                                                        placeholderText="Select Date"
                                                        disabled={isdataForRead || isApproved === 1 || row.notRequired}
                                                        selected={
                                                            row.returnDate ? new Date(row.returnDate) : null
                                                        }
                                                        onChange={(date) =>
                                                            setFieldValue(
                                                                `onboardChecklist[${index}].returnDate`,
                                                                formatDates(date, "yyyy-MM-dd")
                                                            )
                                                        }
                                                        dateFormat="dd-MMM-yyyy"
                                                    />
                                                    {touched?.onboardChecklist?.[index]?.returnDate &&
                                                        errors?.onboardChecklist?.[index]?.returnDate && (
                                                            <div className="text-danger" style={{ fontSize: "12px" }}>
                                                                {errors.onboardChecklist[index].returnDate}
                                                            </div>
                                                        )}
                                                </td>

                                                {/* Remarks */}
                                                <td style={{ width: columnWidths.remarks }}>
                                                    <Field
                                                        name={`onboardChecklist[${index}].remarks`}
                                                        value={row.remarks || ""}
                                                        disabled={isdataForRead || row.notRequired}
                                                        onChange={(e) =>
                                                            setFieldValue(`onboardChecklist[${index}].remarks`, e.target.value)
                                                        }
                                                        className="form-control"
                                                        placeholder="Remarks"
                                                    />
                                                </td>


                                                {/* Action */}
                                                <td style={{ width: columnWidths.action }} className="text-right">
                                                    {/* {!row.attachmentPath &&
                                                        !row.attachment &&
                                                        !isdataForRead &&
                                                        !row.isFromMasterChecklist && (
                                                            <FileUpload
                                                                id={`file_input_employee_${index}`}
                                                                name={`onboardChecklist[${index}].attachment`}
                                                                type="file"
                                                                className="form-control"
                                                                disabled={
                                                                    isdataForRead || row.isFromMasterChecklist
                                                                }
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        setFieldValue(
                                                                            `onboardChecklist[${index}].attachment`,
                                                                            file
                                                                        );
                                                                    }
                                                                }}
                                                                label={null}
                                                            />
                                                        )} */}

                                                    {(row.attachmentPath || row.attachment) && (
                                                        <a
                                                            href={
                                                                row.attachment instanceof File
                                                                    ? URL.createObjectURL(row.attachment)
                                                                    : getUploadUrl(row.attachmentPath)
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"

                                                        >
                                                            <View className="w-4 h-4 text-black cursor-pointer" />

                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center">
                                                No checklist added
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

export default OnboardChecklistForm;