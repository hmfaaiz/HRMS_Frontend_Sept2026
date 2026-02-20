import React, { useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import {
  fetchAllSubsidiaryData,
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import SubsidiaryPayrollPatternListForm from "./SubsidiaryPayrollPatternListForm";

const checklistSchema = Yup.object().shape({
  subsidiaryId: Yup.string().required("Subsidiary is required"),
  payroll_groupId: Yup.mixed().test(
    "payroll-required",
    "Payroll Group is required",
    (value) => value !== "" && value !== undefined,
    // null is allowed — it means "All"
  ),
  list: Yup.array()
    .of(
      Yup.object().shape({
        categoryId: Yup.string().required("Category is required"),
        taskName: Yup.string().required("Task Name is required"),
        taskDescription: Yup.string().required("Task Description is required"),
        attachment: Yup.mixed(),
      }),
    )
    .min(1, "At least one task is required"),
});

export function SubsidiaryPayrollFormEditForm({
  saveForm,
  data,
  onHide,
  isDataForRead,
  loading,
}) {
  const dispatch = useDispatch();

  const { dashboard, payrollChecklist } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      payrollChecklist: state.subsidiary_wise_payroll_checklist,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaries"));
    dispatch(fetchAllFormsMenu(127, "allPayrolGroupList"));
    dispatch(fetchAllFormsMenu(550, "formsMenu"));
  }, [dispatch]);

  // Payroll groups per subsidiary map
  const payrollGroupsPerSubsidiary = useMemo(() => {
    const map = {};
    dashboard?.allPayrolGroupList?.forEach((pg) => {
      if (!map[pg.subsidiaryId]) map[pg.subsidiaryId] = [];
      map[pg.subsidiaryId].push(pg.value);
    });
    return map;
  }, [dashboard?.allPayrolGroupList]);

  //  excluding current record when editing
  const usedCombinations = useMemo(() => {
    if (!Array.isArray(payrollChecklist?.entities)) return [];
    return payrollChecklist.entities
      .filter((item) => {
        if (!data?.subsidiaryId || data?.payroll_groupId === undefined)
          return true;
        return !(
          String(item.subsidiaryId) === String(data.subsidiaryId) &&
          String(item.payroll_groupId) === String(data.payroll_groupId)
        );
      })
      .map((item) => `${item.subsidiaryId}_${item.payroll_groupId}`);
  }, [payrollChecklist?.entities, data]);

  const subsidiariesWithAll = useMemo(() => {
    const result = new Set();
    payrollChecklist?.entities?.forEach((item) => {
      if (
        data?.subsidiaryId &&
        String(item.subsidiaryId) === String(data.subsidiaryId) &&
        String(item.payroll_groupId) === String(data.payroll_groupId)
      )
        return;
      if (item.payroll_groupId === null || item.payroll_groupId === "null") {
        result.add(Number(item.subsidiaryId));
      }
    });
    return result;
  }, [payrollChecklist?.entities, data]);

  const fullyUsedSubsidiaries = useMemo(() => {
    const map = {};
    payrollChecklist?.entities?.forEach((item) => {
      if (
        data?.subsidiaryId &&
        String(item.subsidiaryId) === String(data.subsidiaryId) &&
        String(item.payroll_groupId) === String(data.payroll_groupId)
      )
        return;
      if (!map[item.subsidiaryId]) map[item.subsidiaryId] = new Set();
      map[item.subsidiaryId].add(item.payroll_groupId);
    });

    const result = new Set();
    Object.keys(map).forEach((subsId) => {
      const totalGroups = payrollGroupsPerSubsidiary[subsId]?.length || 0;
      const usedGroups = map[subsId];

      if (
        usedGroups.has(null) ||
        usedGroups.has("null") ||
        (totalGroups > 0 && usedGroups.size >= totalGroups)
      ) {
        result.add(Number(subsId));
      }
    });
    return result;
  }, [payrollChecklist?.entities, payrollGroupsPerSubsidiary, data]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        subsidiaryId: data?.subsidiaryId || "",
        payroll_groupId:
          data?.payroll_groupId !== undefined ? data.payroll_groupId : "",
        list: data?.list || [],
        dataIsExist: data?.dataIsExist || false,
      }}
      validationSchema={checklistSchema}
      onSubmit={saveForm}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {loading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isDataForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  {/* Subsidiary */}
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isDataForRead}
                      options={(dashboard?.allSubsidiaries || []).map(
                        (sub) => ({
                          ...sub,
                          isDisabled: fullyUsedSubsidiaries.has(sub.value),
                        }),
                      )}
                      value={
                        dashboard?.allSubsidiaries?.find(
                          (o) =>
                            String(o.value) === String(values.subsidiaryId),
                        ) || null
                      }
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e?.value || "");
                        setFieldValue("payroll_groupId", "");
                        setFieldValue("list", []);
                        setFieldValue("dataIsExist", false);
                      }}
                    />
                    {errors.subsidiaryId && touched.subsidiaryId && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.9em", marginTop: 4 }}
                      >
                        {errors.subsidiaryId}
                      </div>
                    )}
                  </div>

                  {/* Payroll Group */}
                  <div>
                    <SearchSelect
                      name="payroll_groupId"
                      label={
                        <span>
                          Payroll Group<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isDataForRead || !values.subsidiaryId}
                      options={[
                        {
                          value: null,
                          label: "All",
                          isDisabled:
                            subsidiariesWithAll.has(
                              Number(values.subsidiaryId),
                            ) ||
                            usedCombinations.some((combo) =>
                              combo.startsWith(`${values.subsidiaryId}_`),
                            ),
                        },
                        ...(dashboard?.allPayrolGroupList || []).map((pg) => ({
                          ...pg,
                          isDisabled:
                            subsidiariesWithAll.has(
                              Number(values.subsidiaryId),
                            ) ||
                            usedCombinations.includes(
                              `${values.subsidiaryId}_${pg.value}`,
                            ),
                        })),
                      ]}
                      value={
                        values.payroll_groupId === null
                          ? { value: null, label: "All" } 
                          : values.payroll_groupId === ""
                          ? null 
                          : dashboard?.allPayrolGroupList?.find(
                              (o) =>
                                String(o.value) ===
                                String(values.payroll_groupId),
                            ) || null
                      }
                      onChange={(e) => {
                        const selectedId = e?.value ?? null;
                        setFieldValue("payroll_groupId", selectedId);
                        setFieldValue("list", []);
                        const combo = `${values.subsidiaryId}_${selectedId}`;
                        setFieldValue(
                          "dataIsExist",
                          usedCombinations.includes(combo),
                        );
                      }}
                    />
                    {errors.payroll_groupId && touched.payroll_groupId && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.9em", marginTop: 4 }}
                      >
                        {errors.payroll_groupId}
                      </div>
                    )}
                  </div>
                </div>

                <hr />

                <SubsidiaryPayrollPatternListForm
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  isDataForRead={isDataForRead}
                />
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {!isDataForRead ? (
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

            {!isDataForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={
                  !values.subsidiaryId ||
                  values.payroll_groupId === "" ||
                    values.payroll_groupId === undefined ||
                  !values.list?.length
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
