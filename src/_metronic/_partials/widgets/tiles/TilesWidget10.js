/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import { SearchSelect } from "../../../_helpers/SearchSelect";
import * as actions from "../../../redux/dashboardActions";

const initialValues = {
  cityId: [],
  cetnerId: [],
  subCetnerId: [],
  alarmTimeId: [],
};

const validationSchema = Yup.object().shape({
  cityId: Yup.string(),
  centerId: Yup.string(),
  subCetnerId: Yup.string(),
  alarmTimeId: Yup.string(),
});

export function TilesWidget10({
  className,
  widgetHeight = "150px",
  setCity,
  seletCity,
  setCenter,
  center,
  setSubcenter,
  subCenter,
  alarmTime,
  setAlarmTime,
  setVehicle,
}) {
  const dispatch = useDispatch();

  // console.log("seletedCity", seletCity);
  //console.log("selectedCenter on Top", center);
  // console.log("selectedSubCenter", subCenter);

  //const city = useSelector((state) => state.dashboard.entities);

  const { countryId, cityId } = useSelector((state) => state.auth.user);
  const dashboard = useSelector((state) => state.dashboard);
  //console.log("dashboard.alarmTime", dashboard.alarmTime);
  // console.log("alarmTime", alarmTime);
  // useEffect(() => {
  //   dispatch(action.fetchAllCity(countryId));
  // }, []);

  return (
    <>
      <div
        className={`card card-custom ${className}`}
        style={{ height: widgetHeight }}
      >
        <div className="card-body align-items-center">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            // onSubmit={(values) => {
            //   console.log("Center Form values", values);
            //   //saveCenter(values);
            // }}
          >
            {(handleBlur, setFieldValue, errors, touched) => (
              <>
                <div className="row">
                  <div className="col-12 col-md-3">
                    <SearchSelect
                      name="cityId"
                      options={dashboard.allCity}
                      label="Select City"
                      onChange={(e, { action, removedValue }) => {
                        if (action === "clear") {
                          setCity([]);
                        } else {
                          setCity(e);
                          setCenter([]);
                          setSubcenter([]);
                          setVehicle([]);
                          setAlarmTime([]);
                  
                          dispatch(
                            actions.fetchDashboardVehicles({ cityId: e.value })
                          );
                        }
                      }}
                      value={seletCity}
                      isClearable={false}
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <SearchSelect
                      name="centerId"
                      options={dashboard.cityCenters}
                      label="Select Main Center"
                      value={center}
                      onChange={(e, { action }) => {
                        let payload = {};

                        if (action === "clear") {
                          console.log("Clear called");
                          setCenter([]);
                          setSubcenter([]);
                          setAlarmTime([]);
                          if (seletCity) {
                            payload.cityId = seletCity.value;
                          }

                          dispatch(actions.fetchDashboardVehicles(payload));
                        } else {
                          setCenter(e);
                          if (seletCity) {
                            payload.cityId = seletCity.value;
                          }
                          if (center) {
                            payload.centerId = center.value;
                          }
                          if (subCenter) {
                            payload.subCenterId = subCenter.value;
                          }
                          // dispatch(actions.fetchAllSubCenter(e.value));
                          dispatch(
                            actions.fetchDashboardVehicles({
                              ...payload,
                              centerId: e.value,
                            })
                          );

                          // setSubcenter([]);
                          //setAlarmTime([]);
                        }
                      }}
                      isClearable={true}
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <SearchSelect
                      name="subCenterId"
                      options={dashboard.allSubCenter}
                      label="Select Subcenter"
                      onChange={(e) => {
                        dispatch(
                          actions.fetchDashboardVehicles({
                            cityId: cityId,
                            centerId: center.value,
                            subCenterId: e.value,
                          })
                        );
                        setSubcenter(e);
                        setAlarmTime([]);
                      }}
                      value={subCenter}
                    />
                  </div>
                  <div className="col-12 col-md-3">
                    <SearchSelect
                      name="alarmTimeId"
                      options={dashboard.alarmTime}
                      label="FIlter by Alarm"
                      onChange={(e, { action }) => {
                        let payload = {};
                        if (action === "clear") {
                          setAlarmTime([]);
                          if (seletCity) {
                            payload.cityId = seletCity.value;
                          }
                          if (center) {
                            payload.centerId = center.value;
                          }
                          if (subCenter) {
                            payload.subCenterId = subCenter.value;
                          }

                          dispatch(actions.fetchDashboardVehicles(payload));
                        } else {
                          if (seletCity) {
                            payload.cityId = seletCity.value;
                          }
                          payload.alarmTimeId = e.value;
                          if (center) {
                            payload.centerId = center.value;
                          }
                          if (subCenter) {
                            payload.subCenterId = subCenter.value;
                          }

                          dispatch(actions.fetchDashboardVehicles(payload));
                          setAlarmTime(e);
                          // setCenter([]);
                          // setSubcenter([]);
                        }
                      }}
                      value={alarmTime}
                      isClearable={true}
                    />
                  </div>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
