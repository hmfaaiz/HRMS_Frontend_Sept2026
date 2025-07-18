import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { getClassName } from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";

//Validation for Form
const formValidation = Yup.object().shape({
  paymentMode: Yup.string().required(VALIDATION_MESSAGES.required),
  amount: Yup.string().required(VALIDATION_MESSAGES.required).matches(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.validNumber),
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required)
});

export function MasterEditForm({
  dropdownData,
  submitForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const { dashboard } = useSelector((state) => state);
    const dispatch = useDispatch();
    useEffect(() => {
      if (!user.Id) {
        // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
        dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
        }
  }, [dispatch, user.Id]);
  const dropdown = (data) => {
  
    return [{ Id: "", formName: "--Select Mode--" }, ...data].map((el) => {
      return (<>
        <option value={el.Id}>{el.formName}</option>
      </>)
    })
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          submitForm(values)
        }}
      >
        {({
          handleSubmit,
          errors,
          values,
          handleBlur,
          handleChange,
          setFieldValue,touched,
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
    label={
      <span>
        Subsidiary<span style={{ color: "red" }}>*</span>
      </span>
    }
    isDisabled={isUserForRead}
    onChange={(e) => {
      setFieldValue("subsidiaryId", e?.value || "");
    }}
    value={
      dashboard?.allSubsidiaryList?.find(
        (option) => option.value === values.subsidiaryId
      ) || null
    }
    options={dashboard?.allSubsidiaryList}
  />
  {errors.subsidiaryId && (
    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
      {errors.subsidiaryId}
    </div>
  )}
</div>

                    
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="paymentMode"
                        component={Select}
                        className={errors.paymentMode && !values.paymentMode ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue('paymentMode', e.target.value)
                        }}
                        label={
                          <span>
                            {" "}
                            Payment Mode<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.paymentMode}
                        autoComplete="off"
                        children={dropdown(dropdownData)}
                      />
                      {
                        errors.paymentMode && !values.paymentMode && <CustomErrorLabel touched={true} error={errors.paymentMode} />
                      }
                    </div>


                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="amount"
                        component={Input}
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <span>
                            {" "}
                            Rounding Up to<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.amount}
                        autoComplete="off"
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
                  disabled={loading}
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
