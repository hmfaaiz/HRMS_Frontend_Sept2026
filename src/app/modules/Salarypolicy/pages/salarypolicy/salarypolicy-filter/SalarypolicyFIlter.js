import React, { useMemo, useState, useEffect, useCallback } from "react"
import { Formik } from "formik"
import { isEqual } from "lodash"
import { useSalarypolicyUIContext } from "../SalarypolicyUIContext"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import {} from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";


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

export function SalarypolicyFIlter({ listLoading,user }) {


  const dispatch = useDispatch();
  const SalarypolicyUIContext = useSalarypolicyUIContext()
  const [Loading, setLoading] = useState(false)



  const salarypolicyUIProps  = useMemo(() => {
    return {
      queryParams: SalarypolicyUIContext.queryParams,
      setQueryParams: SalarypolicyUIContext.setQueryParams,
    }
  }, [SalarypolicyUIContext])




  function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  // queryParams, setQueryParams,
  const applyFilter = (values) => {

    const newQueryParams = prepareFilter(salarypolicyUIProps .queryParams, values)
    if (!isEqual(newQueryParams, salarypolicyUIProps .queryParams)) {
      newQueryParams.pageNumber = 1
    
      salarypolicyUIProps .setQueryParams(newQueryParams)
    }
  }


  // const waitapplyFilter = useCallback(
  //   debounce((values) => applyFilter(values), 500),
  //   []
  // );
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
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="row">

              <div className="col-12 col-md-12">
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
              </div>
            </div>
          </form>
        )}
      </Formik>

      <Formik
        enableReinitialize={true}

        onSubmit={(values) => {
           console.log("va");

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
      </Formik>
    </>
  )

  return (
    <>

    </>
  )
}
