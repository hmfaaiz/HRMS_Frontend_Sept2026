import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllFiscalYearDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";

// percentage: Yup.string().required("Required*"),
const holidaysEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),


  startDate: Yup.date().required(VALIDATION_MESSAGES.required),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date cannot be earlier than from date")
    .required(VALIDATION_MESSAGES.required),
  fiscalYearId: Yup.number().required(VALIDATION_MESSAGES.required),


});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [start_date, setStart_date] = useState();
  const [end_date, setEnd_date] = useState();
  const [diffInDate, setDiffInDate] = useState();
  useEffect(() => {
 
     
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFiscalYearDataBySubsidiaryId(data?.subsidiaryId));

 
  }, [dispatch, data?.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.appraisal_period_setup,
      userAccess: state?.auth?.userAccess["appraisal_period_setup"],
    };
  }, shallowEqual);

  const { userForEdit } = currentState;



  return (
    <Formik
      enableReinitialize={true}

      initialValues={data}
      validationSchema={holidaysEditSchema}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,
          startDate: values.startDate
            ? formatDates(values.startDate, "dd-MMM-yyyy")
            : null,
          endDate: values.endDate
            ? formatDates(values.endDate, "dd-MMM-yyyy")
            : null,
        };

        saveForm(payload);
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">
                     
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
                           dispatch(fetchAllFiscalYearDataBySubsidiaryId(e.value));
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                         options={dashboard?.allSubsidiaryList}
                        // currentValue={values?.subsidiaryId}
                        // initializeSubsidiary={(e) => {
                        //   setFieldValue("subsidiaryId", e.value || null);
                        // }}
                      />
                    </div>

                  </div>
            
                  <div className="col-span-1">
                    <label>
                      Start Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="startDate"
                      component={DatePickerField} // Custom component
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("startDate", e);
                        setStart_date(e);
                      }}
                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      End Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="endDate"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      // type="date"
                      onChange={(e) => {
                        setFieldValue("endDate", e);
                        setEnd_date(e);
                      }}

                      // minDate={dateOfJoining}
                      // disabled={userForEdit?.details[0]?.is_deducted }
                    />
                  </div>

                  <div className="col-span-1">
                    <SearchSelect
                      name="fiscalYearId"
                      label={<span>Select Fiscal Year</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("fiscalYearId", e.value || null);
                      }}
                     
                      value={
                        dashboard?.fiscalyearBySubList?.find(
                          (option) => option.value === values.fiscalYearId
                        ) || null
                      }

                      options={dashboard?.fiscalyearBySubList}

                  
                      error={errors.fiscalYearId}
                      touched={touched.fiscalYearId}
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
                OK
              </button>
            )}



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
