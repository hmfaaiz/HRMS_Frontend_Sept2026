import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

export function SelectSub({ setFetchSubsidiaryId, payrollMonth }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}}>
        {({ errors, touched, values, setFieldValue }) => (
          <>
            {/* Form Starts */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-4 gap-x-3 gap-y-2">
                  {/* Subsidiary Id Dropdown Starts */}
                  <div>
                    {/* <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                        setFetchSubsidiaryId(e.value);
                        setFetchTaxSetupId(null);
                        setFieldValue("taxSetupId", null);
                      }}
                      options={dashboard?.allSubsidiaryList}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    /> */}
                    <SubsidiarySelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                        setFetchSubsidiaryId(e.value);
                      }}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      currentValue={values?.subsidiaryId}
                      initializeSubsidiary={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                        setFetchSubsidiaryId(e.value);
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-semibold mt-1 text-sm text-black">
                      Payroll Month
                    </span>
                    <br />
                    <span className="font-semibold mt-2 text-sm text-black">
                      {payrollMonth}
                    </span>
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
