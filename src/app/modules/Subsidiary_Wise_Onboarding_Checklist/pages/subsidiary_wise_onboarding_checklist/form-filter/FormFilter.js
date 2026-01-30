import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useSubsidiaryOnboardingUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

/**
 * Prepare filter exactly like designation filter
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

export function SubsidiaryOnboardingFilter() {
  const uiContext = useSubsidiaryOnboardingUIContext();

  const uiProps = useMemo(() => {
    return {
      queryParams: uiContext.queryParams,
      setQueryParams: uiContext.setQueryParams,
    };
  }, [uiContext]);

  /**
   * Apply filter ONLY when something changes
   */
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(uiProps.queryParams, values);

    if (!isEqual(newQueryParams, uiProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      uiProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
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
              placeholder="Search tasks..."
            />
          </form>
        )}
      </Formik>

      <Formik enableReinitialize onSubmit={() => {}}>
        {() => <form className="form form-label-right" />}
      </Formik>
    </>
  );
}
