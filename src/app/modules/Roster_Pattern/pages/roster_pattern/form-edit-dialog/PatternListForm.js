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
  //   Set All Employees List in Map so we can get data faster in the field
  // const allEmployeeShifts = useMemo(() => {
  //     // Create a Map from the dropdownData.allEmployeeShifts array
  //     const shiftsMap = new Map(dropdownData?.allEmployeeShifts?.map(item => [item.value, item]));

  //     // Add the "offDay" option with value: 0 if it's not already included
  //     shiftsMap.set(0, { label: "Off Day", value: 0 });
  // console.log("shiftsMap111",shiftsMap)
  //     return shiftsMap;
  // }, [dropdownData?.allEmployeeShifts]);

  const allEmployeeShifts = useMemo(() => {
    const shiftsMap = new Map(
      dropdownData?.allEmployeeShifts?.map((item) => [item.value, item])
    );

    shiftsMap.set(0, { label: "Off Day", value: 0 });

    const shiftsArray = Array.from(shiftsMap?.values());

    const sortedShiftsArray = [
      shiftsArray?.find((item) => item?.value === 0),
      ...shiftsArray?.filter((item) => item?.value !== 0),
    ];

    return sortedShiftsArray;
  }, [dropdownData?.allEmployeeShifts]);

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
              <h6 className="font-bold mb-0 text-primary">Shift List</h6>

              {!isdataForRead && values?.list.length < 31 && (
                <button
                  type="button"
                  className="btn btn-primary btn-elevate"
                  onClick={() =>
                    push({
                      shiftId: "",
                      sno: "",
                    })
                  }
                >
                  <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              )}
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <td>S.No.</td>
                      <td>Shift</td>
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
                        {/* <td>

                                            <SearchSelect
                                                name={`list[${index}].shiftId`}

                                                component={SearchSelect}
                                                className={errors.list?.[index]?.shiftId && touched.list?.[index]?.shiftId ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) => {
                                                    const value = e.label == 'Select' ? '' : Number(e.value)
                                                    setFieldValue(
                                                        `list[${index}].shiftId`,
                                                        value
                                                    )
                                                }}
                                                error={errors?.list?.[index]?.shiftId}
                                                touched={touched?.list?.[index]?.shiftId}
                                                isDisabled={isdataForRead}
                                                // value={allEmployeeShifts?.get(row?.shiftId || '') || ''}
                                                // options={dropdownData?.allEmployeeShifts || []}

                                                value={allEmployeeShifts?.get(row?.shiftId) || ''}
  options={Array.from(allEmployeeShifts?.values())}
                                            />

                                        </td> */}
                        <td>
                          <SearchSelect
                            name={`list[${index}].shiftId`}
                            component={SearchSelect}
                            className={
                              errors.list?.[index]?.shiftId &&
                              touched.list?.[index]?.shiftId
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              const value =
                                e.label === "Select" ? "" : Number(e.value);
                              setFieldValue(`list[${index}].shiftId`, value);
                            }}
                            error={errors?.list?.[index]?.shiftId}
                            touched={touched?.list?.[index]?.shiftId}
                            isDisabled={isdataForRead}
                            // Find the corresponding shift object by matching the shiftId
                            value={
                              allEmployeeShifts?.find(
                                (shift) => shift.value === row?.shiftId
                              ) || ""
                            }
                            // Ensure "Off Day" (value: 0) is the first option
                            options={Array.from(
                              allEmployeeShifts?.values()
                            ).sort((a, b) =>
                              a.value === 0 ? -1 : b.value === 0 ? 1 : 0
                            )}
                          />
                        </td>
                        {/* Delete Button Starts */}
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
