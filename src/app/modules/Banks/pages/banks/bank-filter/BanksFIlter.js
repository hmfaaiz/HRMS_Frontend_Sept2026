import React, { useMemo} from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useBanksUIContext } from "../BanksUIContext"
import {InputSearch} from "../../../../../../app/utils/common-modules/InputSearch"



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
