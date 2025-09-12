import { Field, FieldArray } from "formik";
import React from "react";
import {
  Checkbox,
  Input,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { CirclePlus, Trash2 } from "lucide-react";

function LeaveTypePolicyTable({
  values,
  setFieldValue,
  createDropdown,
  errors,
  touched,
  dropdownData,
  handleDelete,
  allLeaveTypeMap,
}) {
  return (
    <>
      <FieldArray name="leavetypePolicies">
        {({ insert, remove, push }) => (
          <>
            <div className="flex justify-between items-center">
              <h6 className="font-bold mb-0 text-primary">
                Leave Entitlement Detail{"  "}
              </h6>
              {values.subsidiaryId && (
                /* values.gradeId && values.employeeTypeId &&*/ <button
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
                  <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              )}
            </div>
            {/* Table Starts */}
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <td>Leave Type</td>
                      <td>Entitled Days</td>
                      <td>Entitle At</td>
                      <td>Encashable</td>
                      <td>Carry Forwardable</td>
                      <td>Attachment Required</td>
                      <td>Gender</td>
                      <td className="text-right">Action</td>
                      {/* <td>Minimum Experience (Years)</td> */}
                      {/* <td>Marital Status</td> */}
                    </tr>
                  </thead>
                  <tbody>
                    {values.leavetypePolicies.map((row, index) => (
                      <tr key={index}>
                        {/* Row Starts */}
                        {/* Leave Type Field Starts */}
                        <td className="max-w-48">
                          <Field
                            name={`leavetypePolicies[${index}].leaveType`}
                            component={Select}
                            className={
                              errors.leavetypePolicies?.[index]?.leaveType &&
                              touched.leavetypePolicies?.[index]?.leaveType
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              const value =
                                e.target.value == "Select"
                                  ? ""
                                  : Number(e.target.value);
                              setFieldValue(
                                `leavetypePolicies[${index}].leaveType`,
                                value
                              );
                              const leaveType = allLeaveTypeMap.get(value)
                                ?.type;
                              if (leaveType != 1) {
                                setFieldValue(
                                  `leavetypePolicies[${index}].encashable`,
                                  false
                                );
                                setFieldValue(
                                  `leavetypePolicies[${index}].carryForwardable`,
                                  false
                                );
                              }
                            }}
                            value={row.leaveType}
                            children={createDropdown(
                              dropdownData.allLeaveTypes || [],
                              values?.leavetypePolicies
                            )}
                          />
                          {errors.leavetypePolicies?.[index]?.leaveType &&
                            touched.leavetypePolicies?.[index]?.leaveType && (
                              <CustomErrorLabel
                                touched={true}
                                error={
                                  errors.leavetypePolicies?.[index]?.leaveType
                                }
                              />
                            )}
                        </td>
                        {/* Leave Type Field Ends */}

                        {/* Entitle Days Field Starts */}
                        <td className="max-w-1">
                          <Field
                            name={`leavetypePolicies[${index}].maxAllowed`}
                            component={Input}
                            type="number"
                            min="0"
                            className={
                              errors.leavetypePolicies?.[index]?.maxAllowed &&
                              touched.leavetypePolicies?.[index]?.maxAllowed
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              setFieldValue(
                                `leavetypePolicies[${index}].maxAllowed`,
                                e.target.value
                              );
                            }}
                            value={row.maxAllowed}
                          />
                          {errors.leavetypePolicies?.[index]?.maxAllowed &&
                            touched.leavetypePolicies?.[index]?.maxAllowed && (
                              <CustomErrorLabel
                                touched={true}
                                error={
                                  errors.leavetypePolicies?.[index]?.maxAllowed
                                }
                              />
                            )}
                        </td>
                        {/* Entitle Days Field Ends */}

                        {/* Entitle At Field Starts */}
                        <td className="max-w-48">
                          <Field
                            name={`leavetypePolicies[${index}].entitledAt`}
                            component={Select}
                            className={
                              errors.leavetypePolicies?.[index]?.entitledAt &&
                              touched.leavetypePolicies?.[index]?.entitledAt
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              const value =
                                e.target.value == "Select"
                                  ? ""
                                  : Number(e.target.value);
                              setFieldValue(
                                `leavetypePolicies[${index}].entitledAt`,
                                value
                              );
                            }}
                            value={row.entitledAt}
                            children={CustomDropdown({
                              data: dropdownData.allEntitlementEvents,
                              firstElement: {
                                label: "Select",
                                value: null,
                              },
                            })}
                            disabled={
                              !Boolean(
                                allLeaveTypeMap?.get(row?.leaveType || "")
                                  ?.type == 1
                              )
                            }
                          />
                          {errors.leavetypePolicies?.[index]?.entitledAt &&
                            touched.leavetypePolicies?.[index]?.entitledAt && (
                              <CustomErrorLabel
                                touched={true}
                                error={
                                  errors.leavetypePolicies?.[index]?.entitledAt
                                }
                              />
                            )}
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
                                  );
                                }}
                                checked={row.encashable}
                                disabled={
                                  !Boolean(
                                    allLeaveTypeMap?.get(row?.leaveType || "")
                                      ?.type == 1
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Field
                                name={`leavetypePolicies[${index}].encashableCount`}
                                component={Input}
                                type="number"
                                min="0"
                                className={
                                  errors.leavetypePolicies?.[index]
                                    ?.encashableCount &&
                                  touched.leavetypePolicies?.[index]
                                    ?.encashableCount
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                onChange={(e) => {
                                  setFieldValue(
                                    `leavetypePolicies[${index}].encashableCount`,
                                    e.target.value
                                  );
                                }}
                                value={
                                  Boolean(row.encashable)
                                    ? row.encashableCount
                                    : ""
                                }
                                disabled={!Boolean(row.encashable)}
                              />
                            </div>
                            {errors.leavetypePolicies?.[index]
                              ?.encashableCount &&
                              touched.leavetypePolicies?.[index]
                                ?.encashableCount && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={
                                    errors.leavetypePolicies?.[index]
                                      ?.encashableCount
                                  }
                                />
                              )}
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
                                  );
                                }}
                                checked={row.carryForwardable}
                                disabled={
                                  !Boolean(
                                    allLeaveTypeMap?.get(row?.leaveType || "")
                                      ?.type == 1
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Field
                                name={`leavetypePolicies[${index}].carryForwardableCount`}
                                component={Input}
                                type="number"
                                min="0"
                                className={
                                  errors.leavetypePolicies?.[index]
                                    ?.carryForwardableCount &&
                                  touched.leavetypePolicies?.[index]
                                    ?.carryForwardableCount
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                onChange={(e) => {
                                  setFieldValue(
                                    `leavetypePolicies[${index}].carryForwardableCount`,
                                    e.target.value
                                  );
                                }}
                                value={
                                  Boolean(row.carryForwardable)
                                    ? row.carryForwardableCount
                                    : ""
                                }
                                disabled={!Boolean(row.carryForwardable)}
                              />
                            </div>
                            {errors.leavetypePolicies?.[index]
                              ?.carryForwardableCount &&
                              touched.leavetypePolicies?.[index]
                                ?.carryForwardableCount && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={
                                    errors.leavetypePolicies?.[index]
                                      ?.carryForwardableCount
                                  }
                                />
                              )}
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
                              );
                            }}
                            checked={row.attachmentRequired}
                            disabled={
                              !Boolean(
                                allLeaveTypeMap?.get(row?.leaveType || "")
                                  ?.type == 1
                              )
                            }
                          />
                        </td>
                        {/* Attachement Required Field End */}

                        {/* Gender Field Starts */}
                        <td>
                          <Field
                            name={`leavetypePolicies[${index}].gender`}
                            component={Select}
                            className={
                              errors.leavetypePolicies?.[index]?.gender &&
                              touched.leavetypePolicies?.[index]?.gender
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              const value =
                                e.target.value == "All"
                                  ? null
                                  : Number(e.target.value);
                              setFieldValue(
                                `leavetypePolicies[${index}].gender`,
                                value
                              );
                            }}
                            value={row.gender}
                            children={CustomDropdown({
                              data: dropdownData.allGenderList,
                              firstElement: { label: "All", value: null },
                            })}
                          />
                          {errors.leavetypePolicies?.[index]?.gender &&
                            touched.leavetypePolicies?.[index]?.gender && (
                              <CustomErrorLabel
                                touched={true}
                                error={
                                  errors.leavetypePolicies?.[index]?.gender
                                }
                              />
                            )}
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
                        {/* Delete Button Starts */}
                        <td className="text-right">
                          <button
                            type="button"
                            className="border-none bg-transparent"
                            onClick={() => {
                              handleDelete(
                                "LeaveTypePolicyTable",
                                values?.leavetypePolicies?.[index]?.Id,
                                remove,
                                index
                              );
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                          </button>
                        </td>
                        {/* Delete Button Ends */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Table Ends */}

            {/* Add button Field Starts */}

            {/* Add button Field Ends */}
          </>
        )}
      </FieldArray>
    </>
  );
}

export default LeaveTypePolicyTable;
