import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllPayrollMonthYearList,
  fetchAllSubsidiaryData,
  fetchPayrollConfigApproverPermission,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import * as actions from "../../../_redux/redux-Actions";
import {
  checkBonus_EmployeesByIds,
  fetchBonusProcess,
} from "../../../_redux/redux-Actions";
import { Eye, XCircle } from "lucide-react";
import { BonusPolicyPanel } from "./BonusPolicyPanel";
import { formatNumberWithCommas } from "../../../../../utils/common";
import { useFormUIContext } from "../FormUIContext";

const bonus_processEditSchema = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  payroll_groupId: Yup.string().nullable(),
  bonusTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  payroll_monthId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
  setIds,
  formUIProps, // kept for backwards compat with any other prop it carries, but NOT used for queryParams
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const formUIContext = useFormUIContext();
  const [isAfterResult, setIsAfterResult] = useState(false);
  const [panelMode, setPanelMode] = useState(false);
  const [
    payrollConfigApproverPermission,
    setPayrollConfigApproverPermission,
  ] = useState(false);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(127, "allPayrolGroupList"));
      dispatch(fetchAllFormsMenu(560, "allBonusTypeList"));
      dispatch(
        fetchPayrollConfigApproverPermission(
          "allPayrollConfigApproverPermissionList",
        ),
      );
    }
  }, [dispatch, user.Id]);

  const { currentState, auth } = useSelector((state) => {
    return {
      currentState: state.bonus_process,
      auth: state.auth.user,
    };
  }, shallowEqual);

  const {
    checkBonus_EmployeesExist,
    resultAfterBonusProcess,
    bonus_policy_details,
  } = currentState;

  const getPayrollMonths = (subsidiaryId) => {
    dispatch(
      fetchAllPayrollMonthYearList(
        { subsidiaryId, employeeId: null },
        "allPayrollMonthYearList",
      ),
    );
  };

  const fetchBonusPolicy = async (subsidiaryId, bonusTypeId) => {
    if (subsidiaryId && bonusTypeId) {
      await dispatch(
        actions.fetchBonusPolicyDetail({ subsidiaryId, bonusTypeId }),
      );
    }
  };

  const checkBonus_Employees = async (
    subsidiaryId,
    payroll_groupId,
    bonusTypeId,
    payroll_monthId,
    revert = false,
    finalize = false,
  ) => {
    if (subsidiaryId && bonusTypeId && payroll_monthId) {
      let data = {
        SubsidiaryId: subsidiaryId,
        PayrollGroupId: payroll_groupId,
        BonusTypeId: bonusTypeId,
        MonthId: payroll_monthId,
        revert,
        finalize,
      };
      await dispatch(checkBonus_EmployeesByIds({ data }));
      if (revert || finalize) {
        await dispatch(
          fetchBonusProcess({
            queryParams: formUIContext.queryParams,
            setIds: formUIContext.setIds,
          }),
        );
      }
    }
  };

  const checkPermission = (subsidiaryId) => {
    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      (entity) => entity.subsidiaryId === Number(subsidiaryId),
    );
    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      const roleId = String(auth?.roleId).trim();
      const payrollApproverIds = permission?.payrollApproverId?.map((id) =>
        String(id).trim(),
      );
      setPayrollConfigApproverPermission(payrollApproverIds?.includes(roleId));
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={bonus_processEditSchema}
      onSubmit={(values, { resetForm }) => {
        enableLoading();

        saveForm(
          {
            subsidiaryId: values.subsidiaryId,
            bonusTypeId: values.bonusTypeId,
            payroll_groupId: values.payroll_groupId,
            payroll_monthId: values.payroll_monthId,
          },
          () => resetForm(),
        );
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        handleReset,
        setFieldValue,
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-3 mt-2">
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        const selectedSubsidiaryId = e.value || null;

                        dispatch(actions.clearReduxData());
                        setFieldValue("subsidiaryId", selectedSubsidiaryId);
                        setFieldValue("payroll_monthId", null);
                        getPayrollMonths(selectedSubsidiaryId);
                        checkBonus_Employees(
                          selectedSubsidiaryId,
                          values.payroll_groupId,
                          values.bonusTypeId,
                          values.payroll_monthId,
                        );
                        setIsAfterResult(false);
                        setPanelMode(false);
                        checkPermission(selectedSubsidiaryId);

                        formUIContext.setQueryParams({
                          ...formUIContext.queryParams,
                          pageNumber: 1,
                          filter: {
                            ...formUIContext.queryParams.filter,
                            subsidiaryId: selectedSubsidiaryId,
                            payrollGroupId: values.payroll_groupId || null,
                            bonusTypeId: values.bonusTypeId || null,
                            payrollMonthId: null, // reset, depends on subsidiary
                          },
                        });
                      }}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (o) => o.value === values.subsidiaryId,
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    />
                  </div>

                  <div>
                    <SearchSelect
                      name="payroll_groupId"
                      label={<span>Payroll Group</span>}
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        const selectedPayrollGroupId = e.value || null;

                        setFieldValue("payroll_groupId", selectedPayrollGroupId);
                        checkBonus_Employees(
                          values.subsidiaryId,
                          selectedPayrollGroupId,
                          values.bonusTypeId,
                          values.payroll_monthId,
                        );
                        setIsAfterResult(false);

                        formUIContext.setQueryParams({
                          ...formUIContext.queryParams,
                          pageNumber: 1,
                          filter: {
                            ...formUIContext.queryParams.filter,
                            subsidiaryId: values.subsidiaryId || null,
                            payrollGroupId: selectedPayrollGroupId,
                            bonusTypeId: values.bonusTypeId || null,
                            payrollMonthId: values.payroll_monthId || null,
                          },
                        });
                      }}
                      value={
                        values?.payroll_groupId == null
                          ? { value: null, label: "All" }
                          : dashboard?.allPayrolGroupList?.find(
                              (o) => o.value === values.payroll_groupId,
                            ) || null
                      }
                      options={[
                        { value: null, label: "All" },
                        ...(dashboard?.allPayrolGroupList || []),
                      ]}
                      error={errors.payroll_groupId}
                      touched={touched.payroll_groupId}
                    />
                  </div>

                  <div className="flex items-end gap-1 justify-end">
                    <div className="w-full">
                      <SearchSelect
                        name="bonusTypeId"
                        label={
                          <span>
                            Bonus Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead || isAfterResult}
                        onChange={(e) => {
                          const selectedBonusTypeId = e.value || null;

                          setFieldValue("bonusTypeId", selectedBonusTypeId);
                          setPanelMode(false);

                          fetchBonusPolicy(
                            values.subsidiaryId,
                            selectedBonusTypeId,
                          );

                          checkBonus_Employees(
                            values.subsidiaryId,
                            values.payroll_groupId,
                            selectedBonusTypeId,
                            values.payroll_monthId,
                          );

                          setIsAfterResult(false);

                          formUIContext.setQueryParams({
                            ...formUIContext.queryParams,
                            pageNumber: 1,
                            filter: {
                              ...formUIContext.queryParams.filter,
                              subsidiaryId: values.subsidiaryId || null,
                              payrollGroupId: values.payroll_groupId || null,
                              bonusTypeId: selectedBonusTypeId,
                              payrollMonthId: values.payroll_monthId || null,
                            },
                          });
                        }}
                        value={
                          dashboard?.allBonusTypeList?.find(
                            (o) => o.value === values.bonusTypeId,
                          ) || null
                        }
                        options={dashboard?.allBonusTypeList || []}
                        error={errors.bonusTypeId}
                        touched={touched.bonusTypeId}
                      />
                    </div>

                    <div className="flex items-end justify-end">
                      {panelMode ? (
                        <button
                          type="button"
                          className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                          onClick={() => setPanelMode(false)}
                        >
                          <XCircle className="w-3 h-3 text-black" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          disabled={!values.subsidiaryId || !values.bonusTypeId}
                          onClick={() => {
                            fetchBonusPolicy(
                              values.subsidiaryId,
                              values.bonusTypeId,
                            );
                            setPanelMode(true);
                          }}
                        >
                          <Eye className="w-4 h-4 text-white" />
                          View
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <SearchSelect
                      name="payroll_monthId"
                      label={
                        <span>
                          Payroll Month<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        const selectedPayrollMonthId = e.value || null;

                        setFieldValue("payroll_monthId", selectedPayrollMonthId);
                        checkBonus_Employees(
                          values.subsidiaryId,
                          values.payroll_groupId,
                          values.bonusTypeId,
                          selectedPayrollMonthId,
                        );
                        setIsAfterResult(false);

                        formUIContext.setQueryParams({
                          ...formUIContext.queryParams,
                          pageNumber: 1,
                          filter: {
                            ...formUIContext.queryParams.filter,
                            subsidiaryId: values.subsidiaryId || null,
                            payrollGroupId: values.payroll_groupId || null,
                            bonusTypeId: values.bonusTypeId || null,
                            payrollMonthId: selectedPayrollMonthId,
                          },
                        });
                      }}
                      value={
                        dashboard?.allPayrollMonthYearList?.find(
                          (o) => o.value === values.payroll_monthId,
                        ) || null
                      }
                      options={
                        dashboard?.allPayrollMonthYearList?.filter(
                          (o) => o.isActive,
                        ) || []
                      }
                      error={errors.payroll_monthId}
                      touched={touched.payroll_monthId}
                    />
                  </div>
                </div>

                <br />

                <BonusPolicyPanel
                  data={bonus_policy_details}
                  panelMode={panelMode}
                />
                <hr />

                {resultAfterBonusProcess ? (
                  <div className="mt-3">
                    {resultAfterBonusProcess?.employees?.length > 0 ? (
                      <>
                        <div className="w-full overflow-x-auto">
                          <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="text-muted">
                        No employees were eligible for this bonus run.
                      </div>
                    )}
                  </div>
                ) : null}
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {payrollConfigApproverPermission && (
              <>
                <button
                  onClick={async () => {
                    await checkBonus_Employees(
                      values.subsidiaryId,
                      values.payroll_groupId,
                      values.bonusTypeId,
                      values.payroll_monthId,
                      false,
                      true,
                    );
                    setIds("");
                    dispatch(actions.clearProcessResult());
                  }}
                  className="btn btn-green"
                  disabled={
                    loading ||
                    (!checkBonus_EmployeesExist?.finalize &&
                      !resultAfterBonusProcess?.finalize)
                  }
                >
                  Finalize
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>

                <button
                  onClick={async () => {
                    await checkBonus_Employees(
                      values.subsidiaryId,
                      values.payroll_groupId,
                      values.bonusTypeId,
                      values.payroll_monthId,
                      true,
                      false,
                    );
                    setIds("");
                    dispatch(actions.clearProcessResult());
                  }}
                  className="btn btn-red"
                  disabled={loading || !checkBonus_EmployeesExist?.revert}
                >
                  Revert
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              </>
            )}

            {!isUserForRead ? (
              <button
                type="reset"
                onClick={() => {
                  setIds("");
                  handleReset();
                  dispatch(actions.clearReduxData());
                  setIsAfterResult(false);
                  setPanelMode(false);
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-elevate">
                OK
              </button>
            )}

            <button
              type="submit"
              onClick={() => {
                handleSubmit();
                setIsAfterResult(true);
              }}
              className="btn btn-primary btn-elevate"
              disabled={loading || !checkBonus_EmployeesExist?.execute}
            >
              Process
              {loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}