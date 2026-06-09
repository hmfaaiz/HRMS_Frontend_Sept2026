import { Field, FieldArray, ErrorMessage } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { amountLimitDynamic } from "../../../../../utils/common";
import { CirclePlus, Eye, Trash2, View } from "lucide-react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { fetchBudgetWorkflow } from "../../../_redux/redux-Actions";
import { headerSortingClasses, NoRecordsFoundMessage, PleaseWaitMessage, sortCaret } from "../../../../../../_metronic/_helpers";
import BootstrapTable from "react-bootstrap-table-next";
import { format } from "date-fns";

function PatternListForm({
    values,
    setFieldValue,
    errors,
    touched,
    dropdownData,
    isdataForRead,
}) {
    const dispatch = useDispatch();
    const [workflowId, setWorkflowId] = useState(null);
    const { dashboard } = useSelector((state) => state);
    useEffect(() => {

        dispatch(fetchAllFormsMenu(158, "allDesignations"));
    }, [dispatch]);


    useEffect(() => {
        values.list?.forEach((_, index) => {
            setFieldValue(`list[${index}].sno`, index + 1);
        });
    }, [values.list, setFieldValue]);

    const totalStrength = values?.list?.reduce(
        (sum, item) => sum + Number(item?.budgeted_strength || 0),
        0
    );

    const totalSalary = values?.list?.reduce(
        (sum, item) => sum + Number(item?.budgeted_salary || 0),
        0
    );

    useEffect(() => {

        dispatch(fetchBudgetWorkflow(workflowId));
    }, [workflowId]);

    const { workflowStatusList } = useSelector(
        (state) => ({
            workflowStatusList: state?.portal_department_wise_budget?.workflowStatusList,

        }),
        shallowEqual
    );

    const columns = [
        {
            dataField: "approvalAuthorityEmp.employeeCode", // Reference the parent object (department)
            text: "Emp Code", // Column heading
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "120px",
                maxWidth: "120px",
            },
        },
        {
            dataField: "approvalAuthorityEmp",
            text: "Name",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
            formatter: (cell) => {
                return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
            },
        },
        {
            dataField: "approvalAuthorityEmp.department.deptName",
            text: "Department",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
        },
        {
            dataField: "approvalAuthorityEmp.designation.formName",
            text: "Designation",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
        },
        {
            dataField: "approvalAuthorityEmp.employeeType.formName",
            text: "Employee Type",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
        },
        {
            dataField: "authorityStatus",
            text: "Self status",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
            formatter: (cell) => {
                let text = "";
                let classname = "";
                if (cell === "P") {
                    text = "Pending";
                    classname = "text-pending font-bold";
                } else if (cell === "A") {
                    text = "Approved";
                    classname = "text-approved font-bold";
                } else if (cell === "R") {
                    text = "Rejected";
                    classname = "text-rejected font-bold";
                }
                return <span className={classname}>{text}</span>;
            },
        },
        {
            dataField: "processDate",
            text: "Process Date",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
            formatter: (cell) => {
                return cell ? format(new Date(cell), "dd-MMM-yyyy:HH:mm:ss") : "";
            },
        },
        {
            dataField: "authorityRemarks",
            text: "Remarks",
            sort: false,
            sortCaret: sortCaret,
            headerSortingClasses,
            style: {
                minWidth: "160px",
                maxWidth: "160px",
            },
        },
    ];
    return (
        <>
            <FieldArray name="list">
                {({ insert, remove, push }) => (
                    <>
                        <br />
                        <div className="flex justify-between items-center">

                            <h6 className="font-bold mb-0 text-primary">Designation List</h6>

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
                                            <td className="w-[5px]">S.No.</td>
                                            <td className="w-[220px]">Designation</td>
                                            <td className="w-[5px]">Strength</td>
                                            {/* <td className="w-[100px]">Budget Amount</td> */}

                                            <td className="w-[100px]">Expected Date of Joining</td>
                                            <td className="w-[300px]">Business need</td>
                                            <td className="w-[300px]">Impact of Position</td>
                                            {/* <td>Status</td> */}
                                            <td className="text-left">Status</td>
                                            <td className="text-right">Actions</td>
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
                                                        style={{ width: "30px" }}

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
                                                        isDisabled={isdataForRead || values?.list?.[index]?.Id}
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
                                                        disabled={isdataForRead || values?.list?.[index]?.Id}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name={`list[${index}].budgeted_strength`} />
                                                    </div>
                                                </td>

                                                {/* <td>
                                                    <Field
                                                        name={`list[${index}].budgeted_salary`}
                                                        type="number"
                                                        className="form-control"
                                                        disabled={isdataForRead || values?.list?.[index]?.Id}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name={`list[${index}].budgeted_salary`} />
                                                    </div>
                                                </td> */}
                                                {/* <td>
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
                                                        disabled={isdataForRead || values?.list?.[index]?.Id}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name={`list[${index}].request_date`} />
                                                    </div>
                                                </td> */}
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
                                                        disabled={isdataForRead || values?.list?.[index]?.Id}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name={`list[${index}].expected_date_of_joining`} />
                                                    </div>
                                                </td>
                                                <td>
                                                    <Field
                                                        as="textarea"
                                                        rows={2}
                                                        name={`list[${index}].business_need`}
                                                        className="form-control"
                                                        disabled={isdataForRead || values?.list?.[index]?.Id}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name={`list[${index}].business_need`} />
                                                    </div>

                                                </td>

                                                <td>
                                                    <Field
                                                        as="textarea"
                                                        rows={2}
                                                        name={`list[${index}].impact_of_position`}
                                                        className="form-control"
                                                        disabled={isdataForRead || values?.list?.[index]?.Id}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name={`list[${index}].impact_of_position`} />
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`font-bold ${values?.list?.[index]?.request_status === "A"
                                                            ? "text-approved"
                                                            : values?.list?.[index]?.request_status === "R"
                                                                ? "text-rejected"
                                                                : "text-pending"
                                                            }`}
                                                    >
                                                        {values?.list?.[index]?.request_status === "A"
                                                            ? "Approved"
                                                            : values?.list?.[index]?.request_status === "R"
                                                                ? "Rejected"
                                                                : "Pending"}
                                                    </span>
                                                </td>
                                                {/* Delete Button Starts */}
                                                {/* {!values?.list[index]?.isPresent && ( */}
                                                {values?.list?.[index]?.Id ? <td className="text-center">
                                                    <button
                                                        disabled={isdataForRead}
                                                        className="border-none bg-transparent"
                                                        type="button"
                                                        onClick={() => {
                                                            console.log("click111111")
                                                            setWorkflowId(values?.list?.[index]?.Id);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 text-black cursor-pointer" />
                                                    </button>
                                                </td> : (
                                                    <td className="text-right">
                                                        <button
                                                            disabled={isdataForRead || values?.list?.[index]?.Id}
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

                                                {/* )} */}


                                            </tr>

                                        ))}
                                        <tr className="font-weight-bold ">
                                            <td colSpan="2" className="text-left">
                                                Total:
                                            </td>

                                            <td>
                                                {totalStrength.toLocaleString("en-US")}
                                            </td>

                                            {/* <td>
                                                {totalSalary.toLocaleString("en-US")}
                                            </td> */}

                                            <td colSpan="5"></td>
                                        </tr>
                                        {typeof errors.list === "string" && (
                                            <tr>
                                                <td colSpan="9" className="text-danger text-left">
                                                    {errors.list}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <br />
                        <h6 className="font-bold mb-0 text-primary">Workflow Authorties</h6>

                        <div className="mt-2">
                            <BootstrapTable
                                noDataIndication={NoRecordsFoundMessage({
                                    entities: workflowStatusList || [],
                                })}
                                wrapperClasses="table-responsive"
                                bordered={false}
                                classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
                                bootstrap4
                                remote
                                keyField="Id"
                                data={workflowStatusList || []}
                                columns={columns}
                            >
                                <PleaseWaitMessage entities={workflowStatusList || []} />
                                <NoRecordsFoundMessage entities={workflowStatusList || []} />
                            </BootstrapTable>
                        </div>
                    </>
                )}
            </FieldArray>
        </>
    );
}

export default PatternListForm;
