import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";

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

export function FormFilter() {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(
    () => ({
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }),
    [FormUIContext]
  );

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ searchText: "" }}
      onSubmit={(values) => applyFilter(values)}
    >
      {({ values, handleBlur, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          {/* <div className="row">
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                name="searchText"
                placeholder="Search..."
                onBlur={handleBlur}
                value={values.searchText}
                onChange={(e) => {
                  setFieldValue("searchText", e.target.value.trim());
                  handleSubmit();
                }}
              />
              <small className="form-text text-muted">
                <b>Search</b> in all fields
              </small>
            </div>
          </div> */}
        </form>
      )}
    </Formik>
  );
}