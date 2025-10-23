import { Field, FieldArray } from "formik";
import React, { useEffect } from "react";
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
  isdataForRead, clearanceDate,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
  }, [dispatch]);


  useEffect(() => {
    values.list.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list, setFieldValue]);

  const clearanceProvidedOptions = [

    { value: 1, label: 'Yes' },
    { value: 0, label: 'No' },
    { value: 2, label: 'Not Required' },
  ]


  useEffect(() => {

    dispatch(
      fetchAllEmployeesWithNoPermissionData(
        "allEmployeesWithNoPermissionList"
      )
    );




  }, [dispatch, values?.employeeId]);

  return (
    <>
      <FieldArray name="list">
        {({ insert, remove, push }) => (
          <>
            <div className="flex justify-end items-center text-right ">

              {/* {!isdataForRead && values?.list.length < 31 && ( */}
              <button
                disabled={!values.employeeId}
                type="button"
                className="btn btn-primary btn-elevate text-right"
                onClick={() =>
                  push({
                    departmentId: "",
                    approverEmployeeId: "",
                    designationId: "",
                    isClearanceProvided: "",
                    sno: "",
                    clearanceDate: "",
                  })
                }
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3 " />{" "}
                Add
              </button>
              {/* )} */}
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <td className="w-[5px]">S.No.</td>
                      <td className="w-[200px]">Department</td>
                      <td className="w-[200px]">Employee</td>
                      <td className="w-[200px]">Designation</td>
                      <td className="w-[200px]">Clearance Provided</td>
                      <td className="w-[100px]">Clearance Date</td>
                      <td className="text-right">Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {values?.list?.map((row, index) => (
                      <tr key={index}>
                        {/* Row Starts */}

                        <td>
                          <Field
                            name={`list[${index}].sno`}
                            value={index + 1}
                            type="number"
                            className="form-control"
                            style={{ width: "100px" }}

                            disabled
                          />
                          {errors.list?.[index]?.sno &&
                            touched.list?.[index]?.sno && (
                              <div className="text-danger">
                                {errors.list[index].sno}
                              </div>
                            )}
                        </td>

                        {/* <td>
                          <SearchSelect
                            name={`list[${index}].departmentId`}
                            className={
                              errors.list?.[index]?.departmentId && touched.list?.[index]?.departmentId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            isDisabled={isdataForRead}
                            options={dashboard?.allDept || []}
                            value={
                              dashboard?.allDept?.find(
                                (option) => option?.value === values?.list?.[index]?.departmentId
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              // if SearchSelect returns the full object { value, label }
                              const value = selectedOption ? selectedOption.value : "";
                              setFieldValue(`list[${index}].departmentId`, value);
                              setFieldValue(`list[${index}].approverEmployeeId`, "");
                              setFieldValue(`list[${index}].designationId`, "");

                            }}
                            placeholder="Select Department"
                          />

                       
                          {errors?.list?.[index]?.departmentId && touched?.list?.[index]?.departmentId && (
                            <div className="invalid-feedback">
                              {errors.list[index].departmentId}
                            </div>
                          )}
                        </td> */}


                        <td>
                          <SearchSelect
                            name={`list[${index}].departmentId`}
                            className={
                              errors.list?.[index]?.departmentId && touched.list?.[index]?.departmentId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            isDisabled={isdataForRead || values.list?.[index]?.isFromDesignationMap}
                            options={
                              (dashboard?.allDept || []).filter((dept) => {
                                // already selected departments (excluding current row)
                                const selectedDepts = values.list
                                  ?.filter((_, i) => i !== index)
                                  ?.map((item) => item.departmentId)
                                  ?.filter(Boolean);

                                return !selectedDepts.includes(dept.value);
                              })
                            }
                            value={
                              dashboard?.allDept?.find(
                                (option) => option?.value === values?.list?.[index]?.departmentId
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              const value = selectedOption ? selectedOption.value : "";
                              setFieldValue(`list[${index}].departmentId`, value);
                              setFieldValue(`list[${index}].approverEmployeeId`, "");
                              setFieldValue(`list[${index}].designationId`, "");

                            }}
                            placeholder="Select Department"
                          />

                          {/* Error message */}
                          {errors?.list?.[index]?.departmentId && touched?.list?.[index]?.departmentId && (
                            <div className="invalid-feedback">
                              {errors.list[index].departmentId}
                            </div>
                          )}
                        </td>


                        <td>
                          <SearchSelect
                            name={`list[${index}].approverEmployeeId`}
                            className={
                              errors.list?.[index]?.approverEmployeeId && touched.list?.[index]?.approverEmployeeId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            isDisabled={isdataForRead || !values.list?.[index]?.departmentId}
                            // options={dashboard?.allEmployeesWithNoPermissionList}
                            options={[
                              { value: null, label: "Select" }, // Adding "All" option with value empty string


                              ...dashboard.allEmployeesWithNoPermissionList.filter(
                                (x) => {


                                  return (
                                    x.departmentId === values.list?.[index]?.departmentId &&
                                    x.value !== values.employeeId
                                  );

                                }
                              ),
                            ]}
                            value={
                              dashboard?.allEmployeesWithNoPermissionList?.find(
                                (option) => option?.value === values?.list?.[index]?.approverEmployeeId
                              ) || null
                            }
                            onChange={(selectedOption) => {

                              const value = selectedOption ? selectedOption.value : "";
                              setFieldValue(`list[${index}].approverEmployeeId`, value);
                              setFieldValue(`list[${index}].designationId`, selectedOption?.designationId);
                            }}
                            placeholder="Select Employee"
                          />

                          {/* Error message */}
                          {errors?.list?.[index]?.approverEmployeeId && touched?.list?.[index]?.approverEmployeeId && (
                            <div className="invalid-feedback">
                              {errors.list[index].approverEmployeeId}
                            </div>
                          )}
                        </td>

                        <td>
                          <SearchSelect
                            name={`list[${index}].designationId`}
                            className={
                              errors.list?.[index]?.designationId && touched.list?.[index]?.designationId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            isDisabled={true}
                            options={dashboard?.allDesignations || []}
                            value={
                              dashboard?.allDesignations?.find(
                                (option) => option?.value === values?.list?.[index]?.designationId
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              // if SearchSelect returns the full object { value, label }
                              const value = selectedOption ? selectedOption.value : "";
                              setFieldValue(`list[${index}].designationId`, value);
                            }}
                            placeholder="Select designation"
                          />

                          {/* Error message */}
                          {errors?.list?.[index]?.designationId && touched?.list?.[index]?.designationId && (
                            <div className="invalid-feedback">
                              {errors.list[index].designationId}
                            </div>
                          )}
                        </td>

                        <td>
                          <SearchSelect
                            name={`list[${index}].isClearanceProvided`}
                            className={
                              errors.list?.[index]?.isClearanceProvided && touched.list?.[index]?.isClearanceProvided
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            isDisabled={isdataForRead || !values.list?.[index]?.departmentId}
                            options={
                              clearanceProvidedOptions?.map(opt =>
                                !values.list?.[index]?.isFromDesignationMap && opt.value === 2
                                  ? { ...opt, isDisabled: true } // ya disabled: true (depend karta hai component pe)
                                  : opt
                              )
                            }
                            value={

                              clearanceProvidedOptions?.find(
                                (option) => option?.value === values?.list?.[index]?.isClearanceProvided
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              // if SearchSelect returns the full object { value, label }
                              const value = selectedOption ? selectedOption.value : "";
                              setFieldValue(`list[${index}].isClearanceProvided`, value);
                              setFieldValue(`list[${index}].clearanceDate`, "");
                            }}
                            placeholder="Select Department"
                          />

                          {/* Error message */}
                          {errors?.list?.[index]?.isClearanceProvided && touched?.list?.[index]?.isClearanceProvided && (
                            <div className="invalid-feedback">
                              {errors.list[index].isClearanceProvided}
                            </div>
                          )}
                        </td>

                        <td className="max-w-18">
                          <DatePicker
                            className="form-control"
                            placeholderText="Select Date"
                            disabled={isdataForRead || values.list?.[index]?.isClearanceProvided != 1}
                            selected={
                              values?.list?.[index]?.clearanceDate
                                ? new Date(values.list[index].clearanceDate)
                                : null
                            }
                            onChange={(date) => {
                              const selectedDate = formatDates(date, "yyyy-MM-dd");
                              setFieldValue(`list[${index}].clearanceDate`, selectedDate);
                            }}
                            dateFormat="dd-MMM-yyyy"
                            name={`list[${index}].clearanceDate`}
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

                          {errors.list?.[index]?.clearanceDate && (
                            <div className="text-danger">{errors.list[index].clearanceDate}</div>
                          )}
                        </td>

                        {
                          !values.list?.[index]?.isFromDesignationMap && (
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
          </>
        )}
      </FieldArray>
    </>
  );
}

export default PatternListForm;
