import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useFormUIContext } from "../FormUIContext";
import { Eye, XCircle } from "lucide-react";

export function EmployeeSelect() {
  //Get all Employee list from dashboard global state
  const FormUIContext = useFormUIContext();
  const { employeeList } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext?.employeeId,
      setemployeeId: FormUIContext?.setemployeeId,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    };
  }, [FormUIContext]);

  return (
    <>
      {/* Formik Starts */}
      <Formik enableReinitialize={true} initialValues={{}}>
        {({ handleBlur, setFieldValue }) => (
          <>
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
                          formUIProps.setemployeeId(value);
                        }}
                        label={
                          <span>
                            {" "}
                            Employee<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          employeeList?.find(
                            (el) => el?.value === formUIProps.employeeId
                          ) || ""
                        }
                        autoComplete="off"
                        options={employeeList}
                      />
                      {!formUIProps?.employeeId && (
                        <CustomErrorLabel
                          touched={true}
                          error={VALIDATION_MESSAGES.required}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div className="mt-6">
                    {formUIProps.panelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() =>
                          formUIProps.setPanelMode(!formUIProps.panelMode)
                        }
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() =>
                          formUIProps.setPanelMode(!formUIProps.panelMode)
                        }
                      >
                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}
                  </div> */}
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
