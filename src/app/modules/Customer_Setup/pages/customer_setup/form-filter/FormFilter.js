import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useCustomerUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText;
  }

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function CustomerFilter({ listLoading }) {
  const customerUIContext = useCustomerUIContext();

  const customerUIProps = useMemo(() => {
    return {
      queryParams: customerUIContext.queryParams,
      setQueryParams: customerUIContext.setQueryParams,
    };
  }, [customerUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(
      customerUIProps.queryParams,
      values
    );

    if (!isEqual(newQueryParams, customerUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      customerUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          searchText: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <InputSearch
              values={values}
              fieldName="searchText"
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
            />
          </form>
        )}
      </Formik>
    </>
  );
}
