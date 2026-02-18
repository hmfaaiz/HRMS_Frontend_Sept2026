import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Eye, XCircle } from "lucide-react";
import { fetchAllProjects } from "../../../../Dashboard/_redux/dashboardActions";

export function FormFilter({
  actionsLoading,
  setEmployeeId,
  setPanelMode,
  panelMode,
}) {
  const dispatch = useDispatch();
  //Get all Employee list from dashboard global state
  const { allEmployees } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
    }),
    shallowEqual,
  );

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);

  return (
    <>
      {/* Formik Starts */}
      <Formik enableReinitialize={true} initialValues={{}}>
        {({ values, handleBlur, setFieldValue }) => (
          <>
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            {/* Form Starts */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                  {/* Employee Id Dropdown Starts */}
                  <div className="col-span-1">
                    <div>
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("employeeId", value);
                          dispatch(fetchAllProjects(value));
                          setEmployeeId(value);
                        }}
                        label={
                          <span>
                            {" "}
                            Employee<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          allEmployeesMap?.get(values?.employeeId || "") || ""
                        }
                        autoComplete="off"
                        // options={allEmployees}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allEmployees) ? allEmployees : []),
                        ]}
                      />
                      {!values.employeeId && (
                        <CustomErrorLabel
                          touched={true}
                          error={VALIDATION_MESSAGES.required}
                        />
                      )}
                    </div>
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
                {/* Employee Id Dropdown Ends */}
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
