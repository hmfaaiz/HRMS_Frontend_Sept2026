import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FacilitatorUIProvider } from "./Facilitator_SetupUIContext";
import { FacilitatorEditDialog } from "./facilitator-edit-dialog/FacilitatorEditDialog";
import { FacilitatorCard } from "./facilitator-card/FacilitatorCard";
import { fetchFacilitatorSetups } from "../../_redux/facilitatorSetupActions";
import { FacilitatorDeleteDialog } from "./facilitator-delete-dialog/FacilitatorDeleteDialog";

export function FacilitatorSetupPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  // Match routes
  const newMatch = useRouteMatch(
    "/facilitator_setup/read-all-facilitator-setup/new"
  );
  const editMatch = useRouteMatch(
    "/facilitator_setup/read-all-facilitator-setup/:id/edit"
  );
  const readMatch = useRouteMatch(
    "/facilitator_setup/read-all-facilitator-setup/:id/read"
  );
  const deleteMatch = useRouteMatch(
    "/facilitator_setup/read-all-facilitator-setup/:id/:status/delete"
  );

  // Fetch table data on mount
  useEffect(() => {
    dispatch(fetchFacilitatorSetups({ pageNumber: 1, pageSize: 50 }));
  }, [dispatch]);

  // UI Events for dialogs
  const FacilitatorUIEvents = {
    newFacilitatorButtonClick: () => {
      // Clear any stored data for new entry
      sessionStorage.removeItem("facilitatorEditData");
      sessionStorage.removeItem("facilitatorReadData");
      history.push("/facilitator_setup/read-all-facilitator-setup/new");
    },
    
    openEditFacilitatorDialog: (rawData) => {
      // Store the data in sessionStorage before navigation
      sessionStorage.setItem("facilitatorEditData", JSON.stringify(rawData));
      const compositeId = `${rawData.employeeId}_${rawData.ticketTypeId}_${rawData.subsidiaryId || 0}`;
      history.push(`/facilitator_setup/read-all-facilitator-setup/${compositeId}/edit`);
    },

    openReadFacilitatorDialog: (rawData) => {
      // Store data for read view
      sessionStorage.setItem("facilitatorReadData", JSON.stringify(rawData));
      const compositeId = `${rawData.employeeId}_${rawData.ticketTypeId}_${rawData.subsidiaryId || 0}`;
      history.push(`/facilitator_setup/read-all-facilitator-setup/${compositeId}/read`);
    },

    openDeleteFacilitatorDialog: (id, rawData) => {
      // Store data for delete as well
      if (rawData) {
        sessionStorage.setItem("facilitatorDeleteData", JSON.stringify(rawData));
      }
      history.push(
        `/facilitator_setup/read-all-facilitator-setup/${id}/active/delete`
      );
    },
  };

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess["facilitator_setup"] || [],
    }),
    shallowEqual
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateFacilitatorSetup"
  );
  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateFacilitatorSetup"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteFacilitatorSetup"
  );

  return (
    <FacilitatorUIProvider FacilitatorUIEvents={FacilitatorUIEvents}>
      {/* NEW */}
      {newMatch && accessUser && (
        <FacilitatorEditDialog
          show={true}
          status="new"
          onHide={() => {
            sessionStorage.removeItem("facilitatorEditData");
            sessionStorage.removeItem("facilitatorReadData");
            history.push("/facilitator_setup/read-all-facilitator-setup");
          }}
          dataForRead={false}
        />
      )}

      {/* EDIT */}
      {editMatch && isAccessForEdit && (
        <FacilitatorEditDialog
          show={true}
          status="edit"
          id={editMatch.params.id}
          onHide={() => {
            sessionStorage.removeItem("facilitatorEditData");
            history.push("/facilitator_setup/read-all-facilitator-setup");
          }}
          dataForRead={false}
        />
      )}

      {/* READ */}
      {readMatch && (
        <FacilitatorEditDialog
          show={true}
          status="read"
          id={readMatch.params.id}
          onHide={() => {
            sessionStorage.removeItem("facilitatorReadData");
            history.push("/facilitator_setup/read-all-facilitator-setup");
          }}
          dataForRead={true}
        />
      )}

      {/* DELETE */}
      {deleteMatch && isAccessForDelete && (
        <FacilitatorDeleteDialog
          show={true}
          id={deleteMatch.params.id}
          status={deleteMatch.params.status}
          onHide={() => {
            sessionStorage.removeItem("facilitatorDeleteData");
            history.push("/facilitator_setup/read-all-facilitator-setup");
          }}
        />
      )}

      {/* MAIN LIST */}
      <FacilitatorCard />

      <ToastContainer position="top-right" autoClose={5000} />
    </FacilitatorUIProvider>
  );
}