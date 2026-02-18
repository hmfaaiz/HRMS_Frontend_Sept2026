import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useSubsidiaryPayrollUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

/**
 * Prepare filter object for payroll checklist
 */
const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText && searchText.trim() !== "") {
    filter.searchQuery = searchText.trim();
  }

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function SubsidiaryPayrollFilter() {
  const uiContext = useSubsidiaryPayrollUIContext();

  const uiProps = useMemo(() => {
    return {
      queryParams: uiContext.queryParams,
      setQueryParams: uiContext.setQueryParams,
    };
  }, [uiContext]);

  /**
   * Apply filter only when values change
   */
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(uiProps.queryParams, values);

    if (!isEqual(newQueryParams, uiProps.queryParams)) {
      newQueryParams.pageNumber = 1; // Reset to first page on filter
      uiProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        searchText: uiProps.queryParams.filter?.searchQuery || "",
      }}
      onSubmit={(values) => applyFilter(values)}
    >
      {({ values, handleSubmit, handleBlur, setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          <InputSearch
            values={values}
            fieldName="searchText"
            setFieldValue={setFieldValue}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            placeholder="Search payroll tasks..."
          />
        </form>
      )}
    </Formik>
  );
}
