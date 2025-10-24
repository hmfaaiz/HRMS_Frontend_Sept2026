import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector } from "react-redux";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
export function FormTable() {
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.resignation_request,
    };
  }, shallowEqual);

  const { rejectedRecord } = currentState;
  // Table columns
  const columns = [
    {
      dataField: "resignationDate",
      text: "Resignation Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
    },
    {
      dataField: "ExitType.formName",
      text: "Exit Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
      },
    },
    {
      dataField: "ExitReason.exitReason",
      text: "Exit Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
      },
    },
    {
      dataField: "exitRemark",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
      },
    },
    {
      dataField: "request_remarks",
      text: "Rejection Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
    },
  ];

  return (
    <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg max-h-56 overflow-y-auto">
      <h6 className="font-bold mb-0 text-primary my-2">
        Rejected Resignations
      </h6>
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({
          entities: rejectedRecord || [],
        })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={rejectedRecord || []}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
      >
        <PleaseWaitMessage entities={rejectedRecord || []} />
        <NoRecordsFoundMessage entities={rejectedRecord || []} />
      </BootstrapTable>
    </div>
  );
}
