import { Field, FieldArray } from 'formik'
import React, { useMemo } from 'react'
import CustomErrorLabel from '../../../../../utils/common-modules/CustomErrorLabel';
import { SearchSelect } from '../../../../../../_metronic/_helpers/SearchSelect';

function PatternListForm({ values, setFieldValue, errors, touched, dropdownData, isdataForRead }) {
    console.log("isdataForRead111", isdataForRead)
    //   Set All Employees List in Map so we can get data faster in the field
    const allEmployeeShifts = useMemo(() => {
        // Create a Map from the dropdownData.allEmployeeShifts array
        const shiftsMap = new Map(dropdownData?.allEmployeeShifts?.map(item => [item.value, item]));
    
        // Add the "offDay" option with value: 0 if it's not already included
        shiftsMap.set(0, { label: "offDay", value: 0 });
    console.log("shiftsMap111",shiftsMap)
        return shiftsMap;
    }, [dropdownData?.allEmployeeShifts]);
    

    return (
        <>
            <h6>Shift List</h6>
            <FieldArray name="list">
                {({ insert, remove, push }) => (
                    <>
                        {/* Table Starts */}
                        <table className="table table-hover">
                            <thead>
                                <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                                    <td>Action</td>
                                    <td>S.No.</td>
                                    <td>Shift</td>
                                </tr>
                            </thead>
                            <tbody>
                                {values?.list?.map((row, index) => (
                                    <tr key={index}>
                                        {/* Row Starts */}

                                        {/* Delete Button Starts */}
                                        <td>
                                            <button disabled={isdataForRead} className="btn btn-danger btn-elevate" type="button" onClick={() => {
                                                remove(index)
                                            }}>
                                                Delete
                                            </button>
                                        </td>


                                        <td>

                                            <Field
                                                name={`list[${index}].sno`}
                                                type="number"
                                                className="form-control"
                                                style={{ width: '100px' }}


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
                                                name={`list[${index}].shiftId`}

                                                component={SearchSelect}
                                                className={errors.list?.[index]?.shiftId && touched.list?.[index]?.shiftId ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) => {
                                                    const value = e.label == '--Select--' ? '' : Number(e.value)
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
  options={Array.from(allEmployeeShifts.values())}
                                            />

                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Table Ends */}

                        {/* Add button Field Starts */}
                        {!isdataForRead && values.list.length < 5 && 
                       ( <button
                            type="button"
                            className="btn btn-primary btn-elevate"
                            onClick={() =>
                                push({
                                    shiftId: "",
                                    sno:""
                                })
                            }
                        >
                            + Add Row
                        </button>)
                        
                        
                        }
                        {/* Add button Field Ends */}
                    </>
                )}
            </FieldArray></>
    )
}

export default PatternListForm