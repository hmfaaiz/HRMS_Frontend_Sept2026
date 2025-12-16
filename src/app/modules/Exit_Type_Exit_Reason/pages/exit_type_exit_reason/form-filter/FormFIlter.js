import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";



const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText;
    // filter.email = searchText
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFIlter({ listLoading, user }) {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;

      formUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
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
          handleChange,
          setFieldValue,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            {/* <div className="col-12 col-md-12">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                    setFieldValue("searchText", e.target.value.trim())
                    handleSubmit()
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div> */}

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

      <Formik enableReinitialize={true} onSubmit={(values) => {}}>
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="row"></div>
            <div className="row"></div>
          </form>
        )}
      </Formik>
    </>
  );

  return <></>;
}
