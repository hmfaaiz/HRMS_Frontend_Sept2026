import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
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
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { formatNumberWithCommas } from "../../../../../utils/common";
import TCard from "../../../../../utils/common-modules/TCard";
export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
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
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.reimbursement_claim,
      userAccess: state?.auth?.userAccess["reimbursement_claim"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds("");

    dispatch(actions.fetchReimbursementClaim(formUIProps));
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.employeeId]);

  // const isAccessForEdit = userAccess?.find(
  //   (item) => item.componentName === "UpdateReimbursementClaim"
  // );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteReimbursementClaim"
  );
  
  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadReimbursementClaim"
  );
  // Table columns
  const columns = [
    // {
    //   dataField: "Id",
    //   text: "ID",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "10px",
    //   },
    // },
    {
      dataField: "ReimbursementType.formName",
      text: "Reimbursement Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    // {
    //   dataField: "Employee.firstName",
    //   text: "Employee",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "10px",
    //   },

    // },

    {
      dataField: "date",
      text: "date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      formatter: (cell) => {
        // Format the date without timestamp
        return format(new Date(cell), "dd-MMM-yyyy"); // Customize format as needed
      },
    },

    {
      dataField: "currentMonth",
      text: "Pay in",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      // formatter: (cell) => {
      //   // Format the date without timestamp
      //   return format(new Date(cell), 'dd-MMM-yyyy'); // Customize format as needed
      // },
    },

    {
      dataField: "amount",
      text: "amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },

    {
      dataField: "approved_status",
      text: "approved status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        switch (cell) {
          case 0:
            return "Pending";
          case 1:
            return "Approved";
          case 2:
            return "Rejected";
          default:
            return "Unknown"; // Default case if status is outside 0, 1, 2.
        }
      },
    },

    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setIds: formUIProps.setIds,
        setIsFileReq: formUIProps.setIsFileReq,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        // openActiveFormDialog: formUIProps.openActiveFormDialog,
        // openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "10px",
      },
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
    <>
      {/* <Accordion defaultActiveKey=""> */}
        {/* <TCard name="Details"> */}
          {/* <Card.Header className="d-flex justify-content-center"> */}
            {/* <div className="accordion-header-btn w-100  d-flex justify-content-center"> */}
              {/* <Accordion.Toggle
                eventKey="0"
                className="flex-between-center text-bold"
              > */}
                
                <h6 className="font-bold mb-0 text-primary my-2">
                        Details
                        </h6>
                {/* <KeyboardArrowDown />
              </Accordion.Toggle> */}
            {/* </div> */}
          {/* </Card.Header> */}
          {/* <Accordion.Collapse eventKey="0"> */}
            <div className="w-full overflow-x-auto">
              <PaginationProvider
                pagination={paginationFactory(paginationOptions)}
              >
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
          {/* </Accordion.Collapse> */}
        {/* </TCard> */}
      {/* </Accordion> */}
    </>
  );
}
