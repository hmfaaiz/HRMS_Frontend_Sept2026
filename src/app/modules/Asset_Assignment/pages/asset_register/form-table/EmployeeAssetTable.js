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



export function EmployeeAssetTable({ employeeId }) {

    console.log("employeeId11111", employeeId)
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
            currentState: state.asset_assignment,
            userAccess: state?.auth?.userAccess["asset_assignment"],
        };
    }, shallowEqual);

    const { totalCount, assignmentList, listLoading } = currentState;

    //totalCount = 10

    const dispatch = useDispatch();

    useEffect(() => {
        if (!employeeId) return;

        formUIProps.setIds([]);

        dispatch(
            actions.fetchAssetAssignmentList(
                employeeId
            )
        );
    }, [employeeId, dispatch]);

    const statusOptions = [
        { value: 0, label: "Unassigned" },
        { value: 1, label: "Assigned" },
        { value: 2, label: "Disposed" },
    ];

    console.log("assignmentList1111", assignmentList)
    const columns = [
        {
            dataField: "AssetRegister.asset_no",
            text: "Asset No.",
            formatter: (_, row) => row.AssetRegister?.asset_no || "",
        },
        {
            dataField: "AssetRegister.AssetModel.name",
            text: "Model Name",
            formatter: (_, row) => row.AssetRegister?.AssetModel?.name || "",
        },

        {
            dataField: "date_of_assignment",
            text: "Date of Assignment",
            formatter: (_, row) => row.date_of_assignment || "",
            formatter: (_, row) =>
                row.date_of_assignment
                    ? format(new Date(row.date_of_assignment), "dd-MMM-yyyy")
                    : "",
        },
      
        {
            dataField: "AssignedByEmployee.fullName",
            text: "Assigned To",
            formatter: (_, row) =>
                row.AssignedByEmployee?.fullName || "-",
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
                data={Array.isArray(assignmentList) ? assignmentList : []}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
            // onTableChange={getHandlerTableChange(
            //     formUIProps.setQueryParams
            // )}
            // selectRow={getSelectRow({
            //   assignmentList,

            // })}
            // {...paginationTableProps}
            >
                <PleaseWaitMessage assignmentList={assignmentList} />
                <NoRecordsFoundMessage assignmentList={assignmentList} />
            </BootstrapTable>

        </div>
    );
}
