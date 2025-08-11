import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Select } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CardHeader } from "@material-ui/core";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Eye, X, XCircle, CircleX } from "lucide-react";


export function EmployeeSelect({
  actionsLoading,
  setemployeeId, setPanelMode, panelMode
}) {
  const dispatch = useDispatch();
  //Get all Employee list from dashboard global state
  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees
    }),
    shallowEqual
  )

  const { activeFiscalYear } = useSelector((state) => state.dashboard);



  return (
    <>
      {/* Formik Starts */}
      <Formik
        enableReinitialize={true}
        initialValues={{}}
      >
        {({
          errors,
          values,
          handleBlur,
          setFieldValue,
        }) => (
          <>

            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            {/* Form Starts */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 col-span-12">

                  {/* Employee Id Dropdown Starts */}
                  <div className="ml-3">



                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === 'Select' ? null : Number(e.value);
                        setFieldValue('employeeId', value);
                        setemployeeId(value);
                        const selectedEmp = allEmployees.find(emp => emp.value === value);
                        dispatch(getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId));
                      }}
                      label={
                        <span>
                          Employee 
                        </span>
                      }
                      value={
                        allEmployees.find(
                          (option) =>
                            option.value === values.employeeId
                        ) || null
                      }
                      // value={values.employeeId}
                      autoComplete="off"
                      // options={allEmployees.map((emp) => ({
                      //   label: emp.label, // Adjust according to your data
                      //   value: emp.value, // Adjust according to your data
                      // }))}
                      options={[{ label: 'Select', value: '' }, ...(Array.isArray(allEmployees) ? allEmployees.map((emp) => ({
                        label: emp.label, // Adjust according to your data
                        value: emp.value, // Adjust according to your data
                      })) : []),]}
                      isSearchable={true} // Ensure search functionality is enabled
                    />
                    {/* {
                      !values.employeeId && <CustomErrorLabel touched={true} error={'Required'} />
                    } */}
                  </div>

                  {/* <div className="col-4 col-md-4 d-flex  align-items-center pt-10">
                    <span
                      className="svg-icon svg-icon-md svg-icon-primary"
                      onClick={() => setPanelMode(!panelMode)}
                    >
                      <SVG
                        src={toAbsoluteUrl(
                          panelMode
                            ? "/media/svg/icons/Communication/CancelButton.svg"
                            : "/media/svg/icons/Communication/AddButton.svg"
                        )}
                      />
                    </span>


                  </div> */}

                  <div className="mt-6">



                    {panelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setPanelMode(!panelMode)}
                      >


                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}




                  </div>
                  {/* Employee Id Dropdown Ends */}

                  {/* <div className="col-12 col-md-4 mt-3 d-flex flex-column align-items-start">
                    {activeFiscalYear
                      ? (() => {
                          return (
                            <>
                              <div>
                                <b>Active Fiscal Year -</b>{" "}
                                {activeFiscalYear?.label}
                              </div>
                              <div>
                                <b>Active Payroll Month -</b>{" "}
                                {activeFiscalYear?.payrollMonthLabel}
                              </div>
                            </>
                          );
                        })()
                      : null}
                  </div> */}

                </div>
              </fieldset>
            </Form>
            {/* Form Ends */}
          </>
        )}
      </Formik>
      {/* Formik Ends */}
    </>
  );
}
