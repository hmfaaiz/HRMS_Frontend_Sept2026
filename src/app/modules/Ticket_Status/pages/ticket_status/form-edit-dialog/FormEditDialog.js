import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { TicketStatusEditForm } from "./FormEdit";
import { TicketStatusEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { useTicketStatusUIContext } from "../FormUIContext";

export function TicketStatusEditDialog({ id, show, onHide, userForRead }) {
  const dispatch = useDispatch();
  const ticketStatusUIContext = useTicketStatusUIContext();
  const { queryParams } = ticketStatusUIContext;

  const [loading, setLoading] = useState(false);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const { ticketStatusForEdit, actionsLoading } = useSelector(
    (state) => ({
      ticketStatusForEdit: state.ticket_status?.ticketStatusForEdit,
      actionsLoading: state.ticket_status?.actionsLoading || false,
    }),
    shallowEqual
  );

  // Fetch ticket status by ID when dialog opens
  useEffect(() => {
    if (id && show) {
      dispatch(actions.fetchTicketStatus(id));
    }
    // Clear the form when dialog closes or when switching to "new" mode
    if (!id) {
      dispatch(actions.fetchTicketStatus(null)); // This clears ticketStatusForEdit
    }
  }, [id, show, dispatch]);

  // Save ticket status
  const saveTicketStatus = async (ticketStatus) => {
    const payload = {
      statusCode: ticketStatus.statusCode,
      statusName: ticketStatus.statusName,
      statusType: ticketStatus.statusType,
      ...(id ? { Id: id } : {}),
    };

    if (!id) {
      await dispatch(
        actions.createTicketStatus(payload, disableLoading, onHide)
      );
    } else {
      await dispatch(
        actions.updateTicketStatus(payload, disableLoading, onHide)
      );
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <TicketStatusEditDialogHeader id={id} isUserForRead={userForRead} />
      <TicketStatusEditForm
        ticketStatus={ticketStatusForEdit || {}} // Pass the actual data from Redux
        saveTicketStatus={saveTicketStatus}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        id={id}
      />
    </Modal>
  );
}