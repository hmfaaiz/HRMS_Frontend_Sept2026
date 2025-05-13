import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Select } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual ,useDispatch} from "react-redux"
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { Card, CardHeader } from "@material-ui/core";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";

export function EmployeeSelect({
  actionsLoading,
  setemployeeId
}) {
  const dispatch = useDispatch();
  //Get all Employee list from dashboard global state
  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees
    }),
    shallowEqual
  )





  return (
    <>
      {/* Formik Starts */}

      <CardHeader title={CurrentModuleName()} >
      </CardHeader>

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
                <div className="from-group row">

                  {/* Employee Id Dropdown Starts */}
                  <div className="col-12 col-md-4 mt-3">
                


                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === '--Select--' ? null : Number(e.value);
                        setFieldValue('employeeId', value);
                        setemployeeId(value);
                         const selectedEmp = allEmployees.find(emp => emp.value === value);
                         dispatch(getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId));
                      
                      }}
                      label={
                        <span>
                          Employee <span style={{ color: 'red' }}>*</span>
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
                      options={allEmployees.map((emp) => ({
                        label: emp.label, // Adjust according to your data
                        value: emp.value, // Adjust according to your data
                      }))}
                      isSearchable={true} // Ensure search functionality is enabled
                    />

                    {
                      !values.employeeId && <CustomErrorLabel touched={true} error={'Required'} />
                    }
                  </div>
                  {/* Employee Id Dropdown Ends */}

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
