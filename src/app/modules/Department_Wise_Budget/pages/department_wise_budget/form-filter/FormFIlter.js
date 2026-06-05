import React, { useMemo, useState, useEffect, useRef } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { useLocation, useHistory } from "react-router-dom";
import { fetchDepartmentWiseBudgets } from "../../../_redux/redux-Actions";


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

export function FormFIlter({ listLoading, user }) {


  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext()
  const [Loading, setLoading] = useState(false)
  const hasResolvedSubsidiary = useRef(false);
  const { dashboard } = useSelector((state) => state);
  const location = useLocation();
  const history = useHistory();
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

      formUIProps.setQueryParams(newQueryParams)
    }
  }
 

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{

          searchText: "",

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
          <form onSubmit={handleSubmit}  >

        <div className="flex items-center gap-3 w-full">


  {/* RIGHT: Search small */}
  <div className="ml-auto w-44">
    <InputSearch
      values={values}
      fieldName="searchText"
      setFieldValue={setFieldValue}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
    />
  </div>

</div>
            {/* </div> */}
          </form>
        )}
      </Formik>

      {/* <Formik
        enableReinitialize={true}

        onSubmit={(values) => {
    

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
            <div className="row">
           

             
            </div>
            <div className="row">
           
            </div>
            
          </form>
        )}
      </Formik> */}
    </>
  )

  return (
    <>

    </>
  )
}
