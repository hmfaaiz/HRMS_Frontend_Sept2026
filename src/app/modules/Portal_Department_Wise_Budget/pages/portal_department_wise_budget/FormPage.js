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
      history.push("/portal_department_wise_budget/read-all-portal-department-wise-budget/new");
    },
    // openEditFormDialog: (id) => {
    //   history.push(`/portal_department_wise_budget/read-all-portal-department-wise-budget/${id}/edit`);
    // },
    // openDeleteFormDialog: (id, status) => {
    //   history.push(`/portal_department_wise_budget/read-all-portal-department-wise-budget/${id}/${status}/delete`);
    // },
    openActiveFormDialog: (id) => {
      history.push(`/portal_department_wise_budget/read-all-portal-department-wise-budget/${id}/active`);
    },
    openReadFormDialog: (
      subsidiaryId,
      budgetYearId,
      departmentId,
      isUserRead
    ) => {
      history.push({
        pathname:
          "/portal_department_wise_budget/read-all-portal-department-wise-budget/read",
        state: {
          subsidiaryId,
          budgetYearId,
          departmentId,
          isUserRead,
        },
      });
    },

    openEditFormDialog: (
      subsidiaryId,
      budgetYearId,
      departmentId,
      isUserRead
    ) => {
      history.push({
        pathname:
          "/portal_department_wise_budget/read-all-portal-department-wise-budget/edit",
        state: {
          subsidiaryId,
          budgetYearId,
          departmentId,
          isUserRead,
        },
      });
    }, 
    
    
    openDeleteFormDialog: (
      subsidiaryId,
      budgetYearId,
      departmentId,
      isUserRead
    ) => {
      history.push({
        pathname:
          "/portal_department_wise_budget/read-all-portal-department-wise-budget/delete",
        state: {
          subsidiaryId,
          budgetYearId,
          departmentId,
          isUserRead,
        },
      });
    },

  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>

         <FormCard />
      <Route exact path="/portal_department_wise_budget/read-all-portal-department-wise-budget/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/portal_department_wise_budget/read-all-portal-department-wise-budget");
            }}
          />
        )}
      </Route>
      {/* <Route path="/portal_department_wise_budget/read-all-portal-department-wise-budget/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/portal_department_wise_budget/read-all-portal-department-wise-budget");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/portal_department_wise_budget/read-all-portal-department-wise-budget/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/portal_department_wise_budget/read-all-portal-department-wise-budget");
            }}
          />
        )}
      </Route> */}

      <Route path="/portal_department_wise_budget/read-all-portal-department-wise-budget/read">
        {({ history, location, match }) => (
          <FormEditDialog
            show={match != null}
            subsidiaryId={location?.state?.subsidiaryId}
            budgetYearId={location?.state?.budgetYearId}
            departmentId={location?.state?.departmentId}
            userForRead={true}
            onHide={() => {
              history.push(
                "/portal_department_wise_budget/read-all-portal-department-wise-budget"
              );
            }}
          />
        )}
      </Route>


      <Route path="/portal_department_wise_budget/read-all-portal-department-wise-budget/edit">
        {({ history, location, match }) => (
          <FormEditDialog
            show={match != null}
            subsidiaryId={location?.state?.subsidiaryId}
            budgetYearId={location?.state?.budgetYearId}
            departmentId={location?.state?.departmentId}
            userForRead={false}
            onHide={() => {
              history.push(
                "/portal_department_wise_budget/read-all-portal-department-wise-budget"
              );
            }}
          />
        )}
      </Route>
      {/* <Route path="/portal_department_wise_budget/read-all-portal-department-wise-budget/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/portal_department_wise_budget/read-all-portal-department-wise-budget");
            }}
          />
        )}
      </Route> */}

 <Route path="/portal_department_wise_budget/read-all-portal-department-wise-budget/delete">
  {({ history, match, location }) => (
    <FormDeleteDialog
      show={match != null}
      subsidiaryId={location?.state?.subsidiaryId}
      budgetYearId={location?.state?.budgetYearId}
      departmentId={location?.state?.departmentId}
      status={match?.params?.status}
      onHide={() => {
        history.push(
          "/portal_department_wise_budget/read-all-portal-department-wise-budget"
        );
      }}
    />
  )}
</Route>

   
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
