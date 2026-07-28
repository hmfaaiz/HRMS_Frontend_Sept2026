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

export function AssetHistoryTable({ show, onHide, Id }) {
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
      openReadAssetHistoryDialog:formUIContext.openReadAssetHistoryDialog,
      openReadAssetAssessmentDialog:formUIContext.openReadAssetAssessmentDialog,
    };
  }, [formUIContext]);

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.asset_register,
    }),
    shallowEqual
  );

  const { assignmentHistory, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    if (show && Id) {
      formUIProps.setIds([]);
      dispatch(actions.fetchAssetAssignmentHistory(Id));
    }
  }, [dispatch, Id, show]);

  const statusOptions = [
    { value: 0, label: "Unassigned" },
    { value: 1, label: "Assigned" },
    { value: 2, label: "Disposed" },
  ];

  const columns = [
    {
      dataField: "AssignedEmployee.fullName",
      text: "Assign To",
      formatter: (_, row) => row.AssignedEmployee?.fullName || "-",
    },
    {
      dataField: "AssignedEmployee.designation.formName",
      text: "Designation",
      formatter: (_, row) =>
        row.AssignedEmployee?.designation?.formName || "-",
    },
    {
      dataField: "date_of_assignment",
      text: "Date of Assignment",
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "-",
    },
    {
      dataField: "date_of_return",
      text: "Date of Return",
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "-",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (_, row) => {
        const status = statusOptions.find(
          (item) => item.value === Number(row.status)
        );
        return status?.label || "-";
      },
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
        <Modal.Title>Asset Assignment History</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <BootstrapTable
          wrapperClasses="table-responsive"
          bordered={false}
          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
          bootstrap4
          remote
          keyField="Id"
          data={assignmentHistory || []}
          columns={columns}
          defaultSorted={uiHelpers.defaultSorted}
          onTableChange={getHandlerTableChange(
            formUIProps.setQueryParams
          )}
        >
          <PleaseWaitMessage entities={assignmentHistory} />
          <NoRecordsFoundMessage entities={assignmentHistory} />
        </BootstrapTable>
      </Modal.Body>
    </Modal>
  );
}