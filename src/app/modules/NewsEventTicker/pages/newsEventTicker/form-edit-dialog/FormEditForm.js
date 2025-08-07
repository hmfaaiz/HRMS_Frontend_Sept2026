import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input, TextArea } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";


// percentage: Yup.string().required("Required*"),
const news_event_tickerEditSchema = Yup.object().shape({


  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),


  ticker_description: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.required),


  ticker_date: Yup.date().required(VALIDATION_MESSAGES.required),



});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {
    if (!user.Id) {

      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));



    }
  }, [dispatch, user.Id]);


  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.news_event_ticker,
      userAccess: state?.auth?.userAccess["news_event_ticker"],
    };
  }, shallowEqual);

  const { userForEdit } = currentState;

  const activeOptions = [

    { value: false, label: "Inactive" },
    { value: true, label: "Active" },
  ];

  return (
    <Formik
      enableReinitialize={true}


      initialValues={user}
      // validationSchema={news_event_tickerEditSchema}
      onSubmit={(values) => {

        enableLoading();
        console.log("aaaaa1111", values)
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="form-group row">
                  <div className="form-group row col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-6 mt-3">
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
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }

                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      />
                    </div>



                    <div className="col-12 col-md-6 mt-3">
                      <label>
                        Ticker Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="ticker_date"
                        component={DatePickerField} // Custom component
                        dateFormat="dd-MMM-yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {


                          setFieldValue("ticker_date", e);

                        }}
                      />
                    </div>


                    {/* Active payroll month */}



                    {/* <div className="col-12 col-md-6 mt-3 d-flex flex-column align-items-end">

                      {values?.subsidiaryId ? (() => {
                        const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
                          (option) => option.value === values.subsidiaryId
                        );
                        return (
                          <>
                            <div>
                              <b>Active Fiscal Year -</b>{" "}
                              {selectedSubsidiary?.fiscalYearLabel}
                            </div>
   
                          </>
                        );
                      })() : null}
                    </div> */}
                  </div>







                  {/* <div className="col-12 col-md-12 mt-3">
                    <label>
                      <span>
                        Ticker Description<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="ticker_description"
                      component={Input}
                      placeholder="Enter description"

                      type="text"

                    />
                  </div> */}
                  <div className="col-12 col-md-12 mt-3 mb-9" style={{ height: '150px' }}>
                    <Field
                      name="ticker_description"
                      component={TextArea}
                      placeholder="Enter ticker Description"
                      className="form-control h-100"  // Force full height
                      label={
                        <span>
                          {" "}
                          Ticker Description<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div className="ml-1 mt-1">
                      <ErrorMessage
                        name="ticker_description"
                        component="div"
                        className="form-feedBack text-danger"
                      />
                    </div>
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Status <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="isActive"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                    >
                      <option value="">Select</option>
                      {activeOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.isActive &&
                      touched.isActive && (
                        <div className="text-danger">
                          {errors.isActive}
                        </div>
                      )}


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
                OK
              </button>
            )}

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

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
  );
}
