import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { getClassName } from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { fetchAllFormsMenu, fetchAllLeaveType, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
//Validation for Form
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  // companyId: Yup.string().required(VALIDATION_MESSAGES.required),
  leave_typeId: Yup.string().required(VALIDATION_MESSAGES.required),
  late_count_leave_deduction: Yup.number()
  .required(VALIDATION_MESSAGES.required)
  .min(0, 'Leave Count must be at least 0.')
  .max(99, 'Leave Count must be at most 99.')
  .typeError('Leave Count must be a number.')
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

  
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defLeaveType = null, setDefualtLeaveType] = useState(null);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllLeaveType("allLeaveTypes"))
     // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsisidaries
     dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch]);


  useEffect(() => {

    const subsidiaryId = defSubsidiary?.value ? defSubsidiary.value : user.subsidiaryId;

    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
      dashboard.allSubsidiaryList.filter((item) => {
        return item.value === subsidiaryId;
      })
    );

  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  
  useEffect(() => {

    const leaveTypeId = defLeaveType?.value ? defLeaveType.value : user.leave_typeId;

    setDefualtLeaveType(
      dashboard.allLeaveTypes &&
      dashboard.allLeaveTypes.filter((item) => {
        return item.value === leaveTypeId;
      })
    );

  }, [user?.leave_typeId, dashboard.leave_typeId]);

  const dropdown = (data) => {
    return [{ value: "", label: "--Select--" }, ...data].map((el) => {
      return (<>
        <option value={el.value}>{el.label}</option>
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
          setFieldValue,
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
                          
                          //handlePaymenModeChanged(e)
                        }}
                        error={errors.subsidiaryId}
                        value={(defSubsidiary || null)}
                        options={dashboard?.allSubsidiaryList}
                      />
                      <ErrorMessage className="form-feedBack" name="subsidiaryId" component="div" />
                     

                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="leave_typeId"
                        label={<span> Leave Type<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("leave_typeId", e.value || null);
                          setDefualtLeaveType(e);
                          //handlePaymenModeChanged(e)
                        }}
                        value={(defLeaveType || null)}
                        options={dashboard?.allLeaveTypes}
                      />
                      <ErrorMessage className="form-feedBack" name="leave_typeId" component="div" />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="late_count_leave_deduction"
                        component={Input}
                        placeholder=""
                        maxLength={2}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <span>
                            {" "}
                            Late Count (Per Leave)<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.late_count_leave_deduction}
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                        <input
                          name="isEnable_att_integration"
                          type="checkbox"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.isEnable_att_integration}
                          checked={values.isEnable_att_integration}
                          label="Enable Attendance Integration"
                        />
                        <label>&nbsp;<span>Enable Attendance Integration</span></label>
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
