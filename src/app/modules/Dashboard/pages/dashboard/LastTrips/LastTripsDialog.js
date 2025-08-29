import React, { useState, useEffect, useCallback } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

// Data table import
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";

// import { TripLogsUIProvider } from "../../../../../app/modules/IncidentDetails/pages/triplogs/TripLogsUIContext";
// import { TripLogsCard } from "../../../../../app/modules/IncidentDetails/pages/triplogs/triplogs-card/TripLogsCard";

// import { LastTripsUIProvider } from "./LastTripsUIContext";
//import { LastTripsCard } from "./triplogs-card/TripLogsCard";
// import { LastTripLogsTable } from "./triplogs-table/TripsLogsTable";
// import {
//   getHandlerTableChange,
//   NoRecordsFoundMessage,
//   PleaseWaitMessage,
//   sortCaret,
//   headerSortingClasses,
// } from "../../../../_helpers";

import { useSelector, useDispatch } from "react-redux";
// import { updateTrip } from "../../../../../app/modules/IncidentDetails/_redux/triplogs/triplogActions";
// import { updateTripLog } from "../../../../redux/dashboardActions";
//import { LastTripsTable } from "./centers-vehicles-table/LastTripsTable";

//import { UsersTable } from "./users-table/UsersTable";
//import { DatetimeColumnFormatter } from "../Formater/DataFormater";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const products = [
  {
    id: 8,
    name: "Suzuki",
    type: "good",
    price: "6000",
  },
  {
    id: 9,
    name: "Bullan",
    type: "bad",
    price: "7000",
  },
  {
    id: 10,
    name: "Bullan",
    type: "unknown",
    price: "7000",
  },
];

const selectOptions = {
  0: "good",
  1: "Bad",
  2: "unknown",
};

const columns = [
  {
    dataField: "id",
    text: "Id",
  },
  {
    dataField: "driver.firstName",
    text: "Driver Name",
    editable: false,
  },
  {
    dataField: "driver.phNo",
    text: "Ph#",
    editable: false,
  },
  {
    dataField: "vehicle.regNo",
    text: "Reg No",
    editable: false,
  },
  {
    dataField: "initialReading",
    text: "Initial Reading",
    editable: false,
  },
  {
    dataField: "finalReading",
    text: "Final Reading",
  },
  {
    dataField: "logBookNo",
    text: "Loog Book No",
  },
  {
    dataField: "sourcecenter.name",
    text: "Center Name",
    editable: false,
  },
  {
    dataField: "price",
    text: "Price",
  },
  {
    dataField: "status",
    text: "status",
  },
  {
    dataField: "startDateTime",
    text: "Start Time",
    editable: false,
    // formatter: DatetimeColumnFormatter,
  },
  {
    dataField: "endDateTime",
    text: "End Time",
    editable: false,
    // formatter: DatetimeColumnFormatter,
  },
];

export const initialFilter = {
  filter: {
    searchQuery: "",
  },

  sortOrder: "name",
  pageNumber: 1,
  pageSize: 10,
};

export default function LastTripsDialog({ open, handleClose, history }) {
  var { lastTrips } = useSelector((item) => item.dashboard);

  //console.log("last trips", lastTrips);
  var [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("UseEffect Called");
    if (lastTrips.rows) {
      setData(lastTrips.rows);
    }
  }, [lastTrips]);
  const handleCellEdit = (oldValue, newValue, row, column) => {
    console.log(
      `Cell edited: ${column.dataField}, row ID: ${row.id}, new value: ${newValue}`
    );
    dispatch();
    // Dispatch your call here...
  };
  const cellEdit = cellEditFactory({
    mode: "click",
    //blurToSave: true,
    beforeSaveCell: (oldValue, newValue, row, column) => {
      console.log("row", row);
      const { dataField } = column;
      const { id, sourceSubCenterId } = row;

      const payload = {
        id: id,
        subCenterId: sourceSubCenterId,
      };

      payload[dataField] = newValue;
      // payload[subCenterId] = subCenterId;

      console.log("payload", payload);

      //dispatch(updateTripLog(payload));
    },
    afterSaveCell: handleCellEdit,
  });

  const NoDataIndication = () => (
    <div className="spinner">
      <div className="rect1" />
      <div className="rect2" />
      <div className="rect3" />
      <div className="rect4" />
      <div className="rect5" />
    </div>
  );

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={true}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Last 20 Trips
        </DialogTitle>
        <DialogContent dividers>
          {/* <LastTripsCard /> */}

          {/* <TripLogsUIProvider TripLogsUIEvents={TripLogsUIEvents}>
            <TripLogsCard />
          </TripLogsUIProvider> */}
          {/* <CenterVehiclesFilter /> */}

          {/* <BootstrapTable
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            remote
            keyField="id"
            data={data || []}
            columns={columns}
            pagination={paginationFactory(paginationOptions)}
            cellEdit={cellEdit}
            onTableChange={getHandlerTableChange(setQueryParams)}
            noDataIndication={() => <NoDataIndication />}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
