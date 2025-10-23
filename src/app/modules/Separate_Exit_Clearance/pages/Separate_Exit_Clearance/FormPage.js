import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
// import { useNavigate } from "react-router-dom";
import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";



export function FormPage({ history }) {

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/exit_clearance/read-all-exit-clearance/new");
    },

    openReadFormDialog: (Id, isUserRead) => {
      history.push({
        pathname: `/exit_clearance/read-all-exit-clearance/read`,
        state: { Id },
      });
    },

    openEditFormDialog: (Id) => {
      history.push({
        pathname: `/exit_clearance/read-all-exit-clearance/edit`,
        state: { Id },
      });
    },

 openDeleteFormDialog: (Id) => {
      history.push({
        pathname: `/exit_clearance/read-all-exit-clearance/delete`,
        state: { Id },
      });
    },


  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/exit_clearance/read-all-exit-clearance/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/exit_clearance/read-all-exit-clearance");
            }}
          />
        )}
      </Route>
  

      <Route path="/exit_clearance/read-all-exit-clearance/edit">
         {({ history, match, location }) => (
          <FormEditDialog
            show={match != null}
           
            Id={location.state?.Id || null}
        
            onHide={() => {
              history.push("/exit_clearance/read-all-exit-clearance");
            }}
          />
        )}
      </Route>


      <Route path="/exit_clearance/read-all-exit-clearance/read">
        {({ history, match, location }) => (
          <FormEditDialog
            show={match != null}
            dataForRead={true}
            emp Id={location.state?.Id || null}
         
            onHide={() => {
              history.push("/exit_clearance/read-all-exit-clearance");
            }}
          />
        )}
      </Route>


          <Route path="/exit_clearance/read-all-exit-clearance/delete">
       {({ history, match, location }) => (
          <FormDeleteDialog
            show={match != null}
        
             Id={location.state?.Id || null}
          
            status={match && match.params.status}
            onHide={() => {
              history.push("/exit_clearance/read-all-exit-clearance");
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
