import React, { useEffect, useMemo } from "react";
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
import { useFormUIContext } from "../FormUIContext";
import { fetchEmployeeDocs } from "../../../_redux/redux-Actions";


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

  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);


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


                    {/* 
                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === 'Select' ? null : Number(e.value);
                        setemployeeId(value);
                        const selectedEmp = allEmployees.find(emp => emp.value === value);
                        const updatedQueryParams = {
                          ...formUIProps.queryParams,
                          employeeId: value,
                          pageNumber: 1,
                        };


                        formUIProps.setQueryParams(updatedQueryParams);
console.log("Selected Employee ID:", updatedQueryParams);
                        dispatch(fetchEmployeeDocs(updatedQueryParams));


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

                      options={[{ label: 'Select', value: '' }, ...(Array.isArray(allEmployees) ? allEmployees.map((emp) => ({
                        label: emp.label, // Adjust according to your data
                        value: emp.value, // Adjust according to your data
                      })) : []),]}
                      isSearchable={true} // Ensure search functionality is enabled
                    /> */}


                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === 'Select' ? null : Number(e.value);

                        setFieldValue("employeeId", value);  

                        setemployeeId(value);

                        const updatedQueryParams = {
                          ...formUIProps.queryParams,
                          employeeId: value,
                          pageNumber: 1,
                        };

                        formUIProps.setQueryParams(updatedQueryParams);
                        dispatch(fetchEmployeeDocs(updatedQueryParams));
                      }}
                      label={<span>Employee</span>}
                      value={
                        allEmployees.find(option => option.value === values.employeeId) || null
                      }
                      autoComplete="off"
                      options={[
                        { label: 'Select', value: '' },
                        ...(Array.isArray(allEmployees)
                          ? allEmployees.map((emp) => ({
                            label: emp.label,
                            value: emp.value,
                          }))
                          : []
                        ),
                      ]}
                      isSearchable={true}
                    />


                  </div>



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
