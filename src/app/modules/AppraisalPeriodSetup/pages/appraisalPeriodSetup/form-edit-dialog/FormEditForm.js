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
const appraisalForCreation = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),


  startDate: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date cannot be earlier than start date")
    .required(VALIDATION_MESSAGES.required),
  fiscalYearId: Yup.number()
  .nullable()
  // .required(VALIDATION_MESSAGES.required),


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

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFiscalYearDataBySubsidiaryId(data?.subsidiaryId));


  }, [dispatch, data?.Id]);





  return (
    <Formik
      enableReinitialize={true}

      initialValues={data}
      validationSchema={appraisalForCreation}
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
                        isDisabled={isUserForRead || data.subsidiaryId}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value == values.subsidiaryId
                          ) || null
                        }
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          console.log("aaaa1", e.value)
                          dispatch(fetchAllFiscalYearDataBySubsidiaryId(e.value));
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        options={dashboard?.allSubsidiaryList}

                      />
                    </div>

                  </div>

                  <div className="col-span-1">
                    <SearchSelect
                      name="fiscalYearId"
                      label={
                        <span>
                          Fiscal Year
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        const selectedFY = dashboard?.fiscalyearBySubList?.find(
                          (option) => option.value === e?.value
                        );

                        setFieldValue("fiscalYearId", e.value || null);
                        setFieldValue("fiscalYearStart", selectedFY ? new Date(selectedFY.startDate) : null);
                        setFieldValue("fiscalYearEnd", selectedFY ? new Date(selectedFY.endDate) : null);
                        setFieldValue("startDate", null)
                        setFieldValue("endDate", null)
                      }}

                      value={
                        dashboard?.fiscalyearBySubList?.find(
                          (option) => option.value === values.fiscalYearId
                        ) || null
                      }

                      // options={dashboard?.fiscalyearBySubList}
                          options={[{ label: 'Select', value: '' }, ...(Array.isArray(dashboard?.fiscalyearBySubList) ? dashboard?.fiscalyearBySubList : []),]}


                      error={errors.fiscalYearId}
                      touched={touched.fiscalYearId}
                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      Start Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="startDate"
                      component={DatePickerField} // Custom component
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      minDate={values?.fiscalYearStart || null}   // fiscal year ki start date
                      maxDate={values?.fiscalYearEnd || null}
                      // disabled={!values.fiscalYearId}
                      type="date"
                      onChange={(e) => {
                        setFieldValue("startDate", e);

                      }}
                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      End Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="endDate"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      // disabled={!values.fiscalYearId}
                      minDate={values?.fiscalYearStart || null } // start date ke baad ka hi date
                      maxDate={values?.fiscalYearEnd || null}                       // fiscal year ke end se zyada na ho
                      onChange={(e) => {
                        setFieldValue("endDate", e);

                      }}

                    // minDate={dateOfJoining}
                    // disabled={userForEdit?.details[0]?.is_deducted }
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
