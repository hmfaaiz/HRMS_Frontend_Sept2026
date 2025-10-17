import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import {
  getHandlerTableChange,
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import BootstrapTable from "react-bootstrap-table-next";

export function FormAuthortiesDialog({ id, show, onHide }) {
  // Customers UI Context
  const usersUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const usersUIProps = useMemo(() => {
    return {
      setYearId: usersUIContext.setYearId,
      yearId: usersUIContext.yearId,
      appraisalCategoryId: usersUIContext.appraisalCategoryId,
      setAppraisalCategoryId: usersUIContext.setAppraisalCategoryId,
    };
  }, [usersUIContext]);

  // Customers Redux state
  const { isLoading, entities } = useSelector(
    (state) => ({
      isLoading: state.appraisal_publish.actionsLoading,
      entities: state.appraisal_publish.appraisal_detail?.authorities || [],
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      dispatch(
        actions.viewAppraisalDetail({
          Id: id,
          yearId: usersUIProps?.yearId,
          appraisalCategoryId: usersUIProps?.appraisalCategoryId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const columns = [
    {
      dataField: "employeeCode", // Reference the parent object (department)
      text: "Emp Code", // Column heading
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
    },
    {
      dataField: "name",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "department",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "designation",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "employeeType",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "isHREvaluation",
      text: "Feedback Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
      formatter: (cell, row) => {
        return cell ? "HR" : row?.isSelf ? "Self" : "Supervisor";
      },
    },
    {
      dataField: "isSubmitted",
      text: "Feedback Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
      formatter: (cell) => {
        let text = "";
        let classname = "";
        if (cell === "noRecord") {
          text = "-";
          classname = "font-bold";
        } else if (cell) {
          text = "Completed";
          classname = "text-approved font-bold";
        } else if (!cell) {
          text = "Pending";
          classname = "text-pending font-bold";
        }
        return <span className={classname}>{text}</span>;
      },
    },
  ];

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Appraisal Submitted By
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <div className="w-full overflow-x-auto mt-4">
          <BootstrapTable
            noDataIndication={NoRecordsFoundMessage({ entities })}
            style={{ width: "100%", overflow: "auto" }}
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            remote
            keyField="Id"
            data={entities === null ? [] : entities}
            columns={columns}
          >
            <PleaseWaitMessage entities={entities} />
            <NoRecordsFoundMessage entities={entities} />
          </BootstrapTable>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={() => {
              onHide();
              usersUIProps.setYearId(null);
              usersUIProps?.setAppraisalCategoryId(null);
            }}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
