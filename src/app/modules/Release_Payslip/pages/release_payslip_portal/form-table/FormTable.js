import React, { useEffect, useMemo, useCallback } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { Checkbox } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";

export function FormTable() {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();

  // ------------------ Extract Context Properties ------------------
  const { subsidiaryId, updatedRow, setUpdatedRow } = useMemo(
    () => ({
      subsidiaryId: formUIContext?.subsidiaryId,
      updatedRow: formUIContext?.updatedRow,
      setUpdatedRow: formUIContext?.setUpdatedRow,
    }),
    [formUIContext]
  );

  // ------------------ Redux State ------------------
  const { entities, actionLoading } = useSelector(
    (state) => ({
      entities: state.release_payslip.entities,
      actionLoading: state?.release_payslip?.actionLoading,
    }),
    shallowEqual
  );

  // ------------------ Fetch Payroll Groups ------------------
  useEffect(() => {
    if (subsidiaryId) {
      dispatch(actions.fetchPayrollGroup({ subsidiaryId }));
    }
  }, [dispatch, subsidiaryId]);

  // ------------------ Sync Entities to Local State ------------------
  useEffect(() => {
    setUpdatedRow(entities?.length > 0 ? entities?.map((e) => ({ ...e })) : []);
  }, [entities, setUpdatedRow]);

  // ------------------ Handle Checkbox Change ------------------
  const handleCheckboxChange = useCallback(
    (rowId) => {
      setUpdatedRow((prev) =>
        prev.map((item) =>
          item.Id === rowId
            ? { ...item, isShowOnPortal: !item.isShowOnPortal }
            : item
        )
      );
    },
    [setUpdatedRow]
  );

  // ------------------ Table Columns ------------------
  const columns = [
    {
      dataField: "PayrollGroup.formName",
      text: "Payroll Group",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "isFinalized",
      text: "Finalized",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => (cell ? "Yes" : "No"),
    },
    {
      dataField: "isShowOnPortal",
      text: "Release Payslip On Employee Portal",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
      formatter: (cell, row) => (
        <Checkbox
          isSelected={row.isShowOnPortal}
          onChange={() => handleCheckboxChange(row.Id)}
          disabled={actionLoading}
        />
      ),
    },
  ];

  const handleSubmit = () => {
    dispatch(actions.updatePayrollGroupForReleasePayslip(updatedRow)).then(
      () => {
        dispatch(actions.fetchPayrollGroup({ subsidiaryId }));
      }
    );
  };

  // ------------------ Render ------------------
  return (
    <div className="w-full overflow-x-auto scrollbar-fancy">
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center table-hover"
        bootstrap4
        keyField="Id"
        data={updatedRow || []}
        columns={columns}
      >
        <PleaseWaitMessage entities={updatedRow} />
        <NoRecordsFoundMessage entities={updatedRow} />
      </BootstrapTable>
      <hr />
      <div className="flex justify-end items-center">
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary btn-elevate"
          disabled={actionLoading || updatedRow?.length == 0}
        >
          Save
          {actionLoading && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )}
        </button>
      </div>
    </div>
  );
}
