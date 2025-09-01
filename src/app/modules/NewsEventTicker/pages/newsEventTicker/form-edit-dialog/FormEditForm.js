import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
// percentage: Yup.string().required("Required*"),
const news_event_tickerEditSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
  .nullable(),
  // .required(VALIDATION_MESSAGES.required),

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
      validationSchema={news_event_tickerEditSchema}
      onSubmit={(values) => {
        enableLoading();
        console.log("aaaaa1111", values);
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
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || userForEdit}
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                      }}

                        value={
                      
                        values?.subsidiaryId == null
                          ? { value: null, label: "All" }
                          : dashboard?.allSubsidiaryList?.find(
                              (option) => option.value === values.subsidiaryId
                            ) || null
                      }
                
                      options={[
                        { value:null, label: "All" },
                        ...(dashboard?.allSubsidiaryList ?? []),
                      ]}
           
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    />
                  </div>

                  {/* <div>
                    <label>
                      Ticker Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      name="ticker_date"
                      // component={DatePickerField} // Custom component
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      type="date"
                      onChange={(e) => {
                            let a=formatDates(e, "yyyy-MM-dd")
                        setFieldValue("ticker_date", a);
                      }}
                    />
                  </div> */}

                    <div>
                                              <label>
                                                Ticker Date<span style={{ color: "red" }}>*</span>
                                              </label>
                                              <DatePicker
                                                className="form-control"
                                                placeholder="ticker_date "
                                                selected={
                                                  values?.ticker_date
                                                    ? new Date(values.ticker_date)
                                                    : null
                                                }
                                                onChange={(date) => {
                                                  let a= formatDates(date, "dd-MMM-yyyy");
                                                  setFieldValue("ticker_date", a);
                                                
                                                }}
                                                timeInputLabel="Time:"
                                                dateFormat="dd-MMM-yyyy"
                                                // showTimeInput
                                                name="ticker_date"
                                                autoComplete="off"
                                              />
                                            </div>

                  <div>
                    <label>
                      Status<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="isActive"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                    >
                      <option value="">Select</option>
                      {activeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.isActive && touched.isActive && (
                      <div className="text-danger">{errors.isActive}</div>
                    )}
                  </div>

                  <div className="col-span-3">
                    <Field
                      name="ticker_description"
                      component={TextArea}
                      placeholder="Enter ticker Description"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Ticker Description
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div>
                      {/* <ErrorMessage
                        name="ticker_description"
                        component="div"
                        className="form-feedBack text-danger"
                      /> */}
                    </div>
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
