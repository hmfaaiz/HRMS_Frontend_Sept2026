/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useDispatch } from "react-redux";
import {
  updateVehicelStatus,
  fetchDashboardVehicles,
} from "../../redux/dashboardActions";

export function DropdownMenu3(column, cityId) {
  const dispatch = useDispatch();
  const offDuty = () => {
    const body = {
      id: column.column.vehicleid,
      available: true,
      offDuty: false,
    };
    dispatch(updateVehicelStatus(body));
    //dispatch(fetchDashboardVehicles({ cityId: +cityId }));
  };

  return (
    <>
      {/*begin::Naviigation*/}
      <ul className="navi">
        <li className="navi-item" onClick={() => offDuty()}>
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="flaticon2-shopping-cart-1"></i>
            </span>
            <span className="navi-text">Stand By</span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="navi-icon flaticon2-calendar-8"></i>
            </span>
            <span className="navi-text">Members</span>
            <span className="navi-label">
              <span className="label label-light-danger label-rounded font-weight-bold">
                3
              </span>
            </span>
          </a>
        </li>
        <li className="navi-item">
          <a href="#" className="navi-link">
            <span className="navi-icon">
              <i className="navi-icon flaticon2-telegram-logo"></i>
            </span>
            <span className="navi-text">Project</span>
          </a>
        </li>
      </ul>
      {/*end::Naviigation*/}
    </>
  );
}
