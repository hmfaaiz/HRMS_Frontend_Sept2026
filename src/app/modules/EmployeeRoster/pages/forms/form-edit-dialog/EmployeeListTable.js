import { Field, FieldArray } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { CirclePlus, Trash2 } from "lucide-react";
import { Dashboard } from "../../../../../../_metronic/_partials";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
function EmployeeListTable({
  values,
  setFieldValue,
  errors,
  touched,
  dropdownData,
  handleDelete,
  isEdit,
}) {
  //Set All Employees List in Map so we can get data faster in the field
 const [departmentId,setDepartmentId]=useState("")
 const [designationId,setDesignationId]=useState("")
   const { dashboard } = useSelector((state) => state);
   const dispatch = useDispatch();
  const allEmployees = useMemo(() => {
    return new Map(
      dropdownData.allEmployees?.map((item) => [item.value, item])
    );
  }, [dropdownData.allEmployees]);
  

  useEffect(() => {
  
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
  }, [dispatch]);

  return (
    <>
      <FieldArray name="list">
        {({ insert, remove, push }) => (
          <>
            <div className="flex justify-between items-center">
              <h6 className="font-bold mb-0 text-primary">
                Employee List{"  "}
              </h6>

              {!isEdit && (
                <button
                  type="button"
                  className="btn btn-primary btn-elevate"
                  onClick={() =>
                    push({
                      employeeId: "",
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
                      <td className="w-80">Employee</td>
                      {/* <td className="w-80">Department</td>
                      <td className="w-80">Designation</td> */}
                      <td className="text-right">Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {values.list.map((row, index) => (
                      <tr key={index}>
                        {/* Row Starts */}



                        {/* Employee Field Starts */}
                        <td>
                          <Field
                            name={`list[${index}].employeeId`}
                            component={SearchSelect}
                            className={
                              errors.list?.[index]?.employeeId &&
                                touched.list?.[index]?.employeeId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              const value =
                                e.label == "Select" ? "" : Number(e.value);
                              setFieldValue(`list[${index}].employeeId`, value);
                              // setDepartmentId(e.departmentId)
                              // setDesignationId(e.designationId)
                            }}
                            error={errors.list?.[index]?.employeeId}
                            touched={touched.list?.[index]?.employeeId}
                            isDisabled={isEdit}
                            value={
                              allEmployees?.get(row?.employeeId || "") || ""
                            }
                            options={dropdownData.allEmployees || []}
                          />
                          {/* {errors.list?.[index]?.employeeId &&
                        touched.list?.[index]?.employeeId &&
                        <CustomErrorLabel touched={true} error={errors.list?.[index]?.employeeId} />
                      } */}
                        </td>

                        {/* <td>
                          <Field
                            name={`list[${index}].departmentId`}
                            component={SearchSelect}


                            value={
                              (dashboard?.allDept || []).find(
                                (item) => item.value === departmentId
                              )
                            }

                            isDisabled={true}

                            options={dashboard.allDept || []}
                          />

                        </td>  
                        
                           <td>
                          <Field
                            name={`list[${index}].designationId`}
                            component={SearchSelect}


                            value={
                              (dashboard?.allDesignations || []).find(
                                (item) => item.value === designationId
                              )
                            }

                            isDisabled={true}

                            options={dashboard?.allDesignations || []}
                          />

                        </td> */}
                        {/* Employee Field Ends */}
                        {/* Delete Button Starts */}
                        <td className="text-right">
                          <button
                            disabled={isEdit}
                            className="border-none bg-transparent"
                            type="button"
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                          </button>
                        </td>
                        {/* Delete Button Ends */}

                        {/* Row Starts */}
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

export default EmployeeListTable;
