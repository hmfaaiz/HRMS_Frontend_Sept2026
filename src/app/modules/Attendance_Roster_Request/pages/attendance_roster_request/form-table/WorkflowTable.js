import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector } from "react-redux"; 
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";

export function WorkflowAuthortiesTable() {
  const formUIContext = useFormUIContext();

  const empAuthorityList = useSelector(
    (state) => state?.attendance_roster_request?.empAuthorityList || []
  );

  const columns = [
    {
      dataField: "level",
      text: "WF Level",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "employeeCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell, row) =>
        `${row?.firstName || ""} ${row?.middleName || ""} ${row?.lastName || ""}`,
    },
    {
      dataField: "department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "grade.formName",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
    },
    {
      dataField: "deligationAuthorityName",
      text: "Delegation Authority",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell, row) => row?.deligationAuthorityName || "-",
    },
  ];

  return (
    <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg max-h-56 overflow-y-auto">
      <h6 className="font-bold mb-0 text-primary my-2">Workflow Authorities</h6>
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities: empAuthorityList })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={empAuthorityList}          
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
      >
        <PleaseWaitMessage entities={empAuthorityList} />
        <NoRecordsFoundMessage entities={empAuthorityList} />
      </BootstrapTable>
    </div>
  );
}