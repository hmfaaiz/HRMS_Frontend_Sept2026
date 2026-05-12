// import React, { useEffect, useMemo } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory, {
//   PaginationProvider,
// } from "react-bootstrap-table2-paginator";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import * as actions from "../../../_redux/redux-Actions";
// import { format } from "date-fns";
// import {
//   getHandlerTableChange,
//   NoRecordsFoundMessage,
//   PleaseWaitMessage,
//   sortCaret,
//   headerSortingClasses,
// } from "../../../../../../_metronic/_helpers";
// import * as uiHelpers from "../FormUIHelpers";
// import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
// import { Pagination } from "../../../../../../_metronic/_partials/controls";
// import { useFormUIContext } from "../FormUIContext";
// import { Accordion, Button, Card } from "react-bootstrap";
// import { KeyboardArrowDown } from "@material-ui/icons";
// import { formatNumberWithCommas } from "../../../../../utils/common";

// export function FormTable() {
//   //Users UI Context
//   const formUIContext = useFormUIContext();

//   const formUIProps = useMemo(() => {
//     return {
//       ids: formUIContext.ids,
//       setIds: formUIContext.setIds,
//       setIsFileReq: formUIContext.setIsFileReq,
//       employeeId: formUIContext.employeeId,
//       queryParams: formUIContext.queryParams,
//       setQueryParams: formUIContext.setQueryParams,
//       openEditFormDialog: formUIContext.openEditFormDialog,
//       openDeleteFormDialog: formUIContext.openDeleteFormDialog,
//       openActiveFormDialog: formUIContext.openActiveFormDialog,
//       openReadFormDialog: formUIContext.openReadFormDialog,
//     };
//   }, [formUIContext]);

//   const { currentState, userAccess } = useSelector((state) => {
//     return {
//       currentState: state.employee_loan_request,
//       userAccess: state?.auth?.userAccess["employee_loan_request"],
//     };
//   }, shallowEqual);

//   const { totalCount, entities, listLoading } = currentState;

//   //totalCount = 10

//   const dispatch = useDispatch();

//   useEffect(() => {
//     formUIProps.setIds("");

//     dispatch(actions.fetchEmployeeLoanRequest(formUIProps));
//   }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.employeeId]);

//   const isAccessForEdit = userAccess?.find(
//     (item) => item.componentName === "UpdateEmployeeLoanRequest"
//   );

//   const isAccessForDelete = userAccess?.find(
//     (item) => item.componentName === "DeleteEmployeeLoanRequest"
//   );
//   // Table columns
//   const columns = [
//     {
//       dataField: "LoanType.name",
//       text: "Loan Type",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "160px",
//       },
//     },

//     {
//       dataField: "total_loan_amount",
//       text: "total loan amount",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "10px",
//         textAlign: "center",
//       },
//       headerStyle: {
//         textAlign: "center", // Align header text to the left
//       },
//       formatter: (cell) => formatNumberWithCommas(cell),
//     },

//     {
//       dataField: "monthly_installment",
//       text: "monthly installment",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "10px",
//         textAlign: "center",
//       },
//       headerStyle: {
//         textAlign: "center", // Align header text to the left
//       },
//       formatter: (cell) => formatNumberWithCommas(cell),
//     },
//     {
//       dataField: "total_installment",
//       text: "total installments",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "10px",
//         textAlign: "center",
//       },
//       headerStyle: {
//         textAlign: "center", // Align header text to the left
//       },
//       formatter: (cell) => formatNumberWithCommas(cell),
//     },

//     {
//       dataField: "applied_date",
//       text: "applied date",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "10px",
//       },
//       formatter: (cell) => {
//         // Format the date without timestamp
//         return format(new Date(cell), "dd-MMM-yyyy"); // Customize format as needed
//       },
//     },

//     {
//       dataField: "approved_status",
//       text: "Status",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "160px",
//       },
//       formatter: (cell, row) => {
//         let text = "";
//         let style = {};
//         if (cell === 0 && !row?.isLoanContinuing) {
//           text = "Pending (Portal)";
//           style = { color: "green", fontWeight: "bold" };
//         } else if (cell === 0) {
//           text = "Pending (HRMS)";
//           style = { color: "green", fontWeight: "bold" };
//         } else if (cell === 1) {
//           text = !row?.isLoanContinuing ? "Completed" : "Active";
//           style = { color: "black", fontWeight: "bold" };
//         } else if (cell === 2) {
//           text = "Rejected";
//           style = { color: "red", fontWeight: "bold" };
//         }
//         return <span style={style}>{text}</span>;
//       },
//     },

