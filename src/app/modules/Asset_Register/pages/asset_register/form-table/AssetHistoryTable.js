import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
    PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
    getHandlerTableChange,
    NoRecordsFoundMessage,
    PleaseWaitMessage,
    sortCaret,
    headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

export function AssetHistoryTable({ Id }) {
    //Users UI Context
    const formUIContext = useFormUIContext();

    const formUIProps = useMemo(() => {
        return {
            ids: formUIContext.ids,
            setIds: formUIContext.setIds,
            queryParams: formUIContext.queryParams,
            setQueryParams: formUIContext.setQueryParams,
            openEditFormDialog: formUIContext.openEditFormDialog,
            openDeleteFormDialog: formUIContext.openDeleteFormDialog,
            openActiveFormDialog: formUIContext.openActiveFormDialog,
            openReadFormDialog: formUIContext.openReadFormDialog,
        };
    }, [formUIContext]);

    const { currentState, userAccess } = useSelector((state) => {
        return {
            currentState: state.asset_register,
            userAccess: state?.auth?.userAccess["asset_register"],
        };
    }, shallowEqual);

    const { totalCount, assignmentHistory, listLoading } = currentState;

    //totalCount = 10

    const dispatch = useDispatch();

    useEffect(() => {
        formUIProps.setIds([]);

        dispatch(actions.fetchAssetAssignmentHistory(Id));
    }, [Id]);



    const statusOptions = [
        { value: 0, label: "Unassigned" },
        { value: 1, label: "Assigned" },
        { value: 2, label: "Disposed" },
    ];

    const columns = [
        {
            dataField: "AssignedEmployee.fullName",
            text: "Assign To",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "100px" },
            formatter: (_, row) => row.AssignedEmployee?.fullName || "-",
        },

        {
            dataField: "AssignedEmployee.designation.formName",
            text: "Designation",
             style: { minWidth: "100px" },
            formatter: (_, row) =>
                row.AssignedEmployee?.designation?.formName || "-",
        },

        {
            dataField: "AssignedEmployee.department.deptName",
            text: "Department",
             style: { minWidth: "100px" },
            formatter: (_, row) =>
                row.AssignedEmployee?.department?.deptName || "-",
        },

        {
            dataField: "date_of_assignment",
            text: "Date of Assignment",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "40px" },
            formatter: (cell) =>
                cell ? format(new Date(cell), "dd-MMM-yyyy") : "-",
        },

        {
            dataField: "date_of_return",
            text: "Date of Return",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "40px" },
            formatter: (cell) =>
                cell ? format(new Date(cell), "dd-MMM-yyyy") : "-",
        },

        {
            dataField: "status",
            text: "Status",
             style: { minWidth: "20px" },
            formatter: (_, row) => {
                const status = statusOptions.find(
                    item => item.value === Number(row.status)
                );
                return status?.label || "-";
            },
        },
    ];


    return (
        <div className="w-full overflow-x-auto">

            <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={assignmentHistory === null ? [] : assignmentHistory}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                    formUIProps.setQueryParams
                )}

            >
                <PleaseWaitMessage assignmentHistory={assignmentHistory} />
                <NoRecordsFoundMessage assignmentHistory={assignmentHistory} />
            </BootstrapTable>



        </div>
    );
}
