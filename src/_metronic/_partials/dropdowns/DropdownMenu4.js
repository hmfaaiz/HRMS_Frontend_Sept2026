/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useDispatch } from "react-redux";
import {
  updateVehicelStatus,
  fetchDashboardVehicles,
} from "../../redux/dashboardActions";

export function DropdownMenu4(column, seletedCity) {
  console.log("seletedCity", seletedCity);
  //console.log("row.veh", row.row.vehicleid);
  const dispatch = useDispatch();

  const standToOff = () => {
    const body = {
      id: column.column.vehicleid,
      available: false,
      offDuty: true,
    };
    dispatch(updateVehicelStatus(body));
    // dispatch(fetchDashboardVehicles({ cityId: +cityId }));
  };

  // console.log("seletedCity", seletedCity);
  return (
    <>
      {/*begin::Navigation*/}
      <ul className="navi navi-hover py-5">
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-drop"></i>
            </span>
            <span className="navi-text">Out</span>
          </a>
        </li>
        <li className="navi-item" onClick={() => standToOff()}>
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-list-3"></i>
            </span>
            <span className="navi-text">Off Duty</span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-rocket-1"></i>
            </span>
            <span className="navi-text">Update Location</span>
            {/* <span className="navi-link-badge">
              <span className="label label-light-primary label-inline font-weight-bold">
                new
              </span>
            </span> */}
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-bell-2"></i>
            </span>
            <span className="navi-text">Last 20 Trips</span>
          </a>
        </li>
        {/* <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-gear"></i>
            </span>
            <span className="navi-text">Settings</span>
          </a>
        </li>

        <li className="navi-separator my-3"></li> */}

        {/* <li className="navi-item">
                <a href="#" className="navi-link">
                    <span className="navi-icon"><i className="flaticon2-magnifier-tool"></i></span>
                    <span className="navi-text">Help</span>
                </a>
            </li>
            <li className="navi-item">
                <a href="#" className="navi-link">
                    <span className="navi-icon"><i className="flaticon2-bell-2"></i></span>
                    <span className="navi-text">Privacy</span>
                    <span className="navi-link-badge">
                <span className="label label-light-danger label-rounded font-weight-bold">5</span>
            </span>
                </a>
            </li> */}
      </ul>
      {/*end::Navigation*/}
    </>
  );
}
