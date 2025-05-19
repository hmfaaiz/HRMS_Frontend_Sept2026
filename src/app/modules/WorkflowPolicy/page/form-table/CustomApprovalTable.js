import { Field, FieldArray } from "formik";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import CustomErrorLabel from "../../../../utils/common-modules/CustomErrorLabel";
import { LevelList } from "../FormUIHelper";

function CustomApprovalWorkflowTable({
  isUserForRead,
  values,
  setFieldValue,
  errors,
  touched,
  handleDelete,
  isEdit,
}) {
  //Set All Employees customApprovalList in Map so we can get data faster in the field

  const { dashboard, roles } = useSelector((state) => {
    return {
      dashboard: state?.dashboard,
      roles: state?.workflow_policy?.roles,
    };
  });

  const allApprovalWorkflowList = useMemo(() => {
    return new Map(
      dashboard?.allApprovalWorkflowList?.map((item) => [item.value, item])
    );
  }, [dashboard?.allApprovalWorkflowList]);

  const allDesignations = useMemo(() => {
    return new Map(
      dashboard?.allDesignations?.map((item) => [item.value, item])
    );
  }, [dashboard?.allDesignations]);

  const allEmployees = useMemo(() => {
    return new Map(dashboard?.allEmployees?.map((item) => [item.value, item]));
  }, [dashboard?.allEmployees]);

  const allRoles = useMemo(() => {
    return new Map(roles?.allRoles?.map((item) => [item.value, item]));
  }, [roles?.allRoles]);

  return (
    <fieldset>
      <h6>Employee Custom Approval List</h6>
      <FieldArray name="customApprovalList">
        {({ insert, remove, push }) => (
          <>
            {/* Table Starts */}
            <table className="table table-hover">
              <thead>
                <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                  <td>Action</td>
                  <td>WF Level</td>
                  <td>Approver</td>
                  <td>Designation</td>
                  <td>Location</td>
                </tr>
              </thead>
              <tbody>
                {values?.customApprovalList?.length > 0 &&
                  values?.customApprovalList?.map((row, index) => (
                    <tr key={index}>
                      {/* Row Starts */}

                      {/* Delete Button Starts */}
                      <td>
                        <button
                          disabled={isEdit}
                          className="btn btn-danger btn-elevate"
                          type="button"
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                      {/* Delete Button Ends */}
                      {/* Level */}
                      <td>{index + 1}</td>
                      {/* <td>{values?.customApprovalList[index]?.workflowLevel}</td> */}
                      {/* Approval Type Field Field Starts */}
                      <td>
                        <Field
                          name={`customApprovalList[${index}].workflowApprovalTypeId`}
                          component={SearchSelect}
                          className={
                            errors.customApprovalList?.[index]
                              ?.workflowApprovalTypeId &&
                            touched.customApprovalList?.[index]
                              ?.workflowApprovalTypeId
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            const value =
                              e.label == "--Select--" ? "" : Number(e.value);
                            setFieldValue(
                              `customApprovalList[${index}].workflowApprovalTypeId`,
                              value
                            );
                            if (e?.label === "HOD") {
                              setFieldValue(
                                `customApprovalList[${index}].isHOD`,
                                true
                              );
                            } else {
                              setFieldValue(
                                `customApprovalList[${index}].isHOD`,
                                false
                              );
                            }
                          }}
                          error={
                            errors.customApprovalList?.[index]
                              ?.workflowApprovalTypeId
                          }
                          touched={
                            touched.customApprovalList?.[index]
                              ?.workflowApprovalTypeId
                          }
                          isDisabled={isUserForRead}
                          value={
                            allApprovalWorkflowList?.get(
                              row?.workflowApprovalTypeId || ""
                            ) || ""
                          }
                          options={
                            dashboard?.allApprovalWorkflowList.map((e, i) => {
                              return {
                                ...e,
                                isDisabled: values?.customApprovalList.some(
                                  (el) => el?.isHOD && e.value == "406"
                                ),
                              };
                            }) || []
                          }
                        />
                        {errors.customApprovalList?.[index]?.employeeId &&
                          touched.customApprovalList?.[index]?.employeeId && (
                            <CustomErrorLabel
                              touched={true}
                              error={
                                errors.customApprovalList?.[index]
                                  ?.workflowApprovalTypeId
                              }
                            />
                          )}
                      </td>
                      {/* Approval Type Field Field Emd */}
                      {/* Level , Designation , Employee , Roles Field Field Starts bases on approval Type */}
                      <td>
                        {values?.customApprovalList[index]
                          .workflowApprovalTypeId == "403" ? (
                          <>
                            <Field
                              name={`customApprovalList[${index}].levelId`}
                              component={SearchSelect}
                              className={
                                errors.customApprovalList?.[index]?.levelId &&
                                touched.customApprovalList?.[index]?.levelId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                const value =
                                  e.label == "--Select--"
                                    ? ""
                                    : Number(e.value);
                                setFieldValue(
                                  `customApprovalList[${index}].levelId`,
                                  value
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].designationId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].locationId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].employeeId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].roleId`,
                                  null
                                );
                              }}
                              error={
                                errors.customApprovalList?.[index]?.levelId
                              }
                              touched={
                                touched.customApprovalList?.[index]?.levelId
                              }
                              isDisabled={isUserForRead}
                              value={
                                LevelList?.find(
                                  (e) => e?.value === row?.levelId
                                ) || ""
                              }
                              options={
                                LevelList.map((e, i) => {
                                  return {
                                    ...e,
                                    isDisabled: values?.customApprovalList?.some(
                                      (el) =>
                                        el?.workflowApprovalTypeId == "403" &&
                                        el?.levelId === e.value
                                    ),
                                  };
                                }) || []
                              }
                            />
                            {errors.customApprovalList?.[index]?.levelId &&
                              touched.customApprovalList?.[index]?.levelId && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={
                                    errors.customApprovalList?.[index]?.levelId
                                  }
                                />
                              )}
                          </>
                        ) : values?.customApprovalList[index]
                            .workflowApprovalTypeId == "404" ? (
                          <>
                            <Field
                              name={`customApprovalList[${index}].designationId`}
                              component={SearchSelect}
                              className={
                                errors.customApprovalList?.[index]
                                  ?.designationId &&
                                touched.customApprovalList?.[index]
                                  ?.designationId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                const value =
                                  e.label == "--Select--"
                                    ? ""
                                    : Number(e.value);
                                setFieldValue(
                                  `customApprovalList[${index}].designationId`,
                                  value
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].levelId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].employeeId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].roleId`,
                                  null
                                );
                              }}
                              error={
                                errors.customApprovalList?.[index]
                                  ?.designationId
                              }
                              touched={
                                touched.customApprovalList?.[index]
                                  ?.designationId
                              }
                              isDisabled={isUserForRead}
                              value={
                                allDesignations?.get(
                                  row?.designationId || ""
                                ) || ""
                              }
                              options={
                                dashboard?.allDesignations?.map((e) => {
                                  return {
                                    ...e,
                                    isDisabled: values?.customApprovalList?.some(
                                      (el) =>
                                        el?.workflowApprovalTypeId == "404" &&
                                        el?.designationId === e.value
                                    ),
                                  };
                                }) || []
                              }
                            />
                            {errors.customApprovalList?.[index]
                              ?.designationId &&
                              touched.customApprovalList?.[index]
                                ?.designationId && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={
                                    errors.customApprovalList?.[index]
                                      ?.designationId
                                  }
                                />
                              )}
                          </>
                        ) : values?.customApprovalList[index]
                            .workflowApprovalTypeId == "405" ? (
                          <>
                            <Field
                              name={`customApprovalList[${index}].employeeId`}
                              component={SearchSelect}
                              className={
                                errors.customApprovalList?.[index]
                                  ?.employeeId &&
                                touched.customApprovalList?.[index]?.employeeId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                const value =
                                  e.label == "--Select--"
                                    ? ""
                                    : Number(e.value);
                                setFieldValue(
                                  `customApprovalList[${index}].employeeId`,
                                  value
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].designationId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].locationId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].levelId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].roleId`,
                                  null
                                );
                              }}
                              error={
                                errors.customApprovalList?.[index]?.employeeId
                              }
                              touched={
                                touched.customApprovalList?.[index]?.employeeId
                              }
                              isDisabled={isUserForRead}
                              value={
                                allEmployees?.get(row?.employeeId || "") || ""
                              }
                              options={
                                dashboard?.allEmployees?.map((e) => {
                                  return {
                                    ...e,
                                    isDisabled: values?.customApprovalList?.some(
                                      (el) =>
                                        el?.workflowApprovalTypeId == "405" &&
                                        el?.employeeId === e.value
                                    ),
                                  };
                                }) || []
                              }
                            />
                            {errors.customApprovalList?.[index]?.employeeId && (
                              <span style={{ color: "red" }}>
                                {errors.customApprovalList?.[index]?.employeeId}
                              </span>
                            )}
                          </>
                        ) : values?.customApprovalList[index]
                            .workflowApprovalTypeId == "407" ? (
                          <>
                            <Field
                              name={`customApprovalList[${index}].roleId`}
                              component={SearchSelect}
                              className={
                                errors.customApprovalList?.[index]?.roleId &&
                                touched.customApprovalList?.[index]?.roleId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                const value =
                                  e.label == "--Select--"
                                    ? ""
                                    : Number(e.value);
                                setFieldValue(
                                  `customApprovalList[${index}].roleId`,
                                  value
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].designationId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].locationId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].employeeId`,
                                  null
                                );
                                setFieldValue(
                                  `customApprovalList[${index}].levelId`,
                                  null
                                );
                              }}
                              error={errors.customApprovalList?.[index]?.roleId}
                              touched={
                                touched.customApprovalList?.[index]?.roleId
                              }
                              isDisabled={isUserForRead}
                              value={allRoles?.get(row?.roleId || "") || ""}
                              options={
                                roles?.allRoles?.map((e) => {
                                  return {
                                    ...e,
                                    isDisabled: values?.customApprovalList?.some(
                                      (el) =>
                                        el?.workflowApprovalTypeId == "407" &&
                                        el?.roleId === e.value
                                    ),
                                  };
                                }) || []
                              }
                            />
                            {errors.customApprovalList?.[index]?.roleId &&
                              touched.customApprovalList?.[index]?.roleId && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={
                                    errors.customApprovalList?.[index]?.roleId
                                  }
                                />
                              )}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      {/* Level , Designation , Employee , Roles Field Field End bases on approval Type */}
                      {/* Location Field if approvval type is designation Start  */}
                      <td>
                        {values?.customApprovalList[index]
                          .workflowApprovalTypeId == "404" && (
                          <>
                            <Field
                              name={`customApprovalList[${index}].locationId`}
                              component={SearchSelect}
                              className={
                                errors.customApprovalList?.[index]
                                  ?.locationId &&
                                touched.customApprovalList?.[index]?.locationId
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setFieldValue(
                                  `customApprovalList[${index}].locationId`,
                                  e?.value
                                );
                              }}
                              error={
                                errors.customApprovalList?.[index]?.locationId
                              }
                              touched={
                                touched.customApprovalList?.[index]?.locationId
                              }
                              isDisabled={isUserForRead}
                              value={[
                                { value: null, label: "All" },
                                ...dashboard?.allLocationChildMenus,
                              ].find((e) => e.value === row?.locationId)}
                              options={
                                [
                                  { value: null, label: "All" },
                                  ...dashboard?.allLocationChildMenus,
                                ] || []
                              }
                            />
                            {errors.customApprovalList?.[index]?.locationId &&
                              touched.customApprovalList?.[index]
                                ?.locationId && (
                                <CustomErrorLabel
                                  touched={true}
                                  error={
                                    errors.customApprovalList?.[index]
                                      ?.locationId
                                  }
                                />
                              )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* Table Ends */}

            {/* Add button Field Starts */}
            {!isEdit && (
              <button
                type="button"
                className="btn btn-primary btn-elevate"
                onClick={() =>
                  push({
                    workflowApprovalTypeId: null,
                    levelId: null, /// report level no
                    workflowLevel: values?.customApprovalList?.length + 1,
                    designationId: null,
                    locationId: null,
                    employeeId: null,
                    isHOD: false,
                    roleId: null,
                  })
                }
              >
                + Add Row
              </button>
            )}
            {/* Add button Field Ends */}
          </>
        )}
      </FieldArray>
    </fieldset>
  );
}

export default CustomApprovalWorkflowTable;
