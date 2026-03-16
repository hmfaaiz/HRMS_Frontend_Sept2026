import React from "react";
import { Form, Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { Eye, XCircle } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function EmployeeSelect({ employeeId, setemployeeId, setPanelMode, panelMode }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { allEmployees } = useSelector(
    (state) => ({ allEmployees: state.dashboard.allEmployees }),
    shallowEqual
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ employeeId: employeeId || "" }}
    >
      {({ values, handleBlur, setFieldValue }) => (
        <Form className="form form-label-right">
          <fieldset>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 mt-2 col-span-12">

              <div className="ml-3">
                <SearchSelect
                  name="employeeId"
                  placeholder=""
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const value = e?.value === "Select" || !e?.value
                      ? null
                      : Number(e.value);

                    setFieldValue("employeeId", value);
                    setemployeeId(value);

                    // ── Reset loan type, loan panel, form, and outstanding ──
                    // When employee changes everything dependent on employee
                    // must clear so stale loan data doesn't remain visible
                    FormUIContext.setLoanTypeId(null);
                    FormUIContext.setLoanPanelMode(false);
                    FormUIContext.setIds("");
                    FormUIContext.setIsViewMode(false);
                    dispatch(actions.clearLoanOutstanding());
                    dispatch(actions.clearUserForEdit());

                    // Fetch active fiscal year for the new employee's subsidiary
                    if (value) {
                      const selectedEmp = allEmployees?.find((emp) => emp.value === value);
                      dispatch(
                        getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId)
                      );
                    }
                  }}
                  label={<span>Employee</span>}
                  value={
                    allEmployees?.find((option) => option.value === Number(values.employeeId)) || null
                  }
                  options={[
                    { label: "Select", value: "" },
                    ...(Array.isArray(allEmployees)
                      ? allEmployees.map((emp) => ({ label: emp.label, value: emp.value }))
                      : []),
                  ]}
                  isSearchable={true}
                />
              </div>

              <div className="mt-6">
                {panelMode ? (
                  <button
                    type="button"
                    className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                    onClick={() => setPanelMode(false)}
                  >
                    <XCircle className="w-3 h-3 text-black" />
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => setPanelMode(true)}
                    disabled={!values.employeeId}
                  >
                    <Eye className="w-4 h-4 text-white" />
                    View Details
                  </button>
                )}
              </div>

            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}