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
    // filter.email = searchQuery
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFilter() {
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
      formUIProps.setQueryParams(updatedQueryParams);
    }
  };
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(541, "allAppraisalCategory"));
  }, [dispatch]);

  useEffect(() => {
    if (
      dashboard?.allSubsidiaryList?.length > 0 &&
      auth?.user?.EmployeeMapping?.subsidiaryId
    ) {
      let subsid = dashboard?.allSubsidiaryList?.find(
        (e) => e.value === auth?.user?.EmployeeMapping?.subsidiaryId
      );
      const updatedQueryParams = {
        ...formUIProps.queryParams,
        filter: {
          ...formUIProps.queryParams?.filter,
          subsidiaryId: subsid?.value,
          monthId: subsid?.payrollMonth?.Id || "",
        },
        pageNumber: 1,
      };
      formUIProps.setSubsidiaryId(subsid?.value);
      formUIProps.setQueryParams(updatedQueryParams);
    }
  }, [dashboard.allSubsidiaryList, auth?.user?.EmployeeMapping?.subsidiaryId]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchQuery: "",
          subsidiaryId: formUIProps.subsidiaryId || "",
          appraisalCategoryId: "",
        }}
        validationSchema={FilterSchema}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-7 gap-3 px-3"
          >
            {values?.subsidiaryId && dashboard?.allSubsidiaryList?.length > 0 && (
              <div className="col-start-4 flex flex-col justify-end items-end">
                <span className="text-sm text-black font-bold">
                  Active Appraisal Period
                </span>
                <span className="text-xs text-black font-bold">
                  {
                    dashboard?.allSubsidiaryList?.find(
                      (el) => el?.value == values?.subsidiaryId
                    )?.appraisalFiscalYearLabel
                  }
                </span>
              </div>
            )}
            <div className="col-start-5">
              <SearchSelect
                name="subsidiaryId"
                label={<span> Subsidiary</span>}
                value={(dashboard?.allSubsidiaryList || [])?.find(
                  (item) => item.value === values?.subsidiaryId
                )}
                onChange={(e) => {
                  const updatedQueryParams = {
                    ...formUIProps.queryParams,
                    filter: {
                      ...formUIProps.queryParams?.filter,
                      subsidiaryId: e.value,
                    },
                    pageNumber: 1,
                  };
                  formUIProps.setSubsidiaryId(e.value);
                  setFieldValue("subsidiaryId", e.value);
                  formUIProps.setQueryParams(updatedQueryParams);
                }}
                options={dashboard?.allSubsidiaryList}
              />
            </div>
            <div className="col-start-6">
              <SearchSelect
                name="appraisalCategoryId"
                label={<span> Appraisal Category</span>}
                value={(dashboard?.allAppraisalCategory || [])?.find(
                  (item) => item.value === values?.appraisalCategoryId
                )}
                onChange={(e) => {
                  const updatedQueryParams = {
                    ...formUIProps.queryParams,
                    filter: {
                      ...formUIProps.queryParams?.filter,
                      appraisalCategoryId: e.value,
                    },
                    pageNumber: 1,
                  };
                  formUIProps.setAppraisalCategoryId(e.value);
                  setFieldValue("appraisalCategoryId", e.value);
                  formUIProps.setQueryParams(updatedQueryParams);
                  formUIProps.setEmployeeId(null);
                  dispatch(actions.clearAppraisalReview());
                  history.push("/appraisal_review/read-all-appraisal-review");
                }}
                options={dashboard?.allAppraisalCategory}
              />
            </div>

            <div className="col-start-7">
              <label>
                <span> Search</span>
              </label>
              <InputSearch
                values={values}
                fieldName="searchQuery"
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
              />
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
