import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";


import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";



export function FormPage({ history }) {

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/general_evaluation_setup/read-all-general-evaluation-setup/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/general_evaluation_setup/read-all-general-evaluation-setup/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/general_evaluation_setup/read-all-general-evaluation-setup/${id}/${status}/delete`);
    },
  
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/general_evaluation_setup/read-all-general-evaluation-setup/${id}/read`);
    },
      
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/general_evaluation_setup/read-all-general-evaluation-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/general_evaluation_setup/read-all-general-evaluation-setup");
            }}
          />
        )}
      </Route>
      <Route path="/general_evaluation_setup/read-all-general-evaluation-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/general_evaluation_setup/read-all-general-evaluation-setup");
            }}
          />
        )}
      </Route>
      <Route path="/general_evaluation_setup/read-all-general-evaluation-setup/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/general_evaluation_setup/read-all-general-evaluation-setup");
            }}
          />
        )}
      </Route>
      <Route path="/general_evaluation_setup/read-all-general-evaluation-setup/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/general_evaluation_setup/read-all-general-evaluation-setup");
            }}
          />
        )}
      </Route>
      

      <FormCard />
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
