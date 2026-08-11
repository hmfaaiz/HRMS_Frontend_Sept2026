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

  // Routes
  // const readMatch = useRouteMatch("/separation/read-all-separation/:id/read");
  const readMatch = useRouteMatch("/separation/read-all-separation/read");

  // const editMatch = useRouteMatch("/separation/read-all-separation/:id/edit");
  const editMatch = useRouteMatch("/separation/read-all-separation/edit");

  const newMatch = useRouteMatch(
    "/separation/read-all-separation/new"
  );

  // const deleteMatch = useRouteMatch(
  //   "/separation/read-all-separation/:id/:status/delete"
  // );
  const deleteMatch = useRouteMatch(
    "/separation/read-all-separation/delete"
  );

  // const revertMatch = useRouteMatch(
  //   "/separation/read-all-separation/:id/:status/revert"
  // );
  const revertMatch = useRouteMatch(
    "/separation/read-all-separation/revert"
  );

  const convertMatch = useRouteMatch(
    "/separation/read-all-separation/:id/convert"
  );

  const FormUIEvents = {
    newFormButtonClick: () =>
      history.push("/separation/read-all-separation/new"),

    openEditFormDialog: (id) => {
      // history.push(`/separation/read-all-separation/${id}/edit`);
      history.push({
        pathname: "/separation/read-all-separation/edit",
        state: {
          id,
        },
      });
    },

    openReadFormDialog: (id) => {
      // history.push(`/separation/read-all-separation/${id}/read`);
      history.push({
        pathname: "/separation/read-all-separation/read",
        state: {
          id,
        },
      });
    },

    openDeleteFormDialog: (id, status) => {
      // history.push(
      //   `/separation/read-all-separation/${id}/${status}/delete`
      // );

      history.push({
        pathname: "/separation/read-all-separation/delete",
        state: {
          id,
          status,
        },
      });
    },

    openRevertFormDialog: (id, status) => {
      // history.push(
      //   `/separation/read-all-separation/${id}/${status}/revert`
      // );

      history.push({
        pathname: "/separation/read-all-separation/revert",
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
        userAccess: state?.auth?.userAccess["separation"],
      };
    },
    shallowEqual
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadSeparation"
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateSeparation"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteSeparation"
  );

  const isAccessForRevert = userAccess?.find(
    (item) => item.componentName === "RevertSeparation"
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateSeparation"
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
            history.push("/separation/read-all-separation")
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
            history.push("/separation/read-all-separation")
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
            history.push("/separation/read-all-separation")
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
            history.push("/separation/read-all-separation")
          }
          actionName="deleteSeparation"
        />
      )}

      {/* REVERT */}
      {revertMatch && isAccessForRevert && (
        <FormDynamicDialogModal
          show={true}

          // Old:
          // id={revertMatch.params.id}

          // Updated:
          id={location.state?.id}

          // Old:
          // status={revertMatch.params.status}

          // Updated:
          status={location.state?.status}

          title="Revert Record"
          message="Are you sure you want to revert this separation record?"
          confirmButtonText="Revert"
          onHide={() =>
            history.push("/separation/read-all-separation")
          }
          actionName="revertSeparation"
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormUIProvider>
  );
}