import React, { useMemo, useCallback } from "react"
import { Formik } from "formik"
import { isEqual, debounce } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { InputSearch } from "../../../../../utils/common-modules/InputSearch"

const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  
  const filter = { ...queryParams.filter };
  if (searchText) {
    filter.searchQuery = searchText;
    newQueryParams.searchQuery = searchText; // Some backends expect it at root
  } else {
    delete filter.searchQuery;
    delete newQueryParams.searchQuery;
  }
  
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFilter() {

  const FormUIContext = useFormUIContext()

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }
  }, [FormUIContext])

  const debouncedApplyFilter = useMemo(
    () =>
      debounce((values) => {
        formUIProps.setQueryParams((prev) => {
          const newQueryParams = prepareFilter(prev, values);
          if (!isEqual(newQueryParams, prev)) {
            return {
              ...newQueryParams,
              pageNumber: 1,
            };
          }
          return prev;
        });
      }, 500),
    [formUIProps.setQueryParams],
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchText: ""
        }}
        onSubmit={(values) => {
          debouncedApplyFilter(values)
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <form className="form form-label-right" style={{margin: '0.8rem 0'}}>
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
  )
}
