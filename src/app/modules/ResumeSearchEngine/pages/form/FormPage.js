import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";
import { FormFIlter } from "./form-filter/FormFIlter";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";

export function FormPage({ history }) {
  const dispatch = useDispatch();
  const FormUIEvents = {
    openReadFormDialog: (id, isUserRead) => {
      history.push(
        `/resume_search_engine/read-all-resume-search-engine/${id}/read`
      );
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/resume_search_engine/read-all-resume-search-engine/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            dataForRead={true}
            onHide={() => {
              history.push(
                "/resume_search_engine/read-all-resume-search-engine"
              );
            }}
          />
        )}
      </Route>

      <TCard name={CurrentModuleName()}>
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <FormFIlter />
        </div>
        <FormCard />
      </TCard>

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
