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
import { fetchHolidays } from "../../../_redux/redux-Actions";


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

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1

      formUIProps.setQueryParams(newQueryParams)
    }
  }
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

  }, [dispatch]);
  useEffect(() => {

    if (hasResolvedSubsidiary.current) return;

    if (!dashboard?.allSubsidiaryList?.length) return;

    const searchParams = new URLSearchParams(location.search);
    const subsidiaryFromUrl = searchParams.get("subsidiary");

    let finalSubsidiaryId = null;

    // 1️ URL has highest priority
    if (subsidiaryFromUrl) {
      // finalSubsidiaryId = parseInt(subsidiaryFromUrl, 10);

      // remove param safely
      searchParams.delete("subsidiary");
      const newUrl =
        location.pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");
      history.replace(newUrl);
    }
    // // 2️ fallback → default subsidiary
    // else {
    finalSubsidiaryId = dashboard?.allSubsidiaryList?.find(
      (e) => e?.isDefault
    )?.value;
    // }

    // 3️ nothing found → stop
    if (!finalSubsidiaryId) return;

    hasResolvedSubsidiary.current = true; //  LOCK IT

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      subsidiaryId: finalSubsidiaryId,
      pageNumber: 1,
    };

    formUIProps.setQueryParams(updatedQueryParams);


    dispatch(fetchHolidays(updatedQueryParams));


  }, [
    location.search,
    dashboard?.allSubsidiaryList
  ]);

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

  {/* LEFT: Subsidiary FIXED */}
  <div className="w-64 flex-shrink-0">
    <SearchSelect
      name="subsidiaryId"
      label={<span>Subsidiary</span>}
      value={
        (dashboard?.allSubsidiaryList || []).find(
          (item) => item.value === formUIProps?.queryParams?.subsidiaryId
        ) || { label: "All", value: "" }
      }
      onChange={(e) => {
        const updatedQueryParams = {
          ...formUIProps.queryParams,
          subsidiaryId: e.value,
          pageNumber: 1,
        };

        formUIProps.setQueryParams(updatedQueryParams);
        dispatch(fetchHolidays(updatedQueryParams));
      }}
      options={[
        { label: "All", value: "" },
        ...(Array.isArray(dashboard?.allSubsidiaryList)
          ? dashboard.allSubsidiaryList
          : []),
      ]}
    />
  </div>

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
