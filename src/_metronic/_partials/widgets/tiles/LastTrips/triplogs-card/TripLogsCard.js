import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
//import { TripLogsTable } from "../triplogs-table/TripsLogsTable";
import { useLastTripsUIContext } from "../LastTripsUIContext";

import { Filter } from "../last-trips-filter/lastTripfilter";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { LastTripLogsTable } from "../triplogs-table/TripsLogsTable";

export function LastTripsCard() {
  const lastTripUIContext = useLastTripsUIContext();
  const { lastTrips } = useSelector((state) => state?.dashboard);

  console.log("lastTrips", lastTrips);

  //const { totalResults, rows } = lastTrips;
  //console.log("incidentsUIContext", incidentsUIContext)
  // const incidentsUIProps = useMemo(() => {
  //   return {
  //     newUserButtonClick: incidentsUIContext.newUserButtonClick,
  //     openEditUserDialog: incidentsUIContext.openEditUserDialog,
  //   };
  // }, [incidentsUIContext]);

  // const { userAccess } = useSelector(
  //   (state) => ({
  //     userAccess: state.auth.userAccess.Users,
  //   }),
  //   shallowEqual
  // );

  // const accessUser = userAccess.find(
  //   (item) => item.componentName === "CreateUser"
  // );

  return (
    <>
      <Card>
        <CardHeader title={<Filter />}>
          {/* <CardHeaderToolbar>
            {accessUser ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={incidentsUIProps.newUserButtonClick}
              >
                Add New Incident
              </button>
            ) : (
              <></>
            )}
            
          </CardHeaderToolbar> */}
        </CardHeader>

        <CardBody>
          <LastTripLogsTable lastTrips={lastTrips && lastTrips} />
        </CardBody>
      </Card>
    </>
  );
}
