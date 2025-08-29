import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllCity,
  fetchDashboardVehicles,

  // alaramTime,
} from "../../redux/dashboardActions";
import { Route } from "react-router-dom";
import { TilesWidget1, TilesWidget10 } from "../widgets";
//import CreateIncidentDialog from "../widgets/modal/CreateIncidentDialog";
import { IncidentCreateDialog } from "../widgets/modal/incident-create-dialog/IncidentCreateDialog";
// import { TripLogEditDialog } from "../../../app/modules/IncidentDetails/pages/triplogs/triplog-edit-dialog/TripLogEditDialog";
//import { DropdownMenu4 } from "../dropdowns";
import { LastTripsUIProvider } from "../widgets/tiles/LastTrips/LastTripsUIContext";
//import LastTripsDialog from "../widgets/tiles/LastTrips/LastTripsDialog";
export function Demo2Dashboard({ history }) {
  const dispatch = useDispatch();

  // All useState Hook
  const [city, setCity] = useState([]);
  const [center, setCenter] = useState([]);
  const [subCenter, setSubcenter] = useState([]);
  const [standByvehicles, setStandbyVehicels] = useState([]);
  const [onDutyVehicles, setOnDutyVehicels] = useState([]);
  const [offDutyVehicles, setOffDutyVehicels] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [regNo, setRegNo] = useState([]);
  const [seletedOnDuty, setSeletecOnDuty] = useState([]);
  const [seletedOnOffDuty, setSeleteOffDuty] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCloseTripDialogue, setCloseTripDialogue] = useState(false);
  const [closeTripId, setCloseTripId] = useState();
  const [diable, setDisable] = useState(true);
  const [diableOnDutyButton, setDisableOnDutyButton] = useState(true);
  const [alarmTime, setAlarmTime] = useState([]);

  // Getting Redux state
  const { dashboard, auth } = useSelector((state) => state);
  const { user } = auth;

  // useEffect(() => {
  //   dispatch(fetchAllCity(user.countryId));
 
  //   dispatch(alaramTime());
  // }, []);



  //console.log("dashboard", dashboard);
  // console.log("city", city);
  useEffect(() => {
    //console.log("seleted cit yis called");
    const getSeletedCity =
      dashboard.allCity &&
      dashboard.allCity.find((item) => {
        return item.value === user.cityId;
      });

    setCity(getSeletedCity);
  }, [dashboard.allCity]);

  useEffect(() => {
    setDisable(vehicle.length > 0 ? false : true);
  }, [vehicle]);

  useEffect(() => {
    setDisableOnDutyButton(seletedOnDuty.length > 0 ? false : true);
  }, [seletedOnDuty]);

  //console.log("vehicle", vehicle);

  useEffect(() => {
    setStandbyVehicels(dashboard.standBy);
  }, [dashboard.standBy, dispatch]);

  useEffect(() => {
    setOnDutyVehicels(dashboard.onDuty);
  }, [dashboard.onDuty]);

  // useEffect(() => {
  //   setAlarmTime(dashboard.alarmTime);
  // }, [dashboard.alarmTime]);

  useEffect(() => {
    setOffDutyVehicels(dashboard.offDuty);
  }, [dashboard.offDuty, dispatch]);

  // Fn create incident Dialogue
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Fn close Trip dialogue
  const openTripcloseDialogue = () => {
    setCloseTripDialogue(true);
    setCloseTripId(seletedOnDuty[0]);
  };

  const handleCloseDialoge = () => {
    setCloseTripDialogue(false);
  };

  const LastTripLogUIEvents = {
    // newUserButtonClick: () => {
    //   history.push("/incident-details/read-all-incident-details/new")
    // },
    openLastTripsDialog: (id) => {
      history.push(`/dashboard/read-vehicle-trip-logs/${id}/edit`);
    },
  };
  return (
    <>
      <LastTripsUIProvider TripLogsUIEvents={LastTripLogUIEvents}>
        <Route path="/dashboard/read-vehicle-trip-logs/:id/edit">
          {/* {({ history, match }) => (
            <LastTripsDialog
              open={match != null}
              id={match && match.params.id}
              // onHide={() => {
              //   history.push("/incident-details/read-all-driver-trip-logs");
              // }}
            />
          )} */}
        </Route>
        <div className="row">
          <div className="col-xl-12">
            <TilesWidget10
              className="gutter-b"
              widgetHeight="125px"
              seletCity={city}
              setCity={setCity}
              setCenter={setCenter}
              center={center}
              setSubcenter={setSubcenter}
              subCenter={subCenter}
              alarmTime={alarmTime}
              setAlarmTime={setAlarmTime}
              setVehicle={setVehicle}
            />
          </div>
          <div className="col-xl-4">
            <TilesWidget1
              className="gutter-b card-stretch"
              chartColor="danger"
              heading="Stand By"
              buttonHeading="Create Incident"
              NoofVehicle={standByvehicles.length}
              vehiclesData={standByvehicles}
              handleClickOpen={handleClickOpen}
              setVehicle={setVehicle}
              vehicle={vehicle}
              seletedCity={city}
              selectionType="checkbox"
              diable={diable}
              rowSelection={false}
              setRegNo={setRegNo}
            />
            <IncidentCreateDialog
              show={open}
              onHide={handleClose}
              handleClose={handleClose}
              selectedVehicles={vehicle}
              setStandbyVehicels={setStandbyVehicels}
              city={city}
              center={center && center.value}
              subCenter={subCenter && subCenter.value}
              setVehicle={setVehicle}
            />
          </div>
          <div className="col-xl-4">
            <TilesWidget1
              className="gutter-b card-stretch"
              chartColor="danger"
              heading="On Duty"
              buttonHeading="In Vehicle"
              NoofVehicle={onDutyVehicles.length}
              vehiclesData={onDutyVehicles}
              handleClickOpen={openTripcloseDialogue}
              setVehicle={setSeletecOnDuty}
              vehicle={seletedOnDuty}
              selectionType="radio"
              diable={diableOnDutyButton}
              rowSelection={false}
            />
            {/* <TripLogEditDialog
              show={openCloseTripDialogue}
              onHide={() => setCloseTripDialogue(false)}
              id={closeTripId}
              seletedCity={city}
              center={center && center.value}
              subCenter={subCenter && subCenter.value}
              setVehicle={setVehicle}
            /> */}
          </div>
          <div className="col-xl-4">
            <TilesWidget1
              className="gutter-b card-stretch"
              chartColor="danger"
              heading="Off Duty"
              //buttonHeading="Active vehicle"
              NoofVehicle={offDutyVehicles.length}
              vehiclesData={offDutyVehicles}
              setVehicle={setSeleteOffDuty}
              seletedCity={city}
              rowSelection={true}
              selectionType="radio"
            />
          </div>
        </div>
      </LastTripsUIProvider>
    </>
  );
}
