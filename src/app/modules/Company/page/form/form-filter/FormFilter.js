import React from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

const FormFilter = () => {
  const { queryParams, setQueryParams } = useFormUIContext();

  const applyFilter = (values) => {
    const filter = values.searchText ? { searchQuery: values.searchText } : {};
    const newQueryParams = { ...queryParams, filter, pageNumber: 1 };

    if (!isEqual(newQueryParams, queryParams)) {
      setQueryParams(newQueryParams);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ searchText: "" }}
      onSubmit={applyFilter}
    >
      {({ values, handleSubmit, handleChange, handleBlur , setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          {/* <input
            type="text"
            className="form-control"
            name="searchText"
            placeholder="Search"
            onBlur={handleBlur}
            value={values.searchText}
            onChange={(e) => {
              handleChange(e);
              handleSubmit();
            }}
          /> */}
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
};

export default FormFilter;
