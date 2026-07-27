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

console.log("dashboard?.allAssetAssignmentListByEmpId111111",dashboard?.allAssetAssignmentListByEmpId)
  return (
    <>
        {assetMode && (
            <div className="w-full overflow-x-auto">
                <div className="flex justify-between items-center mb-3">
                    <h6 className="font-bold mb-0 text-primary">
                        Asset Detail
                    </h6>
                    {/* Optional: Add button if needed */}
                    {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={yourAddFunction}
                    >
                        <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                        Add
                    </button> */}
                </div>
                <div className="react-bootstrap-table table-responsive">
                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                            <td className="min-w-40">Asset No.</td>
                            <td className="min-w-40">Asset Category</td>
                            <td className="min-w-40">Model Name</td>
                            <td className="min-w-40">Date of Assignment</td>
                            <td className="min-w-40">Assigned By</td>
                        </tr>

                        {dashboard?.allAssetAssignmentListByEmpId?.length > 0 ? (
                            dashboard.allAssetAssignmentListByEmpId.map((row) => {
                                const modelName = row.AssetRegister?.AssetModel?.name || "";
                                const makeName =
                                    row.AssetRegister?.AssetModel?.AssetMake?.formName || "";

                                return (
                                    <tr key={row.Id}>
                                        <td>{row.AssetRegister?.asset_no || "-"}</td>
                                        <td>
                                            {row.AssetRegister?.AssetCategory?.formName || "-"}
                                        </td>
                                        <td>
                                            {makeName
                                                ? `${modelName} (${makeName})`
                                                : modelName}
                                        </td>
                                        <td>{row.date_of_assignment || "-"}</td>
                                        <td>{row.AssignedByEmployee?.fullName || "-"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No Records Found
                                </td>
                            </tr>
                        )}
                    </table>
                </div>
            </div>
        )}
    </>
);

}
