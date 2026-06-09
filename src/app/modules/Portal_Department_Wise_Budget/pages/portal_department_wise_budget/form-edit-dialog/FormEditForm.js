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
import { fetchAllDepartmentBySubsidiaryIds, fetchAllBudgetYearDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";
import PatternListForm from "./PatternList";
import { fetchDepartmentWiseBudget } from "../../../_redux/redux-Actions";

// percentage: Yup.string().required("Required*"),
const department_wise_budgetEditSchema = Yup.object().shape({

  subsidiaryId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),






  departmentId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  budgetYearId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),


  list: Yup.array()
    .of(
      Yup.object().shape({
        budgeted_strength: Yup.number()
          .required(VALIDATION_MESSAGES.required)
          .max(999999999, 'Maximum 9 digits allowed'),

        // budgeted_salary: Yup.number()
        //   .required(VALIDATION_MESSAGES.required)
        //   .max(999999999, "Maximum 9 digits allowed")
        //   .test(
        //     "salary-greater-than-strength",
        //     "Budgeted Salary must be greater than Budgeted Strength",
        //     function (value) {
        //       const { budgeted_strength } = this.parent;

        //       if (!value || !budgeted_strength) return true;

        //       return Number(value) > Number(budgeted_strength);
        //     }
        //   ),

        designationId: Yup.number()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        sno: Yup.number().required(VALIDATION_MESSAGES.required),

        business_need: Yup.string().required(VALIDATION_MESSAGES.required),
        impact_of_position: Yup.string().required(VALIDATION_MESSAGES.required),
        expected_date_of_joining: Yup.date()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .min(
            new Date(new Date().setHours(0, 0, 0, 0)),
            "Expected Date of Joining cannot be in the past"
          ),
        // request_date: Yup.date().nullable().required(VALIDATION_MESSAGES.required),
      })
    )
    // .test(
    //   "unique-designation",
    //   "Duplicate designation is not allowed",
    //   function (list) {
    //     if (!list || !list.length) return true;

    //     const designationIds = list
    //       .map((item) => item.designationId)
    //       .filter(Boolean);

    //     return designationIds.length === new Set(designationIds).size;
    //   }
    // ),
    .test(
      "unique-designation-date",
      "Duplicate designation with the same expected date is not allowed",
      function (list) {
        if (!list || !list.length) return true;

        const designationDateKeys = list
          .filter(
            (item) => item.designationId && item.expected_date_of_joining
          )
          .map(
            (item) =>
              `${item.designationId}_${item.expected_date_of_joining}`
          );

        return designationDateKeys.length === new Set(designationDateKeys).size;
      }
    ),
});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);



  const { currentState, userAccess, currentUser } = useSelector((state) => {
    return {
      currentState: state.portal_department_wise_budget,
      userAccess: state?.auth?.userAccess["portal_department_wise_budget"],
      currentUser: state?.auth?.user,
    };
  }, shallowEqual);


  const defaultSubsidiary = dashboard?.allSubsidiaryList?.find(
    (item) => item.isDefault
  );


  useEffect(() => {

    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDepartmentBySubsidiaryIds([formData[0]?.subsidiaryId] || [0]));
    dispatch(fetchAllBudgetYearDataBySubsidiaryId(formData[0]?.subsidiaryId));
    dispatch(fetchRoles());
  }, [dispatch, formData]);


  useEffect(() => {
    dispatch(fetchAllDepartmentBySubsidiaryIds([defaultSubsidiary?.value] || [0]));
    dispatch(fetchAllBudgetYearDataBySubsidiaryId(defaultSubsidiary?.value));
  }, [dispatch, defaultSubsidiary?.value]);



  return (
    <Formik
      enableReinitialize={true}
      // initialValues={{
      //   ...formData,
      //   subsidiaryId: defaultSubsidiary?.value || null
      // }}
      initialValues={{
        subsidiaryId:
          formData?.[0]?.subsidiaryId || currentUser.EmployeeMapping?.subsidiaryId || null,

        departmentId: formData?.[0]?.departmentId || currentUser.EmployeeMapping?.departmentId || null,

        budgetYearId: formData?.[0]?.budgetYearId || null,

        list: formData?.length
          ? formData.map((item, index) => ({
            ...item,
            sno: index + 1,


          }))
          : [],
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

          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">

                  <div className="col-span-1">

                    <SubsidiarySelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      // isDisabled={isdataForRead || formData[0]?.Id}
                      isDisabled={true}
                      onChange={(e) => {
                        setFieldValue("departmentId", null);
                        setFieldValue("budgetYearId", null);
                        setFieldValue("subsidiaryId", e.value);
                        dispatch(fetchAllDepartmentBySubsidiaryIds([e.value] || [0]));
                        dispatch(fetchAllBudgetYearDataBySubsidiaryId(e?.value));
                        if (values.departmentId && values.budgetYearId && e.value) {
                          dispatch(fetchDepartmentWiseBudget({ subsidiaryId: e.value, budgetYearId: values.budgetYearId, departmentId: values.departmentId }));
                        }
                      }}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      currentValue={values?.subsidiaryId}
                      initializeSubsidiary={(e) => {


                      }}
                    />
                  </div>

                  <div className="col-span-1">
                    <SearchSelect
                      name="budgetYearId"
                      label={<span>Budget Year</span>}
                      isDisabled={
                        isdataForRead || !values?.subsidiaryId || formData[0]?.Id
                      }
                      onChange={(e) => {
                        const selectedFY = dashboard?.budgetyearBySubList?.find(
                          (option) => option.value === e?.value
                        );

                        setFieldValue("budgetYearId", e.value || null);
                        if (values.departmentId && values.subsidiaryId && e.value) {
                          dispatch(fetchDepartmentWiseBudget({ subsidiaryId: values.subsidiaryId, budgetYearId: e.value, departmentId: values.departmentId }));
                        }

                      }}
                      value={
                        dashboard?.budgetyearBySubList?.find(
                          (option) => option.value === values.budgetYearId
                        ) || null
                      }

                      options={[
                        { label: "Select", value: "" },
                        ...(dashboard?.budgetyearBySubList || []).filter(
                          (item) => item.isEditable
                        ),
                      ]}
                      isOptionDisabled={(option) => !option.isEditable}
                      error={errors.budgetYearId}
                      touched={touched.budgetYearId}
                    />
                  </div>


                  <div className="col-span-1">
                    <SearchSelect
                      name="departmentId"
                      label={
                        <span>
                          Department<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      // isDisabled={isdataForRead || formData[0]?.Id || !values?.subsidiaryId || !values?.budgetYearId}
                      isDisabled={true}
                      onChange={(e) => {
                        setFieldValue("departmentId", e.value || null);
                        if (values.budgetYearId && values.subsidiaryId && e.value) {
                          dispatch(fetchDepartmentWiseBudget({ subsidiaryId: values.subsidiaryId, budgetYearId: values.budgetYearId, departmentId: e.value }));
                        }

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
                  <br />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-1">
                    <label>
                      <span className="text-bold">
                        Current Strength:  {currentState?.totalEmployees?.toLocaleString("en-US") || 0}
                      </span>
                    </label>

                  </div>

                  <div className="col-span-1">
                    <label>
                      <span className="text-bold">
                        Current Salary:  {currentState?.totalSalary?.toLocaleString("en-US") || 0}
                      </span>
                    </label>
                    {/* <Field
                      name=""
                      component={Input}
                      disabled={true}
                      // value={Number(currentState?.totalSalary || 0)}
                       value={currentState?.totalSalary?.toLocaleString("en-US")}
                      type="number"

                    /> */}
                  </div>
                </div>







                <div>
                  <PatternListForm
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}

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

            {!isdataForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Submit Request
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
