import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { Select } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual ,useDispatch} from "react-redux"
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export function EmployeeSelect({
  actionsLoading,
  setemployeeId,
  setId,setPanelMode, panelMode
}) {
  const dispatch = useDispatch();
  //Get all Employee list from dashboard global state
  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees
    }),
    shallowEqual
  )


  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map(item => [item.value, item]));
  }, [allEmployees]);

  const{    activeFiscalYear
    } = useSelector((state) => state.dashboard);
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
                <div className="from-group row">

                  {/* Employee Id Dropdown Starts */}
                  <div className="col-12 col-md-3  ml-7">
                    <Field
                      name="employeeId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value == '--Select--' ? '' : Number(e.value)
                        setFieldValue('employeeId', value)
                        setemployeeId(value) //Set Employee Id in context for server
                         const selectedEmp = allEmployees.find(emp => emp.value === value);
                           dispatch(getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId));
                        setId(''); //Clear Edit values on Employee Change
                      }}
                      label={
                        <span>
                          {" "}
                          Employee<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={allEmployeesMap?.get(values?.employeeId || '') || ''}
                      autoComplete="off"
                      // options={allEmployees}
                      options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allEmployees) ? allEmployees : [])]}

                    />
                    {
                      !values.employeeId && <CustomErrorLabel touched={true} error={VALIDATION_MESSAGES.required} />
                    }
                  </div>
                  {/* Employee Id Dropdown Ends */}
                      <div className="col-12 col-md-4 d-flex  align-items-center pt-10">
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
                  
                  
                                    </div>


                                         <div className="col-12 col-md-4 mt-3 d-flex flex-column align-items-start">

  {activeFiscalYear ? (() => {

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
  })() : null}
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
