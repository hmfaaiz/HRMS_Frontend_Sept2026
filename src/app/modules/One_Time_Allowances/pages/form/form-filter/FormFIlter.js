import React, { useMemo, useEffect, useState } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFromUIContext } from "../FormUIContext";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { fetchAllOneTimeAllowance } from "../../../_redux/formActions";
import * as Yup from "yup";

const FilterSchema = Yup.object().shape({
  subsidiaryId: Yup.string().required("Subsidiary is required"),
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
  const [sub, setSub] = useState(null);
  const dispatch = useDispatch();
  const formUIContext = useFromUIContext();
  const { dashboard, auth } = useSelector((state) => state);
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
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
  }, [dispatch]);

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find(
      (e) => e?.isDefault
    );
    if (!findDefaultSubs) return;

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      filter: {
        ...formUIProps.queryParams?.filter,
        subsidiaryId: findDefaultSubs?.value,
        monthId: findDefaultSubs?.payrollMonth?.Id || "",
      },
      pageNumber: 1,
    };
    setSub(findDefaultSubs);
    formUIProps.setQueryParams(updatedQueryParams);
  }, [dashboard.allSubsidiaryList]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchQuery: "",
          subsidiaryId: sub?.value || "",
          monthId: sub?.payrollMonth?.Id,
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
              <div className="col-start-5 flex flex-col justify-end items-end">
                <span className="text-sm text-black font-bold">
                  Active Payroll Month
                </span>
                <span className="text-xs text-black font-bold">
                  {
                    dashboard?.allSubsidiaryList?.find(
                      (el) => el?.value == values?.subsidiaryId
                    )?.payrollMonthLabel
                  }
                </span>
              </div>
            )}
            <div className="col-start-6">
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
                      monthId: e?.payrollMonth?.Id || "",
                    },
                    pageNumber: 1,
                  };
                  setSub(e.value);
                  setFieldValue("subsidiaryId", e.value);
                  setFieldValue("monthId", e.payrollMonth?.Id);
                  formUIProps.setQueryParams(updatedQueryParams);
                  dispatch(fetchAllOneTimeAllowance(formUIProps.queryParams));
                }}
                options={dashboard?.allSubsidiaryList}
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
