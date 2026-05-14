import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { format } from "date-fns";
import { Checkbox } from "../../../../../../_metronic/_partials/controls";
import {
  NoRecordsFoundMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";

export function TravelRequestGrid({ segments, employeeEntitlement }) {
  const isHotelSelfAllowed = !!employeeEntitlement?.ishotelEntitlementSelfAmountWise;

  const columns = useMemo(() => {
    return [
      {
        dataField: "FromLocation.formName",
        text: "From Location",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "150px" },
        formatter: (cell) => cell || "-",
      },
      {
        dataField: "ToLocation.formName",
        text: "To Location",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "150px" },
        formatter: (cell) => cell || "-",
      },
      {
        dataField: "fromDate",
        text: "From Date",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "120px" },
        formatter: (cell) =>
          cell ? format(new Date(cell), "dd-MMM-yyyy") : "-",
      },
      {
        dataField: "toDate",
        text: "To Date",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "120px" },
        formatter: (cell) =>
          cell ? format(new Date(cell), "dd-MMM-yyyy") : "-",
      },
      {
        dataField: "ModeOfTravel.formName",
        text: "Mode of Travel",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "130px" },
        formatter: (cell) => cell || "-",
      },
      {
        dataField: "ClassOfTravel.formName",
        text: "Class of Travel",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "130px" },
        formatter: (cell) => cell || "-",
      },
      {
        dataField: "HotelEntitlement.formName",
        text: "Hotel Entitlement",
        sort: false,
        sortCaret: sortCaret,
        style: { minWidth: "150px" },
        formatter: (cell, row) => {
          if (row.accomodationRequired && !row.selfEntitlement) {
            return cell || "-";
          }
          return "";
        },
      },
      // {
      //   dataField: "hotelEntitlementAmount",
      //   text: "Hotel Entitlement Amount",
      //   sort: false,
      //   sortCaret: sortCaret,
      //   classes: "text-right",
      //   headerClasses: "text-right",
      //   style: { minWidth: "160px" },
      //   formatter: (cell, row) => {
      //     if (row.accomodationRequired && !row.selfEntitlement) {
      //       return cell ? Number(cell).toLocaleString() : "0";
      //     }
      //     return "";
      //   },
      // },
      {
        dataField: "selfAmount",
        text: "Self Amount",
        sort: false,
        sortCaret: sortCaret,
        classes: "text-right",
        headerClasses: "text-right",
        style: { minWidth: "120px" },
        formatter: (cell, row) => {
          if (row.selfEntitlement) {
            return cell ? Number(cell).toLocaleString() : "0";
          }
          return "";
        },
      },
    ];
  }, []);

  return (
    <div className="mt-4 overflow-hidden rounded-lg border">
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center table-hover mb-0"
        bootstrap4
        keyField="Id"
        data={segments || []}
        columns={columns}
        noDataIndication={NoRecordsFoundMessage({
          entities: segments || [],
        })}
      />
    </div>
  );
}
