import React, { useMemo, useEffect } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useEmployeeOnboardingUIContext } from "../FormUIContext";
import { useDispatch, useSelector } from "react-redux";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

// Redux actions
import {
  fetchAllSubsidiaryData,
  fetchAllDept,
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { fetchEmployeeOnboardingChecklist } from "../../../_redux/redux-Actions";

const prepareFilter = (queryParams, values) => {
  const { searchText, subsidiaryId, departmentId, designationId, employeeTypeId } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (subsidiaryId) filter.subsidiaryId = subsidiaryId;
  if (departmentId) filter.departmentId = departmentId;
  if (designationId) filter.designationId = designationId;
  if (employeeTypeId) filter.employeeTypeId = employeeTypeId;
  if (searchText) filter.searchQuery = searchText;

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function EmployeeOnboardingFilter() {
  const formUIContext = useEmployeeOnboardingUIContext();
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  // Load subsidiary, department, and employee type data
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
  }, [dispatch]);

  // Set default subsidiary if exists
  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;
    const defaultSubs = dashboard.allSubsidiaryList.find((el) => el?.isDefault);
    if (!defaultSubs) return;

    const filter = {
      subsidiaryId: defaultSubs.value,
    };

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      filter,
      pageNumber: 1,
    };
    
    formUIProps.setQueryParams(updatedQueryParams);
    dispatch(fetchEmployeeOnboardingChecklist(updatedQueryParams));
    dispatch(fetchAllDept(defaultSubs.value));
  }, [dashboard?.allSubsidiaryList]);

  const empTypeOptions = [
    { label: "All", value: "" },
    ...(dashboard?.allEmpTypeDynamicChildMenus || []),
    ...(dashboard?.allEmpTypeChildMenus || []),
  ];

  // Get initial values from queryParams
  const initialValues = {
    searchText: formUIProps.queryParams?.filter?.searchQuery || "",
    subsidiaryId: formUIProps.queryParams?.filter?.subsidiaryId || "",
    departmentId: formUIProps.queryParams?.filter?.departmentId || "",
    designationId: formUIProps.queryParams?.filter?.designationId || "",
    employeeTypeId: formUIProps.queryParams?.filter?.employeeTypeId || "",
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={(values) => {
        const newQueryParams = prepareFilter(formUIProps.queryParams, values);
        newQueryParams.pageNumber = 1;
        formUIProps.setQueryParams(newQueryParams);
        dispatch(fetchEmployeeOnboardingChecklist(newQueryParams));
      }}
    >
      {({ values, handleSubmit, setFieldValue, handleBlur }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          <div className="grid md:grid-cols-7 gap-3 mb-2">
            {/* Subsidiary */}
            <div>
              <SearchSelect
                name="subsidiaryId"
                label="Subsidiary"
                value={
                  (dashboard?.allSubsidiaryList || []).find(
                    (item) => item.value === values.subsidiaryId
                  ) || { label: "All", value: "" }
                }
                onChange={(e) => {
                  setFieldValue("subsidiaryId", e.value);
                  setFieldValue("departmentId", ""); // Reset department
                  
                  const newQueryParams = prepareFilter(formUIProps.queryParams, {
                    ...values,
                    subsidiaryId: e.value,
                    departmentId: "",
                  });
                  newQueryParams.pageNumber = 1;
                  formUIProps.setQueryParams(newQueryParams);
                  dispatch(fetchEmployeeOnboardingChecklist(newQueryParams));
                  dispatch(fetchAllDept(e.value));
                }}
                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allSubsidiaryList || []),
                ]}
              />
            </div>

            {/* Department */}
            {/* <div>
              <SearchSelect
                name="departmentId"
                label="Department"
                value={
                  (dashboard?.allDept || []).find(
                    (item) => item.value === values.departmentId
                  ) || { label: "All", value: "" }
                }
                onChange={(e) => {
                  setFieldValue("departmentId", e.value);
                  
                  const newQueryParams = prepareFilter(formUIProps.queryParams, {
                    ...values,
                    departmentId: e.value,
                  });
                  newQueryParams.pageNumber = 1;
                  formUIProps.setQueryParams(newQueryParams);
                  dispatch(fetchEmployeeOnboardingChecklist(newQueryParams));
                }}
                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allDept || []),
                ]}
              />
            </div> */}

            {/* Designation - Uncomment if needed */}
            {/* <div>
              <SearchSelect
                name="designationId"
                label="Designation"
                value={
                  (dashboard?.allDesignations || []).find(
                    (item) => item.value === values.designationId
                  ) || { label: "All", value: "" }
                }
                onChange={(e) => {
                  setFieldValue("designationId", e.value);
                  
                  const newQueryParams = prepareFilter(formUIProps.queryParams, {
                    ...values,
                    designationId: e.value,
                  });
                  newQueryParams.pageNumber = 1;
                  formUIProps.setQueryParams(newQueryParams);
                  dispatch(fetchEmployeeOnboardingChecklist(newQueryParams));
                }}
                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allDesignations || []),
                ]}
              />
            </div> */}

            {/* Employee Type */}
            {/* <div>
              <SearchSelect
                name="employeeTypeId"
                label="Employee Type"
                value={
                  empTypeOptions.find(
                    (item) => String(item.value) === String(values.employeeTypeId)
                  ) || { label: "All", value: "" }
                }
                options={empTypeOptions}
                onChange={(e) => {
                  setFieldValue("employeeTypeId", e.value);
                  
                  const newQueryParams = prepareFilter(formUIProps.queryParams, {
                    ...values,
                    employeeTypeId: e.value,
                  });
                  newQueryParams.pageNumber = 1;
                  formUIProps.setQueryParams(newQueryParams);
                  dispatch(fetchEmployeeOnboardingChecklist(newQueryParams));
                }}
              />
            </div> */}

            {/* Search */}
            <div>
              <label>Search</label>
              <InputSearch
                values={values}
                fieldName="searchText"
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}