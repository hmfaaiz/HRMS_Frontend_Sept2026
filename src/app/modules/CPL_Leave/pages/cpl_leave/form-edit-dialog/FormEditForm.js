import React, { useEffect, useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";


const cplLeaveSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  gradeId: Yup.number()
    .nullable(),
  // .required(VALIDATION_MESSAGES.required),

  employeeTypeId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  // Business Days
  HalfDay_BusinessDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'")
  ,

  FullDay_BusinessDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'")
  ,

  Onehalf_BusinessDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'")
  ,

  Double_BusinessDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'")
  ,

  // Off Days
  HalfDay_OffDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  FullDay_OffDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  Onehalf_OffDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  Double_OffDay: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  // Holidays
  HalfDay_Holiday: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  FullDay_Holiday: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  Onehalf_Holiday: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  Double_Holiday: Yup.string()
    .matches(/^([01]\d|2[0-3])[0-5]\d$/, "Invalid Time: It should be between '0000' to '2400'"),

  accumulateDays: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .when("isAttProcessExecuted", {
      is: 1,
      then: (schema) =>
        schema
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .integer("Only whole numbers are allowed")
          .min(1, "Days must be at least 1")
          .max(999, "Days cannot exceed 999"),
      otherwise: (schema) => schema.nullable(),
    }),


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
  const inputFile = useRef(null);
  useEffect(() => {

    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

    dispatch(fetchAllFormsMenu(143, "allEmployeegradeList"));


    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));

    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));

  }, []);

  const mergedEmpTypeMenus = useMemo(() => {
    return [
      ...(dashboard?.allEmpTypeDynamicChildMenus || []),
      ...(dashboard?.allEmpTypeChildMenus || []),
    ];
  }, [dashboard?.allEmpTypeDynamicChildMenus, dashboard?.allEmpTypeChildMenus]);



  const defaultSubsidiary = dashboard?.allSubsidiaryList?.find(
    (item) => item.isDefault
  );


  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        subsidiaryId:
          formData?.subsidiaryId ?? defaultSubsidiary?.value ?? null,
      }}
      validationSchema={cplLeaveSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,

      }) => {

        return (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">

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
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                      />
                      <ErrorMessage
                        name="subsidiaryId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>



                    {/* <div className="col-span-1">
                      <SearchSelect
                        name="gradeId"
                        label={
                          <span>
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("gradeId", e.value || null);

                        }}
                        value={
                          dashboard?.allEmployeegradeList?.find(
                            option => Number(option.value) === Number(values.gradeId)
                          ) || null
                        }
                        // options={dashboard?.allEmployeegradeList}
                        options={[
                          { label: "All", value: "" },
                          ...(Array.isArray(dashboard?.allEmployeegradeList)
                            ? dashboard?.allEmployeegradeList
                            : []),
                        ]}
                        error={errors?.gradeId}
                        touched={touched?.gradeId}
                      />





                    </div> */}
                    <div className="col-span-1">
                      <SearchSelect
                        name="gradeId"
                        label={
                          <span>
                            Grade<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("gradeId", e?.value ?? "");
                        }}
                        value={
                          [
                            { label: "All", value: "" },
                            ...(dashboard?.allEmployeegradeList || []),
                          ].find(
                            option => String(option.value) === String(values.gradeId ?? "")
                          ) || { label: "All", value: "" }
                        }
                        options={[
                          { label: "All", value: "" },
                          ...(dashboard?.allEmployeegradeList || []),
                        ]}
                        error={errors?.gradeId}
                        touched={touched?.gradeId}
                      />
                    </div>
                    <div className="col-span-1">
                      <SearchSelect
                        name="employeeTypeId"
                        label={
                          <span>
                            Employee Type
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue(
                            "employeeTypeId",
                            e.value || null
                          );

                        }}
                        value={
                          mergedEmpTypeMenus?.find(
                            option => Number(option.value) === Number(values.employeeTypeId)
                          ) || null
                        }
                        options={mergedEmpTypeMenus}
                        error={errors?.employeeTypeId}
                        touched={touched?.employeeTypeId}
                      />
                    </div>


                  </div>

                  <br />

                  <div className="grid grid-cols-3 gap-x-3 gap-y-2">

                    <div>

                      <h2 className="text-lg font-bold text-tprimary">Business Days</h2>
                      <div className="">
                        <Field
                          name="HalfDay_BusinessDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter half business day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Half Business Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="FullDay_BusinessDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter full business day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Full Business Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="Onehalf_BusinessDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter one half business day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              One Half Business Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="Double_BusinessDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter double business day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Double Business Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-tprimary"> Off Days</h2>
                      <div className="">
                        <Field
                          name="HalfDay_OffDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter half off day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Half Off Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="FullDay_OffDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter full off day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Full Off Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="Onehalf_OffDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter one half off day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              One Half Off Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="Double_OffDay"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter double off day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Double Off Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-tprimary">Holidays</h2>

                      <div className="">
                        <Field
                          name="HalfDay_Holiday"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter half holiday day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Half Holiday Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="FullDay_Holiday"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter full holiday day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Full Holiday Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="Onehalf_Holiday"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter one half holiday day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              One Half Holiday Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>

                      <div className="">
                        <Field
                          name="Double_Holiday"
                          component={Input}
                          maxLength={4}
                          placeholder="Enter double holiday day"
                          className="form-control" // Force full height
                          label={
                            <span>
                              {" "}
                              Double Holiday Day (hhmm)

                            </span>
                          }
                          autoComplete="off"
                        />

                      </div>
                    </div>









                    <br />

                  </div>

                  <div className="grid grid-cols-1 gap-y-3">
                    <h2 className="text-lg font-bold text-tprimary">
                      Lapse policy
                    </h2>

                    {/* Do Nothing */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="isAttProcessExecuted"
                        checked={values.isAttProcessExecuted === 0}
                        onChange={() => {
                          setFieldValue("isAttProcessExecuted", 0);
                          setFieldValue("accumulateDays", "");

                        }}
                      />

                      <span>
                        Do not Lapse Leave
                      </span>
                    </label>

                    {/* Accumulate */}
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          className=""
                          name="isAttProcessExecuted"
                          checked={values.isAttProcessExecuted === 1}
                          onChange={() => {
                            setFieldValue("isAttProcessExecuted", 1);
                          }}
                        />

                        <span>Leave will Lapse after</span>

                        <div className="flex flex-col">
                          <Field
                            name="accumulateDays"
                            component={Input}
                            maxLength={3}
                            placeholder="Days"
                            disabled={values.isAttProcessExecuted !== 1}
                            style={{ width: "80px" }}
                          />

                          {/* {touched.accumulateDays && errors.accumulateDays && (
                            <div className="text-danger text-xs mt-1">
                              {errors.accumulateDays}
                            </div>
                          )} */}
                        </div>

                        <span>Days</span>
                      </div>
                    </div>

                    {/* Options */}
                    {/* {values.isAttProcessExecuted === 1 && (
                      <div className="grid grid-cols-1 gap-y-2 ml-6">

                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            name="cplGeneratedTillEndDate"
                            checked={values.cplGeneratedTillEndDate === 1}
                            onChange={() =>
                              setFieldValue("cplGeneratedTillEndDate", 1)
                            }
                          />
                          Lapse the CPL generated till end date of current Payroll Month and give
                          OT (Applicable to only OT Entitled Employees)
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            name="cplGeneratedTillEndDate"
                            checked={values.cplGeneratedTillEndDate === 2}
                            onChange={() =>
                              setFieldValue("cplGeneratedTillEndDate", 2)
                            }
                          />
                          Lapse the CPL generated till end date of previous Payroll Month and give
                          OT (Applicable to only OT Entitled Employees)
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            name="cplGeneratedTillEndDate"
                            checked={values.cplGeneratedTillEndDate === 3}
                            onChange={() =>
                              setFieldValue("cplGeneratedTillEndDate", 3)
                            }
                          />
                          Lapse the CPL generated till end date of current Payroll Month and do
                          not give OT (Applicable to both OT Entitled and not entitled Employees)
                        </label>

                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="mr-2"
                            name="cplGeneratedTillEndDate"
                            checked={values.cplGeneratedTillEndDate === 4}
                            onChange={() =>
                              setFieldValue("cplGeneratedTillEndDate", 4)
                            }
                          />
                          Lapse the CPL generated till end date of previous Payroll Month and do
                          not give OT (Applicable to both OT Entitled and not entitled Employees)
                        </label>

                      </div>
                    )} */}
                  </div>








                </fieldset>
              </Form>




            </Modal.Body >
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
                  onClick={() => {
                    console.log("Errors", errors);
                    console.log("Values", values);
                    handleSubmit();
                  }}
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
        );
      }}
    </Formik >
  );
}
