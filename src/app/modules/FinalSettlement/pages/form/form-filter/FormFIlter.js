import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Field, Formik } from "formik";
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
import {
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";

const API_URL = process.env.REACT_APP_API_URL;

const prepareFilter = (queryParams, values) => {
  const {
    searchText,
    departmentId,
    designationId,
    subsidiaryId,
    employeeTypeId,
    type,
  } = values;
  const newQueryParams = { ...queryParams };
  const filter = { ...queryParams?.filter };

  if (searchText) {
    filter.searchQuery = searchText;
  }
  if (departmentId) {
    filter.departmentId = departmentId;
  }
  if (designationId) {
    filter.designationId = designationId;
  }
  if (subsidiaryId) {
    filter.subsidiaryId = subsidiaryId;
  }
  if (employeeTypeId) {
    filter.employeeTypeId = employeeTypeId;
  }
  if (type) {
    filter.type = type;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFIlter({ listLoading, user }) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
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

  // const waitapplyFilter = useCallback(
  //   debounce((values) => applyFilter(values), 500),
  //   []
  // );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
  }, [dispatch]);

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) {
      return;
    }
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find(
      (el) => el?.isDefault,
    );
    if (!findDefaultSubs) {
      return;
    }

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      subsidiaryId: findDefaultSubs.value,
      type: "notCreated",
      subsidiaryLabel:
        findDefaultSubs.value !== "" ? findDefaultSubs.label : "",
      pageNumber: 1,
    };

    formUIProps.setQueryParams(updatedQueryParams);
    dispatch(fetchAllDept(findDefaultSubs.value));
  }, [dashboard?.allSubsidiaryList]);

  const empTypeOptions = [
    { label: "All", value: "" },
    ...(dashboard?.allEmpTypeDynamicChildMenus || []),
    ...(dashboard?.allEmpTypeChildMenus || []),
  ];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          searchQuery: "",
          type: "notCreated",
          subsidiaryId: "",
          departmentId: "",
          designationId: "",
          employeeTypeId: "",
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
          <form onSubmit={handleSubmit} className="form form-label-right">
            {/* <div className="col-12 col-md-12">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                    setFieldValue("searchText", e.target.value.trim())
                    handleSubmit()
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div> */}

            {/* <InputSearch
              values={values}
              fieldName="searchText"
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
            /> */}

            <div className="grid md:grid-cols-7 gap-3 mb-2 ">
              <div className="">
                <div>
                  <SearchSelect
                    name="subsidiaryId"
                    label={<span> Subsidiary</span>}
                    value={
                      (dashboard?.allSubsidiaryList || []).find(
                        (item) =>
                          item.value === formUIProps?.queryParams?.subsidiaryId,
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {
                      setFieldValue("subsidiaryId", e.value);
                      dispatch(fetchAllDept(e.value));
                      handleSubmit();
                      // const updatedQueryParams = {
                      //   ...formUIProps.queryParams,
                      //   subsidiaryId: e.value,
                      //   subsidiaryLabel: e.value !== "" ? e.label : "",
                      //   pageNumber: 1,
                      // };

                      // formUIProps.setQueryParams(updatedQueryParams);

                      // dispatch(fetchSeparation(formUIProps.queryParams));
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
                    name="departmentId"
                    label={<span> Department</span>}
                    value={
                      (dashboard?.allDept || []).find(
                        (item) =>
                          item.value === formUIProps?.queryParams?.departmentId,
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {
                      setFieldValue("departmentId", e?.value);
                      handleSubmit();
                      // const updatedQueryParams = {
                      //   ...formUIProps.queryParams,
                      //   departmentId: e.value,
                      //   departmentLabel: e.value !== "" ? e.label : "",
                      //   pageNumber: 1,
                      // };
                      // formUIProps.setQueryParams(updatedQueryParams);
                      // dispatch(fetchSeparation(formUIProps.queryParams));
                    }}
                    // options={dashboard.allDept}
                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(dashboard?.allDept)
                        ? dashboard?.allDept
                        : []),
                    ]}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <SearchSelect
                    name="designationId"
                    label={<span> Designation</span>}
                    value={
                      (dashboard?.allDesignations || []).find(
                        (item) =>
                          item.value ===
                          formUIProps?.queryParams?.designationId,
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {
                      // const updatedQueryParams = {
                      //   ...formUIProps.queryParams,
                      //   designationId: e.value,
                      //   designationLabel: e.value !== "" ? e.label : "",
                      //   pageNumber: 1,
                      // };

                      // formUIProps.setQueryParams(updatedQueryParams);
                      setFieldValue("designation", e?.value);
                      handleSubmit();
                      // dispatch(fetchSeparation(formUIProps.queryParams));
                    }}
                    // options={dashboard?.allDesignations}
                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(dashboard?.allDesignations)
                        ? dashboard?.allDesignations
                        : []),
                    ]}
                  />
                </div>
              </div>

              <div className="">
                <div>
                  <SearchSelect
                    name="employeeTypeId"
                    label={<span> Employee Type</span>}
                    options={empTypeOptions}
                    value={
                      empTypeOptions.find(
                        (item) =>
                          String(item.value) ===
                          String(formUIProps?.queryParams?.employeeTypeId),
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {
                      setFieldValue("employeeTypeId", e?.value);
                      handleSubmit();
                      // const updatedQueryParams = {
                      //   ...formUIProps.queryParams,
                      //   employeeTypeId: e.value,
                      //   employeeLabel: e.value !== "" ? e.label : "",
                      //   pageNumber: 1,
                      // };

                      // formUIProps.setQueryParams(updatedQueryParams);

                      // dispatch(fetchSeparation(formUIProps.queryParams));
                    }}

                    // options={[
                    //   { label: "All", value: "" },
                    //   ...(dashboard?.allEmpTypeDynamicChildMenus || []),
                    //   ...(dashboard?.allEmpTypeChildMenus || []),
                    // ]}
                  />
                </div>
              </div>

              <div>
                <label>
                  {" "}
                  <span> Search</span>
                </label>
                <InputSearch
                  values={values}
                  fieldName="searchText"
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  handleSubmit={handleSubmit}
                />
              </div>

              {/* <div className="">
                <label className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="isNotEligibleForFinalSettlement"
                    checked={values.isNotEligibleForFinalSettlement}


                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        isNotEligibleForFinalSettlement: e.target.checked,
                        isNotEligibleForFinalSettlementLabel: "Not eligible for final settlement",
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);



                    }}
                  />
                  <span>
                    Not eligible for final settlement
                  </span>
                </label>

              </div> */}
            </div>
            <button
              type="button"
              className={`btn mr-2 rounded-xl ${
                values?.type === "notCreated"
                  ? "bg-black text-white"
                  : "btn-secondary"
              }`}
              onClick={() => {
                // const updatedQueryParams = {
                //   ...formUIProps.queryParams,
                //   type: "notCreated",
                //   pageNumber: 1,
                // };
                setFieldValue("type", "notCreated");
                handleSubmit();
                // formUIProps.setQueryParams(updatedQueryParams);
              }}
            >
              Not Created
            </button>
            <button
              type="button"
              className={`btn mr-2 rounded-xl ${
                values?.type === "notFinal"
                  ? "bg-black text-white"
                  : "btn-secondary"
              }`}
              onClick={() => {
                // const updatedQueryParams = {
                //   ...formUIProps.queryParams,
                //   type: "notFinal",
                //   pageNumber: 1,
                // };
                setFieldValue("type", "notFinal");
                handleSubmit();
                // formUIProps.setQueryParams(updatedQueryParams);
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
                // const updatedQueryParams = {
                //   ...formUIProps.queryParams,
                //   type: "final",
                //   pageNumber: 1,
                // };
                setFieldValue("type", "final");
                handleSubmit();
                // formUIProps.setQueryParams(updatedQueryParams);
              }}
            >
              Finalized
            </button>

            {/* <div className="">
                <label className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="isFinalized"
                    checked={values.isFinalized}


                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        isFinalized: e.target.checked,
                        isFinalizedLabel: "Finalized",
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);



                    }}
                  />
                  <span>
                    Finalized
                  </span>
                </label>

              </div> */}
          </form>
        )}
      </Formik>
    </>
  );
}
