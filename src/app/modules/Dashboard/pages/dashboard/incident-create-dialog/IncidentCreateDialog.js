import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { IncidentEditForm } from "./IncidentEditForm";
import { IncidentEditDialogHeader } from "./IncidentEditDialogHeader";
// import { useIncidentsUIContext } from "../../../../IncidentDetails/pages/incidents/IncidentsUIContext";
// import * as actions from "../../../../IncidentDetails/_redux/incidents/incidentActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fetchDashboardVehicles } from "../../../_redux/dashboardActions";

const initIncident = {
  callerName: "",
  // callerCNIC: "",
  callerPhoneNo: "",
  patientName: "",
  // patientCNIC: "",
  shortDescription: "",
  // location: "",
  area: "",
  vehicleId: "",
  alarmTimeId: "",
  // incidentTypeId: undefined,
  // incidentSeverityId: undefined,
  // centerId: undefined,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
}));

export function IncidentCreateDialog({
  id,
  show,
  onHide,
  userForRead,
  handleClose,
  selectedVehicles,
  setStandbyVehicels,
  city,
  center,
  subCenter,
  setVehicle,
  regNo,
  setRegNo,
}) {
  // console.log("city", city);
  // console.log("center", center);
  // console.log("subCenter", subCenter);
  const title = "UserEditDialog";
  const classes = useStyles();
  const [centerId, setCenter] = useState("");
  const [loading, setLoading] = useState(false);
  //const [alaramTime, setAlaramTime] = useState();
  const incidentsUIContext = useIncidentsUIContext();

  const { dashboard } = useSelector((state) => state);

  //console.log("dashboard", dashboard);

  //console.log("incidentsUIContext", incidentsUIContext);
  // const incidentsUIProps = useMemo(() => {
  //   return {
  //     initIncident: incidentsUIContext.initIncident,
  //     queryParams: incidentsUIContext.queryParams,
  //   };
  // }, [incidentsUIContext]);

  const dispatch = useDispatch();
  // const {
  //   actionsLoading,
  //   incidentForEdit,
  //   isuserForRead,
  //   IncidentType,
  //   incidentSeverity,
  //   centers,
  //   vehicleByCenterId,
  //   vehiclesForDropdown,
  // } = useSelector(
  //   (state) => ({
  //     actionsLoading: state.incidentDetails.actionsLoading,
  //     incidentForEdit: state.incidentDetails.incidentForEdit,
  //     isuserForRead: state.incidentDetails.userForRead,
  //     IncidentType: state.incidentDetails.incidentTypes,
  //     incidentSeverity: state.incidentDetails.incidentSeverity,
  //     centers: state.incidentDetails.centers,
  //     vehicleByCenterId: state.incidentDetails.vehicleByCenterId,
  //     vehiclesForDropdown: state.incidentDetails.vehiclesForDropdown,
  //   }),
  //   shallowEqual
  // );

  // Enable Loading
  const enableLoading = () => {
    setLoading(true);
  };
  // disable Loading
  const disabledLoading = () => {
    setLoading(false);
  };

  const saveIncident = (incident) => {
    enableLoading();
    dispatch(actions.createIncident(incident)).then((res) => {
      var filterObj = {};
      if (city.value) {
        filterObj.cityId = city.value;
      }
      if (center) {
        filterObj.centerId = center;
      }
      if (subCenter) {
        filterObj.subCenterId = subCenter;
      }
      setVehicle([]);
      setRegNo([]);
      dispatch(fetchDashboardVehicles(filterObj));
      disabledLoading();
      onHide();
    });
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <IncidentEditDialogHeader id={id} isUserForRead={userForRead} />
      <IncidentEditForm
        saveIncident={saveIncident}
        incident={initIncident}
        IncidentType={IncidentType}
        incidentSeverityOption={incidentSeverity}
        centers={centers}
        vehicleByCenterId={vehicleByCenterId}
        vehiclesForDropdown={vehiclesForDropdown}
        onHide={onHide}
        isUserForRead={userForRead}
        setCenter={setCenter}
        loading={loading}
        handleClose={handleClose}
        selectedVehicles={selectedVehicles}
        regNo={regNo}
        //alaramTime={dashboard.alaramTime}
      />
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
    </Modal>
  );
}
