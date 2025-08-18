import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formdetailsActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormDetailsUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormDetailsUIContext";
import { Row, Col, Form } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import {
  DB_COLUMNS,
  FormClasses,
  Http,
  OperationStatus,
  RedirectURLs,
  TOAST_CONFIG,
} from "../../../../../utils/constants";
import { ToastContainer } from "react-toastify";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";
import { Link } from "@material-ui/core";
import axios from "axios";
import { setData } from "../../../../../../_metronic/redux/tripLogTable/tripLogTableSlice";
import { ChevronRight } from "lucide-react";
export const USERS_URL = process.env.REACT_APP_API_URL;

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.formDetails,
      userAccess: state?.auth?.userAccess["FormDetails"],
    };
  }, shallowEqual);
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
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [currentState]);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [heading, setHeading] = useState("");

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  // const newdata = Object.entries(currentState);

  const newdata = currentState.entities;
  const customList = currentState.customList || [];

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchUsers(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, formUIProps.setIds]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateChildForms"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteChildForms"
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
    //     minWidth: "160px",
    //   },
    // },
    {
      dataField: "formCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "formName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    // {
    //   dataField: "MenuName",
    //   text: "Parent",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
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
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
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
    parentId: formUIProps?.queryParams?.parentId,
  };
  const [handleClickTriggered, setHandleClickTriggered] = useState(false);

  // Handle click event for fetching child forms
  const handleClick = async (parentId, formName) => {
    setLoading(true);
    try {
      let updatedQueryParams = {
        ...formUIProps.queryParams,

        parentId,
      };

      // Set the updated queryParams
      formUIProps.setQueryParams(updatedQueryParams);
      dispatch(actions.customfetchFormDetail(parentId));
      setHeading(formName);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newdata) {
      // const firstMatchingObj = newdata?.find(obj => obj?.Id);
      // 2-7-2025
      const firstMatchingObj = newdata?.find((obj) => obj?.isActive === true);

      if (firstMatchingObj && !paginationOptions.parentId) {
        handleClick(firstMatchingObj?.Id, firstMatchingObj?.formName);
      }
      // newdata.filter(obj => obj?.Id == 45).forEach(obj => {
      //   handleClick(obj?.Id, obj?.formName);
      // });
    }
  }, [newdata]);

  return (
    <>
      {["1"]?.map((dd, index) => (
        <div className="grid grid-cols-3 sm:grid-cols-4  md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 my-4 gap-1 text-sm">
          {newdata
            ?.filter((obj) => obj.isActive == true)
            .map((obj, rightindex) => (
              <div
                className={`col-span-1 ${
                  heading === obj.formName
                    ? " text-tprimary font-bold underline"
                    : "text-black font-semibold"
                }`}
                key={rightindex}
              >
                <div
                  className="cursor-pointer hover:text-tprimary"
                  id={obj.Id}
                  onClick={() => {
                    handleClick(obj.Id, obj.formName);
                  }}
                >
                  <ChevronRight className="inline-block w-3 h-3" />
                  {obj.formName}
                </div>
              </div>
            ))}
        </div>
      ))}
      <hr />
      {heading && <h6 className="font-bold mb-0 text-primary">{heading} </h6>}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full overflow-x-auto">
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              // <Pagination
              //   isLoading={listLoading}
              //   paginationProps={paginationProps}
              // >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={customList === null ? [] : customList}
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
                <PleaseWaitMessage entities={customList} />
                <NoRecordsFoundMessage entities={customList} />
              </BootstrapTable>
              // </Pagination>
            );
          }}
        </PaginationProvider>
      </div>
    </>
  );
}
