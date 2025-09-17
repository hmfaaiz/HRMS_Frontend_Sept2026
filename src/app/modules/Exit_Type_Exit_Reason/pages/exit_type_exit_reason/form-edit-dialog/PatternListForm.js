import { Field, FieldArray } from "formik";
import React, { useEffect, useMemo } from "react";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { amountLimitDynamic } from "../../../../../utils/common";
import { CirclePlus, Trash2 } from "lucide-react";

function PatternListForm({
  values,
  setFieldValue,
  errors,
  touched,
  dropdownData,
  isdataForRead,
}) {




  useEffect(() => {
    values.list.forEach((_, index) => {
      setFieldValue(`list[${index}].sno`, index + 1);
    });
  }, [values.list, setFieldValue]);
  return (
    <>
      <FieldArray name="list">
        {({ insert, remove, push }) => (
          <>
            <div className="flex justify-between items-center">
              <h6 className="font-bold mb-0 text-primary">Exit Reason List</h6>

              {/* {!isdataForRead && values?.list.length < 31 && ( */}
              <button
                disabled={!values.exitTypeId}
                type="button"
                className="btn btn-primary btn-elevate"
                onClick={() =>
                  push({
                    exitReason: "",
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
                      <td>Exit Reason</td>
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
                          <Field

                            name={`list[${index}].exitReason`}
                            className={
                              errors.list?.[index]?.exitReason && touched.list?.[index]?.exitReason
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            disabled={isdataForRead}
                            onChange={(e) => {
                              const value = e.target.value === "Select" ? "" : e.target.value;
                              setFieldValue(`list[${index}].exitReason`, value);
                            }}
                            value={row?.exitReason || ""}
                          >
                            {/* Default option */}

                          </Field>

                          {/* Error message */}
                          {errors?.list?.[index]?.exitReason && touched?.list?.[index]?.exitReason && (
                            <div className="invalid-feedback">
                              {errors.list[index].exitReason}
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
