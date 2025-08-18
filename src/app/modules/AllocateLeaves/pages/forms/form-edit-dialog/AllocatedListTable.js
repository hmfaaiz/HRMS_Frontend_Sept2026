import { Field, FieldArray } from 'formik'
import React from 'react'
import { Input, Select } from '../../../../../../_metronic/_partials/controls'
import CustomErrorLabel from '../../../../../utils/common-modules/CustomErrorLabel';
import CustomDropdown from '../../../../../utils/common-modules/CustomDropdown';

function AllocatedListTable({ values, setFieldValue, errors, touched, dropdownData, handleDelete, accessUser }) {
  return (
    <>
      <h6>Allocated Leaves List</h6>
      <FieldArray name="list">
        {({ insert, remove, push }) => (
          <>
            {/* Table Starts */}
            <table className="table table-hover">
              <thead>
                <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                  <td>Leave Type</td>
                  <td>Leave Count</td>
                  <td>CARRY FORWARD/ENCASHMENT</td>
                  <td>Max Count</td>
                </tr>
              </thead>
              <tbody>
                {values.list.map((row, index) => (
                  <tr key={index}>
                    {/* Row Starts */}

                    {/* Leave Type Field Starts */}
                    <td>
                      <Field
                        name={`list[${index}].leaveType`}
                        component={Select}
                        className={errors.list?.[index]?.leaveType && touched.list?.[index]?.leaveType ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : Number(e.target.value)
                          setFieldValue(
                            `list[${index}].leaveType`,
                            value
                          )
                        }}
                        value={row.leaveType}
                        children={CustomDropdown({ data: dropdownData.allLeaveTypes, leaveTypData: values?.list})}
                      />
                      {errors.list?.[index]?.leaveType &&
                        touched.list?.[index]?.leaveType &&
                        <CustomErrorLabel touched={true} error={errors.list?.[index]?.leaveType} />
                      }
                    </td>
                    {/* Leave Type Field Ends */}

                    {/* Leave Count Field Starts */}
                    <td>
                      <Field
                        name={`list[${index}].leaveCount`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.list?.[index]?.leaveCount && touched.list?.[index]?.leaveCount ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `list[${index}].leaveCount`,
                            e.target.value
                          )
                        }}
                        value={row.leaveCount}
                      />
                      {errors.list?.[index]?.leaveCount &&
                        touched.list?.[index]?.leaveCount &&
                        <CustomErrorLabel touched={true} error={errors.list?.[index]?.leaveCount} />
                      }
                    </td>
                    {/* Leave Count Field Ends */}

                    {/* Policy Type Field Starts */}
                    <td>
                      <Field
                        name={`list[${index}].policyType`}
                        component={Select}
                        className={errors.list?.[index]?.policyType && touched.list?.[index]?.policyType ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : Number(e.target.value)
                          setFieldValue(
                            `list[${index}].policyType`,
                            value
                          )
                        }}
                        value={row.policyType}
                        // children={createDropdown(dropdownData?.allPolicyType || [])}
                        children={CustomDropdown({ data: dropdownData.allPolicyType, firstElement: { label: 'Select', value: null } })}
                      />
                      {errors.list?.[index]?.policyType &&
                        touched.list?.[index]?.policyType &&
                        <CustomErrorLabel touched={true} error={errors.list?.[index]?.policyType} />
                      }
                    </td>
                    {/* Policy Type Field Ends */}

                    {/* Max Count Field Starts */}
                    <td>
                      <Field
                        name={`list[${index}].maxCount`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.list?.[index]?.maxCount && touched.list?.[index]?.maxCount ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `list[${index}].maxCount`,
                            e.target.value
                          )
                        }}
                        value={row.maxCount}
                      />
                      {errors.list?.[index]?.maxCount &&
                        touched.list?.[index]?.maxCount &&
                        <CustomErrorLabel touched={true} error={errors.list?.[index]?.maxCount} />
                      }
                    </td>
                    {/* Max Count Field Ends */}
                  
                    {/* Row Starts */}
                  </tr>
                ))}
              </tbody>
            </table>
             {/* Table Ends */}

            {/* Add button Field Starts */}
           {values.subsidiaryId && values.cycleTypeId && values.yearId && accessUser && <button
              type="button"
              onClick={() =>
                push({
                  leaveType: '',
                  leaveCount: '',
                  policyType: '',
                  maxCount: '',
                })
              }
            >
              + Add Row
            </button>}
            {/* Add button Field Ends */}
          </>
        )}
      </FieldArray></>
  )
}

export default AllocatedListTable