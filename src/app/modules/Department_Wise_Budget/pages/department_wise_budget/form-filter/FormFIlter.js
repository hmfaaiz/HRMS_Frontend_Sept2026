import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import { fetchAllCity, fetchAllCountry, fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { fetchDepartmentWiseBudget, fetchDepartmentWiseBudgets } from "../../../_redux/redux-Actions";


const API_URL = process.env.REACT_APP_API_URL;

const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText;
    // filter.email = searchText
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFIlter({ listLoading, user }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const [Loading, setLoading] = useState(false);
  const { dashboard } = useSelector((state) => state);
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);


  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;

      formUIProps.setQueryParams(newQueryParams);
    }
  };


  const defaultSubsidiary = dashboard?.allSubsidiaryList?.find(
    (item) => item.isDefault
  );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  useEffect(() => {
    if (!defaultSubsidiary?.value) return;

    dispatch(
      actions.fetchAllDepartmentBySubsidiaryIds([
        defaultSubsidiary.value,
      ])
    );

    dispatch(
      actions.fetchAllBudgetYearDataBySubsidiaryId(
        defaultSubsidiary.value
      )
    );
  }, [dispatch, defaultSubsidiary?.value]);


  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) {
      return;
    }
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find(
      (el) => el?.isDefault
    );
    if (!findDefaultSubs) {
      return;
    }

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      subsidiaryId: findDefaultSubs.value,
      pageNumber: 1,
    };

    formUIProps.setQueryParams(updatedQueryParams);

    dispatch(fetchDepartmentWiseBudgets(formUIProps.queryParams));

    dispatch(fetchAllDept(findDefaultSubs.value));
  }, [dashboard?.allSubsidiaryList]);




  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchText: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right ">
            <div className="grid md:grid-cols-7 gap-3 mb-2 ">




              <div className="">
                <div>
                  <SearchSelect
                    name="subsidiaryId"
                    label={
                      <span>
                        {" "}
                        Subsidiary

                      </span>
                    }
                    value={
                      (dashboard?.allSubsidiaryList || []).find(
                        (item) => item.value === formUIProps?.queryParams?.subsidiaryId
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        subsidiaryId: e.value,
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);

                      dispatch(fetchDepartmentWiseBudgets(formUIProps.queryParams));

                      dispatch(fetchAllDept(e.value));
                      dispatch(actions.fetchAllBudgetYearDataBySubsidiaryId(e.value));
                    }}

                    // options={dashboard.allSubsidiaryList}
                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(dashboard?.allSubsidiaryList)
                        ? dashboard.allSubsidiaryList
                        : []),
                    ]}
                  />
                </div>
              </div>

              <div className="">
                <div>
                  <SearchSelect
                    name="budgetYearId"
                    label={
                      <span>
                        {" "}
                        Budget Year

                      </span>
                    }
                    value={
                      (dashboard?.budgetyearBySubList || []).find(
                        (item) => item.value === formUIProps?.queryParams?.budgetYearId
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {
                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        budgetYearId: e.value,
                        pageNumber: 1,
                      };

                      formUIProps.setQueryParams(updatedQueryParams);

                      dispatch(fetchDepartmentWiseBudgets(updatedQueryParams));
                    }}


                    options={[
                      { label: "All", value: "" },
                      ...(dashboard?.budgetyearBySubList || []).filter(
                        (item) => item.isEditable
                      ),
                    ]}
                  />
                </div>
              </div>

              <div className="">
                <div>
                  <SearchSelect
                    name="departmentId"
                    label={
                      <span>
                        {" "}
                       Department

                      </span>
                    }
                    value={
                      (dashboard?.departmentBySubIdsList || []).find(
                        (item) => item.value === formUIProps?.queryParams?.departmentId
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {
                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        departmentId: e.value,
                        pageNumber: 1,
                      };

                      formUIProps.setQueryParams(updatedQueryParams);

                      dispatch(fetchDepartmentWiseBudgets(updatedQueryParams));
                    }}


                     options={dashboard?.departmentBySubIdsList}
                  />
                </div>
              </div>





              {/* <div className="col-span-1">
                <SearchSelect
                  name="departmentId"
                  label={
                    <span>
                      Department<span style={{ color: "red" }}>*</span>
                    </span>
                  }
              
                  onChange={(e) => {
                    setFieldValue("departmentId", e.value || null);
                  

                  }}
                  value={
                    dashboard?.departmentBySubIdsList?.find(
                      (option) => option.value === values.departmentId
                    ) || null
                  }
                  options={dashboard?.departmentBySubIdsList}

                  error={errors.departmentId}
                  touched={touched.departmentId}
                />
              </div> */}







              <div className="">
                <label> <span>
                  {" "}
                  Search

                </span></label>

                <InputSearch
                  values={values}
                  fieldName="searchText"
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  handleSubmit={handleSubmit}
                />

              </div>

            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
