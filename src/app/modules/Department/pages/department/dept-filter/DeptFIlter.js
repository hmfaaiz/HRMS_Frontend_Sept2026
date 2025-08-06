import React, { useMemo } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useDeptUIContext } from "../DeptUIContext"
import { InputSearch } from "../../../../../utils/common-modules/InputSearch"



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

export function DeptFilter({ listLoading, user, setCity,
  seletCity,
  setCenter,
  center,
  setSubcenter,
  isUserForRead,
  subCenter,
  alarmTime,
  setAlarmTime,
  setVehicle, }) {


  const deptUIContext = useDeptUIContext()




  const deptUIProps = useMemo(() => {
    return {
      queryParams: deptUIContext.queryParams,
      setQueryParams: deptUIContext.setQueryParams,
    }
  }, [deptUIContext])





  // queryParams, setQueryParams,
  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(deptUIProps.queryParams, values)
    if (!isEqual(newQueryParams, deptUIProps.queryParams)) {
      newQueryParams.pageNumber = 1

      deptUIProps.setQueryParams(newQueryParams)
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values) => {
          applyFilter(values)
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
                  <b>Search</b> by department
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

     
    </>
  )
}
