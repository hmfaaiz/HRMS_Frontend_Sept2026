import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllEarningList,
  fetchAllDeductionList,
} from "../../../../../../_metronic/redux/dashboardActions";

import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Eye, Trash2, XCircle } from "lucide-react";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import * as actions from "../../../_redux/formActions";

const formValidation = Yup.object().shape({
  EmpId: Yup.string().required(VALIDATION_MESSAGES.required),
  earning_deduction_list: Yup.array()
    .of(
      Yup.object().shape({
        earning_deduction_id: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        TransactionType: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        Amount_OneTime: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^\d+(\.\d{1,2})?$/,
            "Must be a valid number (up to 2 decimal places)"
          ),
        Remarks: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
      })
    )
    .min(1, "Add at least one record"),
});
export function MasterEditForm({
  saveFrom,
  user,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
  panelMode,
  setPanelMode,
}) {
  const { dashboard, actionsLoading } = useSelector((state) => {
    return {
      dashboard: state.dashboard,
      actionsLoading: state.onetime_allowance.actionsLoading,
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllActiveEmployees());
    }
  }, [dispatch, user.Id]);

  useEffect(() => {
    const employeeId = user.EmpId;
    if (employeeId) {
      dispatch(fetchAllEarningList(1, "", employeeId, true));
      dispatch(fetchAllDeductionList(2, "", employeeId));
    }
  }, [user?.EmpId, dispatch]);

  // Calculate totals
  const totalAllowance = (values) => {
    return (
      values?.earning_deduction_list
        ?.filter((el) => el.TransactionType === "Earning")
        ?.reduce(
          (sum, item) => sum + (parseFloat(item.Amount_OneTime) || 0),
          0
        ) || 0
    );
  };

  const totalDeduction = (values) => {
    return (
      values?.earning_deduction_list
        ?.filter((el) => el.TransactionType === "Deduction")
        ?.reduce(
          (sum, item) => sum + (parseFloat(item.Amount_OneTime) || 0),
          0
        ) || 0
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          saveFrom(values);
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          setFieldTouched,
          handleChange,
          setFieldValue,
          isValid,
          dirty,
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
                  {/* Employee Selection */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">
                    <div className="flex item-end gap-1 justify-end">
                      <div className="w-full">
                        <SearchSelect
                          name="EmpId"
                          label={
                            <span>
                              Employee<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={user.Id && true}
                          onChange={async (e) => {
                            const res = await dispatch(
                              actions.fetchOneTimeAllowance(e.value)
                            );
                            setFieldValue("EmpId", e.value || null);
                            setFieldValue(
                              "earning_deduction_list",
                              res.earning_deduction_list
                            );
                            if (e.value) {
                              dispatch(
                                fetchAllEarningList(1, "", e.value, true)
                              );
                              dispatch(fetchAllDeductionList(2, "", e.value));
                            }
                          }}
                          value={
                            (dashboard.allEmployees &&
                              dashboard.allEmployees.find((item) => {
                                return item.value === values.EmpId;
                              })) ||
                            null
                          }
                          error={errors.EmpId}
                          touched={touched.EmpId}
                          options={dashboard.allEmployees}
                        />
                      </div>
                      {/* View/Cancel button */}
                      <div className="flex items-end justify-end">
                        {panelMode ? (
                          <button
                            type="button"
                            className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                            onClick={() => setPanelMode(!panelMode)}
                          >
                            <XCircle className="w-3 h-3 text-black" />
                            Cancel
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={() => setPanelMode(!panelMode)}
                          >
                            <Eye className="w-4 h-4 text-white" />
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <br />
                  <EmployeeProfile
                    employeeId={values.EmpId}
                    panelMode={panelMode}
                  />
                  <hr />
                  {/* Earnings Section */}
                  <FieldArray name="earning_deduction_list">
                    {({ push, remove, form }) => {
                      const earningItems =
                        values.earning_deduction_list?.filter(
                          (el) => el.TransactionType === "Earning"
                        ) || [];

                      return (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-bold mb-0 text-primary">
                              Earnings
                            </h6>
                            {!isUserForRead && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  push({
                                    earning_deduction_id: "",
                                    TransactionType: "Earning",
                                    Amount_OneTime: "0",
                                    Remarks: "",
                                  })
                                }
                              >
                                <CirclePlus className="w-4 h-4 text-white mr-1" />
                                Add
                              </button>
                            )}
                          </div>
                          <div className="w-full overflow-x-auto">
                            <div className="react-bootstrap-table table-responsive">
                              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                <thead>
                                  <tr className="custom-table-header">
                                    <th>Earning</th>
                                    <th>Amount</th>
                                    <th>Remarks</th>
                                    <th className="text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {earningItems.map((row, index) => {
                                    const actualIndex = values.earning_deduction_list.findIndex(
                                      (item) => item === row
                                    );

                                    return (
                                      <tr key={actualIndex}>
                                        <td>
                                          <Field
                                            name={`earning_deduction_list[${actualIndex}].earning_deduction_id`}
                                          >
                                            {({ field, form }) => (
                                              <SearchSelect
                                                {...field}
                                                value={
                                                  dashboard?.allEarnings?.find(
                                                    (el) =>
                                                      el.value == field.value
                                                  ) || null
                                                }
                                                onChange={(e) => {
                                                  form.setFieldValue(
                                                    field.name,
                                                    e?.value || ""
                                                  );
                                                  form.setFieldTouched(
                                                    field.name,
                                                    true
                                                  );
                                                }}
                                                options={
                                                  dashboard?.allEarnings?.map(
                                                    (el) => {
                                                      return {
                                                        ...el,
                                                        isDisabled: values.earning_deduction_list.find(
                                                          (v) =>
                                                            v?.earning_deduction_id ==
                                                              el.value &&
                                                            v.TransactionType ==
                                                              "Earning"
                                                        ),
                                                      };
                                                    }
                                                  ) || []
                                                }
                                                isDisabled={isUserForRead}
                                                className={
                                                  form.errors
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.earning_deduction_id &&
                                                  form.touched
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.earning_deduction_id
                                                    ? "is-invalid"
                                                    : ""
                                                }
                                              />
                                            )}
                                          </Field>
                                          <ErrorMessage
                                            name={`earning_deduction_list[${actualIndex}].earning_deduction_id`}
                                            component="div"
                                            className="invalid-feedback d-block"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            name={`earning_deduction_list[${actualIndex}].Amount_OneTime`}
                                          >
                                            {({ field, form }) => (
                                              <AmountInput
                                                field={field}
                                                form={form}
                                                disabled={isUserForRead}
                                              />
                                            )}
                                          </Field>
                                          <ErrorMessage
                                            name={`earning_deduction_list[${actualIndex}].Amount_OneTime`}
                                            component="div"
                                            className="invalid-feedback d-block"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            name={`earning_deduction_list[${actualIndex}].Remarks`}
                                          >
                                            {({ field, form }) => (
                                              <input
                                                {...field}
                                                type="text"
                                                className={`form-control ${
                                                  form.errors
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.Remarks &&
                                                  form.touched
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.Remarks
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                disabled={isUserForRead}
                                              />
                                            )}
                                          </Field>
                                          <ErrorMessage
                                            name={`earning_deduction_list[${actualIndex}].Remarks`}
                                            component="div"
                                            className="invalid-feedback d-block"
                                          />
                                        </td>
                                        <td className="text-right">
                                          {!isUserForRead && (
                                            <button
                                              type="button"
                                              className="border-none bg-transparent"
                                              onClick={() =>
                                                remove(actualIndex)
                                              }
                                            >
                                              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </FieldArray>

                  <hr />

                  {/* Deductions Section */}
                  <FieldArray name="earning_deduction_list">
                    {({ push, remove, form }) => {
                      const deductionItems =
                        values.earning_deduction_list?.filter(
                          (el) => el.TransactionType === "Deduction"
                        ) || [];

                      return (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-bold mb-0 text-primary">
                              Deductions
                            </h6>
                            {!isUserForRead && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  push({
                                    earning_deduction_id: "",
                                    TransactionType: "Deduction",
                                    Amount_OneTime: "0",
                                    Remarks: "",
                                  })
                                }
                              >
                                <CirclePlus className="w-4 h-4 text-white mr-1" />
                                Add
                              </button>
                            )}
                          </div>

                          <div className="w-full overflow-x-auto">
                            <div className="react-bootstrap-table table-responsive">
                              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                <thead>
                                  <tr className="custom-table-header">
                                    <th>Deduction</th>
                                    <th>Amount</th>
                                    <th>Remarks</th>
                                    <th className="text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {deductionItems.map((row, index) => {
                                    const actualIndex = values.earning_deduction_list.findIndex(
                                      (item) => item === row
                                    );

                                    return (
                                      <tr key={actualIndex}>
                                        <td>
                                          <Field
                                            name={`earning_deduction_list[${actualIndex}].earning_deduction_id`}
                                          >
                                            {({ field, form }) => (
                                              <SearchSelect
                                                {...field}
                                                value={
                                                  dashboard?.allDeductions?.find(
                                                    (el) =>
                                                      el.value == field.value
                                                  ) || null
                                                }
                                                onChange={(e) => {
                                                  form.setFieldValue(
                                                    field.name,
                                                    e?.value || ""
                                                  );
                                                  form.setFieldTouched(
                                                    field.name,
                                                    true
                                                  );
                                                }}
                                                options={
                                                  dashboard?.allDeductions?.map(
                                                    (el) => {
                                                      return {
                                                        ...el,
                                                        isDisabled: values.earning_deduction_list.find(
                                                          (v) =>
                                                            v?.earning_deduction_id ==
                                                              el.value &&
                                                            v.TransactionType ==
                                                              "Deduction"
                                                        ),
                                                      };
                                                    }
                                                  ) || []
                                                }
                                                isDisabled={isUserForRead}
                                                className={
                                                  form.errors
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.earning_deduction_id &&
                                                  form.touched
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.earning_deduction_id
                                                    ? "is-invalid"
                                                    : ""
                                                }
                                              />
                                            )}
                                          </Field>
                                          <ErrorMessage
                                            name={`earning_deduction_list[${actualIndex}].earning_deduction_id`}
                                            component="div"
                                            className="invalid-feedback d-block"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            name={`earning_deduction_list[${actualIndex}].Amount_OneTime`}
                                          >
                                            {({ field, form }) => (
                                              <AmountInput
                                                field={field}
                                                form={form}
                                                disabled={isUserForRead}
                                              />
                                            )}
                                          </Field>
                                          <ErrorMessage
                                            name={`earning_deduction_list[${actualIndex}].Amount_OneTime`}
                                            component="div"
                                            className="invalid-feedback d-block"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            name={`earning_deduction_list[${actualIndex}].Remarks`}
                                          >
                                            {({ field, form }) => (
                                              <input
                                                {...field}
                                                type="text"
                                                className={`form-control ${
                                                  form.errors
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.Remarks &&
                                                  form.touched
                                                    .earning_deduction_list?.[
                                                    actualIndex
                                                  ]?.Remarks
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                                disabled={isUserForRead}
                                              />
                                            )}
                                          </Field>
                                          <ErrorMessage
                                            name={`earning_deduction_list[${actualIndex}].Remarks`}
                                            component="div"
                                            className="invalid-feedback d-block"
                                          />
                                        </td>
                                        <td className="text-right">
                                          {!isUserForRead && (
                                            <button
                                              type="button"
                                              className="border-none bg-transparent"
                                              onClick={() =>
                                                remove(actualIndex)
                                              }
                                            >
                                              <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </FieldArray>

                  {errors?.earning_deduction_list && (
                    <span className="invalid-feedback">
                      {typeof errors?.earning_deduction_list === "string"
                        ? errors?.earning_deduction_list
                        : ""}
                    </span>
                  )}

                  {/* Totals Section */}
                  <div className="grid grid-cols-12 gap-2 mt-4 justify-end">
                    <div className="col-span-1 col-start-11">
                      <AmountInput
                        field={{
                          name: `totalAllowance`,
                          value: totalAllowance(values),
                        }}
                        form={{
                          setFieldValue: () => {},
                          setFieldTouched: () => {},
                          touched: {},
                          errors: {},
                        }}
                        label={"Total Earnings"}
                        disabled={true}
                      />
                    </div>
                    <div className="col-span-1 col-start-12">
                      <AmountInput
                        field={{
                          name: `totalDeduction`,
                          value: totalDeduction(values),
                        }}
                        form={{
                          setFieldValue: () => {},
                          setFieldTouched: () => {},
                          touched: {},
                          errors: {},
                        }}
                        label={"Total Deductions"}
                        disabled={true}
                      />
                    </div>
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {/* Footer buttons */}

              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary btn-elevate"
                  disabled={loading || !isValid}
                >
                  Save
                  {loading && (
                    <span className="ml-3 spinner spinner-white"></span>
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
