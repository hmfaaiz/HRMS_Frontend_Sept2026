import React, { useMemo, useEffect } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFromUIContext } from "../FormUIContext";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import * as actions from "../../../_redux/formActions";
import { useHistory } from "react-router-dom";

const FilterSchema = Yup.object().shape({
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),
  appraisalCategoryId: Yup.string().required(VALIDATION_MESSAGES.required),
  searchQuery: Yup.string().optional(),
});

const prepareFilter = (queryParams, values) => {
  const { searchQuery } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchQuery) {
    filter.searchQuery = searchQuery;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

const APPRAISAL_REVIEW_LIST_PATH =
  "/appraisal_review/read-all-appraisal-review";

export function FormFilter({ createAccess }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const formUIContext = useFromUIContext();
  const { dashboard, auth } = useSelector((state) => state);
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      appraisalCategoryId: formUIContext.appraisalCategoryId,
      setAppraisalCategoryId: formUIContext.setAppraisalCategoryId,
      subsidiaryId: formUIContext.subsidiaryId,
      setSubsidiaryId: formUIContext.setSubsidiaryId,
      setEmployeeId: formUIContext.setEmployeeId,
    };
  }, [formUIContext]);

  // Every place that ends up calling setQueryParams (i.e. triggers a
  // fresh API hit) should go through this so history.push always
  // fires first, consistently, right before the query params change.
  const pushThenSetQueryParams = (updatedQueryParams) => {
    history.push(APPRAISAL_REVIEW_LIST_PATH);
    formUIProps.setEmployeeId(null)
    formUIProps.setQueryParams(updatedQueryParams);
  };

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      const updatedQueryParams = {
        ...formUIProps.queryParams,
        filter: {
          ...values,
          searchQuery: values.searchQuery || "",
        },
        pageNumber: 1,
      };
      // update list by queryParams
      pushThenSetQueryParams(updatedQueryParams);
    }
  };

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
  }, [dispatch]);

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;

    const findDefaultSub = dashboard?.allSubsidiaryList?.find(
      (e) => e.isDefault,
    );

    if (!findDefaultSub) return;

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      filter: {
        ...formUIProps.queryParams?.filter,
        subsidiaryId: findDefaultSub?.value,
        monthId: findDefaultSub?.payrollMonth?.Id || "",
        type:
          formUIProps.queryParams?.filter?.type ||
          (createAccess ? "notCreated" : "notFinal"),
      },
      pageNumber: 1,
    };

    formUIProps.setSubsidiaryId(findDefaultSub?.value);
    pushThenSetQueryParams(updatedQueryParams);
  }, [dashboard.allSubsidiaryList]);

  useEffect(() => {
    if (!dashboard?.allAppraisalCategory?.length) return;

    const defaultCategory = dashboard?.allAppraisalCategory?.[0];

    if (!defaultCategory) return;

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      filter: {
        ...formUIProps.queryParams?.filter,
        appraisalCategoryId: defaultCategory?.value,
        type:
          formUIProps.queryParams?.filter?.type ||
          (createAccess ? "notCreated" : "notFinal"),
      },
      pageNumber: 1,
    };

    formUIProps.setAppraisalCategoryId(defaultCategory?.value);
    pushThenSetQueryParams(updatedQueryParams);
  }, [dashboard.allAppraisalCategory]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchQuery: "",
          subsidiaryId: formUIProps.subsidiaryId || "",
          appraisalCategoryId: formUIProps.appraisalCategoryId || "",
          type:
            formUIProps.queryParams?.filter?.type ||
            (createAccess ? "notCreated" : "notFinal"),
        }}
        validationSchema={FilterSchema}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleBlur, setFieldValue }) => (
          <form className="flex justify-start sm:justify-between items-end flex-wrap gap-2">
            <div>
              {createAccess ? (
                <button
                  type="button"
                  className={`btn mr-2 rounded-xl ${
                    values?.type === "notCreated"
                      ? "bg-black text-white"
                      : "btn-secondary"
                  }`}
                  onClick={() => {
                    setFieldValue("type", "notCreated");
                    applyFilter({ ...values, type: "notCreated" });
                  }}
                >
                  Not Created
                </button>
              ) : null}
              <button
                type="button"
                className={`btn mr-2 rounded-xl ${
                  values?.type === "notFinal"
                    ? "bg-black text-white"
                    : "btn-secondary"
                }`}
                onClick={() => {
                  setFieldValue("type", "notFinal");
                  applyFilter({ ...values, type: "notFinal" });
                }}
              >
                Created
              </button>
              <button
                type="button"
                className={`btn mr-2 rounded-xl ${
                  values?.type === "final"
                    ? "bg-black text-white"
                    : "btn-secondary"
                }`}
                onClick={() => {
                  setFieldValue("type", "final");
                  applyFilter({ ...values, type: "final" });
                }}
              >
                Finalized
              </button>
            </div>
            <div className="grid md:grid-cols-5 gap-3">
              {values?.subsidiaryId &&
                dashboard?.allSubsidiaryList?.length > 0 && (
                  <div className="col-start-2 flex flex-col justify-end items-end">
                    <span className="text-sm text-black font-bold">
                      Active Appraisal Period
                    </span>
                    <span className="text-xs text-black font-bold">
                      {
                        dashboard?.allSubsidiaryList?.find(
                          (el) => el?.value == values?.subsidiaryId,
                        )?.appraisalFiscalYearLabel
                      }
                    </span>
                  </div>
                )}
              <div className="col-start-3">
                <SearchSelect
                  name="subsidiaryId"
                  label={<span> Subsidiary</span>}
                  value={(dashboard?.allSubsidiaryList || [])?.find(
                    (item) => item.value === values?.subsidiaryId,
                  )}
                  onChange={(e) => {
                    const updatedQueryParams = {
                      ...formUIProps.queryParams,
                      filter: {
                        ...formUIProps.queryParams?.filter,
                        subsidiaryId: e.value,
                        type: values?.type,
                      },
                      pageNumber: 1,
                    };
                    formUIProps.setSubsidiaryId(e.value);
                    setFieldValue("subsidiaryId", e.value);
                    pushThenSetQueryParams(updatedQueryParams);
                  }}
                  options={dashboard?.allSubsidiaryList}
                />
              </div>
              <div className="col-start-4">
                <SearchSelect
                  name="appraisalCategoryId"
                  label={<span> Appraisal Category</span>}
                  value={(dashboard?.allAppraisalCategory || [])?.find(
                    (item) => item.value === values?.appraisalCategoryId,
                  )}
                  onChange={(e) => {
                    const updatedQueryParams = {
                      ...formUIProps.queryParams,
                      filter: {
                        ...formUIProps.queryParams?.filter,
                        appraisalCategoryId: e.value,
                        type: values?.type,
                      },
                      pageNumber: 1,
                    };
                    formUIProps.setAppraisalCategoryId(e.value);
                    setFieldValue("appraisalCategoryId", e.value);
                    formUIProps.setEmployeeId(null);
                    dispatch(actions.clearAppraisalReview());
                    pushThenSetQueryParams(updatedQueryParams);
                  }}
                  options={dashboard?.allAppraisalCategory}
                />
              </div>

              <div className="col-start-5">
                <label>
                  <span> Search</span>
                </label>
                <InputSearch
                  values={values}
                  fieldName="searchQuery"
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  handleSubmit={() => applyFilter(values)}
                />
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
