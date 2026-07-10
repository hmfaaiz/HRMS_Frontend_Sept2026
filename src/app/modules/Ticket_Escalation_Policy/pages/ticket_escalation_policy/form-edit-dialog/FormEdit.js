import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { CirclePlus, Trash2 } from "lucide-react";

import { FetchAllFacilitatorTicketType } from "../../../../Dashboard/_redux/dashboardActions";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.mixed().required(VALIDATION_MESSAGES.required),
  ticketTypeId: Yup.mixed().required(VALIDATION_MESSAGES.required),
  rules: Yup.array()
    .of(
      Yup.object().shape({
        priorityLevelId: Yup.mixed().required(VALIDATION_MESSAGES.required),
        exceedDays: Yup.number()
          .typeError("Days must be a number")
          .required(VALIDATION_MESSAGES.required)
          .min(1, "Must be at least 1 day"),
        moveToEmployeeId: Yup.mixed().required(VALIDATION_MESSAGES.required),
      }),
    )
    .min(1, "At least one escalation rule is required"),
});

export function TicketEscalationPolicyEditForm({
  savePolicy,
  data = {},
  onHide,
  isUserForRead = false,
  loading = false,
}) {
  const dispatch = useDispatch();

  // entities added to pull already-saved policies for matching
  const { dashboard, user, entities } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      user: state.auth.user,
      entities: state.ticket_escalation_policy?.entities || [],
    }),
    shallowEqual,
  );

  const [isSaving, setIsSaving] = useState(false);
  // tracks whether current subsidiary+ticketType combo matches an existing saved policy
  const [existingPolicyId, setExistingPolicyId] = useState(data?.Id || null);

  useEffect(() => {
    dispatch(dashboardActions.fetchAllSubsidiaryData("allSubsidiaryData"));
    dispatch(FetchAllFacilitatorTicketType());
    dispatch(dashboardActions.fetchAllFormsMenu(546, "allPriorityLevels"));
  }, [dispatch]);

  //  FETCH EMPLOYEES FOR ALREADY-SELECTED SUBSIDIARY (edit/read mode)
  useEffect(() => {
    if (data?.subsidiaryId) {
      dispatch(
        dashboardActions.fetchAllActiveEmployeesBySubsidiary(data.subsidiaryId),
      );
    }
  }, [dispatch]);

  const subsidiaryOptions =
    dashboard?.allSubsidiaryData?.map((s) => ({
      value: s.id || s.value,
      label: s.name || s.label,
    })) || [];

  const ticketTypeOptions =
    dashboard?.allFacilitatorTicketType?.map((tt) => ({
      value: tt.id || tt.value,
      label: tt.name || tt.label,
    })) || [];

  const priorityOptions = dashboard?.allPriorityLevels || [];

  const employeeOptions =
    dashboard?.allEmployees?.map((emp) => ({
      value: emp.id ?? emp.value,
      label: emp.name ?? emp.label ?? emp.employeeName,
    })) || [];

  //  INITIAL VALUES
  const initialValues = {
    companyId: data.companyId || user?.companyId || null,
    subsidiaryId: data.subsidiaryId || user?.subsidiaryId || null,
    ticketTypeId: data.ticketTypeId || null,
    rules: data.Rules?.length
      ? data.Rules.map((r) => ({
          priorityLevelId: r.priorityLevelId ?? null,
          exceedDays: r.exceedDays ?? "",
          moveToEmployeeId: r.moveToEmployeeId ?? null,
        }))
      : [{ priorityLevelId: null, exceedDays: "", moveToEmployeeId: null }],
  };

  //  ADD / REMOVE ROW
  const addRule = (values, setFieldValue) => {
    setFieldValue("rules", [
      ...values.rules,
      { priorityLevelId: null, exceedDays: "", moveToEmployeeId: null },
    ]);
  };

  const removeRule = (index, values, setFieldValue) => {
    if (values.rules.length > 1) {
      const list = [...values.rules];
      list.splice(index, 1);
      setFieldValue("rules", list);
    }
  };

  // Checks if subsidiary+ticketType combo already has a saved policy, loads its rules if so
  const loadExistingPolicyIfAny = (
    subsidiaryId,
    ticketTypeId,
    setFieldValue,
  ) => {
    if (!subsidiaryId || !ticketTypeId) return;

    const matched = entities.find(
      (e) => e.subsidiaryId === subsidiaryId && e.ticketTypeId === ticketTypeId,
    );

    if (matched) {
      setExistingPolicyId(matched.Id);
      setFieldValue(
        "rules",
        matched.Rules?.length
          ? matched.Rules.map((r) => ({
              priorityLevelId: r.priorityLevelId ?? null,
              exceedDays: r.exceedDays ?? "",
              moveToEmployeeId: r.moveToEmployeeId ?? null,
            }))
          : [{ priorityLevelId: null, exceedDays: "", moveToEmployeeId: null }],
      );
    } else {
      setExistingPolicyId(null);
      setFieldValue("rules", [
        { priorityLevelId: null, exceedDays: "", moveToEmployeeId: null },
      ]);
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
            // if an existing policy was matched, pass its Id so backend updates instead of duplicating
            ...(existingPolicyId ? { Id: existingPolicyId } : {}),
            companyId: values.companyId,
            subsidiaryId: values.subsidiaryId,
            ticketTypeId: values.ticketTypeId,
            rules: values.rules,
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
        <Form className="form form-label-right">
          <fieldset disabled={isUserForRead}>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
              {/* Subsidiary */}
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
                    dispatch(
                      dashboardActions.fetchAllActiveEmployeesBySubsidiary(val),
                    );
                    loadExistingPolicyIfAny(
                      val,
                      values.ticketTypeId,
                      setFieldValue,
                    );
                  }}
                  error={errors.subsidiaryId}
                  touched={touched.subsidiaryId}
                />
              </div>

              {/* Ticket Type */}
              <div>
                <SearchSelect
                  name="ticketTypeId"
                  label={
                    <span>
                      Ticket Type <span className="text-red-500">*</span>
                    </span>
                  }
                  value={
                    ticketTypeOptions.find(
                      (t) => t.value === values.ticketTypeId,
                    ) || null
                  }
                  options={ticketTypeOptions}
                  isDisabled={isUserForRead}
                  onChange={(e) => {
                    const val = e?.value || null;
                    setFieldValue("ticketTypeId", val);
                    loadExistingPolicyIfAny(
                      values.subsidiaryId,
                      val,
                      setFieldValue,
                    );
                  }}
                  error={errors.ticketTypeId}
                  touched={touched.ticketTypeId}
                />
              </div>
            </div>
          </fieldset>

          {/*  Escalation Rules Table  */}
          <div className="w-full overflow-x-auto mt-8">
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-bold mb-0 text-primary">Escalation Rules</h6>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addRule(values, setFieldValue)}
                disabled={
                  isUserForRead ||
                  !values?.subsidiaryId ||
                  !values?.ticketTypeId
                }
              >
                <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </div>

            {typeof errors.rules === "string" && touched.rules && (
              <div className="alert alert-danger mb-3" role="alert">
                {errors.rules}
              </div>
            )}

            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th className="min-w-30"></th>
                      <th className="min-w-40">
                        Priority <span className="text-red-500">*</span>
                      </th>
                      <th className="min-w-20"></th>
                      <th style={{ width: "70px" }}>
                        Days <span className="text-red-500">*</span>
                      </th>
                      <th className="min-w-60"></th>
                      <th style={{ minWidth: "280px" }}>
                        Employee <span className="text-red-500">*</span>
                      </th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.rules.map((rule, index) => (
                      <tr key={index}>
                        <td className="font-semibold">If</td>

                        <td>
                          <SearchSelect
                            value={
                              priorityOptions.find(
                                (p) => p.value === rule.priorityLevelId,
                              ) || null
                            }
                            options={priorityOptions.filter(
                              (p) =>
                                p.value === rule.priorityLevelId || // keep this row's own selection visible
                                !values.rules.some(
                                  (row, rowIndex) =>
                                    rowIndex !== index &&
                                    row.priorityLevelId === p.value,
                                ),
                            )}
                            isDisabled={isUserForRead}
                            onChange={(e) => {
                              const list = [...values.rules];
                              list[index].priorityLevelId = e?.value || null;
                              setFieldValue("rules", list);
                            }}
                            error={errors.rules?.[index]?.priorityLevelId}
                            touched={touched.rules?.[index]?.priorityLevelId}
                          />
                        </td>
                        <td className="font-semibold">exceeds</td>

                        <td style={{ width: "70px" }}>
                          <input
                            type="number"
                            min="1"
                            className="form-control text-center"
                            value={rule.exceedDays}
                            disabled={isUserForRead}
                            onChange={(e) => {
                              const list = [...values.rules];
                              list[index].exceedDays = e.target.value;
                              setFieldValue("rules", list);
                            }}
                          />
                          {errors.rules?.[index]?.exceedDays &&
                            touched.rules?.[index]?.exceedDays && (
                              <div className="text-red-500 text-xs mt-1">
                                {errors.rules[index].exceedDays}
                              </div>
                            )}
                        </td>

                        <td className="font-semibold">
                          Days with no response then move the ticket to
                        </td>

                        <td style={{ minWidth: "280px" }}>
                          <SearchSelect
                            value={
                              employeeOptions.find(
                                (emp) => emp.value === rule.moveToEmployeeId,
                              ) || null
                            }
                            options={employeeOptions}
                            isDisabled={isUserForRead || !values?.subsidiaryId}
                            onChange={(e) => {
                              const list = [...values.rules];
                              list[index].moveToEmployeeId = e?.value || null;
                              setFieldValue("rules", list);
                            }}
                            error={errors.rules?.[index]?.moveToEmployeeId}
                            touched={touched.rules?.[index]?.moveToEmployeeId}
                          />
                        </td>

                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() =>
                              removeRule(index, values, setFieldValue)
                            }
                            className="border-none bg-transparent"
                            disabled={
                              isUserForRead || values.rules.length === 1
                            }
                            title={
                              values.rules.length === 1
                                ? "At least one rule is required"
                                : "Remove rule"
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

          {/*  Buttons  */}

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
