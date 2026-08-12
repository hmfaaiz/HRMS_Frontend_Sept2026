import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Modal } from "react-bootstrap";
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
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";
import { fetchAssetChecklistById } from "../../../../Dashboard/_redux/dashboardActions";

export function AssetAssessmentTable({ show, onHide, Id }) {
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
      openReadAssetHistoryDialog: formUIContext.openReadAssetHistoryDialog,
      openReadAssetAssessmentDialog: formUIContext.openReadAssetAssessmentDialog,
    };
  }, [formUIContext]);



  const { dashboard } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    if (show && Id) {
      formUIProps.setIds([]);
      dispatch(fetchAssetChecklistById(Id));
    }
  }, [dispatch, Id, show]);

  const statusOptions = [
    { value: 0, label: "Unassigned" },
    { value: 1, label: "Assigned" },
    { value: 2, label: "Disposed" },
  ];

  const columns = [

    {
      dataField: "assetNo",
      text: "Asset No.",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },

    },
    {
      dataField: "AssetModel.name",
      text: "Model Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
      formatter: (_, row) => {
        const modelName = row.AssetModel?.name || "";
        const makeName = row.AssetModel?.AssetMake?.formName || "";

        return makeName
          ? `${modelName} (${makeName})`
          : modelName;
      },
    },

    {
      dataField: "date_of_inspection",
      text: "Date Of Inspection",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },

    },

    {
      dataField: "InspectedByEmployee",
      text: "Inspected By",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },

    },

    {
      dataField: "event_for_inspection",
      text: "Inspection Event",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },

    },



    {
      dataField: "reason_for_inspection",
      text: "Reason for Inspection",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      // formatter: (cell) => {
      //   if (!cell) return "";
      //   return cell.length > 160 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 160) + "..."}</span> : cell;
      // },

      formatter: (cell) => {
        if (!cell) return "";

        const maxLength = 670;
        const wrapLength = 170;

        // truncate after 500
        let text = cell.length > maxLength ? cell.substring(0, maxLength) + "..." : cell;

        // insert line breaks every 160 chars
        const formattedText = text.match(new RegExp(`.{1,${wrapLength}}`, "g"))?.join("\n");

        return (
          <span
            data-bs-toggle="tooltip"
            title={cell}
            style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
          >
            {formattedText}
          </span>
        );
      }


    },




  ];


  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="asset-history-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Asset Assessment</Modal.Title>
           <button
          type="button"
          onClick={onHide}
          aria-label="Close"
          style={{
            marginLeft: "auto",
            border: "none",
            background: "transparent",
            fontSize: "28px",
            lineHeight: "1",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#000",
            opacity: 1,
            display: "block",
            width: "40px",
            height: "40px",
          }}
        >
          ×
        </button>
      </Modal.Header>

      <Modal.Body>
        <BootstrapTable
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
          bootstrap4
          remote
          keyField="Id"
          data={dashboard?.allAssetChecklistById || []}
          columns={columns}
          defaultSorted={uiHelpers.defaultSorted}
          onTableChange={getHandlerTableChange(
            formUIProps.setQueryParams
          )}
        >
          <PleaseWaitMessage entities={dashboard?.allAssetChecklistById} />
          <NoRecordsFoundMessage entities={dashboard?.allAssetChecklistById} />
        </BootstrapTable>
      </Modal.Body>
    </Modal>
  );
}