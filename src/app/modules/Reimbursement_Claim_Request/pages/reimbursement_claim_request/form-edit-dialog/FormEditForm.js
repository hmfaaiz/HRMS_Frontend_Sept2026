import React, { useEffect, useRef, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import {
  formatDates,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getEmployeeProfileById } from "../../../../../../_metronic/redux/dashboardCrud";
import {
  getAllReimbursementConfigPolicy,
  uploadImage,
  getEmployeeAuthorties,  
} from "../../../_redux/redux-Crud";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { toast } from "react-toastify";

const ReimbursementClaimSchema = Yup.object().shape({
  reimbursement_typeId: Yup.number().required(VALIDATION_MESSAGES.required),
  date: Yup.date().required(VALIDATION_MESSAGES.required),
  amount: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required),
  details: Yup.string().required(VALIDATION_MESSAGES.required),
  pay_in_payroll_forId: Yup.number().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  enableLoading,
  loading,
  setIds,
  isEdit,
  isFileReq,
  setIsFileReq,
  disbaleLoading,
  formUIProps,
  employeeId,
}) {
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({});

  const [empAuthorityList, setEmpAuthorityList] = useState([]);
  const [isPolicyExists, setIsPolicyExists] = useState(false);

  const { dashboard } = useSelector((state) => state);
  const { currentState } = useSelector(
    (state) => ({ currentState: state.reimbursement_claim }),
    shallowEqual
  );

  const { activeFiscalYear } = useSelector((state) => state.dashboard);
  const entities = useSelector(
    (state) => state.reimbursement_claim.entities || [],
    shallowEqual
  );
  const [policies, setPolicies] = useState([]);

  // ── Employee profile for minDate ──────
  useEffect(() => {
    const empId = employeeId || formUIProps?.employeeId?.value;
    if (empId) {
      getEmployeeProfileById(empId)
        .then((res) => {
          if (res?.data?.data) setEmployeeData(res.data.data);
        })
        .catch(() => setEmployeeData({}));
    } else {
      setEmployeeData({});
    }
  }, [employeeId, formUIProps?.employeeId?.value]);

  // ── Load policies for this employee ──────────────────────────────────────
  useEffect(() => {
    const empId = employeeId || formUIProps?.employeeId?.value;
    if (!empId) return;
    getAllReimbursementConfigPolicy({ Id: empId })
      .then((res) => {
        setPolicies(res?.data?.data?.policies || []);
      })
      .catch(() => setPolicies([]));
  }, [employeeId, formUIProps?.employeeId?.value]);

  
  useEffect(() => {
    const empId = employeeId || formUIProps?.employeeId?.value;
    if (!empId) return;
    getEmployeeAuthorties(empId, "629")
      .then((res) => {
        const data = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
        const policyExists = res.data?.data?.isPolicyExists || false;
        const normalized = data.map((e) => ({
          Id: e.Id,
          level: e.level,
          isDeligation: e.isDeligation || false,
          deligationId: e.deligationId || null,
        }));

        setEmpAuthorityList(normalized);
        setIsPolicyExists(policyExists);
      })
      .catch(() => {
        setEmpAuthorityList([]);
        setIsPolicyExists(false);
      });
  }, [employeeId, formUIProps?.employeeId?.value]);

  // ── Active fiscal year ──────────
  useEffect(() => {
    if (currentState?.payrollData?.subsidiaryId) {
      dispatch(
        getActiveFiscalYear(
          "activeFiscalYear",
          currentState?.payrollData?.subsidiaryId
        )
      );
    }
  }, [currentState?.payrollData?.subsidiaryId, dispatch]);

  // ── Filter reimbursement types by policy ──────
  const filteredReimbursementOptions = useMemo(() => {
    const list = dashboard?.allReimbursementTypeList || [];
    if (!policies.length) return list;
    return list.filter((option) =>
      policies.some(
        (item) => Number(item.reimbursement_typeId) === Number(option.value)
      )
    );
  }, [dashboard?.allReimbursementTypeList, policies]);

  // ── Calculate remaining amount limit ───────
  const calculateRemainingAmount = (
    reimbursementTypeId,
    payrollForId,
    policies,
    values
  ) => {
    const maxAmount =
      policies?.find(
        (item) => item.reimbursement_typeId === reimbursementTypeId
      )?.max_amount || 0;

    const limit_type =
      policies?.find(
        (item) => item.reimbursement_typeId === reimbursementTypeId
      )?.limit_type || 1;

    let claimedAmount = 0;

    if (limit_type == 1) {
      claimedAmount = entities
        ?.filter(
          (entity) =>
            entity.reimbursement_typeId === reimbursementTypeId &&
            entity.pay_in_payroll_forId === payrollForId
        )
        ?.reduce((sum, entity) => sum + (entity.amount || 0), 0);
    } else if (limit_type == 2) {
      claimedAmount = entities
        ?.filter((entity) => {
          const entityStartDate = new Date(entity.PayInPayrollForId.startDate);
          const startDate = new Date(activeFiscalYear?.fiscallyear?.startDate);
          const endDate = new Date(activeFiscalYear?.fiscallyear?.endDate);
          return (
            entity.reimbursement_typeId === reimbursementTypeId &&
            entityStartDate >= startDate &&
            entityStartDate <= endDate
          );
        })
        ?.reduce((sum, entity) => sum + (entity.amount || 0), 0);
    }

    let finalMaxAmount = (maxAmount || 0) - (claimedAmount || 0);
    if (isEdit && values?.approved_status === 1) {
      finalMaxAmount += values.amount;
    }
    return finalMaxAmount;
  };

  // ── Min date for date picker ──────────────────────────────────────────────
  const getMinDate = () => {
    const payrollStart = activeFiscalYear?.payrollMonth?.startDate
      ? new Date(activeFiscalYear.payrollMonth.startDate)
      : null;
    const joiningDate = employeeData?.dateOfJoining
      ? new Date(employeeData.dateOfJoining)
      : null;
    if (payrollStart && joiningDate) {
      return payrollStart > joiningDate ? payrollStart : joiningDate;
    }
    return payrollStart || joiningDate || null;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={ReimbursementClaimSchema}
      validate={(values) => {
        const errors = {};
        if (isFileReq && !values.file) {
          errors.file = VALIDATION_MESSAGES.required;
        }
        return errors;
      }}
      onSubmit={async (values, { resetForm }) => {
        enableLoading();

        if (!empAuthorityList || empAuthorityList.length === 0) {
          disbaleLoading();
          toast.error(
            isPolicyExists
              ? "No workflow authorities found for this employee. Cannot submit."
              : "Workflow policy does not exist for this employee. Cannot submit.",
            { position: "top-right", autoClose: 5000 }
          );
          return;
        }

        let filePath = values.file;

        if (values.file instanceof File) {
          try {
            const formData = new FormData();
            formData.append("file", values.file);

            const res = await uploadImage(formData);
            console.log("Upload response:", res);

            const rawPath =
              res?.data?.filePath ||
              res?.data?.data?.filePath ||
              res?.data?.path ||
              res?.data?.data?.path ||
              res?.data?.fileName ||
              "";

            filePath = rawPath.replace(/\\/g, "/").split("/").pop();

            if (!filePath) {
              console.error("No file path in upload response:", res);
              disbaleLoading();
              return;
            }
          } catch (err) {
            console.error("File upload failed:", err);
            disbaleLoading();
            return;
          }
        }

        const finalAmountLimit = calculateRemainingAmount(
          values?.reimbursement_typeId,
          values?.pay_in_payroll_forId,
          policies,
          values
        );

        const clearForm = () => {
          resetForm();
          if (inputFileRef?.current) inputFileRef.current.value = "";
        };

        const payload = {
          ...values,
          file: filePath,
          date: values.date ? formatDates(values.date, "dd-MMM-yyyy") : null,
          employeeId: values.employeeId?.value || values.employeeId || null,
          subsidiaryId: employeeData?.subsidiaryId || null,
          authortiesList: empAuthorityList,
        };

        console.log("Final payload:", payload);
        saveForm(payload, finalAmountLimit, isFileReq, clearForm);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleReset,
        setFieldTouched,
      }) => {
        const limit =
          policies.length > 0
            ? calculateRemainingAmount(
                values?.reimbursement_typeId,
                values?.pay_in_payroll_forId,
                policies,
                values
              )
            : null;

        return (
          <>
            {/* Workflow policy warnings */}
            {empAuthorityList && empAuthorityList?.length === 0 && !isPolicyExists ? (
              <span className="text-xs text-red-500 font-semibold">
                Designation workflow policy does not exist for this employee.
              </span>
            ) : (
              empAuthorityList &&
              empAuthorityList?.length === 0 &&
              isPolicyExists && (
                <span className="text-xs text-gray-500 font-semibold">
                  Workflow Policy is defined but there are no Workflow Authorities
                  as per the policy.
                </span>
              )
            )}

            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset
                disabled={
                  formUIProps?.employeeId?.level > 1 ||
                  empAuthorityList?.length === 0
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                  {/* Reimbursement Type */}
                  <div>
                    <SearchSelect
                      name="reimbursement_typeId"
                      label={
                        <span>
                          Reimbursement Type
                          <span className="text-rejected">*</span>
                        </span>
                      }
                      isDisabled={
                        isEdit ||
                        formUIProps?.employeeId?.level > 1 ||
                        empAuthorityList?.length === 0
                      }
                      onChange={(e) => {
                        setFieldValue("reimbursement_typeId", e?.value || null);
                        const policy = policies.find(
                          (item) =>
                            Number(item.reimbursement_typeId) === Number(e?.value)
                        );
                        setIsFileReq(!!policy?.attachment_required && !values.file);
                      }}
                      value={
                        dashboard?.allReimbursementTypeList?.find(
                          (option) => option.value === values.reimbursement_typeId
                        ) || null
                      }
                      options={filteredReimbursementOptions}
                      error={errors.reimbursement_typeId}
                      touched={touched.reimbursement_typeId}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label>
                      Date<span className="text-rejected">*</span>
                    </label>
                    <Field
                      name="date"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      maxDate={new Date()}
                      minDate={getMinDate()}
                      disabled={isEdit}
                      onChange={(e) => setFieldValue("date", e || null)}
                    />
                  </div>

                  {/* Reimbursement Month */}
                  <div>
                    <SearchSelect
                      name="pay_in_payroll_forId"
                      label={
                        <span>
                          Reimbursement Month
                          <span className="text-rejected">*</span>
                        </span>
                      }
                      isDisabled={
                        isEdit ||
                        formUIProps?.employeeId?.level > 1 ||
                        empAuthorityList?.length === 0
                      }
                      onChange={(e) =>
                        setFieldValue("pay_in_payroll_forId", e?.value || null)
                      }
                      value={
                        dashboard?.allPayrollMonthYearList?.find(
                          (option) => option.value === values.pay_in_payroll_forId
                        ) || null
                      }
                      options={
                        dashboard?.allPayrollMonthYearList?.filter(
                          (o) => o.isActive
                        ) || []
                      }
                      error={errors.pay_in_payroll_forId}
                      touched={touched.pay_in_payroll_forId}
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <AmountInput
                      field={{
                        name: "amount",
                        value: values?.amount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      max={limit !== null && limit > 0 ? limit : undefined}
                      onChange={(e) => {
                        const value = Number(e);
                        if (limit !== null && limit > 0 && value > limit) return;
                        setFieldValue("amount", value);
                      }}
                      disabled={isEdit || !values?.reimbursement_typeId}
                      placeholder="Enter Amount"
                      label={
                        <span>
                          Total Amount{" "}
                          {limit !== null && limit !== undefined
                            ? `(Amount Limit: ${limit.toLocaleString()})`
                            : ""}
                          <span className="text-rejected"> *</span>
                        </span>
                      }
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-4">
                    <Field
                      name="details"
                      component={TextArea}
                      placeholder="Enter claim details"
                      disabled={isEdit}
                      label={
                        <span>
                          Details<span className="text-rejected">*</span>
                        </span>
                      }
                    />
                  </div>

                  {/* File Upload */}
                  <div className="md:col-span-1">
                    <FileUpload
                      label={
                        <>
                          Attachment{" "}
                          {isFileReq && <span className="text-rejected">*</span>}
                        </>
                      }
                      id="reimbursement_file"
                      name="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFileRef}
                      isEdit={isEdit}
                      fileName={
                        values?.file
                          ? values.file instanceof File
                            ? values.file.name
                            : String(values.file).split("/").pop()
                          : ""
                      }
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file || null);
                        setFieldTouched("file", true);
                        if (file) setIsFileReq(false);
                      }}
                    />
                    {errors.file && touched.file && (
                      <div className="text-danger text-xs mt-1">{errors.file}</div>
                    )}
                  </div>

                </div>
              </fieldset>
            </Form>

            <Modal.Footer>
              <button
                type="button"
                onClick={() => {
                  setIds("");
                  handleReset();
                  if (inputFileRef?.current) inputFileRef.current.value = "";
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>

              {!isEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setFieldTouched("file", true);
                    handleSubmit();
                  }}
                  className="btn btn-primary btn-elevate"
                  disabled={
                    loading ||
                    formUIProps?.employeeId?.level > 1 ||
                    empAuthorityList?.length === 0
                  }
                >
                  Submit Request
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        );
      }}
    </Formik>
  );
}