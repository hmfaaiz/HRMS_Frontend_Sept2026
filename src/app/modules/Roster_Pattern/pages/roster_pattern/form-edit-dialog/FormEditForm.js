import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllEmployeeShifts,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import PatternListForm from "./PatternListForm";
import { amountLimitDynamic } from "../../../../../utils/common";


const roster_patternEditSchema = Yup.object().shape({


  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  patternCode: Yup.string()
    .required(VALIDATION_MESSAGES.required),

  patternName: Yup.string()
  .matches(/^[A-Za-z\s.-]+$/, 'Pattern Name must only contain letters.')
  .required(VALIDATION_MESSAGES.required),


    list: Yup.array().of(
      Yup.object().shape({
        shiftId: Yup.number().required(VALIDATION_MESSAGES.required),
        sno: Yup.number().required(VALIDATION_MESSAGES.required)
      })
    )


});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {

    if (!data.Id) {

      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllEmployeeShifts('allEmployeeShifts'));

    }
  }, [dispatch, data.Id]);



  



  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={roster_patternEditSchema}
      onSubmit={(values) => {

        enableLoading();
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
              <fieldset disabled={isdataForRead}>
                <div className="form-group row">
                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                        setFieldValue("list",[])

                      }}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (option) => option?.value === values?.subsidiaryId
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}


                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    />
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      <span>
                        Pattern Code<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="patternCode"
                      component={Input}
                      placeholder="Enter Pattern Code"

                      type="text"
                       onInput={(e) => {
                                                e.target.value = amountLimitDynamic(e.target.value,30); // Limit to 30 digits
                                              }}

                    />
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      <span>
                        Pattern Name<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="patternName"
                      component={Input}
                      placeholder="Enter Pattern Name"

                      type="text"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value,30); // Limit to 30 digits
                      }}

                    />
                  </div>



                </div>

                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                    width: '-webkit-fill-available'
                  }}
                >
                  <PatternListForm
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    dropdownData={{
                      // allEmployeeShifts: dashboard?.allEmployeeShifts
                      allEmployeeShifts:dashboard?.allEmployeeShifts?.filter(shift => shift.subsidiaryId === values.subsidiaryId)
                    }}
                    isdataForRead={isdataForRead}
                  />
                </div>


              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isdataForRead ? (
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

            {!isdataForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={!values?.list?.length}
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
