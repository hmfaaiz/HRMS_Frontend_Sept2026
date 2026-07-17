import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../_metronic/_helpers/SearchSelect";
import { Eye, XCircle } from "lucide-react";
import { fetchAllActiveEmployees } from "../../../../_metronic/redux/dashboardActions";

export function EmployeeSelect({
  employeeId,
  setEmployeeId,
  panelMode,
  setPanelMode,
  onCancel,
  disabled = false,
  isEditMode = false,
  isViewMode = false,
}) {
  const modeText = isEditMode ? "Edit" : isViewMode ? "View" : "Add";
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
    }),
    shallowEqual
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ employeeId: employeeId }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, handleBlur }) => (
        <Form className="form form-label-right">
          <div className="grid grid-cols-4 gap-x-3 gap-y-1">
            {/* Employee Dropdown Starts */}
            <div className="col-span-1">
              <div>
                <SearchSelect
                  name="employeeId"
                  label={
                    <span>
                      {" "}
                      Employee<span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
                    allEmployees?.find(
                      (opt) => opt.value === values.employeeId
                    ) || null
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
                  isDisabled={disabled}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-2 pb-[2px] col-span-3">
              <button
                type="button"
                className={`btn ${
                  panelMode ? "btn-light btn-elevate" : "btn-primary"
                } d-flex align-items-center gap-2`}
                onClick={() => setPanelMode(!panelMode)}
              >
                {panelMode ? (
                  <>
                    <XCircle className="w-3 h-3 text-black" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-white" />
                    View Details
                  </>
                )}
              </button>

              {/* Close / Cross Button */}
              <div className="ml-auto">
                <button
                  type="button"
                  className="bg-transparent border-0 p-0 ml-2"
                  onClick={onCancel}
                  title="Close"
                >
                  <XCircle className="w-5 h-5 text-black cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
