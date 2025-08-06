import React, { useMemo, } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useBanksUIContext } from "../BanksUIContext"
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

export function BanksFilter({ listLoading, user, setCity,
  seletCity,
  setCenter,
  center,
  setSubcenter,
  isUserForRead,
  subCenter,
  alarmTime,
  setAlarmTime,
  setVehicle, }) {


  const banksUIContext = useBanksUIContext()



  const banksUIProps = useMemo(() => {
    return {
      queryParams: banksUIContext.queryParams,
      setQueryParams: banksUIContext.setQueryParams,
    }
  }, [banksUIContext])






  // queryParams, setQueryParams,
  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(banksUIProps.queryParams, values)
    if (!isEqual(newQueryParams, banksUIProps.queryParams)) {
      newQueryParams.pageNumber = 1
      // update list by queryParams

      banksUIProps.setQueryParams(newQueryParams)
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
 
        }}
        onSubmit={(values) => {

          // createPdf(values);
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
          <form onSubmit={handleSubmit} className="">

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

    
    </>
  )


}
