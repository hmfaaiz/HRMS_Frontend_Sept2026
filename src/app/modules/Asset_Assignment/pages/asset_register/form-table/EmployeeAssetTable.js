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


export function EmployeeAssetTable() {
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

    const { totalCount, entities, listLoading } = currentState;
    console.log("entities11111", entities)
    //totalCount = 10

    const dispatch = useDispatch();

    useEffect(() => {
        formUIProps.setIds([]);

        dispatch(actions.fetchAssetRegisters(formUIProps.queryParams));
    }, [formUIProps.queryParams, dispatch, totalCount]);

    const isAccessForEdit = userAccess?.find(
        (item) => item.componentName === "UpdateAssetRegister"
    );

    const isAccessForDelete = userAccess?.find(
        (item) => item.componentName === "DeleteAssetRegister"
    );

    const isAccessForRead = userAccess?.find(
        (item) => item.componentName === "ReadAssetRegister"
    );

    const statusOptions = [
        { value: 0, label: "Unassigned" },
        { value: 1, label: "Assigned" },
        { value: 2, label: "Disposed" },
    ];

    const columns = [
        {
            dataField: "asset_no",
            text: "Asset No.",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "180px" },
        },

        {
            dataField: "AssetModel.name",
            text: "Model Name",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "200px" },
            formatter: (_, row) => row.AssetModel?.name || "",
        },


        {
            dataField: "date_of_acquisition",
            text: "Date of Assignment",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "180px" },
            formatter: (cell) =>
                cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
        },



        {
            dataField: "AssignedEmployee.fullName",
            text: "Asset Assigned By",
            sort: false,
            sortCaret,
            headerSortingClasses,
            style: { minWidth: "220px" },
            formatter: (_, row) =>
                row.AssignedEmployee?.fullName ||
                statusOptions.find(item => item.value === row.status)?.label ||
                "-",
        },

    ];

    //Table pagination properties
    const paginationOptions = {
        custom: true,
        totalSize: totalCount,
        sizePerPageList: uiHelpers.sizePerPageList,
        sizePerPage: formUIProps.queryParams.pageSize,
        page: formUIProps.queryParams.pageNumber,
    };

    return (
        <div className="w-full overflow-x-auto">
            <PaginationProvider pagination={paginationFactory(paginationOptions)}>
                {({ paginationProps, paginationTableProps }) => {
                    return (
                        <Pagination
                            isLoading={listLoading}
                            paginationProps={paginationProps}
                        >
                            <BootstrapTable
                                wrapperClasses="table-responsive"
                                bordered={false}
                                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                                bootstrap4
                                remote
                                keyField="Id"
                                data={entities === null ? [] : entities}
                                columns={columns}
                                defaultSorted={uiHelpers.defaultSorted}
                                onTableChange={getHandlerTableChange(
                                    formUIProps.setQueryParams
                                )}
                                // selectRow={getSelectRow({
                                //   entities,

                                // })}
                                {...paginationTableProps}
                            >
                                <PleaseWaitMessage entities={entities} />
                                <NoRecordsFoundMessage entities={entities} />
                            </BootstrapTable>
                        </Pagination>
                    );
                }}
            </PaginationProvider>
        </div>
    );
}
