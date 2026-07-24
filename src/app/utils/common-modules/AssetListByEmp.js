import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";

import { shallowEqual, useDispatch, useSelector } from "react-redux";



import { format } from "date-fns";
import { fetchAssetAssignmentListByEmpId } from "../../modules/Dashboard/_redux/dashboardActions";
import { NoRecordsFoundMessage, PleaseWaitMessage } from "../../../_metronic/_helpers";


export function AssetListByEmp({ employeeId, assetMode }) {

    console.log("employeeId11111", employeeId)
    const dispatch = useDispatch();
    const { dashboard } = useSelector((state) => state);
    useEffect(() => {
        if (!employeeId) return;



        dispatch(
            fetchAssetAssignmentListByEmpId(
                employeeId
            )
        );
    }, [employeeId, dispatch]);



    const columns = [
        {
            dataField: "AssetRegister.asset_no",
            text: "Asset No.",
            formatter: (_, row) => row.AssetRegister?.asset_no || "",
        },
        {
            dataField: "AssetRegister.AssetCategory.formName",
            text: "Asset Category",
            formatter: (_, row) =>
                row.AssetRegister?.AssetCategory?.formName || "-",
        },
        {
            dataField: "AssetRegister.AssetModel.name",
            text: "Model Name",
            formatter: (_, row) => {
                const modelName = row.AssetRegister?.AssetModel?.name || "";
                const makeName =
                    row.AssetRegister?.AssetModel?.AssetMake?.formName || "";

                return makeName
                    ? `${modelName} (${makeName})`
                    : modelName;
            },
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
            text: "Assigned By",
            formatter: (_, row) =>
                row.AssignedByEmployee?.fullName || "-",
        },



    ];

    console.log("aaaaaa2222222", dashboard?.allAssetAssignmentListByEmpId)
    return (
        <>


            {assetMode && (
                <div className="w-full overflow-x-auto">

                    <BootstrapTable
                        wrapperClasses="table-responsive"
                        bordered={false}
                        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                        bootstrap4
                        remote
                        keyField="Id"
                        data={
                            Array.isArray(dashboard?.allAssetAssignmentListByEmpId)
                                ? dashboard.allAssetAssignmentListByEmpId
                                : []
                        }
                        columns={columns}
                        defaultSorted={[{ dataField: "id", order: "asc" }]}

                    >
                        <PleaseWaitMessage assignmentList={dashboard?.allAssetAssignmentListByEmpId} />
                        <NoRecordsFoundMessage assignmentList={dashboard?.allAssetAssignmentListByEmpId} />
                    </BootstrapTable>

                </div>

            )}
        </>
    );

}
