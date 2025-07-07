
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";

import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,

  fetchAllSubCenter,
  fetchAllSubsidiaryData,
  getLatestBookingNo,
} from "../../../../../../_metronic/redux/dashboardActions";

import DatePicker from "react-datepicker";
import axios from "axios";
import { USERS_URL } from "../../../_redux/formCrud";
import { amountLimit, amountLimitDynamic, formatDates, formatDatesGlobal, getDateDiffInDays } from "../../../../../utils/common";
import { addMonths, getMonth } from "date-fns";
// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const formValidation = Yup.object().shape(
  {
    subsidiaryId: Yup.mixed()
      .nullable().
      required("Required*"),

    startDate: Yup.date()
      .nullable()
      .required("Start date is required")
      .max(Yup.ref('endDate'), 'Start date cannot be later than end date'), // Use Yup.ref to reference endDate

    endDate: Yup.date()
      .nullable()
      .required("End date is required")
      .min(Yup.ref('startDate'), 'End date cannot be earlier than start date'), // Use Yup.ref to reference startDate

  },

);


export function MasterEditForm({
  SavePayrollMonthSetup,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {

  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);


  const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
  };

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // Last day of the current month
  };

  const getDaysInCurrentMonth = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastDayOfCurrentMonth = new Date(nextMonth - 1);
    return lastDayOfCurrentMonth.getDate(); // Get the day of the month
  };


  const getCurrentMonth = () => {

    const now = new Date();
    const currentMonth = now.getMonth(); // Zero-based index (0 = January)
    return currentMonth + 1; // Convert to 1-based (1 = January)
  };

  // Get User Details
  const { auth } = useSelector((state) => state);
  const [defShortFormat, setDefaulShortFormat] = useState(null);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defstartDate, setDefaultStartDate] = useState();
  const [defendDate, setDefaultEndDate] = useState();

  const currentYear = new Date().getFullYear();
  const [defYear, setDefaultYear] = useState();
  const [defDays, setDefaultDays] = useState();
  const [defMonth, setDefaulMonth] = useState();






  useEffect(() => {

    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"))
    }
  }, [dispatch]);





  const addOneMonth = (currentDate) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  };


  const addDays = (currentDate, days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const [flag, setFlag] = useState(false)
  const getActivePreviousPayrollMonth = async (subsidiaryId, setFieldValue) => {

    const response = await axios.post(`${USERS_URL}/payroll_month/get-payroll-month-previous-date`, { subsidiaryId: subsidiaryId });

    if (response?.data?.data?.length > 0) {
      setFlag(true)
      const get_startDate = addOneMonth(response?.data?.data[0]?.startDate)

      // const setDaysInDate = addDays(addOneMonth(response?.data?.data[0]?.startDate), getDaysInCurrentMonth());
      const getmonth = getMonth(get_startDate) + 1;
      const get_lastMonth = response?.data?.data[0]?.month


      setDefaultStartDate(get_startDate)
      setFieldValue("startDate", new Date(get_startDate));

      // Add 365 days (considering leap years automatically)
      const setDaysInDate = new Date(get_startDate);
      setDaysInDate.setMonth(setDaysInDate.getMonth() + 1); // Add one year (365 or 366 days will be calculated automatically)

      // Set the calculated end date
      setDaysInDate.setDate(setDaysInDate.getDate() - 1);
      setFieldValue("endDate", setDaysInDate);



      setDefaultEndDate(setDaysInDate);
      setFieldValue("endDate", new Date(setDaysInDate));



      // if (getmonth == 12) {
      //   month = (1);
      // }
      // else
      //   month = getmonth + 1;

      //uncmment

      setDefaulMonth(getmonth)
      setFieldValue("month", getmonth);




      setDefaultYear(setDaysInDate.getFullYear());
      setFieldValue("year", setDaysInDate.getFullYear());

      const t = formatDates(get_startDate, 'MMyy')

      setDefaulShortFormat(t)

      setFieldValue("shortFormat", t);
      const daysDiff = getDateDiffInDays(get_startDate, setDaysInDate)
 
      setDefaultDays(daysDiff);
      setFieldValue("month_days", daysDiff);

      setFieldValue("subsidiaryId", subsidiaryId);

      //  const pmonth_db = response?.data?.data[0]?.month || 0;


      //   if (pmonth_db == 12) {
      //     setDefaulMonth(1)

      //     const defaultStartDate = "01" + "" + setDaysInDate.getFullYear().toString().substring(2, 4)
      //     setDefaulShortFormat(defaultStartDate)
      //   }
      //   else {

      //     if (pmonth_db <= 9)

      //       setDefaulShortFormat((pmonth_db + 1) + "" + setDaysInDate.getFullYear().toString().substring(2, 4))
      //     else
      //       setDefaulShortFormat((pmonth_db + 1) + "" + setDaysInDate.getFullYear().toString().substring(2, 4))

      //     setDefaulMonth((response?.data?.data[0]?.month) + 1)
      //   }
      // }
      // else {

      //   setDefaulShortFormat("0" + getCurrentMonth() + "" + defYear.toString().substring(2, 4))
    }
    else {
      setFlag(false)
      // setDefaultStartDate(new Date());
      // setFieldValue("startDate", new Date());

      setDefaultEndDate(addMonths(new Date(), 1));
      setFieldValue("endDate", addMonths(new Date(), 1));

      const t = formatDates(new Date(), 'MMyy')

      setFieldValue("shortFormat", t);
      setDefaulShortFormat(t)

      setDefaulMonth(getMonth(new Date()) + 1)
      setFieldValue("month", getMonth(new Date()) + 1);

      // const daysDiff = getDateDiffInDays(new Date(), addOneMonth(new Date()))

      const getYear = formatDates(new Date(), 'yyyy')
      setDefaultYear(getYear);
      setFieldValue("year", getYear);
      //  setDefaultYear(setDaysInDate.getFullYear());
      //  setFieldValue("year", setDaysInDate.getFullYear());
    
      // setDefaultDays(daysDiff);
      // setFieldValue("month_days", daysDiff);

      setFieldValue("subsidiaryId", subsidiaryId);


    }
  }

  const shortFormatGlobal = defYear?.toString().substring(2, 4);

  const getDaysInMonth = async (month, year) => {
    return await new Date(year, month, 0).getDate();
  };

  const handleMonthChange = async (month) => {

    const year = shortFormatGlobal || new Date().getFullYear().toString().substring(2, 4); // Use the provided year or the current year
    const daysInMonth = await getDaysInMonth(month - 1, year);


  };

  useEffect(() => {

    // getActivePreviousPayrollMonth();
  }, []);

  useEffect(() => {
  
    setDefaultDays(getDateDiffInDays(defstartDate, defendDate))

  }, [defstartDate, defendDate]);

  useEffect(() => {
    if (user.startDate) {

      setDefaultStartDate(new Date(user.startDate));
    }
  }, [user.startDate]);


  useEffect(() => {
    if (user.shortFormat) {
      setDefaulShortFormat(user.shortFormat);
    }
  }, [user.shortFormat]);


  useEffect(() => {
    if (user.month) {
      setDefaulMonth(user.month);
    }
  }, [user.month]);

  useEffect(() => {
    if (user.endDate) {
      setDefaultEndDate(new Date(user.endDate));
    }
  }, [user.endDate]);

  useEffect(() => {
    if (user.year) {
      setDefaultYear(defYear);
    }
  }, [user.year]);




  const basisOptions = [
    { value: "-1", label: "Select..." },
    { value: "1", label: "Jan" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Apr" },
    { value: "5", label: "May" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Aug" },
    { value: "9", label: "Sept" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}

        validationSchema={formValidation}
        onSubmit={(values) => {

          enableLoading();
          SavePayrollMonthSetup(values, defDays);
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          formik,
        }) => (

          <>
      
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      {/* <SearchSelect
                        name="subsidiaryId"
                        label={<span> Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                   
                          setDefualtSubsidiaryList(e);

                        }}

                        value={(defSubsidiary || null)}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        options={dashboard.allSubsidiaryList}
                      /> */}

                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          getActivePreviousPayrollMonth(e.value, setFieldValue);
                          // basisOptions.map((i)=>{
                          const aa = getCurrentMonth()

                          setFieldValue("month", aa);
                          setDefaulMonth(aa);
                          const bb = (getCurrentMonth() > 9 ? getCurrentMonth() + "" + shortFormatGlobal : +"0" + getCurrentMonth() + "" + shortFormatGlobal)
                          setDefaulShortFormat(bb)
                          // handleMonthChange(getCurrentMonth());
                       
                          setFieldValue("shortFormat", defShortFormat);

                          // })
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option?.value === values.subsidiaryId
                          ) || null
                        }
                        options={dashboard?.allSubsidiaryList}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <span> Month<span style={{ color: 'red' }}>*</span></span>
                      <select className="form-control"
                        name="month"
                        disabled={flag}
                        value={defMonth || values.month}
                        onChange={(e) => {

                          setFieldValue("month", e.target.value);
                          setDefaulMonth(e.target.value);
                          let short = (e.target.value > 9 ? e.target.value + "" + shortFormatGlobal : +"0" + e.target.value + "" + shortFormatGlobal)
                          setDefaulShortFormat(short)
                          handleMonthChange(e.target.value);
                          setFieldValue("shortFormat", short);

                        }}>
                        <option value="-1" label="Select..." />
                        <option value="1" label="Jan" />
                        <option value="2" label="Feb" />
                        <option value="3" label="Mar" />
                        <option value="4" label="Apr" />
                        <option value="5" label="May" />
                        <option value="6" label="Jun" />
                        <option value="7" label="Jul" />
                        <option value="8" label="Aug" />
                        <option value="9" label="Sept" />
                        <option value="10" label="Oct" />
                        <option value="11" label="Nov" />
                        <option value="12" label="Dec" />
                      </select>
                      {/* <Select
                        label={<span> Month<span style={{ color: 'red' }}>*</span></span>}
                        name="month"
                        // value={defMonth || null}
                        
                        onChange={(e) => {
                          setFieldValue("month", e.value || null);
                          setDefaulMonth(e);
                          handleChanged(e,setFieldValue)
                        }}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        autoComplete="off"
                      >
                        
                      </Select> */}
                    </div>
                  </div>
                  <div className="from-group row">
                    {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="year"
                        disabled={flag}
                        component={Input}
                        // onChange={handleChange}
                        placeholder="Enter Year"
                        label="Year"
                        // value={defYear}
                        // autoComplete="off"
                        onChange={(year) => {
                          setFieldValue("year", year);
                       

                        }}
       
                      />
                    </div> */}



                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Year{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="year"
                        component={Input}
                        placeholder="Enter year"
                        // label="To Amount"
                        type="number"

                        onInput={(e) => {
                          e.target.value = amountLimitDynamic(e.target.value, 4); // Limit to 3 digits
                        }}
                      />
                    </div>

                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      {/* <Field
                        name="shortFormat"
                        disabled={flag}
                        component={Input}
                        onChange={handleChange}
                        placeholder="Enter Short Format"
                        label="Short Format"
                        value={defShortFormat}
                        autoComplete="off"
                        onChange={(e) => {
                          setFieldValue("shortFormat", e.target.value);
                        }}
                      /> */}


                      <Field
                        name="shortFormat"
                        disabled={flag}
                        component={Input}
                        onChange={(e) => {
                          handleChange(e); // Call the original handleChange (if necessary)
                          setFieldValue("shortFormat", e.target.value); // Update the form field value
                        }}
                        placeholder="Enter Short Format"
                        label="Short Format"
                        value={defShortFormat}
                        autoComplete="off"
                      />

                    </div>
                  </div>
                  <div className="from-group row">
                    {/* <div className="col-12 col-md-4 mt-3">
                      <span> Start Date<span style={{ color: 'red' }}>*</span></span>
                      <DatePicker
                        className="form-control"
                       
                        placeholder="Enter Start Date"
                        selected={defstartDate}
                    
                        onChange={(e) => {
                          setFieldValue("startDate", e);
                          setDefaultStartDate(e);
                        }}
                        timeInputLabel="Time:"
                        dateFormat="dd/MM/yyyy"
                        showTimeInput
                        name="startDate"
                        disabled={isUserForRead || flag}
                    
                        autoComplete="off"
                      // value = {values.dateOfJoining}
                      />
                      <ErrorMessage className="form-feedBack" name="startDate" component="div" />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <span> End Date<span style={{ color: 'red' }}>*</span></span>
                      <DatePicker
                        className="form-control"
                        placeholder="Enter End Date"
                        selected={defendDate}
                   
                        onChange={(date) => {
                          setFieldValue("endDate", date);
                          setDefaultEndDate(date);
                    
                          //  setFieldValue("startDate", defstartDate);
                          // setDefaultStartDate(defstartDate);
                          // daysDiff()
                        }}

                        timeInputLabel="Time:"
                        dateFormat="dd/MM/yyyy"
                        showTimeInput
                        name="endDate"
                        disabled={isUserForRead || flag}
                        autoComplete="off"

                      // value = {values.dateOfJoining}
                      />
                      <ErrorMessage className="form-feedBack" name="endDate" component="div" />
                    </div> */}


                    <div className="col-12 col-md-4 mt-3">

                      <span> Start Date<span style={{ color: 'red' }}>*</span></span>
                      <DatePicker
                        className="form-control"
                        placeholder="Enter Start Date"
                        selected={defstartDate}
                        onChange={(date) => {
                          setFieldValue("startDate", date);
                          setDefaultStartDate(date);

                          // Add 365 days (considering leap years automatically)
                          const endDate = new Date(date);
                          endDate.setMonth(endDate.getMonth() + 1); // Add one year (365 or 366 days will be calculated automatically)

                          // Set the calculated end date
                          endDate.setDate(endDate.getDate() - 1);
                          setFieldValue("endDate", endDate);
                          setDefaultEndDate(endDate);
                          setDefaultDays()
                    
                          setFieldValue("month_days", getDateDiffInDays(values.startDate, values.endDate));
                       
                        }}

                        timeInputLabel="Time:"
                        dateFormat="dd-MMM-yyyy"
                        showTimeInput
                        name="startDate"
                        disabled={isUserForRead || flag}
                        autoComplete="off"
                      />
                      <ErrorMessage className="form-feedBack" name="startDate" component="div" />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <span> End Date<span style={{ color: 'red' }}>*</span></span>
                      <DatePicker
                        className="form-control"
                        placeholder="Enter End Date"
                        selected={defendDate}
                        onChange={(date) => {
                          setFieldValue("endDate", date);
                          setDefaultEndDate(date);
                        }}

                        timeInputLabel="Time:"
                        dateFormat="dd-MMM-yyyy"
                        showTimeInput
                        name="endDate"
                        disabled={true}
                        autoComplete="off"
                      // value = {values.dateOfJoining}
                      />
                      <ErrorMessage className="form-feedBack" name="endDate" component="div" />
                    </div>
                  </div>

                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="month_days"
                        disabled={true}
                        component={Input}
                        placeholder="Enter Days"
                        label="Days"
                        autoComplete="off"
                        value={defDays || 0}

                      />
                    </div>
                  </div>


                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isUserForRead ? (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-primary btn-elevate"
                >
                  Ok
                </button>
              )}

              <> </>
              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
