import React, { useMemo, useState, useEffect } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useBranchUIContext } from "../BranchUIContext"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useDispatch, useSelector } from "react-redux";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";



pdfMake.vfs = pdfFonts.pdfMake.vfs;
const API_URL = process.env.REACT_APP_API_URL;


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

export function BranchFilter({ listLoading, user, setCity,
  seletCity,
  setCenter,
  center,
  setSubcenter,
  isUserForRead,
  subCenter,
  alarmTime,
  setAlarmTime,
  setVehicle, }) {

  const [defCity, setDefaultCity] = useState({});
  const dispatch = useDispatch();
  const branchUIContext = useBranchUIContext()
  const dashboard = useSelector((state) => state.dashboard);
  



  const banksUIProps = useMemo(() => {
    return {
      queryParams: branchUIContext.queryParams,
      setQueryParams: branchUIContext.setQueryParams,
    }
  }, [branchUIContext])





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
          donorName: "", // values => All=""/Susspended=0/Active=1/Pending=2
          receiptNo: "", // values => All=""/Business=0/Individual=1
          searchText: "",
          cityId: [],
          centerId: [],
          subCenterId: [],
          alarmTimeId: [],
        }}
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
