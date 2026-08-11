import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/designationActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../ReligionUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useDesignationUIContext } from "../DesignationUIContext";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";
import { format } from "date-fns";
import { downloadEmpProfilePdf } from "../../../_redux/designationActions";


export function DesignationTable({onHide}) {
  //Users UI Context
  const designationUIContext = useDesignationUIContext();

  const religionUIProps = useMemo(() => {
    return {
      ids: designationUIContext.ids,
      setIds: designationUIContext.setIds,
      queryParams: designationUIContext.queryParams,
      setQueryParams: designationUIContext.setQueryParams,
      openEditDesignationDialog: designationUIContext.openEditDesignationDialog,
      openDeleteDesignationDialog: designationUIContext.openDeleteDesignationDialog,
      openActiveDesignationDialog: designationUIContext.openActiveDesignationDialog,
      openReadDesignationDialog: designationUIContext.openReadDesignationDialog,
    };
  }, [designationUIContext]);


  const { currentState, userAccess } = useSelector(
    (state) => {   return {
      
      currentState: state.profile,
      userAccess: state?.auth?.userAccess["Profile"],
    }},
    shallowEqual
  );

  
  const { totalCount, entities, listLoading, profilePdfLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    religionUIProps.setIds([]);

    dispatch(actions.fetchUsers(religionUIProps.queryParams));
  }, [religionUIProps.queryParams, dispatch, totalCount]);


  // For Getting Contact Info
  // useEffect(() => {
  //   religionUIProps.setIds([]);

  //   dispatch(actions.fetchContactInfo(religionUIProps.queryParams));
  // }, [religionUIProps.queryParams, dispatch, totalCount]);

 
  const isInactive = !religionUIProps.queryParams.isActive;
  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateProfile"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteProfile"
  ); 
  
  const isAccessForRead= userAccess?.find(
    (item) => item.componentName === "ReadProfile"
  );
  // Table columns
  const columns = [
   
    {
      dataField: "employeeCode",
      text: "Employee Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "fullName",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "department.deptName",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "designation.formName",
      text: "Designation",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
 
    {
      dataField: "employeeType.formName",
      text: "employee Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "dateOfJoining",
      text: "date Of Joining",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter : (cell) => {return format(new Date(cell) , "dd-MMM-yyyy")}
    },

    ...(isInactive
      ? [
          {
            dataField: "exitType",
            text: "Exit Type",
            sort: false,
            style: { minWidth: "140px" },
            formatter: (cell) => cell || "-",
          },
          {
            dataField: "exitReason",
            text: "Exit Reason",
            sort: false,
            style: { minWidth: "140px" },
            formatter: (cell) => cell || "-",
          },
          {
            dataField: "lastWorkingDate",
            text: "Last Working Date",
            sort: false,
            style: { minWidth: "160px" },
            formatter: (cell) => cell || "-",
          },
        ]
      : []),

    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditDesignationDialog: religionUIProps.openEditDesignationDialog,
        openDeleteDesignationDialog: religionUIProps.openDeleteDesignationDialog,
        openActiveDesignationDialog: religionUIProps.openActiveDesignationDialog,
        openReadDesignationDialog: religionUIProps.openReadDesignationDialog,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        dispatch,
        profilePdfLoading,
        downloadEmpProfilePdf,
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
    sizePerPage: religionUIProps.queryParams.pageSize,
    page: religionUIProps.queryParams.pageNumber,
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
                  religionUIProps.setQueryParams
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
