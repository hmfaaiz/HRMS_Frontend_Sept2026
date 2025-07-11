import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { amountLimit } from "../../../../../utils/common";
import { toast } from "react-toastify";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";

// Define the validation schema for the main form and the policies
const ReimbursementSchema = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  payroll_groupId: Yup.number().required(VALIDATION_MESSAGES.required),
  cycle_typeId: Yup.number().required(VALIDATION_MESSAGES.required),

  policies: Yup.array().of(
    Yup.object().shape({
      reimbursement_typeId: Yup.number().required(VALIDATION_MESSAGES.required),
      max_amount: Yup.number()
        .min(1, "Must be at least 1")
        .required(VALIDATION_MESSAGES.required),
      attachment_required: Yup.string().required(VALIDATION_MESSAGES.required),
      grades: Yup.string().required(VALIDATION_MESSAGES.required),
    })
  ),

  accounts: Yup.array().of(
    Yup.object().shape({
      reimbursement_typeId: Yup.number().required(VALIDATION_MESSAGES.required),
      expense_accountId: Yup.number().required(VALIDATION_MESSAGES.required),
      bank_accountId: Yup.number().required(VALIDATION_MESSAGES.required),
    })
  ),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  disableLoading,
  id,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const basisOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // Fetch necessary data if not already present
  useEffect(() => {
    if (!user.Id) {
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(127, "allPayrolGroupList")); // For All Accounts
      dispatch(fetchAllFormsMenu(205, "allCycleTypeList"));
      dispatch(fetchAllFormsMenu(202, "allReimbursementTypeList"));
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList"));
      dispatch(fetchAllFormsMenu(45, "allAccountList"));

      // reimbursement_typeId
    }
    //allPayrolGroupList
  }, [dispatch, user.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.reimbursement_configuration,
      userAccess: state?.auth?.userAccess["reimbursement_configuration"],
    };
  }, shallowEqual);

  const { entities } = currentState;

  let existedId = 0;
  const check_Existed_Data = (subsidiaryId) => {
    entities.forEach((i) => {
      if (i.subsidiaryId == subsidiaryId) {
        existedId = i.Id;

        dispatch(actions.fetchReimbursementConfig(existedId));
      } else {
        dispatch(actions.fetchReimbursementConfig(0));
      }
    });
  };

  const deleteReimbursementConfigPolicy = (
    Id,
    reimbursement_typeId,
    subsidiaryId
  ) => {
    // server request for deleting customer by id
    enableLoading();
    let data = {
      Id,
      reimbursement_typeId,
      subsidiaryId,
    };
    dispatch(actions.deleteReimbursementConfigPolicy(data)).then(() => {
      onHide();

      disableLoading();
    });
  };

  const deleteNotification = () => {
    toast("Reimbursement policy cannot be empty.");
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={ReimbursementSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue , setFieldTouched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isUserForRead}>
                <div className="form-group row">
                  {/* Subsidiary Field */}
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
                        // check_Existed_Data(e.value);
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

                  {/* Account Field */}
                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="payroll_groupId"
                      label={
                        <span>
                          Payroll Group<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("payroll_groupId", e.value || null);
                      }}
                      value={
                        dashboard?.allPayrolGroupList?.find(
                          (option) => option?.value === values?.payroll_groupId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard.allPayrolGroupList.map((option) => ({
                        label: `${option.label}`, // Adding the value to the label
                        value: option.value,
                      }))}
                      error={errors.payroll_groupId}
                      touched={touched.payroll_groupId}
                    />
                  </div>

                  {/* Employee Loan Account Field */}
                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="cycle_typeId"
                      label={
                        <span>
                          Cycle Type
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("cycle_typeId", e.value || null);
                      }}
                      value={
                        dashboard?.allCycleTypeList?.find(
                          (option) => option?.value === values?.cycle_typeId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard?.allCycleTypeList?.map((option) => ({
                        label: `${option.label}`, // Adding the value to the label
                        value: option.value,
                      }))}
                      error={errors.cycle_typeId}
                      touched={touched.cycle_typeId}
                    />
                  </div>
                </div>
              </fieldset>

              <FieldArray name="policies">
                {({ push, remove }) => (
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                      marginTop: "20px",
                    }}
                  >
                    <h6>Reimbursement Policies</h6>
                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th> {!isUserForRead && <p> Action</p>}</th>
                          <th>Reimbursement Type</th>
                          <th>Max Amount Allowed</th>
                          <th>Attachment Required</th>
                          <th style={{ padding: "20px" }}>Salary Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.policies &&
                          values.policies.length > 0 &&
                          values.policies.map((detail, index) => (
                            <tr key={index}>
                              <td>
                                {!isUserForRead && (
                                  <button
                                    type="button"
                                    // onClick={() => remove(index)}
                                    onClick={() => {
                                      if (
                                        values.policies[index]?.Id &&
                                        values.policies.length > 1
                                      ) {
                                        deleteReimbursementConfigPolicy(
                                          values.policies[index]?.Id,
                                          values.policies[index]
                                            ?.reimbursement_typeId,
                                          values.subsidiaryId
                                        );
                                      } else if (
                                        values.policies[index]?.Id &&
                                        values.policies.length == 1
                                      ) {
                                        deleteNotification();
                                      } else {
                                        remove(index);
                                      }
                                    }}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>

                              <td>
                                <Field
                                  name={`policies[${index}].reimbursement_typeId`}
                                  as="select"
                                  className="form-control"
                                  disabled={
                                    isUserForRead || values.policies[index]?.Id
                                  }
                                >
                                  <option value="">Select...</option>{" "}
                                  {/* Default "Select..." option */}
                                  {dashboard.allReimbursementTypeList?.map(
                                    (x) => {
                                      return (
                                        <option
                                          disabled={
                                            values?.policies?.find(
                                              (el) =>
                                                el.reimbursement_typeId ==
                                                x.value
                                            )
                                              ? true
                                              : false
                                          }
                                          value={x.value}
                                        >
                                          {" "}
                                          {x.label}{" "}
                                        </option>
                                      );
                                    }
                                  )}
                                </Field>
                                {errors.policies?.[index]
                                  ?.reimbursement_typeId &&
                                  touched.policies?.[index]
                                    ?.reimbursement_typeId && (
                                    <div className="text-danger">
                                      {
                                        errors.policies[index]
                                          .reimbursement_typeId
                                      }
                                    </div>
                                  )}
                              </td>
                             
                              <td>
                              <AmountInput
                                field={{
                                  name: `policies[${index}].max_amount`,
                                  value: values?.policies[index].max_amount,
                                }}
                                form={{
                                  touched,
                                  errors,
                                  setFieldValue,
                                  setFieldTouched,
                                }}
                                label={null}
                                disabled={isUserForRead}
                                placeholder="Write amount"
                              />
                                {/* <Field
                                  name={`policies[${index}].max_amount`}
                                  type="number"
                                  placeholder="Write amount"
                                  className="form-control"
                                  disabled={isUserForRead}
                                  onInput={(e) => {
                                    e.target.value = amountLimit(
                                      e.target.value
                                    ); // Limit to 3 digits
                                  }}
                                /> */}
                                {errors.policies?.[index]?.max_amount &&
                                  touched.policies?.[index]?.max_amount && (
                                    <div className="text-danger">
                                      {errors.policies[index].max_amount}
                                    </div>
                                  )}
                              </td>

                              <td>
                                <div className="">
                                  <Field
                                    name={`policies[${index}].attachment_required`}
                                    as="select"
                                    className="form-control"
                                    disabled={isUserForRead}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `policies[${index}].attachment_required`,
                                        e.target.value
                                      ); // Use the raw value
                                    }}
                                  >
                                    <option value="">Select</option>
                                    {basisOptions.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </Field>

                                  {/* {errors.attachment_required &&
                                    touched.attachment_required && (
                                      <div className="text-danger">
                                        {errors.attachment_required}
                                      </div>
                                    )} */}

                                  {errors.policies?.[index]
                                    ?.attachment_required &&
                                    touched.policies?.[index]
                                      ?.attachment_required && (
                                      <div className="text-danger">
                                        {
                                          errors.policies[index]
                                            .attachment_required
                                        }
                                      </div>
                                    )}
                                </div>
                              </td>

                              <td>
                                <div
                                  style={{
                                    maxHeight: "90px", // Set maxHeight for scrolling
                                    overflowY: "auto", // Enable vertical scrolling
                                    overflowX: "hidden", // Hide horizontal scrolling
                                    padding: "10px",
                                    // marginTop: "10px",
                                  }}
                                  className="bg-white m-2"
                                >
                                  {/* {dashboard.allEmployeeGradeList.map(
                                    (option, i) => (
                                      <div
                                        key={i}
                                        className="bg-white p-2"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <input
                                          className="mr-2"
                                          type="checkbox"
                                          checked={values.policies[
                                            index
                                          ].grades.includes(option.value)}
                                          onChange={(e) => {
                                            checkIds(e)
                                            const checked = e.target.checked;
                                            const currentGrades =
                                            values.policies[index].grades ||
                                              [];
                                            if (checked) {
                                              // Add ID to the array
                                              setFieldValue(
                                                `policies[${index}].grades`,
                                                [...currentGrades, option.value]
                                              );
                                            } else {
                                              // Remove ID from the array
                                              setFieldValue(
                                                `policies[${index}].grades`,
                                                currentGrades.filter(
                                                  (id) => id !== option.value
                                                )
                                              );
                                            }
                                          }}
                                        />
                                        <label className="form-check-label ms-2">
                                          {option.label}
                                        </label>
                                      </div>
                                    )
                                  )} */}

                                  {dashboard.allEmployeeGradeList
                                    .filter((option) => option.value !== null) // Filter out the unwanted option
                                    .map((option, i) => (
                                      <div
                                        key={i}
                                        className="bg-white p-1"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <input
                                          className="mr-2"
                                          disabled={isUserForRead}
                                          type="checkbox"
                                          checked={values.policies[
                                            index
                                          ].grades.includes(option.value)}
                                          onChange={(e) => {
                                            const checked = e.target.checked;
                                            const currentGrades =
                                              values.policies[index].grades ||
                                              [];

                                            const newGrades = checked
                                              ? [...currentGrades, option.value]
                                              : currentGrades.filter(
                                                  (id) => id !== option.value
                                                );

                                            setFieldValue(
                                              `policies[${index}].grades`,
                                              newGrades
                                            );
                                          }}
                                        />
                                        <label className="form-check-label ms-2">
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                </div>
                                {errors.policies?.[index]?.grades &&
                                  touched.policies?.[index]?.grades && (
                                    <div className="text-danger">
                                      {errors.policies[index].grades}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {!isUserForRead && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            reimbursement_typeId: "",
                            max_amount: "",
                            attachment_required: "",
                            grades: "",
                          })
                        }
                        className="btn btn-primary btn-sm"
                      >
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>

              <FieldArray name="accounts">
                {({ push, remove }) => (
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                      marginTop: "20px",
                    }}
                  >
                    <h6>Accounts</h6>
                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th> {!isUserForRead && <p> Action</p>}</th>
                          <th>Reimbursement Type</th>
                          <th>Expense Account</th>
                          <th>Bank Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.accounts &&
                          values.accounts.length > 0 &&
                          values.accounts.map((detail, index) => (
                            <tr key={index}>
                              <td>
                                {!isUserForRead && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>

                              <td>
                                <Field
                                  name={`accounts[${index}].reimbursement_typeId`}
                                  as="select"
                                  className="form-control"
                                  disabled={isUserForRead}
                                >
                                  <option value="">Select...</option>{" "}
                                  {/* Default "Select..." option */}
                                  {dashboard.allReimbursementTypeList?.map(
                                    (x) => {
                                      return (
                                        <option
                                          disabled={
                                            values.accounts.find(
                                              (el) =>
                                                el.reimbursement_typeId ==
                                                x.value
                                            )
                                              ? true
                                              : false
                                          }
                                          value={x.value}
                                        >
                                          {" "}
                                          {x.label}{" "}
                                        </option>
                                      );
                                    }
                                  )}
                                </Field>
                                {errors.accounts?.[index]
                                  ?.reimbursement_typeId &&
                                  touched.accounts?.[index]
                                    ?.reimbursement_typeId && (
                                    <div className="text-danger">
                                      {
                                        errors.accounts[index]
                                          .reimbursement_typeId
                                      }
                                    </div>
                                  )}
                              </td>

                              <td>
                                <Field
                                  name={`accounts[${index}].expense_accountId`}
                                  as="select"
                                  className="form-control"
                                  disabled={isUserForRead}
                                >
                                  <option value="">Select...</option>{" "}
                                  {/* Default "Select..." option */}
                                  {dashboard.allAccountList?.map((x) => {
                                    return (
                                      <option
                                        disabled={
                                          values.accounts.find(
                                            (el) =>
                                              el.expense_accountId == x.value
                                          )
                                            ? true
                                            : false
                                        }
                                        value={x.value}
                                      >
                                        {" "}
                                        {x.mergeLabel}{" "}
                                      </option>
                                    );
                                  })}
                                </Field>
                                {errors.accounts?.[index]?.expense_accountId &&
                                  touched.accounts?.[index]
                                    ?.expense_accountId && (
                                    <div className="text-danger">
                                      {errors.accounts[index].expense_accountId}
                                    </div>
                                  )}
                              </td>

                              <td>
                                <Field
                                  name={`accounts[${index}].bank_accountId`}
                                  as="select"
                                  className="form-control"
                                  disabled={isUserForRead}
                                >
                                  <option value="">Select...</option>{" "}
                                  {/* Default "Select..." option */}
                                  {dashboard.allAccountList?.map((x) => {
                                    return (
                                      <option
                                        disabled={
                                          values.accounts.find(
                                            (el) => el.bank_accountId == x.value
                                          )
                                            ? true
                                            : false
                                        }
                                        value={x.value}
                                      >
                                        {" "}
                                        {x.mergeLabel}{" "}
                                      </option>
                                    );
                                  })}
                                </Field>
                                {errors.accounts?.[index]?.bank_accountId &&
                                  touched.accounts?.[index]?.bank_accountId && (
                                    <div className="text-danger">
                                      {errors.accounts[index].bank_accountId}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {!isUserForRead && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            reimbursement_typeId: "",
                            expense_accountId: "",
                            bank_accountId: "",
                          })
                        }
                        className="btn btn-primary btn-sm"
                      >
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / Ok Button */}
            {!isUserForRead ? (
              <button
                type="button"
                onClick={onHide}
                // onClick={() => clear_Existed_Data()}

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

            {/* Save Button */}
            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                // disabled={loading}
                disabled={
                  loading ||
                  (values?.policies?.length === 0 &&
                    values?.accounts?.length === 0)
                }
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
