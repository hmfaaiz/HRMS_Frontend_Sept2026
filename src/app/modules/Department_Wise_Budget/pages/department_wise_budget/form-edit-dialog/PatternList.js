import { Field, FieldArray } from "formik";
import React, { useEffect, useMemo } from "react";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { amountLimitDynamic } from "../../../../../utils/common";
import { CirclePlus, Trash2 } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";

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

        dispatch(fetchAllFormsMenu(158, "allDesignations"));
    }, [dispatch]);


    useEffect(() => {
        values.list?.forEach((_, index) => {
            setFieldValue(`list[${index}].sno`, index + 1);
        });
    }, [values.list, setFieldValue]);


    return (
        <>
            <FieldArray name="list">
                {({ insert, remove, push }) => (
                    <>
                        <div className="flex justify-between items-center">
                            <h6 className="font-bold mb-0 text-primary">Department List</h6>

                            {/* {!isdataForRead && values?.list.length < 31 && ( */}
                            <button
                                disabled={!values.departmentId}
                                type="button"
                                className="btn btn-primary btn-elevate"
                                onClick={() =>
                                    push({
                                        sno: "",
                                        subsidiaryId: "",
                                        departmentId: null,
                                        bugetYearId: null,
                                        designationId: null,
                                        budgeted_strength: "",
                                        budgeted_strength: "",
                                        request_date: "",
                                        expected_date_of_joining: "",
                                        business_need: "",
                                        impact_of_position: "",
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
                                            <td>Designation</td>
                                            <td>Strength</td>
                                            <td>Budget Amount</td>
                                            <td>Request Date</td>
                                            <td>Expected Date of Joining</td>
                                            <td>Business need</td>
                                            <td>Impact of Position</td>
                                            {/* <td>Status</td> */}
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
                                                        name={`list[${index}].designationId`}
                                                        className={
                                                            errors.list?.[index]?.designationId && touched.list?.[index]?.designationId
                                                                ? "form-control is-invalid"
                                                                : "form-control"
                                                        }
                                                        disabled={isdataForRead}
                                                        options={dashboard?.allDesignations || []}
                                                        value={
                                                            dashboard?.allDesignations?.find(
                                                                (option) => option?.value === values?.list?.[index]?.designationId
                                                            ) || null
                                                        }
                                                        onChange={(selectedOption) => {
                                                            // if SearchSelect returns the full object { value, label }
                                                            const value = selectedOption ? selectedOption.value : "";
                                                            setFieldValue(`list[${index}].designationId`, value);
                                                        }}
                                                        placeholder="Select Department"
                                                    />

                                                    {/* Error message */}
                                                    {errors?.list?.[index]?.designationId && touched?.list?.[index]?.designationId && (
                                                        <div className="invalid-feedback">
                                                            {errors.list[index].designationId}
                                                        </div>
                                                    )}
                                                </td>


                                                <td>
                                                    <Field
                                                        name={`list[${index}].budgeted_strength`}
                                                        type="number"
                                                        className="form-control"
                                                        disabled={isdataForRead}
                                                    />
                                                </td>

                                                <td>
                                                    <Field
                                                        name={`list[${index}].budgeted_salary`}
                                                        type="number"
                                                        className="form-control"
                                                        disabled={isdataForRead}
                                                    />
                                                </td>
                                                <td>
                                                    <DatePicker
                                                        className="form-control"
                                                        name={`list[${index}].request_date`}
                                                        value={values?.list?.[index]?.request_date || ""}
                                                        selected={
                                                            values?.list?.[index]?.request_date
                                                                ? new Date(values?.list?.[index]?.request_date)
                                                                : null
                                                        }
                                                        onChange={(date) => {
                                                            setFieldValue(`list[${index}].request_date`, date);
                                                        }}
                                                        disabled={isdataForRead}
                                                    />
                                                </td>
                                                <td>
                                                    <DatePicker
                                                        className="form-control"
                                                        name={`list[${index}].expected_date_of_joining`}
                                                        value={values?.list?.[index]?.expected_date_of_joining || ""}
                                                        selected={
                                                            values?.list?.[index]?.expected_date_of_joining
                                                                ? new Date(values?.list?.[index]?.expected_date_of_joining)
                                                                : null
                                                        }
                                                        onChange={(date) => {
                                                            setFieldValue(`list[${index}].expected_date_of_joining`, date);
                                                        }}
                                                        disabled={isdataForRead}
                                                    />
                                                </td>
                                                <td>
                                                    <Field
                                                        as="textarea"
                                                        rows={2}
                                                        name={`list[${index}].business_need`}
                                                        className="form-control"
                                                        disabled={isdataForRead}
                                                    />
                                                </td>

                                                <td>
                                                    <Field
                                                        as="textarea"
                                                        rows={2}
                                                        name={`list[${index}].impact_of_position`}
                                                        className="form-control"
                                                        disabled={isdataForRead}
                                                    />
                                                </td>

                                                {/* <td>
                                                    <Field
                                                        as="select"
                                                        name={`list[${index}].request_status`}
                                                        className="form-control"
                                                        disabled={isdataForRead}
                                                    >
                                                        <option value="P">Pending</option>
                                                        <option value="A">Approved</option>
                                                        <option value="R">Rejected</option>
                                                    </Field>
                                                </td> */}

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