//     {
//       dataField: "action",
//       text: "Actions",
//       isDummyField: true,
//       formatter: ActionsColumnFormatter,
//       formatExtraData: {
//         setIds: formUIProps.setIds,
//         setIsFileReq: formUIProps.setIsFileReq,
//         openEditFormDialog: formUIProps.openEditFormDialog,
//         openDeleteFormDialog: formUIProps.openDeleteFormDialog,
//         // openActiveFormDialog: formUIProps.openActiveFormDialog,
//         // openReadFormDialog: formUIProps.openReadFormDialog,
//         isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
//         isAccessForDelete: isAccessForDelete
//           ? isAccessForDelete.isAccess
//           : false,
//       },
//       classes: "text-right pr-0",
//       headerClasses: "text-right pr-3",
//       style: {
//         minWidth: "10px",
//       },
//     },
//   ];

//   //Table pagination properties
//   const paginationOptions = {
//     custom: true,
//     totalSize: totalCount,
//     sizePerPageList: uiHelpers.sizePerPageList,
//     sizePerPage: formUIProps.queryParams.pageSize,
//     page: formUIProps.queryParams.pageNumber,
//   };

//   return (
//     <>
   
      
       
//             {/* <div className="accordion-header-btn w-100  d-flex justify-content-center">
//               <Accordion.Toggle
//                 as={Button}
//                 eventKey="0"
//                 className="flex-between-center text-bold"
//               >
//                 Employee Loan Request
//                 <KeyboardArrowDown />
//               </Accordion.Toggle>
//             </div> */}
//             <h6 className="font-bold mb-0 text-primary my-2">
//                         Details
//                         </h6>
        
//             <div className="w-full overflow-x-auto">
//               <PaginationProvider
//                 pagination={paginationFactory(paginationOptions)}
//               >
//                 {({ paginationProps, paginationTableProps }) => {
//                   return (
//                     <Pagination
//                       isLoading={listLoading}
//                       paginationProps={paginationProps}
//                     >
//                       <BootstrapTable
//                         wrapperClasses="table-responsive"
//                         bordered={false}
//                         classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
//                         bootstrap4
//                         remote
//                         keyField="Id"
//                         data={entities === null ? [] : entities}
//                         columns={columns}
//                         defaultSorted={uiHelpers.defaultSorted}
//                         onTableChange={getHandlerTableChange(
//                           formUIProps.setQueryParams
//                         )}
//                         // selectRow={getSelectRow({
//                         //   entities,

//                         // })}
//                         {...paginationTableProps}
//                       >
//                         <PleaseWaitMessage entities={entities} />
//                         <NoRecordsFoundMessage entities={entities} />
//                       </BootstrapTable>
//                     </Pagination>
//                   );
//                 }}
//               </PaginationProvider>
//             </div>
      
      
     
//     </>
//   );
// }




import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { downloadLoanPdf, downloadLoanCompletionPdf } from "../../../_redux/redux-Actions"; // ← added downloadLoanCompletionPdf
import { format } from "date-fns";
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
import { formatNumberWithCommas } from "../../../../../utils/common";
import { InstallmentDetailTable } from "./InstallmentDetailTable";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

async function fetchInstallmentDetails(loanRequestId) {
  const res = await axios.post(
    `${API_URL}/employee_loan_request/read-employee-loan-request`,
    { Id: loanRequestId }
  );
  return res.data?.data?.details || [];
}

function ExpandedRowRenderer({ row }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchInstallmentDetails(row.Id)
      .then((data) => { setDetails(data); setLoading(false); })
      .catch(() => { setDetails([]); setLoading(false); });
  }, [row.Id]);

  return <InstallmentDetailTable details={details || []} loading={loading} />;
}

