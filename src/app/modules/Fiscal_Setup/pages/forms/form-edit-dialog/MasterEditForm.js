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
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// Function to check if two dates are exactly 365 days apart
// const validateDateDifference = (startDate, endDate) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // Calculate the difference in milliseconds
//   const timeDiff = end - start;

//   // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
//   const dayDiff = timeDiff / (1000 * 3600 * 24);

//   // Check if the difference is exactly 365 days
//   return dayDiff === 365 || dayDiff === 366;
// };
// Validation schema
const formValidation = Yup.object().shape(
  {
    startDate: Yup.date().nullable().required(VALIDATION_MESSAGES.required),
    endDate: Yup.date().nullable()
      .required(VALIDATION_MESSAGES.required),
      // .test(
      //   'date-difference',
      //   'End date must be exactly 365 or 366 days after start date',
      //   function (endDate) {
      //     const { startDate } = this.parent;
      //     return validateDateDifference(startDate, endDate);
      //   }
      // ),
      subsidiaryId: Yup.number()
      .nullable().required("Required*")
      
  },

);
export function MasterEditForm({
  SaveTaxSetup,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);
  const [defstartDate, setDefaultStartDate] = useState(null);
  const [defendDate, setDefaultEndDate] = useState(null);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);

  //===== Date Of Joining


  useEffect(() => {

    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"))
    }
  }, [dispatch]);

  useEffect(() => {
    if (user.startDate) {
      setDefaultStartDate(new Date(user.startDate));

      // const endDate = new Date(user.startDate);
      // endDate.setMonth(user.startDate.getMonth() + 13); // Adds 11 months
      // setDefaultEndDate(endDate);
    }
  }, [user.startDate]);

  useEffect(() => {
    if (user.endDate) {
     setDefaultEndDate(new Date(user.endDate));
    }
  }, [user.endDate]);

  
  useEffect(() => {

    const subsidiaryId = defSubsidiary?.value ? defSubsidiary.value : user.subsidiaryId;

    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
      dashboard.allSubsidiaryList.filter((item) => {
        return item.value === subsidiaryId;
      })
    );

  }, [user?.subsidiaryId, dashboard.subsidiaryId]);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
     
          enableLoading();
          SaveTaxSetup(values);
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
                      <SearchSelect
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
                      />
                    </div>
                  </div>
                  <div className="from-group row">
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
                                   endDate.setFullYear(endDate.getFullYear() + 1); // Add one year (365 or 366 days will be calculated automatically)
         
                                   // Set the calculated end date
                                   endDate.setDate(endDate.getDate() - 1);
                                   setFieldValue("endDate", endDate);
                                   setDefaultEndDate(endDate);
                        }}
                      
                        timeInputLabel="Time:"
                        dateFormat="dd-MMM-yyyy"
                        showTimeInput
                        name="startDate"
                        disabled={isUserForRead}
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



                  <div className="form-group row"></div>
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
