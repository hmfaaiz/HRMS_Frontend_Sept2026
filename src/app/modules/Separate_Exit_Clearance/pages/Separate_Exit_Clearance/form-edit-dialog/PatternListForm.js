import { Field, FieldArray } from "formik";
import React, { useEffect, useRef } from "react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { formatDates } from "../../../../../utils/common";
import { CirclePlus, Trash2 } from "lucide-react";
import { fetchAllDept, fetchAllEmployeesWithNoPermissionData, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { useDispatch, useSelector } from "react-redux";

import DatePicker from "react-datepicker";

function PatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  isdataForRead,
  clearanceDate,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  // Get the employee patternList from Redux state
  const employeeList = dashboard?.allEmployeesWithNoPermissionList || [];

  // Use ref to track if auto-population has been done
  const hasAutoPopulated = useRef(false);

  useEffect(() => {
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
  }, [dispatch]);

  useEffect(() => {
    values.patternList?.forEach((_, index) => {
      setFieldValue(`patternList[${index}].sno`, index + 1);
    });
  }, [values.patternList, setFieldValue]);

  // Fetch employees when component mounts or when employeeId changes
  useEffect(() => {
    if (values?.employeeId) {
      dispatch(fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList"));
    }
  }, [dispatch, values?.employeeId]);

  // Auto-populate HOD when employee patternList loads or when patternList changes
  useEffect(() => {
    // Only proceed if we have employee data and patternList exists
    if (!employeeList.length || !values.patternList?.length) {
      return;
    }

    // Reset the flag when employeeId changes (new employee selected)
    hasAutoPopulated.current = false;

    let hasChanges = false;

    // Loop through each row and auto-populate HOD where department exists but approver is empty
    const updatedRows = values.patternList.map((row, index) => {
      if (row.departmentId && !row.approverEmployeeId) {
        // Find HOD for this department (hod === 1)
        const hodEmployee = employeeList.find(
          emp => emp.departmentId === row.departmentId && emp.hod === 1 && emp.value !== values.employeeId
        );

        if (hodEmployee) {
          hasChanges = true;
          return {
            ...row,
            approverEmployeeId: hodEmployee.value,
            designationId: hodEmployee.designationId
          };
        }
      }
      return row;
    });

    // Apply all changes at once if any
    if (hasChanges && !hasAutoPopulated.current) {
      setFieldValue('patternList', updatedRows);
      hasAutoPopulated.current = true;
    }
  }, [employeeList, values.patternList, values.employeeId, setFieldValue]);

  const clearanceProvidedOptions = [
    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
    { value: 2, label: 'Not Required' },
  ];

  // Handle manual department change (if user changes department)
  const handleDepartmentChange = (index, selectedOption) => {
    const departmentId = selectedOption ? selectedOption.value : "";
    setFieldValue(`patternList[${index}].departmentId`, departmentId);
    setFieldValue(`patternList[${index}].approverEmployeeId`, "");
    setFieldValue(`patternList[${index}].designationId`, "");

    if (departmentId && employeeList.length) {
      const hodEmployee = employeeList.find(
        emp => emp.departmentId === departmentId && emp.hod === 1 && emp.value !== values.employeeId
      );

      if (hodEmployee) {
        setFieldValue(`patternList[${index}].approverEmployeeId`, hodEmployee.value);
        setFieldValue(`patternList[${index}].designationId`, hodEmployee.designationId);
      }
    }
  };

  return (
    <>
      <FieldArray name="patternList">
        {({ insert, remove, push }) => (
          <>
            <div className="">
              <h6 className="font-bold mb-0 text-primary ">
                Clearance
              </h6>
              <div className="flex justify-end items-center text-right ">

                {/* {!isdataForRead && values?.patternList.length < 31 && ( */}
                <button
                  disabled={!values.employeeId}
                  type="button"
                  className="btn btn-primary btn-elevate text-right"
                  onClick={() => {
                    push({
                      departmentId: "",
                      approverEmployeeId: "",
                      designationId: "",
                      isClearanceProvided: "",
                      // isClearanceProvided: 0,
                      sno: "",
                      clearanceDate: "",
                      remarks: "",
                      isEmailSend: false,
                    });
                  }}
                >
                  <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" /> Add
                </button>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                    <thead>
                      <tr className="custom-table-header">
                        <td className="w-[5px]">S.No.</td>
                        <td className="w-[150px]">Department</td>
                        <td className="w-[180px]">Employee</td>
                        <td className="w-[150px]">Designation</td>
                        <td className="w-[30px]">Clearance Provided</td>
                        <td className="w-[100px]">Clearance Date</td>
                        <td className="w-[350px]">Remarks</td>
                        <td className="text-right">Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {values?.patternList?.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <Field
                              name={`patternList[${index}].sno`}
                              value={index + 1}
                              type="number"
                              className="form-control"
                              style={{ width: "20px" }}
                              disabled
                            />
                            {errors.patternList?.[index]?.sno &&
                              touched.patternList?.[index]?.sno && (
                                <div className="text-danger">
                                  {errors.patternList[index].sno}
                                </div>
                              )}
                          </td>

                          {/* Department */}
                          <td>
                            <SearchSelect
                              name={`patternList[${index}].departmentId`}
                              className={
                                errors.patternList?.[index]?.departmentId && touched.patternList?.[index]?.departmentId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              isDisabled={isdataForRead || values.patternList?.[index]?.isFromDesignationMap}
                              options={
                                (dashboard?.allDept || []).filter((dept) => {
                                  // already selected departments (excluding current row)
                                  const selectedDepts = values.patternList
                                    ?.filter((_, i) => i !== index)
                                    ?.map((item) => item.departmentId)
                                    ?.filter(Boolean);
                                  return !selectedDepts.includes(dept.value);
                                })
                              }
                              value={
                                dashboard?.allDept?.find(
                                  (option) => option?.value === values?.patternList?.[index]?.departmentId
                                ) || null
                              }
                              onChange={(selectedOption) => handleDepartmentChange(index, selectedOption)}
                              placeholder="Select Department"
                            />

                            {/* Error message */}
                            {errors?.patternList?.[index]?.departmentId && (
                              <div className="invalid-feedback">
                                {errors.patternList[index].departmentId}
                              </div>
                            )}
                          </td>


                          <td>
                            <SearchSelect
                              name={`patternList[${index}].approverEmployeeId`}
                              className={
                                errors.patternList?.[index]?.approverEmployeeId && touched.patternList?.[index]?.approverEmployeeId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              isDisabled={isdataForRead || !values.patternList?.[index]?.departmentId}
                              // options={dashboard?.allEmployeesWithNoPermissionList}
                              options={[
                                { value: null, label: "Select" },
                                ...employeeList.filter(
                                  (x) => {


                                    return (
                                      x.departmentId === values.patternList?.[index]?.departmentId &&
                                      x.value !== values.employeeId
                                    );

                                  }
                                ),
                              ]}
                              value={
                                employeeList.find(
                                  (option) => option?.value === values?.patternList?.[index]?.approverEmployeeId
                                ) || null
                              }
                              onChange={(selectedOption) => {

                                const value = selectedOption ? selectedOption.value : "";
                                setFieldValue(`patternList[${index}].approverEmployeeId`, value);
                                setFieldValue(`patternList[${index}].designationId`, selectedOption?.designationId);
                              }}
                              placeholder="Select Employee"
                            />
                            {errors?.patternList?.[index]?.approverEmployeeId && (
                              <div className="invalid-feedback">
                                {errors.patternList[index].approverEmployeeId}
                              </div>
                            )}
                          </td>

                          <td>
                            <SearchSelect
                              name={`patternList[${index}].designationId`}
                              className={
                                errors.patternList?.[index]?.designationId && touched.patternList?.[index]?.designationId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              isDisabled={true}
                              options={dashboard?.allDesignations || []}
                              value={
                                dashboard?.allDesignations?.find(
                                  (option) => option?.value === values?.patternList?.[index]?.designationId
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                // if SearchSelect returns the full object { value, label }
                                const value = selectedOption ? selectedOption.value : "";
                                setFieldValue(`patternList[${index}].designationId`, value);
                              }}
                              placeholder="Select designation"
                            />

                            {/* Error message */}
                            {errors?.patternList?.[index]?.designationId && (
                              <div className="invalid-feedback">
                                {errors.patternList[index].designationId}
                              </div>
                            )}
                          </td>

                          <td>
                            <SearchSelect
                              name={`patternList[${index}].isClearanceProvided`}
                              className={
                                errors.patternList?.[index]?.isClearanceProvided && touched.patternList?.[index]?.isClearanceProvided
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              isDisabled={isdataForRead || !values.patternList?.[index]?.departmentId}
                              options={
                                clearanceProvidedOptions?.map(opt =>
                                  !values.patternList?.[index]?.isFromDesignationMap && opt.value === 2
                                    ? { ...opt, isDisabled: true } // ya disabled: true (depend karta hai component pe)
                                    : opt
                                )
                              }
                              // value={

                              //   clearanceProvidedOptions?.find(
                              //     (option) => option?.value === values?.patternList?.[index]?.isClearanceProvided
                              //   ) || null
                              // }

                              value={
                                clearanceProvidedOptions.find(
                                  (option) => Number(option.value) === Number(values?.patternList?.[index]?.isClearanceProvided)
                                ) || clearanceProvidedOptions.find(opt => opt.value === 0)
                              }
                              onChange={(selectedOption) => {
                                // if SearchSelect returns the full object { value, label }
                                const value = selectedOption ? selectedOption.value : "";
                                setFieldValue(`patternList[${index}].isClearanceProvided`, value);
                                setFieldValue(`patternList[${index}].clearanceDate`, "");
                              }}
                              placeholder="Select Department"
                            />

                            {/* Error message */}
                            {errors?.patternList?.[index]?.isClearanceProvided && (
                              <div className="invalid-feedback">
                                {errors.patternList[index].isClearanceProvided}
                              </div>
                            )}
                          </td>

                          <td className="max-w-18">
                            <DatePicker
                              className="form-control"
                              placeholderText="Select Date"
                              disabled={isdataForRead || values.patternList?.[index]?.isClearanceProvided != 1}
                              selected={
                                values?.patternList?.[index]?.clearanceDate
                                  ? new Date(values.patternList[index].clearanceDate)
                                  : null
                              }
                              onChange={(date) => {
                                const selectedDate = formatDates(date, "yyyy-MM-dd");
                                setFieldValue(`patternList[${index}].clearanceDate`, selectedDate);
                              }}
                              dateFormat="dd-MMM-yyyy"
                              name={`patternList[${index}].clearanceDate`}
                              autoComplete="off"
                              showPopperArrow={false}

                              minDate={
                                clearanceDate?.resignationDate
                                  ? new Date(clearanceDate?.resignationDate)
                                  : new Date()
                              }
                            // maxDate={
                            //   appraisalPeriod?.endDate
                            //     ? new Date(appraisalPeriod?.endDate)
                            //     : new Date()
                            // }

                            />

                            {errors.patternList?.[index]?.clearanceDate && (
                              <div className="text-danger">{errors.patternList[index].clearanceDate}</div>
                            )}
                          </td>

                          <td>
                            <Field
                              name={`patternList[${index}].remarks`}
                              className={
                                errors.patternList?.[index]?.remarks && touched.patternList?.[index]?.remarks
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }



                              onChange={(e) => {


                                setFieldValue(`patternList[${index}].remarks`, e.target.value);
                              }}
                              placeholder="Enter remarks"
                            />

                            {/* Error message */}
                            {errors?.patternList?.[index]?.remarks && (
                              <div className="invalid-feedback">
                                {errors.patternList[index].remarks}
                              </div>
                            )}
                          </td>

                          {
                            !values.patternList?.[index]?.isFromDesignationMap && (
                              <td className="text-right">
                                <button
                                  disabled={isdataForRead}
                                  className="border-none bg-transparent"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                </button>
                              </td>
                            )
                          }


                          {/* )} */}

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </FieldArray>
    </>
  );
}

export default PatternListForm;