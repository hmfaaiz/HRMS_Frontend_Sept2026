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

export function FormTable() {
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
      openPostingFormDialog: formUIContext.openPostingFormDialog,
      openHoldFormDialog: formUIContext.openHoldFormDialog,
      openCloseFormDialog: formUIContext.openCloseFormDialog,
    };
  }, [formUIContext]);


  const { currentState, userAccess } = useSelector(
    (state) => {
      return {


        currentState: state.applicant_profile,
        userAccess: state?.auth?.userAccess["applicant_profile"],
      }
    },
    shallowEqual
  );


  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);


    dispatch(actions.fetchApplicantProfile(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);


  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadApplicantProfile"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateApplicantProfile";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteApplicantProfile"
  );



  // Posting

  const isAccessForPost = userAccess?.find(
    (item) => item.componentName === "PostApplicantProfile"
  );
  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "HoldApplicantProfile"
  );
  const isAccessForClose = userAccess?.find(
    (item) => item.componentName === "CloseApplicantProfile"
  );
  // Table columns



  const columns = [

    // {
    //   dataField: "Subsidiary.name",
    //   text: "Subsidiary",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "200px",
    //   },
    // },

    {
      dataField: "FullName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
    },
    {
      dataField: "Country.name",
      text: "Country",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
    },
    {
      dataField: "City.name",
      text: "City",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
    },

    {
      dataField: "email_personal",
      text: "Personal Email",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
    },

    {
      dataField: "phone_cell",
      text: "Cell No.",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
    },



    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForView: isAccessForView ? isAccessForView.isAccess : false,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,


      },

      classes: "text-end pr-0",
      headerClasses: "text-end pr-3",
      style: {
        minWidth: "100px",
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
    </>
  );
}
