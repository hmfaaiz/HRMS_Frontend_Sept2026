import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getDateDiffInDays } from "../../../../../utils/common";

// percentage: Yup.string().required("Required*"),
const holidaysEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  // to_amount: Yup.string().required("Required*"),

  name: Yup.string()
    .required(VALIDATION_MESSAGES.required),


  from_date: Yup.date().required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .min(
      Yup.ref('from_date'),
      "End date cannot be earlier than from date"
    )
    .required(VALIDATION_MESSAGES.required),



  holiday_typeId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  religionId: Yup.number()
    .nullable(),
    

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
  const [start_date, setStart_date] = useState()
  const [end_date, setEnd_date] = useState()
  const [diffInDate, setDiffInDate] = useState()
  useEffect(() => {
    if (!user.Id) {
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(184, "allContractTypeList"));
      dispatch(fetchAllFormsMenu(213, "allHolidayTypeList"));
      dispatch(fetchAllFormsMenu(87, "allReligionChildMenus"));


    }
  }, [dispatch, user.Id]);


  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.holidays,
      userAccess: state?.auth?.userAccess["holidays"],
    };
  }, shallowEqual);

  const { userForEdit } = currentState;

  useEffect(() => {
    setStart_date(userForEdit?.from_date)
    setEnd_date(userForEdit?.to_date)
  }, [userForEdit])
  useEffect(() => {

    if (start_date && end_date) {
      setDiffInDate(getDateDiffInDays(start_date, end_date))

    }

  }, [start_date, end_date]);

  return (
    <Formik
      enableReinitialize={true}
      // initialValues={{
      //   Id:user.Id || '',
      //   type: user.type ||  '',
      //   value:user.value || 0,
      //   multiplier: user.multiplier || 0,
      //   divisor: user.divisor || 0,
      // }}

      initialValues={user}
      validationSchema={holidaysEditSchema}
      onSubmit={(values) => {

        enableLoading();
        saveForm(values, diffInDate);
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
                  <div className="col-12 col-md-12  p-0 m-0">
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
                  </div>



                  {/* <div className="col-12 col-md-6 mt-3">
                    <label>
                     From Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="from_date"
                      component={DatePickerField}
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Date"
                 
                      type="date"
                
                      onChange={(e) => {
                        setFieldValue("to_date", e);
                   
                        setStart_date(e)
                      }}
                      // minDate={dateOfJoining} 
                      // disabled={userForEdit?.details[0]?.is_deducted }
                    />
                  </div> */}

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      From Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="from_date"
                      component={DatePickerField} // Custom component
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Date"
                      type="date"
                      onChange={(e) => {


                        setFieldValue("from_date", e);
                        setStart_date(e);
                      }}
                    />
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      To Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="to_date"
                      component={DatePickerField}
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Date"

                      // type="date"
                      onChange={(e) => {
                        setFieldValue("to_date", e);
                        setEnd_date(e);
                      }}

                    // minDate={dateOfJoining} 
                    // disabled={userForEdit?.details[0]?.is_deducted }
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      <span>
                        Holiday Name<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="name"
                      component={Input}
                      placeholder="Enter Name"

                      type="text"

                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      <span>
                        Number of days<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="number_of_days"
                      component={Input}
                      // placeholder="Enter number_of_days"
                      disabled={true}
                      type="number"
                      value={diffInDate}



                    />
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="holiday_typeId"
                      label={
                        <span>
                          Holiday Type<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("holiday_typeId", e.value || null);
                      }}
                      value={
                        dashboard?.allHolidayTypeList?.find(
                          (option) => option.value === values.holiday_typeId
                        ) || null
                      }

                      options={dashboard?.allHolidayTypeList}
                      // options={dashboard.allSubidiaryList.map(option => ({
                      //   label: `${option.label} (${option.value})`, // Adding the value to the label
                      //   value: option.value,
                      // }))}
                      error={errors.holiday_typeId}
                      touched={touched.holiday_typeId}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="religionId"
                      label={
                        <span>
                          Select Religion
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("religionId", e.value || null);
                      }}

                      value={
                        // Default to "All" if religionId is null or undefined
                        values?.religionId ==null
                          ? { value: null, label: 'All' }
                          : dashboard?.allReligionChildMenus?.find(
                            (option) => option.value === values.religionId
                          ) || null
                      }
                      // value={
                      //   dashboard?.allReligionChildMenus?.find(
                      //     (option) => option.value === values.religionId
                      //   ) || null
                      // }

                      // options={dashboard?.allReligionChildMenus}

                      options={[
                        { value: null, label: 'All' }, // Adding "All" option with value empty string
                        ...dashboard?.allReligionChildMenus, // Spread the rest of the menu options
                      ]}

                      // options={dashboard.allSubidiaryList.map(option => ({
                      //   label: `${option.label} (${option.value})`, // Adding the value to the label
                      //   value: option.value,
                      // }))}
                      error={errors.religionId}
                      touched={touched.religionId}
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
