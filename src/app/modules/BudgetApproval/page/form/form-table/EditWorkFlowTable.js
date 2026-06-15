import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BootstrapTable from "react-bootstrap-table-next";
import * as actions from "../../../redux/formAction";
import { useFormUIContext } from "../../FormUIContext";

import {
    headerSortingClasses,
    NoRecordsFoundMessage,
    PleaseWaitMessage,
    sortCaret,
} from "../../../../../../_metronic/_helpers";

import { format } from "date-fns";
import { initialFilter } from "../../FormUIHelper";

export function EditWorkflowTable({ onHide, show }) {
    const dispatch = useDispatch();
    const FormUIContext = useFormUIContext();

    const [tableData, setTableData] = useState([]);

    const { actionsLoading, budgetAmountData, user } = useSelector(
        (state) => ({

            actionsLoading:
                state?.department_wise_budget_approval?.actionsLoading,
            budgetAmountData:
                state?.department_wise_budget_approval?.budgetAmountData,
            user: state?.auth?.user,
        }),
        shallowEqual
    );
    const handleSubmit = () => {
        const payload = {
            Id: tableData?.[0]?.Id,
            budgeted_salary: tableData?.[0]?.budgeted_salary,
        };



        dispatch(actions.updateBudgetAmountById(payload, onHide));
        dispatch(
            actions.fetchBudgetApprovalApplication(
                initialFilter,
                user?.employeeIdMapping
            )
        );
    };

    useEffect(() => {
        if (budgetAmountData) {
            setTableData(
                Array.isArray(budgetAmountData)
                    ? budgetAmountData
                    : [budgetAmountData]
            );
        }
    }, [budgetAmountData]);

    const formUIProps = useMemo(() => {
        return {
            workflowId: FormUIContext?.workflowId,
            currentData: FormUIContext?.currentData,
        };
    }, [FormUIContext]);

    const parentData = formUIProps?.currentData?.parentData;

    const columns = [
        {
            dataField: "budgetCode",
            text: "Budget Code",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
        {
            dataField: "Department.deptName",
            text: "Department",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
        {
            dataField: "Designation.formName",
            text: "Designation",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
        //   {
        //     dataField: "budgeted_salary",
        //     text: "budgeted amounty",
        //     sort: false,
        //     sortCaret,
        //     headerSortingClasses,
        //   },
        {
            dataField: "budgeted_salary",
            text: "Budgeted Amount",
            sort: false,
            sortCaret,
            headerSortingClasses,
            formatter: (cell, row, rowIndex) => (
                <input
                    type="text"
                    className="form-control"
                    defaultValue={cell || ""}

                    onKeyDown={(e) => {
                        const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                        ];

                        // allow control keys
                        if (allowedKeys.includes(e.key)) return;

                        // allow only numbers
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                            return;
                        }

                        // prevent more than 9 digits
                        const currentValue = e.target.value;
                        if (currentValue.length >= 9) {
                            e.preventDefault();
                        }
                    }}

                    onBlur={(e) => {
                        const updatedData = [...tableData];

                        updatedData[rowIndex] = {
                            ...updatedData[rowIndex],
                            budgeted_salary: e.target.value.slice(0, 9), // safety fallback
                        };

                        setTableData(updatedData);
                    }}
                />
            )
        },
        {
            dataField: "budgeted_strength",
            text: "Budgeted Strength",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
        {
            dataField: "request_date",
            text: "Request Date",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
        {
            dataField: "expected_date_of_joining",
            text: "Expected Joining",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
        {
            dataField: "request_status",
            text: "Status",
            sort: false,
            sortCaret,
            headerSortingClasses,
            formatter: (cell) => {
                if (cell === "P") return "Pending";
                if (cell === "A") return "Approved";
                if (cell === "R") return "Rejected";
                return cell;
            },
        },
        {
            dataField: "business_need",
            text: "Business Need",
            sort: false,
            sortCaret,
            headerSortingClasses,
        },
    ];

    // useEffect(() => {
    //     if (formUIProps?.workflowId) {
    //         dispatch(actions.fetchBudgetWorkflow(formUIProps.workflowId));
    //     }
    // }, [formUIProps.workflowId, dispatch]);

    // useEffect(() => {
    //     const data =
    //         workflowStatusList && workflowStatusList.length > 0
    //             ? workflowStatusList
    //             : parentData
    //                 ? [parentData]
    //                 : [];

    //     setTableData(data);
    // }, [workflowStatusList, parentData]);

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            {actionsLoading && <div className="p-2">Loading...</div>}

            <Modal.Header closeButton>
                <Modal.Title>Update Budget Approval</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="mt-2">
                    <BootstrapTable
                        keyField="Id"
                        data={tableData}
                        columns={columns}
                        wrapperClasses="table-responsive"
                        bordered={false}
                        bootstrap4
                        classes="table table-head-custom table-vertical-center table-hover"
                        noDataIndication={NoRecordsFoundMessage({
                            entities: tableData,
                        })}
                    >
                        <PleaseWaitMessage entities={tableData} />
                        <NoRecordsFoundMessage entities={tableData} />
                    </BootstrapTable>
                </div>
            </Modal.Body>

            <Modal.Footer>

                <button onClick={onHide} className="btn btn-light">
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </Modal.Footer>
        </Modal>
    );
}