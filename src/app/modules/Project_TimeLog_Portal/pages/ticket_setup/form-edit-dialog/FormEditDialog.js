import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEdit";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fetchAllTicket } from "../../../../Dashboard/_redux/dashboardActions";

export function FormEditDialog({ Id }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const formUIContext = useFormUIContext();
  const { queryParams, initVal, employeeId, setId } = formUIContext || {};
  const [queryPrefill, setQueryPrefill] = useState({});

  const { dataForEdit, actionsLoading = false } = useSelector(
    (state) => state.project_timelog_portal || {},
    shallowEqual,
  );
  const resolvedInitialValues = Id
    ? dataForEdit || {}
    : { ...(initVal || {}), ...(queryPrefill || {}) };

  // Fetch customer by ID when editing or viewing
  useEffect(() => {
    if (Id) dispatch(actions.fetchTimeLog(Id));
  }, [Id]);

  // Save customer (create or update)
  const saveForm = async (payload, resetForm) => {
    if (!Id) {
      await dispatch(actions.createTimeLog({ ...payload, employeeId }));
    } else {
      await dispatch(actions.updateTimeLog({ ...payload, employeeId }));
    }
  };

  useEffect(() => {
    const queryParams = Object?.fromEntries(
      new URLSearchParams(history?.location?.search)?.entries(),
    );

    if (queryParams && Object.keys(queryParams).length > 0) {
      if (!Id && (queryParams?.projectId || queryParams?.ticketId)) {
        setQueryPrefill({
          ...(queryParams?.projectId
            ? { projectId: queryParams.projectId }
            : {}),
          ...(queryParams?.ticketId ? { ticketId: queryParams.ticketId } : {}),
        });
        dispatch(fetchAllTicket(null, queryParams?.projectId));
      }

      // Clear query params from URL
      history.replace({
        pathname: history.location.pathname,
        search: "",
        state: history.location.state,
      });
    }
  }, [Id, history, initVal, dispatch]);
  return (
    <>
      <Modal.Title className="m-0">
        {Id ? "Edit Time Log" : "Create Time Log"}
      </Modal.Title>
      <FormEditForm
        dataForEdit={resolvedInitialValues}
        saveForm={saveForm}
        actionsLoading={actionsLoading}
        initialValues={initVal}
        setId={setId}
      />
    </>
  );
}
