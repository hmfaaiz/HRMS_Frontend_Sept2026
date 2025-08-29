import React from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../../_redux/dashboardActionss";
import { Dropdown } from "react-bootstrap";
import {
  DropdownCustomToggler,
  DropdownMenu4,
  DropdownMenu3,
} from "../../../../../../../_metronic/_partials/dropdowns";

export function ActionFormater(cell, row) {
  const dispatch = useDispatch();
  const standToOff = () => {
    //console.log("city", seletedCity);
    const body = {
      id: row.vehicleid,
      available: false,
      offDuty: true,
    };
    dispatch(actions.updateVehicelStatus(body)).then(() => {
      dispatch(actions.fetchDashboardVehicles({ cityId: seletedCity.value }));
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
    dispatch(actions.updateVehicelStatus(body)).then(() => {
      dispatch(actions.fetchDashboardVehicles({ cityId: seletedCity.value }));
    });
  };

  const handleClickLastTripsDialoge = () => {
    // history.push(`/dashboard/read-vehicle-trip-logs/${row.vehicleid}/edit`);

    const body = {
      vehicleId: row.vehicleid,
      filter: {
        searchQuery: "",
      },
      sortOrder: "name",
      pageSize: 20,
      pageNumber: 1,
    };
    dispatch(actions.getLastTrips(body));
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
}
