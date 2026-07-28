import React, { useEffect, useState, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/redux-Actions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CirclePlus, CircleMinus, Trash2 } from "lucide-react";

const PAYMENT_CRITERIA_PARENT_FORM_ID = 561;

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.mixed().required(VALIDATION_MESSAGES.required),
  bonusTypeId: Yup.number()
    .typeError(VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  gradeId: Yup.array()
    .min(1, VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  employeeTypeId: Yup.array()
    .min(1, VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  sumOfEarningsComponents: Yup.array()
    .min(1, VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  considerConfirmationDate: Yup.boolean(),
  confirmationDateBefore: Yup.date()
    .nullable()
    .when("considerConfirmationDate", {
      is: true,
      then: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
    }),
  considerJoiningDate: Yup.boolean(),
  joiningDateBefore: Yup.date()
    .nullable()
    .when("considerJoiningDate", {
      is: true,
      then: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
    }),
  salaryMonthOption: Yup.mixed().required(VALIDATION_MESSAGES.required),
  specificSalaryMonth: Yup.mixed().required(VALIDATION_MESSAGES.required),
  divisor: Yup.number()
    .typeError("Must be a number")
    .required(VALIDATION_MESSAGES.required)
    .min(1, "Must be at least 1"),
  multiplier: Yup.number()
    .typeError("Must be a number")
    .required(VALIDATION_MESSAGES.required)
    .min(1, "Must be at least 1"),
  serviceSlabs: Yup.array()
    .of(
      Yup.object().shape({
        serviceDurationFrom: Yup.number()
          .typeError("Must be a number")
          .required(VALIDATION_MESSAGES.required)
          .min(0, "Must be between 0 and 99.99")
          .max(99.99, "Must be between 0 and 99.99"),
        serviceDurationTo: Yup.number()
          .typeError("Must be a number")
          .required(VALIDATION_MESSAGES.required)
          .min(0, "Must be between 0 and 99.99")
          .max(99.99, "Must be between 0 and 99.99")
          .moreThan(
            Yup.ref("serviceDurationFrom"),
            "'To' must be greater than 'From'",
          ),
        paymentCriteriaId: Yup.mixed().required(VALIDATION_MESSAGES.required),
      }),
    )
    .min(1, "At least one service duration slab is required")
    .test(
      "no-overlapping-slabs",
      "Service duration ranges cannot overlap",
      function (slabs) {
        if (!slabs || slabs.length < 2) return true;

        const round2 = (n) => Math.round(n * 100) / 100;

        const parsed = slabs
          .map((s, idx) => ({
            idx,
            from: round2(Number(s.serviceDurationFrom)),
            to: round2(Number(s.serviceDurationTo)),
          }))
          .filter((s) => !Number.isNaN(s.from) && !Number.isNaN(s.to));

        const overlappingIdx = new Set();
        for (let i = 0; i < parsed.length; i++) {
          for (let j = i + 1; j < parsed.length; j++) {
            const a = parsed[i];
            const b = parsed[j];
            const conflict =
              Math.max(a.from, b.from) <= Math.min(a.to, b.to);
            if (conflict) {
              overlappingIdx.add(b.idx); // flag only the later row
            }
          }
        }

        if (overlappingIdx.size === 0) return true;

        const errors = Array.from(overlappingIdx).map((idx) =>
          this.createError({
            path: `${this.path}[${idx}].serviceDurationFrom`,
            message: "This range overlaps or touches another slab's boundary",
          }),
        );

        throw new Yup.ValidationError(errors);
      },
    ),
});

export function FormEditForm({
  savePolicy,
  data = {},
  onHide,
  isUserForRead = false,
  loading = false,
}) {
  const dispatch = useDispatch();

  const { dashboard, user } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.bonus_policy,
    }),
    shallowEqual,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [showProrationFields, setShowProrationFields] = useState(
    (data?.divisor && data.divisor !== 1) ||
      (data?.multiplier && data.multiplier !== 1),
  );

  // Keep this in sync if `data` loads/changes after mount (e.g. async fetch, or reused modal)
  useEffect(() => {
    if (
      (data?.divisor && data.divisor !== 1) ||
      (data?.multiplier && data.multiplier !== 1)
    ) {
      setShowProrationFields(true);
    }
  }, [data]);

  useEffect(() => {
    dispatch(dashboardActions.fetchAllSubsidiaryData("allSubsidiaryData"));
    dispatch(dashboardActions.fetchAllFormsMenu(143, "allEmployeeGradeList"));
    dispatch(dashboardActions.fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
    dispatch(dashboardActions.fetchAllFormsMenu(560, "allBonusTypeList"));
    dispatch(
      dashboardActions.fetchAllFormsMenu(
        PAYMENT_CRITERIA_PARENT_FORM_ID,
        "allPaymentCriteriaList",
      ),
    );
  }, [dispatch]);

  useEffect(() => {
    if (data?.subsidiaryId) {
      dispatch(actions.fetchActiveEarningsBySubsidiary(data.subsidiaryId));
      dispatch(
        dashboardActions.fetchAllPayrollMonthYearList(
          { subsidiaryId: data.subsidiaryId, employeeId: null },
          "allPayrollMonthYearList",
        ),
      );
    }
  }, [dispatch, data?.subsidiaryId]);

  const subsidiaryOptions = dashboard?.allSubsidiaryData || [];
  const bonusTypeOptions = dashboard?.allBonusTypeList || [];
  const gradeOptions = dashboard?.allEmployeeGradeList || [];
  const employeeTypeOptions = dashboard?.allEmpTypeChildMenus || [];
  const paymentCriteriaOptions = dashboard?.allPaymentCriteriaList || [];
  const salaryComponentOptions = currentState?.allEarnings || [];
  const payrollMonthOptions = dashboard?.allPayrollMonthYearList || [];
  const activePayrollMonth = payrollMonthOptions.find((m) => m.isActive);

  const salaryMonthDropdownOptions = useMemo(() => {
    const opts = [];
    if (activePayrollMonth) {
      opts.push({
        value: "CURRENT_SALARY",
        // label: `Current Salary (${activePayrollMonth.label})`,
        label: `Current Salary`,
      });
    }
    payrollMonthOptions
      .filter((m) => m.value !== activePayrollMonth?.value)
      .forEach((m) => {
        opts.push({ value: String(m.value), label: m.label });
      });
    return opts;
  }, [payrollMonthOptions, activePayrollMonth]);

  const toArray = (v) => {
    if (Array.isArray(v)) return v.map(String);
    if (v === null || v === undefined || v === "") return [];
    return [String(v)];
  };

  const initialValues = {
    Id: data?.Id || null,
    companyId: data.companyId || user?.companyId || null,
    subsidiaryId: data.subsidiaryId || null,
    bonusTypeId: Array.isArray(data.bonusTypeId)
      ? data.bonusTypeId[0] ?? null
      : data.bonusTypeId ?? null,
    gradeId: toArray(data.gradeId),
    employeeTypeId: toArray(data.employeeTypeId),
    sumOfEarningsComponents: (data.sumOfEarningsComponents || []).map(String),
    considerConfirmationDate: data.considerConfirmationDate || false,
    confirmationDateBefore: data.confirmationDateBefore || null,
    considerJoiningDate: data.considerJoiningDate || false,
    joiningDateBefore: data.joiningDateBefore || null,
    salaryMonthOption: data.salaryMonthOption || "SPECIFIC_MONTH",
    specificSalaryMonth: data.specificSalaryMonth || null,
    divisor: data.divisor ?? 1,
    multiplier: data.multiplier ?? 1,
    serviceSlabs: data.serviceSlabs?.length
      ? data.serviceSlabs.map((s) => ({ ...s }))
      : [
          {
            serviceDurationFrom: "",
            serviceDurationTo: "",
            paymentCriteriaId: null,
          },
        ],
  };

  const addSlabRow = (values, setFieldValue) => {
    setFieldValue("serviceSlabs", [
      ...values.serviceSlabs,
      {
        serviceDurationFrom: "",
        serviceDurationTo: "",
        paymentCriteriaId: null,
      },
    ]);
  };

  const removeSlabRow = (index, values, setFieldValue) => {
    if (values.serviceSlabs.length > 1) {
      const list = [...values.serviceSlabs];
      list.splice(index, 1);
      setFieldValue("serviceSlabs", list);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        if (isSaving) return;
        setIsSaving(true);
        try {
          await savePolicy({
            ...(values.Id ? { Id: values.Id } : {}),
            companyId: values.companyId,
            subsidiaryId: values.subsidiaryId,
            bonusTypeId: values.bonusTypeId,
            gradeId: values.gradeId,
            employeeTypeId: values.employeeTypeId,
            sumOfEarningsComponents: values.sumOfEarningsComponents,
            considerConfirmationDate: values.considerConfirmationDate,
            confirmationDateBefore: values.confirmationDateBefore,
            considerJoiningDate: values.considerJoiningDate,
            joiningDateBefore: values.joiningDateBefore,
            salaryMonthOption: values.salaryMonthOption,
            specificSalaryMonth: values.specificSalaryMonth,
            divisor: values.divisor,
            multiplier: values.multiplier,
            serviceSlabs: values.serviceSlabs.map((slab) => ({
              ...(slab.Id ? { Id: slab.Id } : {}),
              serviceDurationFrom: slab.serviceDurationFrom,
              serviceDurationTo: slab.serviceDurationTo,
              paymentCriteriaId: slab.paymentCriteriaId,
            })),
          });
          onHide();
        } catch (error) {
          console.error("Save error:", error);
        } finally {
          setIsSaving(false);
        }
      }}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <Form className="form form-label-right px-6 py-6">
          <fieldset disabled={isUserForRead}>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
              <div>
                <SearchSelect
                  name="subsidiaryId"
                  label={
                    <span>
                      Subsidiary <span className="text-red-500">*</span>
                    </span>
                  }
                  value={
                    subsidiaryOptions.find(
                      (s) => s.value === values.subsidiaryId,
                    ) || null
                  }
                  options={subsidiaryOptions}
                  isDisabled={isUserForRead}
                  onChange={(e) => {
                    const val = e?.value || null;
                    setFieldValue("subsidiaryId", val);
                    setFieldValue("sumOfEarningsComponents", []);
                    setFieldValue("specificSalaryMonth", null);
                    setFieldValue("salaryMonthOption", "SPECIFIC_MONTH");
                    if (val) {
                      dispatch(actions.fetchActiveEarningsBySubsidiary(val));
                      dispatch(
                        dashboardActions.fetchAllPayrollMonthYearList(
                          { subsidiaryId: val, employeeId: null },
                          "allPayrollMonthYearList",
                        ),
                      );
                    }
                  }}
                  error={errors.subsidiaryId}
                  touched={touched.subsidiaryId}
                />
              </div>

              <div>
                <SearchSelect
                  name="bonusTypeId"
                  label={
                    <span>
                      Bonus Type <span className="text-red-500">*</span>
                    </span>
                  }
                  value={
                    bonusTypeOptions.find(
                      (b) => String(b.value) === String(values.bonusTypeId),
                    ) || null
                  }
                  options={bonusTypeOptions}
                  isDisabled={isUserForRead}
                  onChange={(e) =>
                    setFieldValue("bonusTypeId", e?.value || null)
                  }
                  error={errors.bonusTypeId}
                  touched={touched.bonusTypeId}
                />
              </div>
            </div>

            <div className="mt-4">
              <h6 className="font-bold mb-3 text-primary">
                Bonus Eligibility Criteria
              </h6>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                <div>
                  <MultiSelect
                    name="gradeId"
                    label={
                      <span>
                        Grades <span className="text-red-500">*</span>
                      </span>
                    }
                    value={gradeOptions.filter((g) =>
                      values.gradeId?.map(String).includes(String(g.value)),
                    )}
                    options={gradeOptions}
                    isDisabled={isUserForRead}
                    onChange={(items = []) =>
                      setFieldValue(
                        "gradeId",
                        items.map((i) => i.value),
                      )
                    }
                  />
                  {errors.gradeId && touched.gradeId && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.gradeId}
                    </div>
                  )}
                </div>

                <div>
                  <MultiSelect
                    name="employeeTypeId"
                    label={
                      <span>
                        Employee Type <span className="text-red-500">*</span>
                      </span>
                    }
                    value={employeeTypeOptions.filter((e) =>
                      values.employeeTypeId
                        ?.map(String)
                        .includes(String(e.value)),
                    )}
                    options={employeeTypeOptions}
                    isDisabled={isUserForRead}
                    onChange={(items = []) =>
                      setFieldValue(
                        "employeeTypeId",
                        items.map((i) => i.value),
                      )
                    }
                  />
                  {errors.employeeTypeId && touched.employeeTypeId && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.employeeTypeId}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <MultiSelect
                    name="sumOfEarningsComponents"
                    label={
                      <span>
                        Sum of Earnings <span className="text-red-500">*</span>
                      </span>
                    }
                    isDisabled={isUserForRead || !values.subsidiaryId}
                    value={salaryComponentOptions.filter((c) =>
                      values.sumOfEarningsComponents
                        ?.map(String)
                        .includes(String(c.value)),
                    )}
                    options={salaryComponentOptions}
                    onChange={(items = []) =>
                      setFieldValue(
                        "sumOfEarningsComponents",
                        items.map((i) => i.value),
                      )
                    }
                  />
                  {errors.sumOfEarningsComponents &&
                    touched.sumOfEarningsComponents && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.sumOfEarningsComponents}
                      </div>
                    )}

                  {showProrationFields && (
                    <div className="mt-3" style={{ width: "180px" }}>
                      <label className="text-sm whitespace-nowrap block">
                        Multiply by the number of bonus-eligible days.{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="form-control form-control-sm"
                        disabled={isUserForRead}
                        value={values.multiplier}
                        onChange={(e) =>
                          setFieldValue("multiplier", e.target.value)
                        }
                        placeholder="Days"
                      />
                      {errors.multiplier && touched.multiplier && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.multiplier}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div
                    className="flex items-center whitespace-nowrap"
                    style={{ marginTop: "28px", flexShrink: 0 }}
                  >
                    {!showProrationFields ? (
                      <span
                        className="flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        onClick={() => setShowProrationFields(true)}
                      >
                        <CirclePlus className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm whitespace-nowrap">
                          Add Multiplier & Divisor
                        </span>
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        onClick={() => setShowProrationFields(false)}
                      >
                        <CircleMinus className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm whitespace-nowrap">
                          Hide Multiplier & Divisor
                        </span>
                      </span>
                    )}
                  </div>

                  {showProrationFields && (
                    <div className="mt-3" style={{ width: "180px" }}>
                      <label className="text-sm whitespace-nowrap block">
                        Divide by (No. of days to calculate per day bonus
                        amount) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="form-control form-control-sm"
                        disabled={isUserForRead}
                        value={values.divisor}
                        onChange={(e) =>
                          setFieldValue("divisor", e.target.value)
                        }
                        placeholder="Days"
                      />
                      {errors.divisor && touched.divisor && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.divisor}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!values.considerJoiningDate && (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mt-3">
                  <div className="col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={values.considerConfirmationDate}
                      disabled={isUserForRead}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue("considerConfirmationDate", checked);
                        if (!checked) {
                          setFieldValue("confirmationDateBefore", null);
                        }
                      }}
                    />
                    <label className="mb-0 text-sm ">
                      Give bonus to Employees whose 'Date of Confirmation'
                      is before
                    </label>
                  </div>
                  {values.considerConfirmationDate && (
                    <div>
                      <Field
                        name="confirmationDateBefore"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={
                          <span>
                            Date <span className="text-red-500">*</span>
                          </span>
                        }
                        disabled={isUserForRead}
                        onChange={(date) =>
                          setFieldValue("confirmationDateBefore", date)
                        }
                        autoComplete="off"
                      />
                    </div>
                  )}
                </div>
              )}

              {!values.considerConfirmationDate && (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 mt-3">
                  <div className="col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={values.considerJoiningDate}
                      disabled={isUserForRead}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue("considerJoiningDate", checked);
                        if (!checked) {
                          setFieldValue("joiningDateBefore", null);
                        }
                      }}
                    />
                    <label className="mb-0 text-sm">
                      Give bonus to Employees whose 'Date of Joining' is
                      before
                    </label>
                  </div>
                  {values.considerJoiningDate && (
                    <div>
                      <Field
                        name="joiningDateBefore"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={
                          <span>
                            Date <span className="text-red-500">*</span>
                          </span>
                        }
                        disabled={isUserForRead}
                        onChange={(date) =>
                          setFieldValue("joiningDateBefore", date)
                        }
                        autoComplete="off"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <h6 className="font-bold mb-3 text-primary">
                Bonus Payment Criteria
              </h6>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                <div>
                  <SearchSelect
                    name="specificSalaryMonth"
                    label={
                      <span className="whitespace-nowrap">
                        Salary to be considered for Bonus Calculation{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    }
                    value={
                      values.salaryMonthOption === "CURRENT_SALARY"
                        ? salaryMonthDropdownOptions.find(
                            (o) => o.value === "CURRENT_SALARY",
                          ) || null
                        : salaryMonthDropdownOptions.find(
                            (o) =>
                              o.value === String(values.specificSalaryMonth),
                          ) || null
                    }
                    options={salaryMonthDropdownOptions}
                    isDisabled={isUserForRead || !values.subsidiaryId}
                    onChange={(e) => {
                      if (!e) {
                        setFieldValue("specificSalaryMonth", null);
                        return;
                      }
                      if (e.value === "CURRENT_SALARY") {
                        setFieldValue("salaryMonthOption", "CURRENT_SALARY");
                        setFieldValue(
                          "specificSalaryMonth",
                          activePayrollMonth
                            ? String(activePayrollMonth.value)
                            : null,
                        );
                      } else {
                        setFieldValue("salaryMonthOption", "SPECIFIC_MONTH");
                        setFieldValue("specificSalaryMonth", e.value);
                      }
                    }}
                    error={errors.specificSalaryMonth}
                    touched={touched.specificSalaryMonth}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <div className="w-full overflow-x-auto mt-8">
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-bold mb-0 text-primary">
                Prorate Bonus by Service Duration
              </h6>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addSlabRow(values, setFieldValue)}
                disabled={isUserForRead}
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </div>

            {typeof errors.serviceSlabs === "string" && touched.serviceSlabs && (
              <div className="alert alert-danger mb-3" role="alert">
                {errors.serviceSlabs}
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th className="min-w-40">
                        Service Duration From{" "}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="min-w-40">
                        Service Duration To{" "}
                        <span className="text-red-500">*</span>
                      </th>
                      <th style={{ minWidth: "220px" }}>
                        Payment Criteria <span className="text-red-500">*</span>
                      </th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.serviceSlabs.map((slab, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="99.99"
                            className="form-control"
                            disabled={isUserForRead}
                            value={slab.serviceDurationFrom}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue(
                                "serviceSlabs",
                                values.serviceSlabs.map((s, i) =>
                                  i === index
                                    ? { ...s, serviceDurationFrom: value }
                                    : s,
                                ),
                              );
                            }}
                          />
                          {errors.serviceSlabs?.[index]?.serviceDurationFrom &&
                            touched.serviceSlabs?.[index]
                              ?.serviceDurationFrom && (
                              <div className="text-red-500 text-xs mt-1">
                                {errors.serviceSlabs[index].serviceDurationFrom}
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="99.99"
                            className="form-control"
                            disabled={isUserForRead}
                            value={slab.serviceDurationTo}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFieldValue(
                                "serviceSlabs",
                                values.serviceSlabs.map((s, i) =>
                                  i === index
                                    ? { ...s, serviceDurationTo: value }
                                    : s,
                                ),
                              );
                            }}
                          />
                          {errors.serviceSlabs?.[index]?.serviceDurationTo &&
                            touched.serviceSlabs?.[index]
                              ?.serviceDurationTo && (
                              <div className="text-red-500 text-xs mt-1">
                                {errors.serviceSlabs[index].serviceDurationTo}
                              </div>
                            )}
                        </td>
                        <td style={{ minWidth: "220px" }}>
                          <SearchSelect
                            value={
                              paymentCriteriaOptions.find(
                                (p) =>
                                  String(p.value) ===
                                  String(slab.paymentCriteriaId),
                              ) || null
                            }
                            options={paymentCriteriaOptions}
                            isOptionDisabled={(option) =>
                              values.serviceSlabs.some(
                                (s, i) =>
                                  i !== index &&
                                  String(s.paymentCriteriaId) ===
                                    String(option.value),
                              )
                            }
                            isDisabled={isUserForRead}
                            onChange={(e) => {
                              const value = e?.value || null;
                              setFieldValue(
                                "serviceSlabs",
                                values.serviceSlabs.map((s, i) =>
                                  i === index
                                    ? { ...s, paymentCriteriaId: value }
                                    : s,
                                ),
                              );
                            }}
                          />
                          {errors.serviceSlabs?.[index]?.paymentCriteriaId &&
                            touched.serviceSlabs?.[index]
                              ?.paymentCriteriaId && (
                              <div className="text-red-500 text-xs mt-1">
                                {errors.serviceSlabs[index].paymentCriteriaId}
                              </div>
                            )}
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() =>
                              removeSlabRow(index, values, setFieldValue)
                            }
                            className="border-none bg-transparent"
                            disabled={
                              isUserForRead || values.serviceSlabs.length === 1
                            }
                            title={
                              values.serviceSlabs.length === 1
                                ? "At least one slab is required"
                                : "Remove slab"
                            }
                          >
                            <Trash2 className="w-4 h-4 text-black" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className={isUserForRead ? "btn btn-primary" : "btn btn-light"}
              onClick={onHide}
              disabled={isSaving}
            >
              {isUserForRead ? "OK" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading || isSaving}
              >
                Save{" "}
                {(loading || isSaving) && (
                  <span className="spinner spinner-white ml-2"></span>
                )}
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
