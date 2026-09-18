import React from "react";
import { useDispatch } from "react-redux";
import {
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";
import { FormCard } from "./form-card/FormCard";
import { shallowEqual, useSelector } from "react-redux";

export function FormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // Old:
  // const readMatch = useRouteMatch(
  //   "/final_settlement/read-all-final-settlement/:id/read",
  // );

  // Updated:
  const readMatch = useRouteMatch(
    "/final_settlement/read-all-final-settlement/read",
  );

  // Old:
  // const editMatch = useRouteMatch(
  //   "/final_settlement/read-all-final-settlement/:id/edit",
  // );

  // Updated:
  const editMatch = useRouteMatch(
    "/final_settlement/read-all-final-settlement/edit",
  );

  const newMatch = useRouteMatch(
    "/final_settlement/read-all-final-settlement/new",
  );

  // Old:
  // const deleteMatch = useRouteMatch(
  //   "/final_settlement/read-all-final-settlement/:id/:status/delete",
  // );

  // Updated:
  const deleteMatch = useRouteMatch(
    "/final_settlement/read-all-final-settlement/delete",
  );

  const convertMatch = useRouteMatch(
    "/final_settlement/read-all-final-settlement/:id/convert",
  );

  const FormUIEvents = {
    
    newFormButtonClick: (Id,subsidiaryId) => {
       console.log("subsidiaryId:", subsidiaryId);
      history.push(
        `/final_settlement/read-all-final-settlement/new${
          typeof Id != "Object" ? `?Id=${btoa(Id)}&subsidiaryId=${btoa(subsidiaryId)}` : ""
        }`
      );
    },

    openEditFormDialog: (id) => {
      // Old:
      // history.push(
      //   `/final_settlement/read-all-final-settlement/${id}/edit`
      // );

      // Updated:
      history.push({
        pathname: "/final_settlement/read-all-final-settlement/edit",
        state: {
          id,
        },
      });
    },

    openReadFormDialog: (id) => {
      // Old:
      // history.push(
      //   `/final_settlement/read-all-final-settlement/${id}/read`
      // );

      // Updated:
      history.push({
        pathname: "/final_settlement/read-all-final-settlement/read",
        state: {
          id,
        },
      });
    },

    openDeleteFormDialog: (id, status) => {
      // Old:
      // history.push(
      //   `/final_settlement/read-all-final-settlement/${id}/${status}/delete`,
      // );

      // Updated:
      history.push({
        pathname: "/final_settlement/read-all-final-settlement/delete",
        state: {
          id,
          status,
        },
      });
    },
  };

  const { userAccess } = useSelector(
    (state) => {
      return {
        userAccess: state?.auth?.userAccess["final_settlement"],
      };
    },
    shallowEqual
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadFinalSettlement"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateFinalSettlement";
  });

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteFinalSettlement"
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateFinalSettlement"
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormCard />

      {/* NEW */}
      {newMatch && accessUser && (
        <FormEditDialog
          show={true}
          status="new"
          onHide={() =>
            history.push(
              "/final_settlement/read-all-final-settlement"
            )
          }
        />
      )}

      {/* EDIT */}
      {editMatch && isAccessForEdit && (
        <FormEditDialog
          show={true}

          // Old:
          // id={editMatch.params.id}

          // Updated:
          id={location.state?.id}

          status="edit"
          onHide={() =>
            history.push(
              "/final_settlement/read-all-final-settlement"
            )
          }
        />
      )}

      {/* READ */}
      {readMatch && isAccessForView && (
        <FormEditDialog
          show={true}

          // Old:
          // id={readMatch.params.id}

          // Updated:
          id={location.state?.id}

          dataForRead={true}
          status="read"
          onHide={() =>
            history.push(
              "/final_settlement/read-all-final-settlement"
            )
          }
        />
      )}

      {/* DELETE */}
      {deleteMatch && isAccessForDelete && (
        <FormDynamicDialogModal
          show={true}

          // Old:
          // id={deleteMatch.params.id}

          // Updated:
          id={location.state?.id}

          // Old:
          // status={deleteMatch.params.status}

          // Updated:
          status={location.state?.status}

          title="Delete Record"
          message="Are you sure you want to delete this record?"
          confirmButtonText="Delete Record"
          onHide={() =>
            history.push(
              "/final_settlement/read-all-final-settlement"
            )
          }
          actionName="deleteFinalSettlement"
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
      />
    </FormUIProvider>
  );
}