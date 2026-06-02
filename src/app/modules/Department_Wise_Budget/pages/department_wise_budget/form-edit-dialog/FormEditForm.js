import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {

  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchRoles } from "../../../../UserMangement/_redux/usersActions";
import {

  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllDepartmentBySubsidiaryIds, fetchAllFiscalYearDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";

// percentage: Yup.string().required("Required*"),
const department_wise_budgetEditSchema = Yup.object().shape({

  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),


  budgeted_strength: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .max(999999999, 'Maximum 9 digits allowed'),

  budgeted_salary: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .max(999999999, "Maximum 9 digits allowed")
    .test(
      "salary-greater-than-strength",
      "Budgeted Salary must be greater than Budgeted Strength",
      function (value) {
        const { budgeted_strength } = this.parent;

        if (!value || !budgeted_strength) return true;

        return Number(value) > Number(budgeted_strength);
      }
    ),




  departmentId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  fiscalYearId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);



  const { currentState, userAccess, roles } = useSelector((state) => {
    return {
      currentState: state.department_wise_budget,
      userAccess: state?.auth?.userAccess["department_wise_budget"],
      roles: state.users?.roles?.allRoles || []
    };
  }, shallowEqual);


  const defaultSubsidiary = dashboard?.allSubsidiaryList?.find(
    (item) => item.isDefault
  );


  useEffect(() => {

    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDepartmentBySubsidiaryIds([formData?.subsidiaryId] || [0]));
    dispatch(fetchAllFiscalYearDataBySubsidiaryId(formData?.subsidiaryId));
    dispatch(fetchRoles());
  }, [dispatch, formData?.Id]);


  useEffect(() => {
    dispatch(fetchAllDepartmentBySubsidiaryIds([defaultSubsidiary?.value] || [0]));
    dispatch(fetchAllFiscalYearDataBySubsidiaryId(defaultSubsidiary?.value));
  }, [dispatch, defaultSubsidiary?.value]);



  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        subsidiaryId: defaultSubsidiary?.value || null
      }}
      validationSchema={department_wise_budgetEditSchema}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,

        };

        saveForm(payload);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange }) => (
        <>
          {console.log("errors1111", errors)}
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

                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("departmentId", e.value || null);
                          setFieldValue("fiscalYearId", e.value || null);
                          setFieldValue("subsidiaryId", e.value || null);
                          dispatch(fetchAllDepartmentBySubsidiaryIds([e.value] || [0]));
                          dispatch(fetchAllFiscalYearDataBySubsidiaryId(e?.value));
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {


                        }}
                      />
                    </div>

                  </div>


                  <div className="col-span-1">
                    <SearchSelect
                      name="departmentId"
                      label={
                        <span>
                          Department<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("departmentId", e.value || null);
                      }}
                      value={
                        dashboard?.departmentBySubIdsList?.find(
                          (option) => option.value === values.departmentId
                        ) || null
                      }
                      options={dashboard?.departmentBySubIdsList}

                      error={errors.departmentId}
                      touched={touched.departmentId}
                    />
                  </div>


                  <div className="col-span-1">
                    <label>
                      <span>
                        Budgeted Strength<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="budgeted_strength"
                      component={Input}
                      disabled={formData?.Id ? true : false}
                      type="number"

                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      <span>
                        Budgeted Salary<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="budgeted_salary"
                      component={Input}
                      disabled={formData?.Id ? true : false}

                      type="number"

                    />
                  </div>



                  <div className="col-span-1">
                    <label>
                      <span>
                        Remaining Budgeted Strength
                      </span>
                    </label>
                    <Field
                      name="remaining_budgeted_strength"
                      component={Input}
                      disabled={true}
                      type="number"

                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      <span>
                        Remaining Budgeted Salary
                      </span>
                    </label>
                    <Field
                      name="remaining_budgeted_salary"
                      component={Input}
                      disabled={true}

                      type="number"

                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      <span>
                        Request Status
                      </span>
                    </label>
                    <Field
                      name="request_status"
                      component={Input}
                      disabled={true}

                    />
                  </div>

                  <div className="col-span-2">
                    <label>
                      <span>
                        Request Remarks
                      </span>
                    </label>
                    <Field
                      name="request_remarks"
                      component={TextArea}

                      className="form-control " // Force full height
                      autoComplete="off"
                      disabled={true}
                    />
                  </div>


                  <div className="col-span-1">
                    <SearchSelect
                      name="fiscalYearId"
                      label={<span>Fiscal Year</span>}
                      isDisabled={
                        isUserForRead || !values?.subsidiaryId
                      }
                      onChange={(e) => {
                        const selectedFY = dashboard?.fiscalyearBySubList?.find(
                          (option) => option.value === e?.value
                        );

                        setFieldValue("fiscalYearId", e.value || null);


                      }}
                      value={
                        dashboard?.fiscalyearBySubList?.find(
                          (option) => option.value === values.fiscalYearId
                        ) || null
                      }

                      options={[
                        { label: "Select", value: "" },
                        ...(dashboard?.fiscalyearBySubList || []).filter(
                          (item) => item.isActive
                        ),
                      ]}
                      isOptionDisabled={(option) => !option.isActive}
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
