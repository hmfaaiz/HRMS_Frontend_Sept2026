/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { DropdownCustomToggler } from "../../dropdowns";
import {
  updateVehicelStatus,
  fetchDashboardVehicles,
  // getLastTrips,
} from "../../../redux/dashboardActions";
import { useDispatch } from "react-redux";
import { getDate, getTime, getCurrentTime } from "../../../../app/utils/common";
import moment from "moment";

export function TilesWidget1({
  className,
  chartColor = "danger",
  heading,
  setRegNo,
  buttonHeading,
  NoofVehicle,
  vehiclesData,
  handleClickOpen,
  setVehicle,
  vehicle,
  seletedCity,
  selectionType,
  diable,
  rowSelection,
}) {
  // const triplogsUIContext = useLastTripsUIContext();
  // const triplogsUIProps = useMemo(() => {
  //   return {
  //     queryParams: triplogsUIContext.queryParams,
  //     setQueryParams: triplogsUIContext.setQueryParams,
  //     setQueryParamsBase: triplogsUIContext.setQueryParamsBase,
  //     openEditUserDialog: triplogsUIContext.openLastTripsDialog,
  //   };
  // }, [triplogsUIContext]);

  const dispatch = useDispatch();
  const timerFormater = (cellContent) => {
    return (
      <>
        <span>{getTime(cellContent)}</span>
      </>
    );
  };
  const getMinutes = (start) => {
    var now = moment(new Date());
    return now.diff(start, "minutes");
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    history.push(`/dashboard`);
    setOpen(false);
  };

  const history = useHistory();

  const actionFormater = (cell, row) => {
    const standToOff = () => {
      //console.log("city", seletedCity);
      const body = {
        id: row.vehicleid,
        available: false,
        offDuty: true,
      };
      dispatch(updateVehicelStatus(body)).then(() => {
        dispatch(fetchDashboardVehicles({ cityId: seletedCity.value }));
      });
    };

    const offToStand = () => {
      const body = {
        id: row.vehicleid,
        available: true,
        offDuty: false,
      };

      // dispatch(updateVehicelStatus(body)).then(() => {
      //   // console.log("seletedCity", seletedCity);
      //   //dispatch(fetchDashboardVehicles({ cityId: 0 }));
      // });
      dispatch(updateVehicelStatus(body)).then(() => {
        dispatch(fetchDashboardVehicles({ cityId: seletedCity.value }));
      });
    };

    const handleClickLastTripsDialoge = () => {
      history.push(`/dashboard/read-vehicle-trip-logs/${row.vehicleid}/edit`);

      const body = {
        vehicleId: row.vehicleid,
        filter: {
          searchQuery: "",
        },
        sortOrder: "name",
        pageSize: 20,
        pageNumber: 1,
      };
      // dispatch(getLastTrips(body));
      setOpen(true);
    };

    return (
      <>
        {heading != "On Duty" && (
          <Dropdown className="dropdown-inline" alignRight>
            <Dropdown.Toggle
              className=" btn-clean btn-hover-light-primary btn-sm btn-icon"
              variant="transparent"
              id="dropdown-toggle-top"
              as={DropdownCustomToggler}
            >
              <i className="ki ki-bold-more-hor" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
              <ul className="navi navi-hover py-5">
                {heading === "Stand By" ? (
                  <>
                    <li className="navi-item" onClick={() => standToOff()}>
                      <a href="#" className="navi-link">
                        <span className="navi-icon">
                          <i className="flaticon2-list-3"></i>
                        </span>
                        <span className="navi-text">Off Duty</span>
                      </a>
                    </li>
                    {/* <li className="navi-item">
                      <a href="#" className="navi-link">
                        <span className="navi-icon">
                          <i className="flaticon2-rocket-1"></i>
                        </span>
                        <span className="navi-text">Update</span>
                      </a>
                    </li> */}
                    <li
                      className="navi-item"
                      onClick={() => handleClickLastTripsDialoge()}
                    >
                      <a href="#" className="navi-link">
                        <span className="navi-icon">
                          <i className="flaticon2-bell-2"></i>
                        </span>
                        <span className="navi-text">Last 20 Trips</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="navi-item" onClick={() => offToStand()}>
                    <a href="#" className="navi-link">
                      <span className="navi-icon">
                        <i className="flaticon2-list-3"></i>
                      </span>
                      <span className="navi-text">Stand By</span>
                    </a>
                  </li>
                )}
              </ul>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </>
    );
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    {
      dataField: "name",
      text: "Vehicle Name",
      align: "start",
      headerAlign: "center",
      headerAttrs: {
        hidden: true,
      },
      style: (cell, row, rowIndex, colIndex) => {
        var minutes = getMinutes(row.start_time);
        if (row.status != "offDuty" && minutes > 5) {
          return { color: "red", verticalAlign: "middle" };
        }
        return { verticalAlign: "middle" };
      },
    },

    {
      dataField: "regNo",
      text: "Registration No",
      align: "start",
      headerAttrs: {
        hidden: true,
      },
      style: (cell, row, rowIndex, colIndex) => {
        var minutes = getMinutes(row.start_time);
        if (row.status != "offDuty" && minutes > 5) {
          return { color: "red", verticalAlign: "middle" };
        }
        return { verticalAlign: "middle" };
      },
    },
    {
      dataField: "start_time",
      text: "time",
      align: "center",
      headerAttrs: {
        hidden: true,
      },
      style: (cell, row, rowIndex, colIndex) => {
        var minutes = getMinutes(row.start_time);
        if (row.status != "offDuty" && minutes > 5) {
          return { color: "red", verticalAlign: "middle" };
        }
        return { verticalAlign: "middle" };
      },
      formatter: timerFormater,
    },
    {
      dataField: "",
      text: "Action",
      headerAlign: "center",
      headerAttrs: {
        hidden: true,
      },
      formatter: actionFormater,
      style: { verticalAlign: "middle" },
    },
  ];

  const selectRow = {
    mode: selectionType,
    hideSelectColumn: rowSelection,
    style: { backgroundColor: "#c8e6c9" },
    selectColumnStyle: {
      textAlign: "center",
      verticalAlign: "middle",
    },
    classes: "custom-class",
    align: "center",
    hideSelectAll: true,
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        let vehicleId;
        // console.log("row", row);
        if (row.status === "Available") {
          vehicleId = row.vehicleid;
          // console.log("row", row);
          setVehicle((item) => [...item, vehicleId]);
          setRegNo((item) => [...item, row.regNo]);
        } else {
          vehicleId = row.tripLogId;
          setVehicle([row.tripLogId]);
        }
      } else if (!isSelect) {
        //console.log("seleted vehicel", vehicle);
        const index = vehicle && vehicle.indexOf(row.vehicleid);
        //  console.log("index", index);
        if (index > -1) {
          vehicle.splice(index, 1);
          setVehicle([...vehicle]);
          // if()
          //console.log("Uncseleted called", row);

          setRegNo([row.regNo]);
          //setVehicle((item) => [...item, vehicle]);
        }
      }
    },
  };

  const emptyDataMessage = () => {
    return <h6 className="text-center mt-2">No Data to Display</h6>;
  };

  return (
    <>
      <div className={`card card-custom ${className}`}>
        {/* begin::Header */}
        <div className="card-header border-0">
          <div className="card-title">
            <div className="card-label">
              <div className="font-weight-bolder">{heading}</div>
              <div className="font-size-sm text-muted mt-2">{NoofVehicle}</div>
            </div>
          </div>
          <div className="card-toolbar">
            {buttonHeading && (
              <button
                className="btn btn-primary"
                disabled={diable}
                onClick={handleClickOpen}
                //onClick={handleShow}
              >
                {buttonHeading}
              </button>
            )}
          </div>
        </div>

        <div className="table-box">
          <BootstrapTable
            classes="dasboard-table"
            keyField="vehicleid"
            data={vehiclesData || []}
            columns={columns}
            selectRow={selectRow}
            condensed
            bordered={false}
            noDataIndication={emptyDataMessage}
          />
        </div>
        {/* <LastTripsDialog open={open} handleClose={handleClose} /> */}
      </div>
    </>
  );
}
