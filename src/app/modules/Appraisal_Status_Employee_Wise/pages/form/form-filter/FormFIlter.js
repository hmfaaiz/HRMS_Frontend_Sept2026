import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { initialFilter } from "../FormUIHelpers";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/formActions";
import { fetchAllAppraisalPeriodDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";

const formSchema = Yup.object().shape({
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  appraisalCategoryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  appraisalPeriodId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  employeeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormFilter() {
  const dispatch = useDispatch();

  const { dashboard, auth, list_loading } = useSelector(
    (state) => ({
      dashboard: state?.dashboard,
      auth: state?.auth,
      list_loading: state?.appraisal_status?.list_loading,
    }),
    shallowEqual
  );

  const [initialValues, setInitialValues] = useState(initialFilter);

  /* Fetch initial data */
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
  }, [dispatch]);

  /* Auto select subsidiary for logged-in user */
  useEffect(() => {
    const subsidiaries = dashboard?.allSubsidiaryList || [];
    const userSubsidiaryId = auth?.user?.EmployeeMapping?.subsidiaryId;
    const selectedSub =
      subsidiaries.find((s) => s.value === userSubsidiaryId) ?? subsidiaries[0];

    if (!selectedSub) return;

    dispatch(fetchAllAppraisalPeriodDataBySubsidiaryId(selectedSub.value));
    dispatch(fetchAllActiveEmployeesBySubsidiary(selectedSub.value));

    setInitialValues({
      subsidiaryId: selectedSub.value,
      appraisalPeriodId: selectedSub.appraisalFiscalYear?.Id ?? "",
      appraisalCategoryId: "",
      employeeId: "",
    });
  }, [dashboard?.allSubsidiaryList, auth?.user, dispatch]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={formSchema}
      onSubmit={(values) => {
        dispatch(actions.fetchAllAppraisalStatusEmployeeWise(values));
      }}
    >
      {({
        values,
        handleSubmit,
        setFieldValue,
        resetForm,
        isValid,
        errors,
        touched,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-5 gap-3 px-3">
            {/* Subsidiary */}
            <div>
              <SearchSelect
                name="subsidiaryId"
                label={
                  <span>
                    Subsidiary<span style={{ color: "red" }}>*</span>
                  </span>
                }
                value={
                  values.subsidiaryId
                    ? dashboard?.allSubsidiaryList?.find(
                        (i) => i.value === values.subsidiaryId
                      )
                    : null
                }
                options={dashboard?.allSubsidiaryList}
                error={errors?.subsidiaryId}
                touched={touched?.subsidiaryId}
                onChange={(e) => {
                  setFieldValue("subsidiaryId", e?.value ?? "");
                  // Clear dependent fields
                  setFieldValue("appraisalPeriodId", "");
                  setFieldValue("appraisalCategoryId", "");
                  setFieldValue("employeeId", "");

                  if (e?.value) {
                    dispatch(
                      fetchAllAppraisalPeriodDataBySubsidiaryId(e.value)
                    );
                    dispatch(fetchAllActiveEmployeesBySubsidiary(e.value));
                  }
                }}
              />
            </div>

            {/* Appraisal Period */}
            <div>
              <SearchSelect
                name="appraisalPeriodId"
                label={
                  <span>
                    Appraisal Period<span style={{ color: "red" }}>*</span>
                  </span>
                }
                isDisabled={!values.subsidiaryId}
                value={
                  values.appraisalPeriodId
                    ? dashboard?.appraisalPeriodBySubList?.find(
                        (i) => i.value === values.appraisalPeriodId
                      )
                    : null
                }
                error={errors?.appraisalPeriodId}
                touched={touched?.appraisalPeriodId}
                options={dashboard?.appraisalPeriodBySubList}
                onChange={(e) =>
                  setFieldValue("appraisalPeriodId", e?.value ?? "")
                }
              />
            </div>

            {/* Appraisal Category */}
            <div>
              <SearchSelect
                name="appraisalCategoryId"
                label={
                  <span>
                    Appraisal Category<span style={{ color: "red" }}>*</span>
                  </span>
                }
                isDisabled={!values.subsidiaryId}
                value={
                  values.appraisalCategoryId
                    ? dashboard?.allAppraisalCategory?.find(
                        (i) => i.value === values.appraisalCategoryId
                      )
                    : null
                }
                error={errors?.appraisalCategoryId}
                touched={touched?.appraisalCategoryId}
                options={dashboard?.allAppraisalCategory}
                onChange={(e) =>
                  setFieldValue("appraisalCategoryId", e?.value ?? "")
                }
              />
            </div>

            {/* Employee */}
            <div>
              <SearchSelect
                name="employeeId"
                label={
                  <span>
                    Employee<span style={{ color: "red" }}>*</span>
                  </span>
                }
                isDisabled={!values.subsidiaryId}
                value={
                  values.employeeId
                    ? dashboard?.allEmployees?.find(
                        (i) => i.value === values.employeeId
                      )
                    : null
                }
                error={errors?.employeeId}
                touched={touched?.employeeId}
                options={dashboard?.allEmployees}
                onChange={(e) => setFieldValue("employeeId", e?.value ?? "")}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={() => resetForm({ values: initialFilter })}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                list_loading ||
                !isValid ||
                !values?.subsidiaryId ||
                !values?.appraisalPeriodId ||
                !values?.appraisalCategoryId ||
                !values?.employeeId
              }
              className="btn btn-success"
            >
              Filter
              {list_loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
