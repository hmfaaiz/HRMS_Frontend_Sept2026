import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormActiveDialog } from "./form-active-dialog/FormActiveDialog";
import { FormCard } from "./form-card/FormCard";
import { DuplicateDialog } from "./form-edit-dialog/FormDuplicateDialog";

export function Payroll_Policy({ history }) {
  const [defRecordId, setDefaultRecordId] = useState(0);
  const [readOnly, setreadOnly] = useState(false)
  const [active, setActive] = useState(false)

  const dispatch = useDispatch();

  const FormUIEvents = {
    newFormButtonClick: () => {
      setreadOnly(false)
      setActive(true)
      history.push("/payroll_process_policy/read-all-payroll-process-policy/new");
    },
    openEditFormDialog: (id) => {
      setDefaultRecordId(id);
      setreadOnly(false)
      setActive(true)
      history.push(`/payroll_process_policy/read-all-payroll-process-policy/${id}/edit`);
    },

    openDeleteFormDialog: (id, status) => {
      // setActive(true)
      history.push(`/payroll_process_policy/read-all-payroll-process-policy/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      setreadOnly(false)
      // setActive(true)
      history.push(`/payroll_process_policy/read-all-payroll-process-policy/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      setActive(true)
      setreadOnly(true)
      history.push(`/payroll_process_policy/read-all-payroll-process-policy/${id}/read`);
    },
     openDuplicateDialog: (id, isUserRead) => {
      history.push(`/payroll_process_policy/read-all-payroll-process-policy/${id}/duplicate`);
    },
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/payroll_process_policy/read-all-payroll-process-policy/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/payroll_process_policy/read-all-payroll-process-policy");
            }}
          />
        )}
      </Route>
      <Route path="/payroll_process_policy/read-all-payroll-process-policy/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/payroll_process_policy/read-all-payroll-process-policy");
            }}
          />
        )}
      </Route>
      <Route path="/payroll_process_policy/read-all-payroll-process-policy/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/payroll_process_policy/read-all-payroll-process-policy");
            }}
          />
        )}
      </Route>
      <Route path="/payroll_process_policy/read-all-payroll-process-policy/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/payroll_process_policy/read-all-payroll-process-policy");
            }}
          />
        )}
      </Route>
      <Route path="/payroll_process_policy/read-all-payroll-process-policy/:id/active">
        {({ history, match }) => (
          <FormActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/payroll_process_policy/read-all-payroll-process-policy");
            }}
          />
        )}
      </Route>

       <Route
                exact={true}
                path="/payroll_process_policy/read-all-payroll-process-policy/:id/duplicate"
              >
                {({ history, match }) => (
                  <DuplicateDialog
                    show={match != null}
                    onHide={() => {
                      history.push("/payroll_process_policy/read-all-payroll-process-policy");
                    }}
                  />
                )}
              </Route>
      <FormCard id={defRecordId} setid={setDefaultRecordId} readOnly={readOnly} active={active} setActive={setActive} />
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
