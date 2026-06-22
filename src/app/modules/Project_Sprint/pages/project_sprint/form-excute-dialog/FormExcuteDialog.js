import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { Trash2, CheckCircle, AlertCircle } from "lucide-react";

export function FormExcuteDialog({ id, show, onHide, type }) {
  const dispatch = useDispatch();
  const [connectedTickets, setConnectedTickets] = useState([]);
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(
    () => ({
      queryParams: formUIContext.queryParams,
    }),
    [formUIContext],
  );

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.project_sprint?.actionsLoading,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(actions?.fetchSprintTickets(id)).then((e) => {
      setConnectedTickets(e || []);
    });
  }, [id]);

  // Separate tickets into completed and incomplete
  const { completedTickets, incompleteTickets } = useMemo(() => {
    if (!connectedTickets.length) {
      return { completedTickets: [], incompleteTickets: [] };
    }

    const completed = connectedTickets.filter(
      (ticket) => ticket?.Ticket?.TicketStatus?.statusTypeId === 616,
    );

    const incomplete = connectedTickets.filter(
      (ticket) => ticket?.Ticket?.TicketStatus?.statusTypeId !== 616,
    );

    return { completedTickets: completed, incompleteTickets: incomplete };
  }, [connectedTickets]);

  const updateRecord = () => {
    dispatch(
      actions.excuteProjectSprint(
        type == "start"
          ? { Id: id, isStart: true }
          : { Id: id, isCompleted: true },
      ),
    ).then(() => {
      onHide();
    });
  };

  const getModalTitle = () => {
    if (type === "start") return "Start Sprint";
    if (type === "complete") return "Complete Sprint";
    return "Record";
  };

  const getModalMessage = () => {
    if (type === "start") {
      return "Are you sure you want to start this sprint?";
    }
    if (type === "complete") {
      if (incompleteTickets.length > 0) {
        return `This sprint has ${incompleteTickets.length} incomplete ticket(s). Please complete them before closing the sprint.`;
      }
      return "Are you sure you want to complete this sprint? All tickets are completed.";
    }
    return "Are you sure you want to permanently delete this record?";
  };

  const renderTicketTable = (
    tickets,
    title,
    isCompleted = false,
    isStart = false,
  ) => {
    if (!tickets.length) return null;

    return (
      <div className="">
        <div className="mb-1 flex items-center gap-1">
          {isStart ? null : isCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          {!isStart && (
            <strong
              className={
                isStart ? "" : isCompleted ? "text-green-700" : "text-red-700"
              }
            >
              {title} ({tickets.length})
            </strong>
          )}
        </div>
        <div className="w-full overflow-x-auto">
          <div className="react-bootstrap-table table-responsive">
            <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
              <thead>
                <tr className="custom-table-header">
                  <th className="min-w-44">Ticket</th>
                  <th>Ticket Description</th>
                  <th>Ticket Status</th>
                  <th>Assign To</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((item, index) => (
                  <tr
                    key={item.ticketId || index}
                    className={
                      isStart ? "" : isCompleted ? "bg-green-50" : "bg-red-50"
                    }
                  >
                    <td>{item.Ticket?.ticketCode || ""}</td>
                    <td>{item.Ticket?.ticketDescription || ""}</td>
                    <td>{item.Ticket?.TicketStatus?.statusName || ""}</td>
                    <td>{item.Ticket?.AssignToEmp?.name || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{getModalTitle()}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}

        {type === "start" || type === "complete" ? (
          <div>
            {type === "start" ? (
              // Start mode - show all tickets
              <>
                <div className="mb-3">
                  <strong>
                    Tickets connected to this sprint ({connectedTickets.length}
                    ):
                  </strong>
                </div>
                {connectedTickets.length > 0 ? (
                  renderTicketTable(
                    connectedTickets,
                    "",
                    false,
                    type == "start" ? true : false,
                  )
                ) : (
                  <div className="alert alert-info">
                    No tickets connected to this sprint.
                  </div>
                )}
              </>
            ) : (
              // Complete mode - show separate sections
              <>
                {/* Completed Tickets Section */}
                {renderTicketTable(
                  completedTickets,
                  "Completed Tickets",
                  true,
                  false,
                )}

                {/* Incomplete Tickets Section */}
                {renderTicketTable(
                  incompleteTickets,
                  "In Progress Tickets",
                  false,
                  false,
                )}

                {connectedTickets.length === 0 && (
                  <div className="alert alert-info">
                    No tickets connected to this sprint.
                  </div>
                )}

                {completedTickets.length > 0 &&
                  incompleteTickets.length === 0 && (
                    <div className="alert alert-success mt-1">
                      All tickets are completed! You can now complete this
                      sprint.
                    </div>
                  )}
              </>
            )}

            <div className="mt-1 text-sm">
              <span>{getModalMessage()}</span>
            </div>
          </div>
        ) : (
          // Default delete message
          <span>{getModalMessage()}</span>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={updateRecord}
          className="btn btn-primary"
          disabled={
            isLoading ||
            (type === "complete" &&
              incompleteTickets?.length == connectedTickets?.length)
          }
        >
          {type === "start" && "Start"}
          {type === "complete" && "Complete"}
          {type !== "start" && type !== "complete" && "Delete"}
          {isLoading && <span className="ml-3 spinner spinner-white" />}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
