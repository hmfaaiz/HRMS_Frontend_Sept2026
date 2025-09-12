import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllAccountsByType,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { accountType, VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { amountLimit } from "../../../../../utils/common";
import { toast } from "react-toastify";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Trash2 } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

// Define the validation schema for the main form and the policies
const ReimbursementSchema = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  payroll_groupId: Yup.number().required(VALIDATION_MESSAGES.required),
  cycle_typeId: Yup.number()
   .nullable(),
  // .required(VALIDATION_MESSAGES.required),

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
      // dispatch(fetchAllFormsMenu(45, "allAccountList"));
      dispatch(fetchAllAccountsByType(45,accountType.Expenses, "allExpenseAccountList"));
      dispatch(fetchAllAccountsByType(45,accountType.Assets ,"allAssetsAccountList"));

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
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        setFieldTouched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isUserForRead}>
                <div className="grid lg:grid-cols-3 gap-x-3 gap-y-1">
                  {/* Subsidiary Field */}
                  <div className="">
                    {/* <SearchSelect
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
                    /> */}
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
                        // check_Existed_Data(e.value);
                      }}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      currentValue={values?.subsidiaryId}
                      initializeSubsidiary={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                      }}
                    />
                  </div>

                  {/* Account Field */}
                  <div className="">
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
                           {dashboard?.allSubsidiaryList?.find(
  (option) => option.value === values.subsidiaryId
)?.localizationId === 2 && (
                  <div className="">
                    <SearchSelect
                      name="cycle_typeId"
                      label={
                        <span>
                          Cycle Type
                          {/* <span style={{ color: "red" }}>*</span> */}
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
)}
                </div>
              </fieldset>

              <div className="w-full overflow-x-auto mt-2">
                <FieldArray name="policies">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Reimbursement Policies{"  "}
                        </h6>
                        {!isUserForRead && (
                          <button
                            c
                            type="button"
                            onClick={() =>
                              push({
                                reimbursement_typeId: "",
                                max_amount: "",
                                attachment_required: "",
                                grades: "",
                              })
                            }
                            className="btn btn-primary btn-sm mt-1"
                          >
                            <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                            Add
                          </button>
                        )}
                      </div>
                      <div className="w-full overflow-x-auto">
                        <div className="react-bootstrap-table table-responsive">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                            <tr className="custom-table-header">
                              <td className="min-w-32">Reimbursement Type</td>
                              <td className="min-w-32">Max Amount Allowed</td>
                              <td className="min-w-32">Attachment Required</td>
                              <td className="min-w-32">Salary Grade</td>
                              <td className="min-w-32">
                                {" "}
                                {!isUserForRead && <p> Action</p>}
                              </td>
                            </tr>

                            <tbody>
                              {values.policies &&
                                values.policies.length > 0 &&
                                values.policies.map((detail, index) => (
                                  <tr key={index}>
                                    <td>
                                      <Field
                                        name={`policies[${index}].reimbursement_typeId`}
                                        as="select"
                                        className="form-control"
                                        disabled={
                                          isUserForRead ||
                                          values.policies[index]?.Id
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
                                          value:
                                            values?.policies[index].max_amount,
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
                                        touched.policies?.[index]
                                          ?.max_amount && (
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
                                      <div>
                                        <div className="overflow-auto max-h-16 border-none">
                                          {dashboard.allEmployeeGradeList
                                            .filter(
                                              (option) => option.value !== null
                                            ) // Filter out the unwanted option
                                            .map((option, i) => (
                                              <div key={i}>
                                                <label className="flex items-center space-x-1">
                                                  <input
                                                    disabled={isUserForRead}
                                                    type="checkbox"
                                                    checked={values.policies[
                                                      index
                                                    ].grades.includes(
                                                      option.value
                                                    )}
                                                    onChange={(e) => {
                                                      const checked =
                                                        e.target.checked;
                                                      const currentGrades =
                                                        values.policies[index]
                                                          .grades || [];

                                                      const newGrades = checked
                                                        ? [
                                                            ...currentGrades,
                                                            option.value,
                                                          ]
                                                        : currentGrades.filter(
                                                            (id) =>
                                                              id !==
                                                              option.value
                                                          );

                                                      setFieldValue(
                                                        `policies[${index}].grades`,
                                                        newGrades
                                                      );
                                                    }}
                                                  />

                                                  {option.label}
                                                </label>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                      {errors.policies?.[index]?.grades &&
                                        touched.policies?.[index]?.grades && (
                                          <div className="text-danger">
                                            {errors.policies[index].grades}
                                          </div>
                                        )}
                                    </td>

                                    <td className="text-right">
                                      {!isUserForRead && (
                                        <button
                                          className="bg-transparent border-none"
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
                                        >
                                          <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="w-full overflow-x-auto">
                <FieldArray name="accounts">
                  {({ push, remove }) => (
                    <div>
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold mb-0 text-primary">
                          Accounts{"  "}
                        </h6>
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
                            <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                            Add
                          </button>
                        )}
                      </div>
                      <div className="w-full overflow-x-auto">
                        <div className="react-bootstrap-table table-responsive">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                            <tr className="custom-table-header">
                            
                              <td className="min-w-32">Reimbursement Type</td>
                              <td className="min-w-32">Expense Account</td>
                              <td className="min-w-32">Bank Account</td>
                              <td className="min-w-32"> {!isUserForRead && <p> Action</p>}</td>
                            </tr>

                            <tbody>
                              {values.accounts &&
                                values.accounts.length > 0 &&
                                values.accounts.map((detail, index) => (
                                  <tr key={index}>
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
                                        {dashboard.allExpenseAccountList?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                values.accounts.find(
                                                  (el) =>
                                                    el.expense_accountId ==
                                                    x.value
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
                                      {errors.accounts?.[index]
                                        ?.expense_accountId &&
                                        touched.accounts?.[index]
                                          ?.expense_accountId && (
                                          <div className="text-danger">
                                            {
                                              errors.accounts[index]
                                                .expense_accountId
                                            }
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
                                        {dashboard.allAssetsAccountList?.map((x) => {
                                          return (
                                            <option
                                              disabled={
                                                values.accounts.find(
                                                  (el) =>
                                                    el.bank_accountId == x.value
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
                                      {errors.accounts?.[index]
                                        ?.bank_accountId &&
                                        touched.accounts?.[index]
                                          ?.bank_accountId && (
                                          <div className="text-danger">
                                            {
                                              errors.accounts[index]
                                                .bank_accountId
                                            }
                                          </div>
                                        )}
                                    </td>

                                    <td className="text-right">
                                      {!isUserForRead && (
                                        <button
                                          className="bg-transparent border-none"
                                          type="button"
                                          onClick={() => remove(index)}
                                        >
                                          <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / OK Button */}
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
                OK
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
