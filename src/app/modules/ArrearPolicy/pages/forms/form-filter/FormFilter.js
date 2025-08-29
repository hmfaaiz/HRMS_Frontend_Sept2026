import React, { useMemo } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { debounce } from "lodash";
import { useCallback } from "react";

const prepareFilter = (queryParams, values) => {
  const { searchText } = values
  const newQueryParams = { ...queryParams }
  const filter = {}

  if (searchText) {
    filter.searchQuery = searchText
    // filter.email = searchText
  }
  newQueryParams.filter = filter
  return newQueryParams
}

export function FormFilter() {

  const FormUIContext = useFormUIContext()

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }
  }, [FormUIContext])

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1
      // update list by queryParams
      formUIProps.setQueryParams(newQueryParams)
    }
  }


  //This is a Debounce Function that will run the function only after 500ms even if the function is triggered every second.
  const debouncedApplyFilter = useCallback(
    debounce((values) => applyFilter(values), 500), 
    []
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
            <div className="row">
              <div className="col-12 col-md-12">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search By Type"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                      setFieldValue("searchText", e.target.value)
                      handleSubmit()
                  }}
                />
                <small className="form-text text-muted">
                  {/* <b>Search</b> in Type field */}
                </small>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  )
}
