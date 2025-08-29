import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DeptUIProvider } from "./DeptUIContext";
import { DeptEditDialog } from "./dept-edit-dialog/DeptEditDialog";
import { DeptDeleteDialog } from "./dept-delete-dialog/DeptDeleteDialog";
import { DeptActiveDialog } from "./dept-active-dialog/DeptActiveDialog";
import { DeptCard } from "./dept-card/DeptCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,
  fetchCenters,
} from "../../_redux/deptActions";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function DeptPage({ history }) {
  const dispatch = useDispatch();
  const DeptUIEvents = {
    newDeptButtonClick: () => {
      dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/department/read-all-dept/new");
    },
    openEditDeptDialog: (id) => {
      dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/department/read-all-dept/${id}/edit`);
    },
    openDeleteDeptDialog: (id, status) => {
      history.push(`/department/read-all-dept/${id}/${status}/delete`);
    },
    openActiveDeptDialog: (id) => {
      history.push(`/department/read-all-dept/${id}/active`);
    },
    openReadDeptDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/department/read-all-dept/${id}/read`);
    },
  };
  return (
    
    <DeptUIProvider DeptUIEvents={DeptUIEvents}>
      <Route exact path="/department/read-all-dept/new">
        {({ history, match }) => (
          <DeptEditDialog
            show={match != null}
            onHide={() => {
              history.push("/department/read-all-dept");
            }}
          />
        )}
      </Route>
      <Route path="/department/read-all-dept/:id/edit">
        {({ history, match }) => (
          <DeptEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/department/read-all-dept");
            }}
          />
        )}
      </Route>
      <Route path="/department/read-all-dept/:id/read">
        {({ history, match }) => (
          <DeptEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/department/read-all-dept");
            }}
          />
        )}
      </Route>
      <Route path="/department/read-all-dept/:id/:status/delete">
        {({ history, match }) => (
          <DeptDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/department/read-all-dept");
            }}
          />
        )}
      </Route>
      <Route path="/department/read-all-dept/:id/active">
        {({ history, match }) => (
          <DeptActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/department/read-all-dept");
            }}
          />
        )}
      </Route>
      <DeptCard />
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
    </DeptUIProvider>
  );
}
