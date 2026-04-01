import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { useDispatch } from "react-redux";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";

import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";

export function FormTable({ onEditClick }) {
  const { employeeId, setUserForEdit, setPanelMode } = useFormUIContext();

  // Mock data - replace with entities from Redux later
  const travelRequests = [
    {
      id: 1,
      purpose: "Trip for Client Visit",
      project: "Project-X",
      travelType: "International",
      date: "27-Nov-2025",
      status: 0,
    },
    {
      id: 2,
      purpose: "Internal Audit",
      project: "Standard Ops",
      travelType: "Domestic",
      date: "22-Jul-2025",
      status: 1,
    }
  ];

  const columns = [
    {
      dataField: "purpose",
      text: "Purpose",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "160px" },
    },
    {
      dataField: "project",
      text: "Project",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "160px" },
    },
    {
      dataField: "travelType",
      text: "Travel Type",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "130px" },
    },
    {
      dataField: "date",
      text: "Travel Date",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "120px" },
    },
    {
      dataField: "status",
      text: "Approved Status",
      formatter: (cell) => {
        const statuses = ["Pending", "Approved", "Rejected"];
        return statuses[cell] || "Unknown";
      },
      style: { minWidth: "130px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "120px" },
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openReadFormDialog: (row) => {
          setUserForEdit(row);
          setPanelMode(true);
        },
        openEditFormDialog: onEditClick || ((row) => {
          setUserForEdit(row);
          setPanelMode(true);
        }),
        openDeleteFormDialog: (id) => {
          console.log("Delete clicked for id:", id);
        },
      },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: travelRequests.length,
    sizePerPage: 10,
    page: 1,
  };

  return (
    <div className="mt-5 mb-8 font-sans">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <Pagination paginationProps={paginationProps}>
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              remote
              keyField="id"
              data={travelRequests}
              columns={columns}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={travelRequests} />
              <NoRecordsFoundMessage entities={travelRequests} />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}
