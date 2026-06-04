import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  VALIDATION_MESSAGES,
  WEEK_DAY_STRING,
} from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { CirclePlus, Trash2 } from "lucide-react";
import {
  fetchAllEmployeeShifts,
  fetchAllRosterPattern,
} from "../../../../../../_metronic/redux/dashboardActions";
import { toast } from "react-toastify";
import { getEmployeeAuthorties } from "../../../_redux/redux-Crud";
import { getPayrollMonth } from "../../../_redux/redux-Actions";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog";

export function RosterRequestFormEditForm({
  saveForm,
  user,
  enableLoading,
  loading,
  disbaleLoading,
  setIds,
  isEdit,
  employeeId,
}) {
  const dispatch = useDispatch();

  // Local authority state
  const [empAuthorityList, setEmpAuthorityList] = useState([]);
  const [isPolicyExists, setIsPolicyExists] = useState(false);
  const { confirm, ConfirmationComponent } = useConfirmationDialog();
  
  const allEmployeeShifts = useSelector(
    (s) => s?.dashboard?.allEmployeeShifts || [],
  );
  const allRosterPatternList = useSelector(
    (s) => s?.dashboard?.allRosterPatternList || [],
  );

  //Payroll month from Redux
  const payrollData = useSelector(
    (state) => state?.attendance_roster_request?.payrollData || null,
  );

  const { employeeList } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList || [],
    }),
    shallowEqual,
  );

  const hasSubordinates = employeeList.some((e) => e.level > 0);
  const selfEmployee = employeeList.find((e) => e.level === 0);

  //Fetch shifts & patterns
  useEffect(() => {
    if (!allEmployeeShifts.length)
      dispatch(fetchAllEmployeeShifts("allEmployeeShifts"));
    if (!allRosterPatternList.length)
      dispatch(fetchAllRosterPattern("allRosterPatternList"));
  }, [dispatch]);

  //Fetch workflow authorities
  useEffect(() => {
    if (!employeeId) return;
    getEmployeeAuthorties(employeeId, "637")
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
  }, [employeeId]);

  const subsidiaryId = useSelector(
    (state) => state?.auth?.user?.EmployeeMapping?.subsidiaryId || null,
  );

  useEffect(() => {
    if (!subsidiaryId) return;
    dispatch(getPayrollMonth(subsidiaryId));
  }, [subsidiaryId, dispatch]);

  const RosterRequestSchema = useMemo(
    () =>
      Yup.object().shape({
        from: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .test(
            "min-payroll-date",
            payrollData?.startDate
              ? `Date cannot be before ${formatDates(
                  payrollData.startDate,
                  "dd-MMM-yyyy",
                )}`
              : "Invalid date",
            function(value) {
              if (!payrollData?.startDate || !value) return true;
              return new Date(value) >= new Date(payrollData.startDate);
            },
          ),
        to: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("from"), "To date cannot be before From date"),
        shiftId: Yup.string()
          .nullable()
          .when("isEnable_roster_via_shift", {
            is: true,
            then: Yup.string().required(VALIDATION_MESSAGES.required),
            otherwise: Yup.string().notRequired(),
          }),
        patternId: Yup.string().when("isEnable_roster_via_pattern", {
          is: true,
          then: Yup.string().required(VALIDATION_MESSAGES.required),
          otherwise: Yup.string().notRequired(),
        }),
        request_remarks: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .min(1, VALIDATION_MESSAGES.required),
        list: Yup.array().of(
          Yup.object().shape({
            employeeId: Yup.number()
              .required(VALIDATION_MESSAGES.required)
              .nullable(),
          }),
        ),
      }),
    [payrollData],
  );

  const checkPayrollMonth = (values) => {
    return (
      payrollData?.startDate &&
      values.from &&
      new Date(payrollData.startDate).getTime() >
        new Date(values.from).getTime()
    );
  };

  const weekDayOptions = [
    { label: "N/A", value: null },
    ...Object.keys(WEEK_DAY_STRING).map((key) => ({
      label: WEEK_DAY_STRING[key],
      value: WEEK_DAY_STRING[key],
    })),
  ];

  const clearFields = (fields, setFieldValue) =>
    fields.forEach((f) => setFieldValue(f, ""));

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...user,
        list: user?.list?.length
          ? user.list
          : [{ employeeId: employeeId || "" }],
      }}
      validationSchema={RosterRequestSchema}
      onSubmit={async (values, { resetForm }) => {
        
        const result = await confirm(
          "Confirm Submission",
          "Are you sure you want to submit this request?",
          "No",
          "Yes",
        );
        if (!result) return;
        enableLoading();

        //Guard: no authorities ──
        // if (!empAuthorityList || empAuthorityList.length === 0) {
        //   disbaleLoading();
        //   toast.error(
        //     isPolicyExists
        //       ? "No workflow authorities found for this employee. Cannot submit."
        //       : "Workflow policy does not exist for this employee. Cannot submit.",
        //     { position: "top-right", autoClose: 5000 },
        //   );
        //   return;
        // }

        const employeeListPayload = hasSubordinates
          ? (values.list || [])
              .filter((e) => e.employeeId)
              .map((e) => ({ employeeId: e.employeeId }))
          : [{ employeeId: selfEmployee?.value }];

        if (!employeeListPayload.length) {
          disbaleLoading();
          toast.error("At least one employee must be selected.", {
            position: "top-right",
            autoClose: 4000,
          });
          return;
        }
        const payload = {
          from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
          to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
          shiftId: values.isEnable_roster_via_shift ? values.shiftId : null,
          patternId: values.isEnable_roster_via_pattern
            ? values.patternId
            : null,
          offDay_1: values.offDay_1 || null,
          offDay_2: values.offDay_2 || null,
          isEnable_roster_via_shift: !!values.isEnable_roster_via_shift,
          isEnable_roster_via_pattern: !!values.isEnable_roster_via_pattern,
          request_remarks: values.request_remarks || "",
          list: employeeListPayload,
          authortiesList: empAuthorityList.map((e) => ({
            Id: e.Id,
            level: e.level,
            isDeligation: e.isDeligation || false,
            deligationId: e.deligationId || null,
          })),
        };

        saveForm(payload, resetForm);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleReset,
        handleBlur,
        handleChange,
      }) => (
        <>
        <ConfirmationComponent />
          {/* ── Workflow authority warnings ── */}
          {empAuthorityList.length === 0 && !isPolicyExists ? (
            <span className="text-xs text-red-500 font-semibold">
              Designation workflow policy does not exist for this employee.
            </span>
          ) : (
            empAuthorityList.length === 0 &&
            isPolicyExists && (
              <span className="text-xs text-gray-500 font-semibold">
                Workflow Policy is defined but there are no Workflow Authorities
                as per the policy.
              </span>
            )
          )}

          <Form className="form form-label-right" onSubmit={handleSubmit}>
            <fieldset disabled={empAuthorityList.length === 0}>
              {/* ── ROW 1: From / To / Via Shift / Off Day 1 / Off Day 2 / Shift ── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-1 mt-2 items-start">
                {/* From */}
                <div className="md:col-span-2">
                  <Field
                    name="from"
                    component={DatePickerField}
                    dateFormat="dd-MMM-yyyy"
                    placeholder="From"
                    disabled={isEdit}
                    minDate={
                      payrollData?.startDate
                        ? new Date(payrollData.startDate)
                        : null
                    }
                    label={
                      <span>
                        From <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    onChange={(date) => setFieldValue("from", date)}
                  />
                </div>

                {/* To */}
                <div className="md:col-span-2">
                  <Field
                    name="to"
                    component={DatePickerField}
                    dateFormat="dd-MMM-yyyy"
                    placeholder="To"
                    disabled={isEdit}
                    minDate={
                      values.from
                        ? new Date(values.from)
                        : payrollData?.startDate
                        ? new Date(payrollData.startDate)
                        : null
                    }
                    label={
                      <span>
                        To <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    onChange={(date) => setFieldValue("to", date)}
                  />
                </div>
                {/* Remarks */}
                <div className="md:col-span-8">
                  <Field
                    name="request_remarks"
                    component={TextArea}
                    placeholder="Enter remarks"
                    disabled={isEdit}
                    rows={2}
                    label={
                      <span>
                        Remarks <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                  />
                  {/* {errors.request_remarks && touched.request_remarks && (
                    <CustomErrorLabel touched error={errors.request_remarks} />
                  )} */}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-2 mt-3">
                <div className="md:col-span-12 flex items-center">
                  <input
                    name="isEnable_roster_via_shift"
                    type="checkbox"
                    checked={!!values.isEnable_roster_via_shift}
                    disabled={isEdit}
                    onChange={(e) => {
                      clearFields(["patternId"], setFieldValue);
                      setFieldValue("isEnable_roster_via_pattern", false);
                      handleChange(e);
                      if (!e.target.checked) {
                        clearFields(
                          ["shiftId", "offDay_1", "offDay_2"],
                          setFieldValue,
                        );
                      }
                    }}
                  />
                  <label className="ml-2 mb-0 text-sm">Via Shift</label>
                </div>

                {/* Off Day 1 */}
                <div className="md:col-span-2">
                  <label className="text-sm">Off Day 1</label>
                  <select
                    className="form-control"
                    disabled={isEdit || !values.isEnable_roster_via_shift}
                    value={values.offDay_1 || ""}
                    onChange={(e) =>
                      setFieldValue("offDay_1", e.target.value || null)
                    }
                  >
                    {weekDayOptions.map((opt, i) => (
                      <option key={i} value={opt.value ?? ""}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Off Day 2 */}
                <div className="md:col-span-2">
                  <label className="text-sm">Off Day 2</label>
                  <select
                    className="form-control"
                    disabled={isEdit || !values.isEnable_roster_via_shift}
                    value={values.offDay_2 || ""}
                    onChange={(e) =>
                      setFieldValue("offDay_2", e.target.value || null)
                    }
                  >
                    {weekDayOptions.map((opt, i) => (
                      <option key={i} value={opt.value ?? ""}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shift */}
                <div className="md:col-span-2">
                  <SearchSelect
                    name="shiftId"
                    label={
                      <span>
                        Shift{" "}
                        {values.isEnable_roster_via_shift && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </span>
                    }
                    isDisabled={isEdit || !values.isEnable_roster_via_shift}
                    onChange={(e) => setFieldValue("shiftId", e?.value || null)}
                    value={
                      allEmployeeShifts.find(
                        (opt) => opt.value === values.shiftId,
                      ) || null
                    }
                    options={allEmployeeShifts}
                    error={errors.shiftId}
                    touched={touched.shiftId}
                  />
                </div>
              </div>

              {/* ── ROW 2: Via Pattern / Pattern / Remarks ── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-2 mt-3">
                {/* Via Pattern Checkbox */}
                <div className="md:col-span-12 flex items-center">
                  <input
                    name="isEnable_roster_via_pattern"
                    type="checkbox"
                    checked={!!values.isEnable_roster_via_pattern}
                    disabled={isEdit}
                    onChange={(e) => {
                      clearFields(
                        ["shiftId", "offDay_1", "offDay_2"],
                        setFieldValue,
                      );
                      setFieldValue("isEnable_roster_via_shift", false);
                      handleChange(e);
                      if (!e.target.checked) setFieldValue("patternId", "");
                    }}
                    onBlur={handleBlur}
                  />
                  <label className="ml-2 mb-0 text-sm">Via Pattern</label>
                </div>

                {/* Pattern Dropdown */}
                <div className="md:col-span-2">
                  <SearchSelect
                    name="patternId"
                    label={
                      <span>
                        Pattern{" "}
                        {values.isEnable_roster_via_pattern && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </span>
                    }
                    isDisabled={isEdit || !values.isEnable_roster_via_pattern}
                    onChange={(e) =>
                      setFieldValue("patternId", e?.value || null)
                    }
                    value={
                      allRosterPatternList.find(
                        (opt) => opt.value === values.patternId,
                      ) || null
                    }
                    options={allRosterPatternList}
                    error={errors.patternId}
                    touched={touched.patternId}
                  />
                </div>
              </div>

              {/*EMPLOYEE SECTION*/}
              <hr className="mt-4" />

              {hasSubordinates ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="font-bold mb-0 text-primary">Employees</h6>
                    {!isEdit && (
                      <button
                        type="button"
                        className="btn btn-primary btn-elevate"
                        onClick={() =>
                          setFieldValue("list", [
                            ...(values.list || []),
                            { employeeId: "" },
                          ])
                        }
                      >
                        <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                        Add
                      </button>
                    )}
                  </div>

                  <div className="w-full overflow-x-auto">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <thead>
                          <tr className="custom-table-header">
                            <td className="w-80">Employee</td>
                            <td className="text-right">Action</td>
                          </tr>
                        </thead>
                        <tbody>
                          {(values.list || [{ employeeId: "" }]).map(
                            (row, index) => (
                              <tr key={index}>
                                <td>
                                  <SearchSelect
                                    name={`list[${index}].employeeId`}
                                    isDisabled={isEdit}
                                    onChange={(e) => {
                                      const val =
                                        e?.label === "Select"
                                          ? ""
                                          : Number(e?.value);
                                      const updatedList = [
                                        ...(values.list || []),
                                      ];
                                      updatedList[index] = {
                                        employeeId: val,
                                      };
                                      setFieldValue("list", updatedList);
                                    }}
                                    value={
                                      employeeList.find(
                                        (o) => o.value === row.employeeId,
                                      ) || null
                                    }
                                    options={employeeList.map((emp) => ({
                                      ...emp,
                                      isDisabled: (values.list || []).some(
                                        (row, i) =>
                                          i !== index &&
                                          Number(row.employeeId) ===
                                            Number(emp.value),
                                      ),
                                    }))}
                                    // error={errors.list?.[index]?.employeeId}
                                    // touched={touched.list?.[index]?.employeeId}
                                  />
                                  {errors.list?.[index]?.employeeId &&
                                    touched.list?.[index]?.employeeId && (
                                      <CustomErrorLabel
                                        touched
                                        error={errors.list[index].employeeId}
                                      />
                                    )}
                                </td>
                                <td className="text-right">
                                  <button
                                    disabled={isEdit}
                                    className="border-none bg-transparent"
                                    type="button"
                                    onClick={() => {
                                      const updatedList = (
                                        values.list || []
                                      ).filter((_, i) => i !== index);
                                      setFieldValue("list", updatedList);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                  </button>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-3 gap-y-1 mt-2">
                  <div>
                    <label className="font-size-sm font-weight-bold">
                      Employee
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={selfEmployee?.label || ""}
                    />
                  </div>
                </div>
              )}
            </fieldset>
          </Form>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => {
                setIds("");
                handleReset();
              }}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>

            {!checkPayrollMonth(values) && !isEdit && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={
                  loading ||
                  empAuthorityList.length === 0 ||
                  (!values.isEnable_roster_via_shift &&
                    !values.isEnable_roster_via_pattern)
                }
              >
                Submit Request
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white" />
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
