/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Dropdown } from "react-bootstrap";
//import { useHistory } from "react-router-dom";
import { DropdownCustomToggler } from "../../../../../../_metronic/_partials/dropdowns";
import * as actions from "../../../_redux/dashboardActions";
import { useDispatch } from "react-redux";
import { getTime } from "../../../../../utils/common";
//import moment from "moment";
import { useCentersUIContext } from "../DashboardUIContext";

export function TilesWidget({
  className,
  chartColor = "danger",
  heading,
  setRegNo,
  regNo,
  buttonHeading,
  NoofVehicle,
  vehiclesData,
  handleClickOpen,
  setVehicle,
  vehicle,
  seletedCity,
  selectedCenter,
  selectedSubCenter,
  selectionType,
  diable,
  rowSelection,
}) {
  const dispatch = useDispatch();
  const centersUIContext = useCentersUIContext();
  const centersUIProps = useMemo(() => {
    return {
      queryParams: centersUIContext.queryParams,
      secondQueryParams: centersUIContext.secondQueryParams,
      openReadLastTripsDialog: centersUIContext.openReadLastTripsDialog,
    };
  }, [centersUIContext]);

  const timerFormater = (cellContent) => {
    return (
      <>
        <span>{getTime(cellContent)}</span>
      </>
    );
  };
  const minFormater = (cellContent) => {
    return (
      <>
        {cellContent ? (
          <>
            <span>{cellContent} min</span>
          </>
        ) : (
          <>-</>
        )}
      </>
    );
  };

  const actionFormater = (cell, row) => {
    const openReadLastTripsDialog = centersUIProps.openReadLastTripsDialog;

    // console.log("call through prop", openLast);
    const standToOff = () => {
      //console.log("city", seletedCity);
      const body = {
        id: row.vehicleid,
        available: false,
        offDuty: true,
      };
      const payload = {};
      if (seletedCity) {
        payload.cityId = seletedCity.value;
      }
      if (selectedCenter) {
        payload.centerId = selectedCenter.value;
      }
      if (selectedSubCenter) {
        payload.subCenterId = selectedSubCenter.value;
      }
      dispatch(actions.updateVehicelStatus(body)).then(() => {
        dispatch(actions.fetchDashboardVehicles(payload));
      });
    };

    const offToStand = () => {
      const body = {
        id: row.vehicleid,
        available: true,
        offDuty: false,
      };

      const payload = {};
      if (seletedCity) {
        payload.cityId = seletedCity.value;
      }
      if (selectedCenter) {
        payload.centerId = selectedCenter.value;
      }
      if (selectedSubCenter) {
        payload.subCenterId = selectedSubCenter.value;
      }

      dispatch(actions.updateVehicelStatus(body)).then(() => {
        //dispatch(actions.fetchDashboardVehicles({ cityId: seletedCity.value }));
        dispatch(actions.fetchDashboardVehicles(payload));
      });
    };

    // const handleClickLastTripsDialoge = () => {
    //   history.push(`/dashboard/read-vehicle-trip-logs/${row.vehicleid}/edit`);

    //   const body = {
    //     vehicleId: row.vehicleid,
    //     filter: {
    //       searchQuery: "",
    //     },
    //     sortOrder: "name",
    //     pageSize: 20,
    //     pageNumber: 1,
    //   };
    //   dispatch(actions.getLastTrips(body));
    //   setOpen(true);
    // };

    return (
      <>
        {heading !== "On Duty" && (
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
                    <li
                      className="navi-item"
                      onClick={() => openReadLastTripsDialog(row.vehicleid)}
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

  if (heading === "Stand By") {
    var columns = [
      {
        dataField: "regNo",
        text: "Reg No",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }
          return { verticalAlign: "middle" };
        },
      },
      {
        dataField: "end_time",
        text: "ET",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }

          return { verticalAlign: "middle" };
        },
        formatter: timerFormater,
      },
      {
        dataField: "assigned_minutes",
        text: "Assign",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }

          return { verticalAlign: "middle" };
        },
        formatter: minFormater,
      },
      // {
      //   dataField: "duration_minutes",
      //   text: "Dur",
      //   align: "start",
      //   // headerAttrs: {
      //   //   hidden: true,
      //   // },
      //   style: (cell, row, rowIndex, colIndex) => {
      //     const { timestatus } = row;
      //     if (row.status !== "offDuty" && timestatus === "late") {
      //       return { color: "red", verticalAlign: "middle" };
      //     }

      //     return { verticalAlign: "middle" };
      //   },
      //   formatter: minFormater,
      // },
      // {
      //   dataField: "start_time",
      //   text: "ST",
      //   align: "center",
      //   // headerAttrs: {
      //   //   hidden: true,
      //   // },
      //   style: (cell, row, rowIndex, colIndex) => {
      //     const { timestatus } = row;
      //     if (row.status !== "offDuty" && timestatus === "late") {
      //       return { color: "red", verticalAlign: "middle" };
      //     }

      //     // Old function to update countinue
      //     // var minutes = getMinutes(row.start_time);
      //     // if (row.status !== "offDuty" && minutes > 5) {
      //     //   return { color: "red", verticalAlign: "middle" };
      //     // }
      //     return { verticalAlign: "middle" };
      //   },
      //   formatter: timerFormater,
      // },
      {
        dataField: "",
        text: "Action",
        headerAlign: "center",
        headerAttrs: {
          hidden: true,
        },
        formatter: actionFormater,
        //   formatExtraData: {
        //     openReadLastTripsDialog: centersUIProps.openReadLastTripsDialog,
        //   },
        style: { verticalAlign: "middle" },
      },
    ];
  } else if (heading == "On Duty") {
    var columns = [
      {
        dataField: "regNo",
        text: "Reg No",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }
          return { verticalAlign: "middle" };
        },
      },
      {
        dataField: "start_time",
        text: "ST",
        align: "center",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }

          return { verticalAlign: "middle" };
        },
        formatter: timerFormater,
      },
      {
        dataField: "assigned_minutes",
        text: "Assign",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }

          return { verticalAlign: "middle" };
        },
        formatter: minFormater,
      },
      // {
      //   dataField: "duration_minutes",
      //   text: "Dur",
      //   align: "start",
      //   // headerAttrs: {
      //   //   hidden: true,
      //   // },
      //   style: (cell, row, rowIndex, colIndex) => {
      //     const { timestatus } = row;
      //     if (row.status !== "offDuty" && timestatus === "late") {
      //       return { color: "red", verticalAlign: "middle" };
      //     }

      //     return { verticalAlign: "middle" };
      //   },
      //   formatter: minFormater,
      // },

      {
        dataField: "",
        text: "Action",
        headerAlign: "center",
        headerAttrs: {
          hidden: true,
        },
        formatter: actionFormater,
        //   formatExtraData: {
        //     openReadLastTripsDialog: centersUIProps.openReadLastTripsDialog,
        //   },
        style: { verticalAlign: "middle" },
      },
    ];
  } else {
    var columns = [
      {
        dataField: "regNo",
        text: "Reg No",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }
          return { verticalAlign: "middle" };
        },
      },
      {
        dataField: "start_time",
        text: "Last Trip Time",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status !== "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }
          return { verticalAlign: "middle" };
        },
        formatter: timerFormater,
      },
      {
        dataField: "duration_minutes",
        text: "Dur",
        align: "start",
        // headerAttrs: {
        //   hidden: true,
        // },
        style: (cell, row, rowIndex, colIndex) => {
          const { timestatus } = row;
          if (row.status != "offDuty" && timestatus === "late") {
            return { color: "red", verticalAlign: "middle" };
          }

          return { verticalAlign: "middle" };
        },
        formatter: minFormater,
      },

      {
        dataField: "",
        text: "Action",
        headerAlign: "center",
        headerAttrs: {
          hidden: true,
        },
        formatter: actionFormater,
        //   formatExtraData: {
        //     openReadLastTripsDialog: centersUIProps.openReadLastTripsDialog,
        //   },
        style: { verticalAlign: "middle" },
      },
    ];
  }

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
      // console.log("isSelect", isSelect);
      // console.log("row", row);
      // console.log("rowIndex", rowIndex);
      // console.log("e", e);
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
        const index = vehicle && vehicle.indexOf(row.vehicleid);
        if (index > -1) {
          vehicle.splice(index, 1);
          setVehicle([...vehicle]);
        }
        const regIndex = regNo && regNo.indexOf(row.regNo);
        if (regIndex > -1) {
          regNo.splice(regIndex, 1);
          setRegNo([...regNo]);
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