export function FormTable({ showDetails }) {
  const formUIContext = useFormUIContext();
  const [expandedRows, setExpandedRows] = useState([]);
  const dispatch = useDispatch();

  const formUIProps = useMemo(() => ({
    ids: formUIContext.ids,
    setIds: formUIContext.setIds,
    setIsFileReq: formUIContext.setIsFileReq,
    employeeId: formUIContext.employeeId,
    queryParams: formUIContext.queryParams,
    setQueryParams: formUIContext.setQueryParams,
    openEditFormDialog: formUIContext.openEditFormDialog,
    openDeleteFormDialog: formUIContext.openDeleteFormDialog,
    openActiveFormDialog: formUIContext.openActiveFormDialog,
    openReadFormDialog: formUIContext.openReadFormDialog,
    openInstallmentDetails: formUIContext.openInstallmentDetails,
  }), [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => ({
    currentState: state.employee_loan_request,
    userAccess: state?.auth?.userAccess["employee_loan_request"],
  }), shallowEqual);

  // ← destructure completionPdfLoading alongside pdfLoading
  const { totalCount, entities, listLoading, pdfLoading, completionPdfLoading } = currentState;

  useEffect(() => {
    if (!showDetails) {
      setExpandedRows([]);
    }
  }, [showDetails]);

  useEffect(() => {
    formUIProps.setIds("");
    dispatch(actions.fetchEmployeeLoanRequest(formUIProps));
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.employeeId]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEmployeeLoanRequest"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeLoanRequest"
  );

  const handleExpand = (row, isExpand) => {
    setExpandedRows((prev) =>
      isExpand
        ? prev.includes(row.Id) ? prev : [...prev, row.Id]
        : prev.filter((id) => id !== row.Id)
    );
  };

  const expandRow = showDetails
    ? {
        renderer: (row) => <ExpandedRowRenderer row={row} />,
        expanded: expandedRows,
        expandByColumnOnly: true,
        onExpand: handleExpand,
        showExpandColumn: true,
        expandColumnPosition: "left",
        expandHeaderColumnRenderer: () => null,
        expandColumnRenderer: ({ expanded }) => (
          <button
            type="button"
            title={expanded ? "Collapse" : "View installment schedule"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "2px 4px", display: "inline-flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 20, height: 20, borderRadius: "50%",
              background: expanded ? "#009EF7" : "#e2eaf5",
              color: expanded ? "#fff" : "#4a5568",
              fontSize: 10, fontWeight: 700,
              transition: "background 0.2s, transform 0.2s",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}>
              ▶
            </span>
          </button>
        ),
      }
    : {
        renderer: () => null,
        expanded: [],
        expandByColumnOnly: true,
        showExpandColumn: false,
      };

  const columns = [
    {
      dataField: "LoanType.name",
      text: "Loan Type",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
    },
    {
      dataField: "total_loan_amount",
      text: "Total Loan Amount",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "10px", textAlign: "center" },
      headerStyle: { textAlign: "center" },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "monthly_installment",
      text: "Monthly Installment",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "10px", textAlign: "center" },
      headerStyle: { textAlign: "center" },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "total_installment",
      text: "Total Installments",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "10px", textAlign: "center" },
      headerStyle: { textAlign: "center" },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "applied_date",
      text: "Applied Date",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "10px" },
      formatter: (cell) => format(new Date(cell), "dd-MMM-yyyy"),
    },
    {
      dataField: "approved_status",
      text: "Status",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell, row) => {
        let text = "";
        let style = {};
        if (cell === 0 && !row?.isLoanContinuing) {
          text = "Pending (Portal)"; style = { color: "green", fontWeight: "bold" };
        } else if (cell === 0) {
          text = "Pending (HRMS)"; style = { color: "green", fontWeight: "bold" };
        } else if (cell === 1) {
          text = !row?.isLoanContinuing ? "Completed" : "Active";
          style = { color: "black", fontWeight: "bold" };
        } else if (cell === 2) {
          text = "Rejected"; style = { color: "red", fontWeight: "bold" };
        }
        return <span style={style}>{text}</span>;
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      headerAlign: "right",
      align: "right",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setIds: formUIProps.setIds,
        setIsFileReq: formUIProps.setIsFileReq,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openInstallmentDetails: formUIProps.openInstallmentDetails,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
        dispatch,
        pdfDownloading: pdfLoading,
        completionPdfLoading,
        downloadLoanPdf,
        downloadLoanCompletionPdf,
        showDetails,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "10px" },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <>
      <h6 className="font-bold mb-0 text-primary my-2">Details</h6>
      <div className="w-full overflow-x-auto">
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <Pagination isLoading={listLoading} paginationProps={paginationProps}>
              <BootstrapTable
                key={showDetails ? "expanded" : "collapsed"}
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={!entities ? [] : entities.filter(Boolean)}
                columns={columns}
                expandRow={expandRow}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          )}
        </PaginationProvider>
      </div>
    </>
  );
}