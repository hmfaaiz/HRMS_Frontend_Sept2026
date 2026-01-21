import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

export function SelectSub({ setFetchSubsidiaryId, fetchSubsidiaryId }) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) {
      return;
    }
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find(
      (el) => el?.isDefault
    );
    if (!findDefaultSubs) {
      return;
    }
    setFetchSubsidiaryId(findDefaultSubs.value);
  }, [dashboard?.allSubsidiaryList]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ subsidiaryId: fetchSubsidiaryId }}
      >
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
                      options={dashboard?.allSubsidiaryList}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (e) => e?.value === values?.subsidiaryId
                        ) || null
                      }
                    />
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
