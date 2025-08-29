import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import { Route, Switch } from "react-router-dom";
// import { TilesWidget10 } from "../../../../../../_metronic/_partials/widgets";
// import { TilesWidget } from "../tiles-widget/TilesWidget";
// import { IncidentCreateDialog } from "../incident-create-dialog/IncidentCreateDialog";
// import { TripLogEditDialog } from "../../../../IncidentDetails/pages/triplogs/triplog-edit-dialog/TripLogEditDialog";
import LastTripsDialog from "../LastTrips/LastTripsDialog";
// import { fetchTripLog } from "../../../../IncidentDetails/_redux/incidents/incidentActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function DashboardTiles({ history }) {
  const dispatch = useDispatch();

  // All useState Hook
  const [city, setCity] = useState([]);
  const [center, setCenter] = useState([]);
  const [subCenter, setSubcenter] = useState([]);
  const [standByvehicles, setStandbyVehicels] = useState([]);
  const [onDutyVehicles, setOnDutyVehicels] = useState([]);
  const [offDutyVehicles, setOffDutyVehicels] = useState([]);
  //Selections for Stand by vehicles
  const [vehicle, setVehicle] = useState([]);
  // getting stand by selected vehicle reg no
  const [regNo, setRegNo] = useState([]);
  //  Selection for on Duty Vehicles
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

  // console.log("seletedOnDuty", seletedOnDuty);
  // console.log("vehicle seelcted for stand by", vehicle);

  // console.log("seletedCity", city);
  // console.log("selectedCenter", center);
  // console.log("selectedSubCenter", subCenter);

  useEffect(() => {
    dispatch(action.fetchAllCity(user.countryId));

    dispatch(action.alaramTime());
  }, []);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   console.log("Set interval called");
    //   // let payload = {}
    //   // if(alarmTime){
    //   //   payload.alarmTimeId
    //   // }
    //   dispatch(
    //     action.fetchDashboardVehicles({ cityId: user.cityId || city.value })
    //   );
    // }, 50000);
    // // setOnDutyVehicels(dashboard.onDuty);
    // return () => clearInterval(interval);
    //console.log("First render call");
    dispatch(
      action.fetchDashboardVehicles({ cityId: user.cityId || city.value })
    );
    // //dispatch(fetchAllCityCenters(user.cityId));
  }, []);

  //console.log("dashboard", dashboard);
  //console.log("dashboard.allCity", dashboard);
  useEffect(() => {
    if (dashboard.allCity) {
      const getSeletedCity =
        dashboard.allCity &&
        dashboard.allCity.find((item) => {
          return item.value === user.cityId;
        });

      setCity(getSeletedCity);
    }
  }, [dashboard.allCity]);

  useEffect(() => {
    setDisable(vehicle.length > 0 ? false : true);
  }, [vehicle]);

  useEffect(() => {
    setDisableOnDutyButton(seletedOnDuty.length > 0 ? false : true);
  }, [seletedOnDuty]);

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
    setCloseTripId(seletedOnDuty[0]);
    //console.log("seletedOnDuty", seletedOnDuty[0]);
    if (seletedOnDuty[0] != null) {
      setCloseTripDialogue(true);
    } else {
      toast.error("Trip Log id Not found", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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

  //console.log("vehicle", vehicle);
  return (
    <>
    <div><h1>Dashboard 2</h1></div>
      <div className="row">
        <div className="col-xl-12">
          {/* <TilesWidget10
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
          /> */}
        </div>
        {/* <div className="col-xl-4">
          <TilesWidget
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
            selectedCenter={center}
            selectedSubCenter={subCenter}
            selectionType="checkbox"
            diable={diable}
            rowSelection={false}
            setRegNo={setRegNo}
            regNo={regNo}
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
            regNo={regNo}
            setRegNo={setRegNo}
          />
        </div> */}
        <div className="col-xl-4">
          {/* <TilesWidget
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
            seletedCity={city}
            selectedCenter={center}
            selectedSubCenter={subCenter}
          />
          <TripLogEditDialog
            show={openCloseTripDialogue}
            onHide={() => setCloseTripDialogue(false)}
            id={closeTripId}
            seletedCity={city}
            center={center && center.value}
            subCenter={subCenter && subCenter.value}
            setVehicle={setVehicle}
            setSeletecOnDuty={setSeletecOnDuty}
          /> */}
        </div>
        <div className="col-xl-4">
          {/* <TilesWidget
            className="gutter-b card-stretch"
            chartColor="danger"
            heading="Off Duty"
            //buttonHeading="Active vehicle"
            NoofVehicle={offDutyVehicles.length}
            vehiclesData={offDutyVehicles}
            setVehicle={setSeleteOffDuty}
            rowSelection={true}
            selectionType="radio"
            seletedCity={city}
            selectedCenter={center}
            selectedSubCenter={subCenter}
          /> */}
        </div>
      </div>
    </>
  );
}
