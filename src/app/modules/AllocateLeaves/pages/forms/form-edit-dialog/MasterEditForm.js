import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Select } from "../../../../../../_metronic/_partials/controls";
import AllocatedListTable from "./AllocatedListTable";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { fetchAllLeaveTypeBySubsidiary } from "../../../../../../_metronic/redux/dashboardActions";

//Validations for Form
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required('Required'),
  cycleTypeId: Yup.number().required('Required'),
  yearId: Yup.number().required('Required'),
  list: Yup.array().of(
    Yup.object().shape({
      leaveType: Yup.number().required('Required'),
      leaveCount: Yup.number().min(1, VALIDATION_MESSAGES.minOneValue).max(999, VALIDATION_MESSAGES.maxThreeDigit).required(VALIDATION_MESSAGES.required),
      policyType: Yup.number().nullable(),
      maxCount: Yup.number().min(0,  VALIDATION_MESSAGES.minOneValue).max(Yup.ref('leaveCount'), 'Max Count cannot be greater than Leave count').nullable(),
    }))
    .min(1, 'Allocate Atleast One leave'),
});

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
  dropdownData,
  getOldData,
  accessUser,
  dispatch
}) {

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
          touched,
          errors,
          values,
          handleBlur,
          setFieldValue,
          handleReset,
          dirty
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

                    {/* Subsidiary Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="subsidiaryId"
                        component={Select}
                        className={errors.subsidiaryId && touched.subsidiaryId ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : Number(e.target.value)
                          dispatch(fetchAllLeaveTypeBySubsidiary("allLeaveTypes", value));
                          setFieldValue('subsidiaryId', value)
                          const filter = { subsidiaryId: value, cycleTypeId: values.cycleTypeId, yearId: values.yearId }
                          getOldData(filter)
                        }}
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.subsidiaryId}
                        autoComplete="off"
                        children={CustomDropdown({ data: dropdownData.allSubsidiaryList, firstElement: { label: 'Select', value: null } })}
                      />
                      {
                        errors.subsidiaryId && touched.subsidiaryId && <CustomErrorLabel touched={true} error={errors.subsidiaryId} />
                      }
                    </div>
                    {/* Subsidiary Field End */}

                    {/* Cycle Type Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="cycleTypeId"
                        component={Select}
                        className={errors.cycleTypeId && touched.cycleTypeId ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : Number(e.target.value)
                          setFieldValue('cycleTypeId', value)
                          const filter = { subsidiaryId: values.subsidiaryId, cycleTypeId: value, yearId: values.yearId }
                          getOldData(filter)
                        }}
                        label={
                          <span>
                            {" "}
                            Cycle Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.cycleTypeId}
                        autoComplete="off"
                        children={CustomDropdown({ data: dropdownData.allCycleTypeList, firstElement: { label: 'Select', value: null } })}
                      />
                      {
                        errors.cycleTypeId && touched.cycleTypeId && <CustomErrorLabel touched={true} error={errors.cycleTypeId} />
                      }
                    </div>
                    {/* Cycle Type Field End */}

                    {/* Year Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="yearId"
                        component={Select}
                        className={errors.yearId && touched.yearId ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == 'Select' ? '' : Number(e.target.value)
                          setFieldValue('yearId', value)
                          const filter = { subsidiaryId: values.subsidiaryId, cycleTypeId: values.cycleTypeId, yearId: value }
                          getOldData(filter)
                        }}
                        label={<span>{" "}Year<span style={{ color: "red" }}>*</span></span>}
                        value={values.yearId}
                        autoComplete="off"
                        children={CustomDropdown({ data: dropdownData.allFiscalYears, firstElement: { label: 'Select', value: null } })}
                      />
                      {
                        errors.yearId && touched.yearId && <CustomErrorLabel touched={true} error={errors.yearId} />
                      }
                    </div>
                    {/* Year Field End */}

                  </div>
                  <br />
                  <br />

                  {/* Allocated List Table Start */}
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <AllocatedListTable
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      dropdownData={{
                        allLeaveTypes: dropdownData.allLeaveTypes,
                        allPolicyType: dropdownData.allPolicyType
                      }}
                      accessUser={accessUser}
                    // handleDelete={deleteTableRow}
                    />
                  </div>
                  {/* Allocated List Table End */}

                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isUserForRead && (
                <button
                  type="reset"
                  onClick={() => {
                    setFieldValue('subsidiaryId', '')
                    setFieldValue('cycleTypeId', '')
                    setFieldValue('yearId', '')
                    setFieldValue('list', [])
                  }}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              )}

              <> </>
              {accessUser && (
                <button
                  type="submit"
                  disabled={!values?.list?.length || loading}
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
