import { Field, FieldArray } from "formik";
import React, { useEffect, useMemo } from "react";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { amountLimitDynamic } from "../../../../../utils/common";
import { CirclePlus, Trash2 } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllDept } from "../../../../../../_metronic/redux/dashboardActions";

function PatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  dropdownData,
  isdataForRead,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    dispatch(fetchAllDept());
  }, [dispatch]);


  useEffect(() => {
    values.list.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list, setFieldValue]);

  console.log("dashboard?.allDept1111",dashboard?.allDept)
  return (
    <>
      <FieldArray name="list">
        {({ insert, remove, push }) => (
          <>
            <div className="flex justify-between items-center">
              <h6 className="font-bold mb-0 text-primary">Department List</h6>

              {/* {!isdataForRead && values?.list.length < 31 && ( */}
              <button
                disabled={!values.designationId}
                type="button"
                className="btn btn-primary btn-elevate"
                onClick={() =>
                  push({
                    departmentId: "",
                    sno: "",
                  })
                }
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
              {/* )} */}
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <td>S.No.</td>
                      <td>Department</td>
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
                            // onInput={(e) => {
                            //                             e.target.value = amountLimitDynamic(e.target.value,2); // Limit to 3 digits
                            //                           }}
                            disabled
                          />
                          {errors.list?.[index]?.sno &&
                            touched.list?.[index]?.sno && (
                              <div className="text-danger">
                                {errors.list[index].sno}
                              </div>
                            )}
                        </td>

                        <td>
                          <SearchSelect
                            name={`list[${index}].departmentId`}
                            className={
                              errors.list?.[index]?.departmentId && touched.list?.[index]?.departmentId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            disabled={isdataForRead}
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

                        {/* Delete Button Starts */}
                        {!values?.list[index]?.isPresent && (
                          <td className="text-right">
                            <button
                              disabled={isdataForRead}
                              className="border-none bg-transparent"
                              type="button"
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                            </button>
                          </td>
                        )}

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
