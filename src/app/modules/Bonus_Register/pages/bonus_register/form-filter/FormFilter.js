import React, { useEffect, useMemo } from "react";
import { Field, Formik } from "formik";
import { isEqual } from "lodash";
import * as Yup from "yup";
import { useBonusRegisterUIContext } from "../FormUIContext";
import { Form, Modal } from "react-bootstrap";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { groupByOptions, initialFilter } from "../FormUIHelper";
import * as actions from "../../../_redux/redux-Actions";
import {
  fetchAllDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { Select } from "../../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { Download } from "lucide-react";

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),
  bonusTypeId: Yup.string().required(VALIDATION_MESSAGES.required),
  monthId: Yup.string().required(VALIDATION_MESSAGES.required),
});

const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

const ALL_OPTION = { label: "All", value: "" };

export function BonusRegisterFilter({
  registerLoading,
  registerExcelLoading,
  registerPreviewLoading,
}) {
  const dispatch = useDispatch();
  const BonusRegisterUIContext = useBonusRegisterUIContext();

  const { allSubsidiaryList, allDept } = useSelector((state) => state.dashboard);

  const { bonusTypes, months, filtersLoading } = useSelector(
    (state) => state.bonus_register,
    shallowEqual
  );

  const allSubsidiaryMap = useMemo(
    () => new Map(allSubsidiaryList?.map((item) => [item.value, item])),
    [allSubsidiaryList]
  );
  const allDeptMap = useMemo(
    () => new Map(allDept?.map((item) => [item.value, item])),
    [allDept]
  );
  const allGroupByMap = useMemo(
    () => new Map(groupByOptions?.map((item) => [item.value, item])),
    []
  );

  const bonusTypeOptions = useMemo(
    () => (bonusTypes || []).map((bt) => ({ label: bt.formName, value: bt.Id })),
    [bonusTypes]
  );
  const bonusTypeMap = useMemo(
    () => new Map(bonusTypeOptions.map((item) => [item.value, item])),
    [bonusTypeOptions]
  );

  const monthOptions = useMemo(
    () => (months || []).map((m) => ({ label: m.reportFormat || m.shortFormat, value: m.Id })),
    [months]
  );
  const monthMap = useMemo(
    () => new Map(monthOptions.map((item) => [item.value, item])),
    [monthOptions]
  );

  const formUIProps = useMemo(
    () => ({
      queryParams: BonusRegisterUIContext.queryParams,
      setQueryParams: BonusRegisterUIContext.setQueryParams,
    }),
    [BonusRegisterUIContext]
  );

  
  const initialValues = useMemo(
    () => ({
      ...initialFilter.filter,
      subsidiaryId:
        initialFilter.filter?.subsidiaryId ||
        allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
        "",
    }),
    [allSubsidiaryList]
  );

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  const getLabels = (values) => ({
    monthLabel: monthMap?.get(values.monthId || "")?.label,
    subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
    bonusTypeLabel: bonusTypeMap?.get(values.bonusTypeId || "")?.label,
    groupWiseLabel: allGroupByMap?.get(values.groupBy || "")?.label,
    departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,
  });

  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateBonusRegisterPdf(newQueryParams.filter, document, labels));
  };

  const getExcel = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateBonusRegisterExcel(newQueryParams.filter, document, labels));
  };

  const previewRegisterPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchPreviewBonusRegisterPdf(newQueryParams.filter, document, labels));
  };

  useEffect(() => {
    if (!allDept || !allDept?.length) dispatch(fetchAllDept());
  }, [dispatch]);

 
  useEffect(() => {
    if (!allSubsidiaryList?.length) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch]);

  useEffect(() => {
    // Seed filters for the default subsidiary on first load
    if (!allSubsidiaryList?.length) return;
    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);
    if (!findDefaultSubs) return;
    dispatch(actions.fetchBonusRegisterFilters({ subsidiaryId: findDefaultSubs.value }));
  }, [allSubsidiaryList]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={formValidation}
      onSubmit={(values) => {
        applyFilter(values);
      }}
    >
      {({ values, handleBlur, setFieldValue, errors, touched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset>
                <h6 className="font-bold mb-0 text-primary">Employee</h6>
                <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                  {/* Subsidiary */}
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value == "--Select--" ? "" : Number(e.value);
                        setFieldValue("subsidiaryId", value);
                        setFieldValue("bonusTypeId", "");
                        setFieldValue("monthId", "");
                        setFieldValue("departmentId", "");
                        dispatch(actions.fetchBonusRegisterFilters({ subsidiaryId: value }));
                      }}
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      value={
                        allSubsidiaryList?.find((el) => el?.value === values?.subsidiaryId) || null
                      }
                      options={allSubsidiaryList}
                    />
                  </div>

                
                  <div>
                    <SearchSelect
                      name="bonusTypeId"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value == "--Select--" ? "" : Number(e.value);
                        setFieldValue("bonusTypeId", value);
                        setFieldValue("monthId", "");
                        dispatch(
                          actions.fetchBonusRegisterFilters({
                            subsidiaryId: values.subsidiaryId,
                            bonusTypeId: value || undefined,
                          })
                        );
                      }}
                      label={
                        <span>
                          Bonus Type<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      error={errors?.bonusTypeId}
                      touched={touched?.bonusTypeId}
                      value={
                        bonusTypeOptions?.find(
                          (opt) => opt.value === values?.bonusTypeId
                        ) || null
                      }
                      options={bonusTypeOptions}
                      isDisabled={!values.subsidiaryId || filtersLoading}
                    />
                  </div>

                 
                  <div>
                    <SearchSelect
                      name="monthId"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value == "--Select--" ? "" : Number(e.value);
                        setFieldValue("monthId", value);
                      }}
                      label={
                        <span>
                          Payroll Month<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      error={errors?.monthId}
                      touched={touched?.monthId}
                      value={monthMap?.get(values?.monthId || "") || null}
                      options={monthOptions}
                      isDisabled={!values.subsidiaryId || filtersLoading}
                    />
                  </div>
                </div>

                <hr />

                <h6 className="font-bold mb-0 text-primary">
                  Bonus Register (PDF / Excel)
                </h6>

                <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                  {/* Group By */}
                  <div className="md:col-start-1 md:col-end-2">
                    <Field
                      name="groupBy"
                      component={Select}
                      placeholder=""
                      onChange={(e) => setFieldValue("groupBy", e.target.value)}
                      label={<span>Group By</span>}
                      value={values.groupBy}
                      autoComplete="off"
                      children={CustomDropdown({ data: groupByOptions })}
                    />
                  </div>

                  <div className="md:col-start-3 md:col-end-5 flex justify-end">
                    <button
                      onClick={() => {
                        previewRegisterPdf(values);
                        window.open("/bonus_register/preview-registered-bonus-pdf");
                      }}
                      disabled={
                        registerLoading ||
                        registerExcelLoading ||
                        registerPreviewLoading ||
                        !values.subsidiaryId ||
                        !values.bonusTypeId ||
                        !values.monthId
                      }
                      type="button"
                      className="btn btn-primary btn-elevate h-9 mt-4 mr-1"
                    >
                      Preview
                      {registerPreviewLoading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>

                    <button
                      onClick={() => getPdf(values)}
                      disabled={
                        registerLoading ||
                        registerExcelLoading ||
                        registerPreviewLoading ||
                        !values.subsidiaryId ||
                        !values.bonusTypeId ||
                        !values.monthId
                      }
                      type="button"
                      className="btn btn-primary btn-elevate h-9 mt-4"
                    >
                      Generate Register (PDF)
                      <Download className="w-4 h-4 ml-2" />
                      {registerLoading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>

                    <button
                      onClick={() => getExcel(values)}
                      disabled={
                        registerExcelLoading ||
                        !values.subsidiaryId ||
                        !values.bonusTypeId ||
                        !values.monthId
                      }
                      type="button"
                      className="btn btn-primary btn-elevate h-9 mt-4 ml-1"
                    >
                      Generate Register (Excel)
                      <Download className="w-4 h-4 ml-2" />
                      {registerExcelLoading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
        </>
      )}
    </Formik>
  );
}