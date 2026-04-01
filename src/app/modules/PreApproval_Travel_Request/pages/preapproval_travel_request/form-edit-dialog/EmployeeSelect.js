import React from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Eye, XCircle, FileText, History } from "lucide-react";

export function EmployeeSelect({
  employeeId,
  setEmployeeId,
  panelMode,
  setPanelMode,
}) {
  const dispatch = useDispatch();
  
  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
    }),
    shallowEqual
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ employeeId: employeeId }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, handleBlur }) => (
          <Form className="form form-label-right">
            <div className="grid grid-cols-12 gap-x-3 items-end">
              {/* Employee Dropdown */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <SearchSelect
                  name="employeeId"
                  label={<span>Employee</span>}
                  placeholder="Select Employee"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    const value =
                      !e.value || e.value === "Select" ? null : Number(e.value);
                    setFieldValue("employeeId", value);
                    setEmployeeId(value);
                    if (!value) {
                      setPanelMode(false);
                    }
                  }}
                  value={
                    allEmployees?.find((opt) => opt.value === values.employeeId) || null
                  }
                  options={[
                    { label: "Select", value: "" },
                    ...(Array.isArray(allEmployees)
                      ? allEmployees.map((emp) => ({
                          label: emp.label,
                          value: emp.value,
                        }))
                      : []),
                  ]}
                  isSearchable={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-wrap gap-2 mt-4 md:mt-0 pb-[2px]">
                {/* View Details Button */}
                <button
                  type="button"
                  className={`btn ${panelMode ? "btn-light" : "btn-primary"} d-flex align-items-center gap-2`}
                  onClick={() => setPanelMode(!panelMode)}
                >
                  {panelMode ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      View Detail
                    </>
                  )}
                </button>

                {/* Entitlement Detail Button */}
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={() => {
                    console.log("Entitlement Detail Clicked");
                  }}
                  disabled={!values.employeeId}
                >
                  <FileText className="w-4 h-4" />
                  Entitlement Detail
                </button>

                {/* Last Travel Details Button */}
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={() => {
                    console.log("Last Travel Details Clicked");
                  }}
                  disabled={!values.employeeId}
                >
                  <History className="w-4 h-4" />
                  Last Travel Details
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
