import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";



export function FormPage({ history }) {


  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/employee_doc/read-all-employee-doc/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/employee_doc/read-all-employee-doc/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/employee_doc/read-all-employee-doc/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/employee_doc/read-all-employee-doc/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/employee_doc/read-all-employee-doc/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      {/* <Route exact path="/employee_doc/read-all-employee-doc/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/employee_doc/read-all-employee-doc");
            }}
          />
        )}
      </Route>
      <Route path="/employee_doc/read-all-employee-doc/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_doc/read-all-employee-doc");
            }}
          />
        )}
      </Route>
      <Route path="/employee_doc/read-all-employee-doc/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/employee_doc/read-all-employee-doc");
            }}
          />
        )}
      </Route>
      <Route path="/employee_doc/read-all-employee-doc/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/employee_doc/read-all-employee-doc");
            }}
          />
        )}
      </Route> */}


        
            <Route path="/employee_doc/read-all-employee-doc/:id/:status/delete">
              {({ history, match }) => (
                <FormDeleteDialog
                  show={match != null}
                  id={match && match.params.id}
                  status={match && match.params.status}
                  onHide={() => {
                    history.push("/employee_doc/read-all-employee-doc");
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
