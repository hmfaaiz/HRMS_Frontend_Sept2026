import React, { useEffect } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { useFormUIContext } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { useDispatch } from "react-redux";
import * as actions from "../../_redux/redux-Actions";
import { FormDeleteDialog } from "../form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/ask/ai-chatbot/new");
    },
    existingButtonClick: (id) => {
      history.push(`/ask/ai-chatbot/${id}/continue`);
    },
  };

  useEffect(() => {
    dispatch(actions.fetchChatList());
  }, [dispatch]);

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Switch>
        {" "}
        {/*  Only ONE route renders at a time */}
        {/* Case 1: New form creation */}
        <Route exact path="/ask/ai-chatbot/new" component={NewFormRoute} />
        {/* Case 2: Edit existing form */}
        <Route path="/ask/ai-chatbot/:id/continue" component={EditFormRoute} />

      </Switch>

      <DeleteFormRoute />
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

function DeleteFormRoute() {
  const { deleteId, setDeleteId } = useFormUIContext();

  return (
    <FormDeleteDialog
      id={deleteId}
      show={!!deleteId}
      onHide={() => setDeleteId(null)}
    />
  );
}

//  Component for NEW form (empty)
function NewFormRoute() {
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location?.search);
  const encodedQuestion = queryParams.get("question");
  const decodedQuestion = encodedQuestion ? atob(encodedQuestion) : "";

  // If there's a pre-filled question, show it in the dialog
  // No redirect needed - stay on /new
  return (
    <>
    <FormEditDialog
      value={decodedQuestion}
      show={true}
      onHide={() => {
        history.push("/ask/ai-chatbot");
      }}
    />
    </>
  );
}

//  Component for EDITING existing form
function EditFormRoute({ match, history }) {
  const id = match.params.id;

  // Optional: Validate if ID exists, redirect if not
  useEffect(() => {
    if (!id || id === "new") {
      // If someone tries to access with invalid ID, redirect
      history.replace("/ask/ai-chatbot");
    }
  }, [id, history]);

  return (
    <FormEditDialog
      show={!!id && id !== "new"}
      id={id}
      onHide={() => {
        history.push("/ask/ai-chatbot");
      }}
    />
  );
}
