import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch , useSelector } from "react-redux";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

export function SelectSub({
  setFetchSubsidiaryId,
  payrollMonth,
  fetchSubsidiaryId,
}) {
  const dispatch = useDispatch();

  const {dashboard} = useSelector((e)=> e)

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;
    const defaultSubs = dashboard?.allSubsidiaryList?.find((e) => e?.isDefault);
    if (!defaultSubs) return;

    setFetchSubsidiaryId(defaultSubs.value);
  }, [dashboard?.allSubsidiaryList]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ subsidiaryId : fetchSubsidiaryId }}>
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
                    <SearchSelect
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
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (e) => e.value === values?.subsidiaryId
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}
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
