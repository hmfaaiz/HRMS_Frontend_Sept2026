import { Field, FieldArray } from 'formik'
import React from 'react'
import { Input, Select } from '../../../../../../_metronic/_partials/controls'
import CustomErrorLabel from '../../../../../utils/common-modules/CustomErrorLabel';
import CustomDropdown from '../../../../../utils/common-modules/CustomDropdown';

function LeaveTypeSalaryDeductionTable({ values, setFieldValue, createDropdown, errors, touched, dropdownData, handleDelete }) {
  return (
    <>
      <h6>Leave Type Salary Deduction Policies</h6>
      <FieldArray name="leaveTypeSalaryDeductionPolicies">
        {({ insert, remove, push }) => (
          <>
            {/* Table Starts */}
            <table className="table table-hover">
              <thead>
                <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                  <td>Action</td>
                  <td>Leave Type</td>
                  <td>Min Leave</td>
                  <td>Max Leave</td>
                  <td>Deduction %</td>
                  <td>Leave Status</td>
                </tr>
              </thead>
              <tbody>
                {values.leaveTypeSalaryDeductionPolicies.map((row, index) => (
                  <tr key={index}>
                    {/* Row Starts */}

                    {/* Delete Button Starts */}
                    <td>
                      <button type="button" className="btn btn-danger btn-elevate" onClick={() => {
                        handleDelete('LeaveTypeSalaryDeductionTable', values?.leaveTypeSalaryDeductionPolicies?.[index]?.Id, remove, index)
                      }}>
                        Delete
                      </button>
                    </td>
                    {/* Delete Button Ends */}

                    {/* Leave Type Field Starts */}
                    <td>
                      <Field
                        name={`leaveTypeSalaryDeductionPolicies[${index}].leaveType`}
                        component={Select}
                        className={errors.leaveTypeSalaryDeductionPolicies?.[index]?.leaveType && touched.leaveTypeSalaryDeductionPolicies?.[index]?.leaveType ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : e.target.value
                          setFieldValue(
                            `leaveTypeSalaryDeductionPolicies[${index}].leaveType`,
                            value
                          )
                        }}
                        value={row.leaveType}
                        children={createDropdown(dropdownData.allLeaveTypes || [], values?.leaveTypeSalaryDeductionPolicies)}
                      />
                      {errors.leaveTypeSalaryDeductionPolicies?.[index]?.leaveType &&
                        touched.leaveTypeSalaryDeductionPolicies?.[index]?.leaveType &&
                        <CustomErrorLabel touched={true} error={errors.leaveTypeSalaryDeductionPolicies?.[index]?.leaveType} />
                      }
                    </td>
                    {/* Leave Type Field Ends */}

                    {/* Min Leave Field Starts */}
                    <td>
                      <Field
                        name={`leaveTypeSalaryDeductionPolicies[${index}].minLeave`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leaveTypeSalaryDeductionPolicies?.[index]?.minLeave && touched.leaveTypeSalaryDeductionPolicies?.[index]?.minLeave ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leaveTypeSalaryDeductionPolicies[${index}].minLeave`,
                            e.target.value
                          )
                        }}
                        value={row.minLeave}
                      />
                      {errors.leaveTypeSalaryDeductionPolicies?.[index]?.minLeave &&
                        touched.leaveTypeSalaryDeductionPolicies?.[index]?.minLeave &&
                        <CustomErrorLabel touched={true} error={errors.leaveTypeSalaryDeductionPolicies?.[index]?.minLeave} />
                      }
                    </td>
                    {/* Min Leave Field Ends */}

                    {/* Max Leave Field Starts */}
                    <td>
                      <Field
                        name={`leaveTypeSalaryDeductionPolicies[${index}].maxLeave`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leaveTypeSalaryDeductionPolicies?.[index]?.maxLeave && touched.leaveTypeSalaryDeductionPolicies?.[index]?.maxLeave ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leaveTypeSalaryDeductionPolicies[${index}].maxLeave`,
                            e.target.value
                          )
                        }}
                        value={row.maxLeave}
                      />
                      {errors.leaveTypeSalaryDeductionPolicies?.[index]?.maxLeave &&
                        touched.leaveTypeSalaryDeductionPolicies?.[index]?.maxLeave &&
                        <CustomErrorLabel touched={true} error={errors.leaveTypeSalaryDeductionPolicies?.[index]?.maxLeave} />
                      }
                    </td>
                    {/* Max Leave Field Ends */}

                    {/* Deduction Field Starts */}
                    <td>
                      <Field
                        name={`leaveTypeSalaryDeductionPolicies[${index}].deduction`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leaveTypeSalaryDeductionPolicies?.[index]?.deduction && touched.leaveTypeSalaryDeductionPolicies?.[index]?.deduction ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leaveTypeSalaryDeductionPolicies[${index}].deduction`,
                            e.target.value
                          )
                        }}
                        value={row.deduction}
                      />
                      {errors.leaveTypeSalaryDeductionPolicies?.[index]?.deduction &&
                        touched.leaveTypeSalaryDeductionPolicies?.[index]?.deduction &&
                        <CustomErrorLabel touched={true} error={errors.leaveTypeSalaryDeductionPolicies?.[index]?.deduction} />
                      }
                    </td>
                    {/* Deduction Field Ends */}

                    {/* Leave status Field Starts */}
                    <td>
                      <Field
                        name={`leaveTypeSalaryDeductionPolicies[${index}].leaveStatus`}
                        component={Select}
                        className={errors.leaveTypeSalaryDeductionPolicies?.[index]?.leaveStatus && touched.leaveTypeSalaryDeductionPolicies?.[index]?.leaveStatus ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == 'All' ? null : e.target.value
                          setFieldValue(
                            `leaveTypeSalaryDeductionPolicies[${index}].leaveStatus`,
                            value
                          )
                        }}
                        value={row.leaveStatus}
                        children={CustomDropdown({ data: dropdownData.allLeaveStatus, firstElement: { label: 'All', value: null } })}
                      />
                      {errors.leaveTypeSalaryDeductionPolicies?.[index]?.leaveStatus &&
                        touched.leaveTypeSalaryDeductionPolicies?.[index]?.leaveStatus &&
                        <CustomErrorLabel touched={true} error={errors.leaveTypeSalaryDeductionPolicies?.[index]?.leaveStatus} />
                      }
                    </td>
                    {/* Leave status Field Ends */}

                    {/* Row Ends */}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Table Ends */}

            {/* Add Button Field Starts */}
            {values.subsidiaryId /*&& values.gradeId && values.employeeTypeId*/ && <button
              type="button"
              className="btn btn-primary btn-elevate"
              onClick={() =>
                push({
                  leaveType: "",
                  minLeave: "",
                  maxLeave: "",
                  deduction: "",
                  leaveStatus: null,
                })
              }
            >
              + Add Row
            </button>}
            {/* Add Button Field Ends */}
          </>
        )}
      </FieldArray></>
  )
}

export default LeaveTypeSalaryDeductionTable