import React, { useMemo, useEffect } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFromUIContext } from "../FormUIContext";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllDesignationByGradeId,
  fetchAllFormsMenu,
  fetchAllParentDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { initialFilter } from "../FormUIHelpers";
import { Form } from "react-bootstrap";

const FilterSchema = Yup.object().shape({
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),
  appraisalCategoryId: Yup.string().required(VALIDATION_MESSAGES.required),
  searchQuery: Yup.string().optional(),
  departmentId: Yup.string()
    .nullable()
    .optional(),
  designationId: Yup.string()
    .nullable()
    .optional(),
  employeeId: Yup.string()
    .nullable()
    .optional(),
  gradeId: Yup.string()
    .nullable()
    .optional(),
});

const prepareFilter = (queryParams, values) => {
  const { searchQuery } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchQuery) {
    filter.searchQuery = searchQuery;
    // filter.email = searchQuery
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFilter() {
  const dispatch = useDispatch();

  const formUIContext = useFromUIContext();
  const { list_loading, auth, dashboard } = useSelector((state) => {
    return {
      list_loading: state.appraisal_finalization?.list_loading,
      dashboard: state?.dashboard,
      auth: state?.auth,
    };
  }, shallowEqual);
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      const updatedQueryParams = {
        ...formUIProps.queryParams,
        filter: {
          ...values,
          searchQuery: values.searchQuery || "",
        },
        pageNumber: 1,
      };
      // update list by queryParams
      formUIProps.setQueryParams(updatedQueryParams);
    }
  };
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (
      dashboard?.allSubsidiaryList?.length > 0 &&
      auth?.user?.EmployeeMapping?.subsidiaryId
    ) {
      let subsid = dashboard?.allSubsidiaryList?.find(
        (e) => e.value === auth?.user?.EmployeeMapping?.subsidiaryId
      );
      const updatedQueryParams = {
        ...formUIProps.queryParams,
        filter: {
          ...formUIProps.queryParams?.filter,
          subsidiaryId: subsid?.value,
        },
        pageNumber: 1,
      };
      formUIProps.setQueryParams(updatedQueryParams);
      dispatch(fetchAllParentDept(subsid?.value));
    }
  }, [dashboard.allSubsidiaryList, auth?.user?.EmployeeMapping?.subsidiaryId]);
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...formUIProps.queryParams?.filter }}
      onSubmit={applyFilter}
      validationSchema={FilterSchema}
    >
      {({
        values,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
        handleReset,
      }) => (
        <Form className="form form-label-right">
          <fieldset>
            <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-1">
              {/* subsidiary  */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-1 md:col-span-5 col-span-2">
                <div>
                  <SearchSelect
                    name="subsidiaryId"
                    label={<span> Subsidiary</span>}
                    value={(dashboard?.allSubsidiaryList || [])?.find(
                      (item) => item.value === values?.subsidiaryId
                    )}
                    onChange={(e) => {
                      setFieldValue("subsidiaryId", e.value || null);
                      dispatch(fetchAllParentDept(e.value));
                      setFieldValue("departmentId", "");
                    }}
                    options={dashboard?.allSubsidiaryList}
                  />
                </div>
                <div className="flex flex-col justify-end items-start">
                  {values?.subsidiaryId &&
                    dashboard?.allSubsidiaryList?.length > 0 && (
                      <>
                        <span className="text-sm text-black font-bold">
                          Active Appraisal Period
                        </span>
                        <span className="text-xs text-black font-bold">
                          {
                            dashboard?.allSubsidiaryList?.find(
                              (el) => el?.value == values?.subsidiaryId
                            )?.appraisalFiscalYearLabel
                          }
                        </span>
                      </>
                    )}
                </div>
              </div>
              {/* appraisal status  */}
              <div>
                <SearchSelect
                  name={"appraisalCategoryId"}
                  label={
                    <span>
                      Appraisal Category<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  onChange={(e) => {
                    setFieldValue("appraisalCategoryId", e?.value || null);
                  }}
                  value={
                    dashboard?.allAppraisalCategory?.find(
                      (el) => el?.value === values?.appraisalCategoryId
                    ) || null
                  }
                  error={errors?.appraisalCategoryId}
                  touched={touched?.appraisalCategoryId}
                  options={dashboard?.allAppraisalCategory}
                />
              </div>
              {/* department  */}
              <div>
                <SearchSelect
                  name={"departmentId"}
                  label={<span>Department</span>}
                  isDisabled={!values?.subsidiaryId}
                  onChange={(e) => {
                    setFieldValue("departmentId", e?.value || null);
                  }}
                  value={
                    dashboard?.allParentDept?.find(
                      (el) => el?.value === values?.departmentId
                    ) || null
                  }
                  error={errors?.departmentId}
                  touched={touched?.departmentId}
                  options={dashboard?.allParentDept}
                />
              </div>
              {/* grade  */}
              <div>
                <SearchSelect
                  name={"gradeId"}
                  label={<span>Grade</span>}
                  onChange={(e) => {
                    setFieldValue("gradeId", e?.value || null);
                    setFieldValue("designationId", "");
                    dispatch(
                      fetchAllDesignationByGradeId(
                        e?.value,
                        "allDesignationByGrade"
                      )
                    );
                  }}
                  value={
                    dashboard?.allEmployeegradeList?.find(
                      (el) => el?.value === values?.gradeId
                    ) || null
                  }
                  error={errors?.gradeId}
                  touched={touched?.gradeId}
                  options={dashboard?.allEmployeegradeList}
                />
              </div>
              {/* designation  */}
              <div>
                <SearchSelect
                  name={"designationId"}
                  label={<span>Designation</span>}
                  isDisabled={!values?.gradeId}
                  onChange={(e) => {
                    setFieldValue("designationId", e?.value || null);
                  }}
                  value={
                    dashboard?.allDesignationByGrade?.find(
                      (el) => el?.value === values?.designationId
                    ) || null
                  }
                  error={errors?.designationId}
                  touched={touched?.designationId}
                  options={dashboard?.allDesignationByGrade}
                />
              </div>
              {/* employee  */}
              <div>
                <SearchSelect
                  name={"employeeId"}
                  label={<span>Employee</span>}
                  onChange={(e) => {
                    setFieldValue("employeeId", e?.value || null);
                  }}
                  value={
                    dashboard?.allEmployees?.find(
                      (el) => el?.value === values?.employeeId
                    ) || null
                  }
                  error={errors?.employeeId}
                  touched={touched?.employeeId}
                  options={dashboard?.allEmployees}
                />
              </div>
            </div>
          </fieldset>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              // disabled={levelList?.length < 2}
              onClick={() => {
                applyFilter(initialFilter.filter);
                handleReset();
              }}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={list_loading}
              className="btn btn-success"
            >
              Filter
              {list_loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
