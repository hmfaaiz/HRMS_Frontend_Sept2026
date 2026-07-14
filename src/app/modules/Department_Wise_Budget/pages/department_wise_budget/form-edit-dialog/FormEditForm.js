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

  fetchAllParentDept,
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


  // list: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       budgeted_strength: Yup.number()
  //         .required(VALIDATION_MESSAGES.required)
  //         .max(999999999, 'Maximum 9 digits allowed'),

  //       // budgeted_salary: Yup.number()
  //       //   .required(VALIDATION_MESSAGES.required)
  //       //   .max(999999999, "Maximum 9 digits allowed")
  //       //   .test(
  //       //     "salary-greater-than-strength",
  //       //     "Budgeted Salary must be greater than Budgeted Strength",
  //       //     function (value) {
  //       //       const { budgeted_strength } = this.parent;

  //       //       if (!value || !budgeted_strength) return true;

  //       //       return Number(value) > Number(budgeted_strength);
  //       //     }
  //       //   ),
  //       budgeted_salary: Yup.number()
  //         .typeError(VALIDATION_MESSAGES.required)
  //         .transform((value, originalValue) => {
  //           return originalValue === "" ? null : value;
  //         })
  //         .nullable()
  //         .required(VALIDATION_MESSAGES.required)
  //         .max(999999999, "Maximum 9 digits allowed")
  //         .test(
  //           "salary-greater-than-strength",
  //           "Budgeted Salary must be greater than Budgeted Strength",
  //           function (value) {
  //             const { budgeted_strength } = this.parent;

  //             if (value == null || budgeted_strength == null) return true;

  //             return Number(value) > Number(budgeted_strength);
  //           }
  //         ),
  //       designationId: Yup.number()
  //         .nullable()
  //         .required(VALIDATION_MESSAGES.required),
  //       sno: Yup.number().required(VALIDATION_MESSAGES.required),

  //       business_need: Yup.string().nullable(),
  //       impact_of_position: Yup.string().nullable(),
  //       request_date: Yup.date()
  //         .nullable()
  //         .required(VALIDATION_MESSAGES.required),

  //       expected_date_of_joining: Yup.date()
  //         .nullable()
  //         .required(VALIDATION_MESSAGES.required)
  //         .test(
  //           "date-validation",
  //           "Expected Date must be greater than or equal to Request Date",
  //           function (value) {
  //             const { request_date } = this.parent;

  //             if (!value || !request_date) return true;

  //             const expected = new Date(value);
  //             const request = new Date(request_date);

  //             // normalize time
  //             expected.setHours(0, 0, 0, 0);
  //             request.setHours(0, 0, 0, 0);

  //             return expected >= request;
  //           }
  //         )
  //         .test(
  //           "not-past-date",
  //           "Expected Date of Joining cannot be in the past",
  //           function (value) {
  //             if (!value) return true;

  //             const today = new Date();
  //             today.setHours(0, 0, 0, 0);

  //             const expected = new Date(value);
  //             expected.setHours(0, 0, 0, 0);

  //             return expected >= today;
  //           }
  //         ),
  //     })
  //   )
  //   // .test(
  //   //   "unique-designation",
  //   //   "Duplicate designation is not allowed",
  //   //   function (list) {
  //   //     if (!list || !list.length) return true;

  //   //     const designationIds = list
  //   //       .map((item) => item.designationId)
  //   //       .filter(Boolean);

  //   //     return designationIds.length === new Set(designationIds).size;
  //   //   }
  //   // ),
  //   .test(
  //     "unique-designation-date",
  //     "Duplicate designation with the same expected date is not allowed",
  //     function (list) {
  //       if (!list || !list.length) return true;

  //       const designationDateKeys = list
  //         .filter(
  //           (item) => item.designationId && item.expected_date_of_joining
  //         )
  //         .map(
  //           (item) =>
  //             `${item.designationId}_${item.expected_date_of_joining}`
  //         );

  //       return designationDateKeys.length === new Set(designationDateKeys).size;
  //     }
  //   ),

  list: Yup.array().of(
  Yup.lazy((row) => {
    // Approved ya Rejected row par validation skip
    if (row?.request_status === "A" || row?.request_status === "R") {
      return Yup.object().shape({});
    }

    // Sirf Pending rows ke liye validation
    return Yup.object().shape({
      budgeted_strength: Yup.number()
        .required(VALIDATION_MESSAGES.required)
        .max(999999999, "Maximum 9 digits allowed"),

      budgeted_salary: Yup.number()
        .typeError(VALIDATION_MESSAGES.required)
        .transform((value, originalValue) =>
          originalValue === "" ? null : value
        )
        .nullable()
        .required(VALIDATION_MESSAGES.required)
        .max(999999999, "Maximum 9 digits allowed")
        .test(
          "salary-greater-than-strength",
          "Budgeted Salary must be greater than Budgeted Strength",
          function (value) {
            const { budgeted_strength } = this.parent;

            if (value == null || budgeted_strength == null) return true;

            return Number(value) > Number(budgeted_strength);
          }
        ),

      designationId: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      sno: Yup.number().required(VALIDATION_MESSAGES.required),

      business_need: Yup.string().nullable(),

      impact_of_position: Yup.string().nullable(),

      request_date: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required),

      expected_date_of_joining: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required)
        .test(
          "date-validation",
          "Expected Date must be greater than or equal to Request Date",
          function (value) {
            const { request_date } = this.parent;

            if (!value || !request_date) return true;

            const expected = new Date(value);
            const request = new Date(request_date);

            expected.setHours(0, 0, 0, 0);
            request.setHours(0, 0, 0, 0);

            return expected >= request;
          }
        )
        .test(
          "not-past-date",
          "Expected Date of Joining cannot be in the past",
          function (value) {
            if (!value) return true;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const expected = new Date(value);
            expected.setHours(0, 0, 0, 0);

            return expected >= today;
          }
        ),
    });
  })
)
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
  const [selectedValues, setSelectedValues] = useState({
    subsidiaryId: null,
    departmentId: null,
    budgetYearId: null,
  });


  const { currentState, userAccess, currentUser } = useSelector((state) => {
    return {
      currentState: state.department_wise_budget,
      userAccess: state?.auth?.userAccess["department_wise_budget"],
      currentUser: state?.auth?.user,
    };
  }, shallowEqual);


  const defaultSubsidiary = dashboard?.allSubsidiaryList?.find(
    (item) => item.isDefault
  );

  useEffect(() => {
    const subsidiaryId =
      formData?.[0]?.subsidiaryId ??
      defaultSubsidiary?.value ??
      0;

    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDepartmentBySubsidiaryIds([subsidiaryId]));
    dispatch(fetchAllBudgetYearDataBySubsidiaryId(subsidiaryId));
  }, [dispatch, formData, defaultSubsidiary?.value]);



  useEffect(() => {
    if (formData?.length) {
      setSelectedValues({
        subsidiaryId: formData?.[0]?.subsidiaryId || null,
        departmentId: formData?.[0]?.departmentId || null,
        budgetYearId: formData?.[0]?.budgetYearId || null,
      });
    }
  }, [formData]);


  return (
    <Formik
      enableReinitialize={true}
      // initialValues={{
      //   ...formData,
      //   subsidiaryId: defaultSubsidiary?.value || null
      // }}
      // initialValues={{
      //   subsidiaryId:
      //     formData?.[0]?.subsidiaryId || defaultSubsidiary?.value || null,

      //   departmentId: formData?.[0]?.departmentId || null,

      //   budgetYearId: formData?.[0]?.budgetYearId || null,

      //   list: formData?.length
      //     ? formData.map((item, index) => ({
      //       ...item,
      //       sno: index + 1,


      //     }))
      //     : [],
      // }}
      initialValues={{
        subsidiaryId:
          formData?.[0]?.subsidiaryId ||
          selectedValues?.subsidiaryId ||
          defaultSubsidiary?.value ||
          null,

        departmentId:
          formData?.[0]?.departmentId ||
          selectedValues?.departmentId ||
          null,

        budgetYearId:
          formData?.[0]?.budgetYearId ||
          selectedValues?.budgetYearId ||
          null,

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
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("departmentId", null);
                        setFieldValue("budgetYearId", null);
                        setFieldValue("subsidiaryId", e.value);
                        dispatch(fetchAllParentDept([e.value] || [0]));
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
                        setSelectedValues((prev) => ({
                          ...prev,
                          budgetYearId: e.value || null,
                        }));

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
                      isDisabled={isdataForRead}
                      onChange={(e) => {
                        setFieldValue("departmentId", e.value || null);
                        if (values.budgetYearId && values.subsidiaryId && e.value) {
                          dispatch(fetchDepartmentWiseBudget({ subsidiaryId: values.subsidiaryId, budgetYearId: values.budgetYearId, departmentId: e.value }));
                        }
                        setSelectedValues((prev) => ({
                          ...prev,
                          departmentId: e.value || null,
                        }));

                      }}
                      value={
                        dashboard?.allParentDept?.find(
                          (option) => option.value === values.departmentId
                        ) || null
                      }
                      options={dashboard?.allParentDept}

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







                <div >
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
                disabled={values?.list.length === 0}
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
