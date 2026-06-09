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
      history.push("/employee_goal_setup_portal/read-all-employee-goal-setup/new");
    },
    // openEditFormDialog: (id) => {
    //   history.push(`/employee_goal_setup_portal/read-all-employee-goal-setup/${id}/edit`);
    // },
    // openDeleteFormDialog: (id, status) => {
    //   history.push(`/employee_goal_setup_portal/read-all-employee-goal-setup/${id}/${status}/delete`);
    // },
    openActiveFormDialog: (id) => {
      history.push(`/employee_goal_setup_portal/read-all-employee-goal-setup/${id}/active`);
    },
    // openReadFormDialog: (id, isUserRead) => {
    //   history.push(`/employee_goal_setup_portal/read-all-employee-goal-setup/${id}/read`);
    // },

    openReadFormDialog: (employeeId, appraisalPeriodId, isUserRead) => {
      history.push({
        pathname: `/employee_goal_setup_portal/read-all-employee-goal-setup/read`,
        state: { employeeId, appraisalPeriodId },
      });
    },

    openEditFormDialog: (employeeId, appraisalPeriodId) => {
      history.push({
        pathname: `/employee_goal_setup_portal/read-all-employee-goal-setup/edit`,
        state: { employeeId, appraisalPeriodId },
      });
    },

 openDeleteFormDialog: (employeeId, appraisalPeriodId) => {
      history.push({
        pathname: `/employee_goal_setup_portal/read-all-employee-goal-setup/delete`,
        state: { employeeId, appraisalPeriodId },
      });
    },


  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/employee_goal_setup_portal/read-all-employee-goal-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
            }}
          />
        )}
      </Route>
      {/* <Route path="/employee_goal_setup_portal/read-all-employee-goal-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
            }}
          />
        )}
      </Route> */}

      <Route path="/employee_goal_setup_portal/read-all-employee-goal-setup/edit">
         {({ history, match, location }) => (
          <FormEditDialog
            show={match != null}
           
            employeeId={location.state?.employeeId || null}
            appraisalPeriodId={location.state?.appraisalPeriodId || null}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
            }}
          />
        )}
      </Route>
      {/* <Route path="/employee_goal_setup_portal/read-all-employee-goal-setup/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            dataForRead={true}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
            }}
          />
        )}
      </Route> */}

      <Route path="/employee_goal_setup_portal/read-all-employee-goal-setup/read">
        {({ history, match, location }) => (
          <FormEditDialog
            show={match != null}
            dataForRead={true}
            employeeId={location.state?.employeeId || null}
            appraisalPeriodId={location.state?.appraisalPeriodId || null}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
            }}
          />
        )}
      </Route>
      {/* <Route path="/employee_goal_setup_portal/read-all-employee-goal-setup/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
            }}
          />
        )}
      </Route> */}

          <Route path="/employee_goal_setup_portal/read-all-employee-goal-setup/delete">
       {({ history, match, location }) => (
          <FormDeleteDialog
            show={match != null}
        
            employeeId={location.state?.employeeId || null}
            appraisalPeriodId={location.state?.appraisalPeriodId || null}
            status={match && match.params.status}
            onHide={() => {
              history.push("/employee_goal_setup_portal/read-all-employee-goal-setup");
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
