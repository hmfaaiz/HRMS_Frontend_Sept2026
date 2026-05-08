import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, onHide }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.TravelRequestWorkflowAdmin?.userForEdit,
      actionsLoading: state.TravelRequestWorkflowAdmin?.actionsLoading,
    }),
    shallowEqual,
  );

  useEffect(() => {
    let _title = id
      ? "Process Travel Request"
      : "Travel Request Details";
    setTitle(_title);
  }, [id, userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h4 className="text-dark font-bold m-0">{title}</h4>
        {onHide && (
          <button
            type="button"
            className="btn btn-sm btn-light-danger"
            onClick={onHide}
          >
            Close
          </button>
        )}
      </div>
    </>
  );
}
