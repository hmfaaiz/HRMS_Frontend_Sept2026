import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { DashboardUIProvider } from "./DashboardUIContext";
import { LastTripsDialog } from "./last-trips-dialog/LastTripsDialog";
import { DashboardTiles } from "./trips-vehicle-tiles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as actions from "../../_redux/dashboardActions";
//import { useCentersUIContext } from "./DashboardUIContext";

export function DashboardPage({ history }) {
  // const centersUIContext = useCentersUIContext();

  const dispatch = useDispatch();

  const centersUIEvents = {
    openReadLastTripsDialog: async (id) => {
      const body = {
        vehicleId: id,
        filter: {
          searchQuery: "",
        },
        sortOrder: "name",
        pageSize: 20,
        pageNumber: 1,
      };
      dispatch(actions.getLastTrips(body));
      history.push(`/dashboard/vehicle/${id}/read`);
    },
  };
  return (
    <>
    <div><h1>Dashboard 3</h1></div>
    <DashboardUIProvider centersUIEvents={centersUIEvents}>
      <Route path="/dashboard/vehicle/:id/read">
        {({ history, match }) => (
          <LastTripsDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/dashboard/vehicle");
            }}
          />
        )}
      </Route>

      <DashboardTiles />
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
    </DashboardUIProvider></>
  );
}
