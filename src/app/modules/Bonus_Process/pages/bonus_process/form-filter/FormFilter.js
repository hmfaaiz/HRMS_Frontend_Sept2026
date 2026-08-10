import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";

const prepareFilter = (queryParams, values) => {
  const { searchText, bonusTypeId } = values;

  const newQueryParams = { ...queryParams };

  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText;
  }

  if (bonusTypeId) {
    filter.bonusTypeId = bonusTypeId;
  }

  newQueryParams.filter = filter;

  return newQueryParams;
};

export function FormFIlter({ listLoading }) {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    newQueryParams.pageNumber = 1;

    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        searchText: "",
        bonusTypeId: "",
      }}
      onSubmit={(values) => applyFilter(values)}
    >
      {({ values, handleSubmit, handleBlur, setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          <div className="row">
            {/* Bonus Type Dropdown */}
            <div className="col-12 col-md-6">
              <select
                className="form-control"
                name="bonusTypeId"
                value={values.bonusTypeId}
                onChange={(e) => {
                  const value = e.target.value;

                  setFieldValue("bonusTypeId", value);

                  applyFilter({
                    ...values,
                    bonusTypeId: value,
                  });
                }}
              >
                <option value="">Select Bonus Type</option>

                <option value="1">Bonus Type 1</option>

                <option value="2">Bonus Type 2</option>

                <option value="3">Bonus Type 3</option>
              </select>
            </div>

            {/* Search */}
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                name="searchText"
                placeholder="Search"
                onBlur={handleBlur}
                value={values.searchText}
                onChange={(e) => {
                  const value = e.target.value.trim();

                  setFieldValue("searchText", value);

                  applyFilter({
                    ...values,
                    searchText: value,
                  });
                }}
              />

              <small className="form-text text-muted">
                <b>Search</b> in all fields
              </small>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}
