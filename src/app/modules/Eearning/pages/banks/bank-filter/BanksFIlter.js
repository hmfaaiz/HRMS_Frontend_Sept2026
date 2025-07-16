import React, { useMemo,  } from "react"
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
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="row">

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



            </div>
          </form>
        )}
      </Formik>

      <Formik
        enableReinitialize={true}
        // initialValues={{
        //   donorName: "", // values => All=""/Susspended=0/Active=1/Pending=2
        //   receiptNo: "", // values => All=""/Business=0/Individual=1
        //   searchText: "",
        //   cityId: '0',
        //   centerId: '0',
        //   subCenterId: '0',
        //   alarmTimeId: [],
        // }}
        onSubmit={(values) => {
      
          //createPdf(values);
          //applyFilter(values)
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
              {/* <div className="col-12 col-md-4">
                <label>Date From</label>
                <DatePicker
                  className="form-control"
                  placeholder="Enter Date From"
                  // selected={receiptDateFrom}
                  // onChange={(date) => {
                  //   setFieldValue("receiptDateFrom", date);
                  //   setReceiptDateFrom(date);
                  // }}
                  timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                  showTimeInput
                  name="incidentlocationReachdateTime"
                  disabled={isUserForRead}
                />
              </div> */}
              {/* <div className="col-12 col-md-4">
                <label>Date To</label>
                <DatePicker
                  className="form-control"
                  placeholder="Enter Date To"
                  // selected={receiptDateTo}
                  // onChange={(date) => {
                  //   setFieldValue("receiptDateTo", date);
                  //   setReceiptDateTo(date);
                  // }}
                  timeInputLabel="Time:"
                  dateFormat="dd/MM/yyyy"
                  showTimeInput
                  name="incidentlocationReachdateTime"
                  disabled={isUserForRead}
                />
              </div> */}
             {/* <div className="col-12 col-md-12">
             
                <label>Bank</label>
                <input

                  className="form-control"
                  //onBlur={(e) => createPdf(e.target.value)}
                  // values={values.txtBookNo}
                  // onChange={(e) => {
                  //   setFieldValue("txtBookNo", e.target.value.trim())
                  //   // handleSubmit()
                  // }}
                  name="txtBankSearch"
                  placeholder="Enter Bank Name"
                // onBlur={handleBlur}

                />


              </div>*/}

             
            </div>
            <div className="row">
            {/* <div className="col-12 col-md-4">
                <SearchSelect
                  name="cityId"
                  label="Select City*"
                  isDisabled={false}
                  onBlur={() => {
                    //   handleBlur({ target: { name: "cityId" } });
                  }}
                  // onChange={(e) => {
                  //   setFieldValue("cityId", e.value || null);
                  //   setDefaultCity(e);
                  //   dispatch(fetchAllCityCenters(e.value));
                  // }}
                  // value={defCity}
                  // error={errors.cityId}
                  // touched={touched.cityId}
                  // options={dashboard.allCity}
                />
              </div> */}
              {/* <div className="col-12 col-md-4">
                <SearchSelect
                  name="centerId"
                  label="Select Circle*"
                  isDisabled={isUserForRead && true}
                  // onBlur={() => {
                  //   handleBlur({ target: { name: "centerId" } });
                  // }}
                  // onChange={(e) => {
                  //   setFieldValue("centerId", e.value || '0');
                  //   setDefaultCenter(e);
                  //   dispatch(fetchAllSubCenter(e.value));
                  // }}
                  // value={defCenter}
                  // // error={user.centerId}
                  // // touched={touched.centerId}
                  // options={dashboard.cityCenters}
                />
              </div> */}
              {/* <div className="col-12 col-md-4">
                <SearchSelect
                  name="subCenterId"
                  label="Center*"
                  isDisabled={isUserForRead && true}
                  // onBlur={() => {
                  //   handleBlur({ target: { name: "subCenterId" } });
                  // }}
                  // onChange={(e) => {
                  //   setFieldValue("subCenterId", e.value || null);
                  //   setDefaultSubCenter(e);
              
                  //   // setDefaultDriver([]);
                  //   // dispatch(fetchDrivers(e.value));
                  // }}
                  // value={defSubcenter}
                  // error={errors.subCenterId}
                  // touched={touched.subCenterId}
                  // options={dashboard.allSubCenter}
                />
              </div> */}
            </div>
            {/* <div className="row">
              <div className="col-md-12">
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Search
                  {(
                    <span className="ml-3 mr-3"></span>
                  )}
                </button>
              </div>

            </div> */}
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
