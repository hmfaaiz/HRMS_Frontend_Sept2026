import React, { useMemo, useCallback } from "react"
import { Formik } from "formik"
import { isEqual, debounce } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

const prepareFilter = (queryParams, values) => {
  const { searchText } = values
  const newQueryParams = { ...queryParams }
  const filter = {}

  if (searchText) {
    filter.searchQuery = searchText
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

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1
      formUIProps.setQueryParams(newQueryParams)
    }
  }

  
  const debouncedApplyFilter = useCallback(
    debounce((values) => applyFilter(values), 500),
    [formUIProps.queryParams]  
  )

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchText: ""
        }}
        onSubmit={() => {}}  
      >
        {({
          values,
          handleBlur,
          setFieldValue,
        }) => (
          <form className="form form-label-right" style={{ margin: '0.8rem 0' }}>
            <InputSearch
              values={values}
              fieldName="searchText"
              setFieldValue={(field, value) => {
                setFieldValue(field, value)
                debouncedApplyFilter({ ...values, [field]: value })
              }}
              handleBlur={handleBlur}
              handleSubmit={() => {}} 
            />
          </form>
        )}
      </Formik>
    </>
  )
}