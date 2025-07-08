import { Field, FieldArray } from 'formik'
import React from 'react'
import { Checkbox, Input, Select } from '../../../../../../_metronic/_partials/controls'
import CustomErrorLabel from '../../../../../utils/common-modules/CustomErrorLabel';
import CustomDropdown from '../../../../../utils/common-modules/CustomDropdown';

function LeaveTypePolicyTable({ values, setFieldValue, createDropdown, errors, touched, dropdownData, handleDelete, allLeaveTypeMap }) {
  return (
    <>
      <h6>Leave Type Policies</h6>
      <FieldArray name="leavetypePolicies">
        {({ insert, remove, push }) => (
          <>
            {/* Table Starts */}
            <table className="table table-hover">
              <thead>
                <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                  <td>Action</td>
                  <td>Leave Type</td>
                  <td>Entitled Days</td>
                  <td>Entitle At</td>
                  <td>Encashable</td>
                  <td>Carry Forwardable</td>
                  <td>Attachment Required</td>
                  <td>Gender</td>
                  {/* <td>Minimum Experience (Years)</td> */}
                  {/* <td>Marital Status</td> */}
                </tr>
              </thead>
              <tbody>
                {values.leavetypePolicies.map((row, index) => (
                  <tr key={index}>
                    {/* Row Starts */}

                    {/* Delete Button Starts */}
                    <td>
                      <button type="button" className="btn btn-danger btn-elevate" onClick={() => {
                        handleDelete('LeaveTypePolicyTable', values?.leavetypePolicies?.[index]?.Id, remove, index)
                      }}>
                        Delete
                      </button>
                    </td>
                    {/* Delete Button Ends */}

                    {/* Leave Type Field Starts */}
                    <td>
                      <Field
                        name={`leavetypePolicies[${index}].leaveType`}
                        component={Select}
                        className={errors.leavetypePolicies?.[index]?.leaveType && touched.leavetypePolicies?.[index]?.leaveType ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                          setFieldValue(
                            `leavetypePolicies[${index}].leaveType`,
                            value
                          )
                          const leaveType = allLeaveTypeMap.get(value)?.type;
                          if(leaveType != 1){
                            setFieldValue(`leavetypePolicies[${index}].encashable`, false);
                            setFieldValue(`leavetypePolicies[${index}].carryForwardable`, false);
                          }
                        }}
                        value={row.leaveType}
                        children={createDropdown(dropdownData.allLeaveTypes || [], values?.leavetypePolicies)}
                      />
                      {errors.leavetypePolicies?.[index]?.leaveType &&
                        touched.leavetypePolicies?.[index]?.leaveType &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.leaveType} />
                      }
                    </td>
                    {/* Leave Type Field Ends */}

                    {/* Entitle Days Field Starts */}
                    <td>
                      <Field
                        name={`leavetypePolicies[${index}].maxAllowed`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leavetypePolicies?.[index]?.maxAllowed && touched.leavetypePolicies?.[index]?.maxAllowed ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].maxAllowed`,
                            e.target.value
                          )
                        }}
                        value={row.maxAllowed}
                      />
                      {errors.leavetypePolicies?.[index]?.maxAllowed &&
                        touched.leavetypePolicies?.[index]?.maxAllowed &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.maxAllowed} />
                      }
                    </td>
                    {/* Entitle Days Field Ends */}

                    {/* Entitle At Field Starts */}
                    <td>
                      <Field
                        name={`leavetypePolicies[${index}].entitledAt`}
                        component={Select}
                        className={errors.leavetypePolicies?.[index]?.entitledAt && touched.leavetypePolicies?.[index]?.entitledAt ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                          setFieldValue(
                            `leavetypePolicies[${index}].entitledAt`,
                            value
                          )
                        }}
                        value={row.entitledAt}
                        children={CustomDropdown({ data: dropdownData.allEntitlementEvents, firstElement: { label: '--Select--', value: null } })}
                        disabled={!Boolean(allLeaveTypeMap?.get(row?.leaveType || '')?.type == 1)}
                      />
                      {errors.leavetypePolicies?.[index]?.entitledAt &&
                        touched.leavetypePolicies?.[index]?.entitledAt &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.entitledAt} />
                      }
                    </td>
                    {/* Entitle At Field Ends */}

                    {/* Encashable Field Starts */}
                    <td>
                        <div className="d-flex align-items-center">
                           <div className="mr-3">
                      <input
                        name={`leavetypePolicies[${index}].encashable`}
                        type="checkbox"
                        // component={Checkbox}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].encashable`,
                            e.target.checked
                          )
                        }}
                        checked={row.encashable}
                        disabled={!Boolean(allLeaveTypeMap?.get(row?.leaveType || '')?.type == 1)}
                         style={'white' ? { width: '20px', height: '20px' } : {}}
                      />
                      </div>
                      <Field
                        name={`leavetypePolicies[${index}].encashableCount`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leavetypePolicies?.[index]?.encashableCount && touched.leavetypePolicies?.[index]?.encashableCount ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].encashableCount`,
                            e.target.value
                          )
                        }}
                        value={Boolean(row.encashable) ? row.encashableCount : ''}
                        disabled={!Boolean(row.encashable)}
                      />
                      {errors.leavetypePolicies?.[index]?.encashableCount &&
                        touched.leavetypePolicies?.[index]?.encashableCount &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.encashableCount} />
                      }
                      </div>
                    </td>
                    {/* Encashable Field End */}

                    {/* Carry Forwardable Field Starts */}
                    <td>
                             <div className="d-flex align-items-center">
                                  <div className="mr-3">
                      <input
                        type="checkbox"
                        name={`leavetypePolicies[${index}].carryForwardable`}
                        // component={Checkbox}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].carryForwardable`,
                            e.target.checked
                          )
                        }}
                        checked={row.carryForwardable}
                        disabled={!Boolean(allLeaveTypeMap?.get(row?.leaveType || '')?.type == 1)}
                         style={'white' ? { width: '20px', height: '20px' } : {}}
                    
                      />
                        </div>
                      <Field
                        name={`leavetypePolicies[${index}].carryForwardableCount`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leavetypePolicies?.[index]?.carryForwardableCount && touched.leavetypePolicies?.[index]?.carryForwardableCount ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].carryForwardableCount`,
                            e.target.value
                          )
                        }}
                        value={Boolean(row.carryForwardable) ? row.carryForwardableCount : ''}
                        disabled={!Boolean(row.carryForwardable)}
                      />
                      {errors.leavetypePolicies?.[index]?.carryForwardableCount &&
                        touched.leavetypePolicies?.[index]?.carryForwardableCount &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.carryForwardableCount} />
                      }
                      </div>
                    </td>
                    {/* Carry Forwardable Field End */}

                    {/* Attachement Required Field Starts */}
                    <td>
                      <input
                        type="checkbox"
                        // component={Checkbox}
                        name={`leavetypePolicies[${index}].attachmentRequired`}
                        component={Checkbox}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].attachmentRequired`,
                            e.target.checked
                          )
                        }}
                        checked={row.attachmentRequired}
                            disabled={!Boolean(allLeaveTypeMap?.get(row?.leaveType || '')?.type == 1)}
                         style={'white' ? { width: '20px', height: '20px' } : {}}
                  
                      />
                    </td>
                    {/* Attachement Required Field End */}

                    {/* Gender Field Starts */}
                    <td>
                      <Field
                        name={`leavetypePolicies[${index}].gender`}
                        component={Select}
                        className={errors.leavetypePolicies?.[index]?.gender && touched.leavetypePolicies?.[index]?.gender ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == 'All' ? null : Number(e.target.value)
                          setFieldValue(
                            `leavetypePolicies[${index}].gender`,
                            value
                          )
                        }}
                        value={row.gender}
                        children={CustomDropdown({ data: dropdownData.allGenderList, firstElement: { label: 'All', value: null } })}
                      />
                      {errors.leavetypePolicies?.[index]?.gender &&
                        touched.leavetypePolicies?.[index]?.gender &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.gender} />
                      }
                    </td>
                    {/* Gender Field Ends */}

                    {/* This field will be used later that's why disabled for now */}
                    {/* Min Experience Field Starts */}
                    {/* <td>
                      <Field
                        name={`leavetypePolicies[${index}].minExp`}
                        component={Input}
                        type="number"
                        min="0"
                        className={errors.leavetypePolicies?.[index]?.minExp && touched.leavetypePolicies?.[index]?.minExp ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setFieldValue(
                            `leavetypePolicies[${index}].minExp`,
                            e.target.value
                          )
                        }}
                        value={row.minExp}
                      />
                      {errors.leavetypePolicies?.[index]?.minExp &&
                        touched.leavetypePolicies?.[index]?.minExp &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.minExp} />
                      }
                    </td> */}
                    {/* Min Experience Field Ends */}
                    {/* This field will be used later that's why disabled for now */}

                    {/* This field will be used later that's why disabled for now */}
                    {/* Marital Status Field Starts */}
                    {/* <td>
                      <Field
                        name={`leavetypePolicies[${index}].maritalStatus`}
                        component={Select}
                        className={errors.leavetypePolicies?.[index]?.maritalStatus && touched.leavetypePolicies?.[index]?.maritalStatus ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          const value = e.target.value == 'All' ? null : Number(e.target.value)
                          setFieldValue(
                            `leavetypePolicies[${index}].maritalStatus`,
                            value
                          )
                        }}
                        value={row.maritalStatus}
                        children={CustomDropdown({ data: dropdownData.allMaritalStatus, firstElement: { label: 'All', value: null } })}
                      />
                      {errors.leavetypePolicies?.[index]?.maritalStatus &&
                        touched.leavetypePolicies?.[index]?.maritalStatus &&
                        <CustomErrorLabel touched={true} error={errors.leavetypePolicies?.[index]?.maritalStatus} />
                      }
                    </td> */}
                    {/* Marital Status Field Ends */}
                    {/* This field will be used later that's why disabled for now */}

                    {/* Row Starts */}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Table Ends */}

            {/* Add button Field Starts */}
            {values.subsidiaryId && /* values.gradeId && values.employeeTypeId &&*/ <button
              type="button"
              className="btn btn-primary btn-elevate"
              onClick={() =>
                push({
                  leaveType: "",
                  gender: null,
                  entitledAt: null,
                  minExp: "",
                  maxAllowed: "",
                  attachmentRequired: false,
                  encashable: false,
                  encashableCount: "",
                  carryForwardable: false,
                  carryForwardableCount: "",
                  maritalStatus: null,
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

export default LeaveTypePolicyTable