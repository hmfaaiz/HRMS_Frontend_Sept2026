import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useTicketStatusUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

// Prepare query parameters with search filter
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

export function TicketStatusFilter({ listLoading }) {
  const ticketStatusUIContext = useTicketStatusUIContext();

  const ticketStatusUIProps = useMemo(() => {
    return {
      queryParams: ticketStatusUIContext.queryParams,
      setQueryParams: ticketStatusUIContext.setQueryParams,
    };
  }, [ticketStatusUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(ticketStatusUIProps.queryParams, values);

    if (!isEqual(newQueryParams, ticketStatusUIProps.queryParams)) {
      newQueryParams.pageNumber = 1; // Reset to first page
      ticketStatusUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        searchText: "",
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
          />
        </form>
      )}
    </Formik>
  );
}
