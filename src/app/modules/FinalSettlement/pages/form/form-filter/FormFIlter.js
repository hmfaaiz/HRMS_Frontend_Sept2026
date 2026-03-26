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
import { fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { debounce } from "redux-saga/effects";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";


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

  function addCommas(nStr) {
    nStr += "";
    let x = nStr.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }

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
      return
    }
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find((el) => el?.isDefault)
    if (!findDefaultSubs) {
      return
    }

    const updatedQueryParams = {
      ...formUIProps.queryParams,
      subsidiaryId: findDefaultSubs.value,
      subsidiaryLabel: findDefaultSubs.value !== "" ? findDefaultSubs.label : "",
      pageNumber: 1,
    };

    formUIProps.setQueryParams(updatedQueryParams);
    dispatch(fetchAllDept(findDefaultSubs.value));
  }, [dashboard?.allSubsidiaryList])


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
                        subsidiaryLabel: e.value !== "" ? e.label : "",
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);


                      // dispatch(fetchSeparation(formUIProps.queryParams));
                      dispatch(fetchAllDept(e.value));
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
                    label={
                      <span>
                        {" "}
                        Department

                      </span>
                    }

                    value={
                      (dashboard?.allDept || []).find(
                        (item) => item.value === formUIProps?.queryParams?.departmentId
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        departmentId: e.value,
                        departmentLabel: e.value !== "" ? e.label : "",
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);


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
                    label={
                      <span>
                        {" "}
                        Designation

                      </span>
                    }


                    value={
                      (dashboard?.allDesignations || []).find(
                        (item) => item.value === formUIProps?.queryParams?.designationId
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        designationId: e.value,
                        designationLabel: e.value !== "" ? e.label : "",
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);


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
                    label={
                      <span>
                        {" "}
                        Employee Type

                      </span>
                    }

                    options={empTypeOptions}
                    value={
                      empTypeOptions.find(
                        (item) =>
                          String(item.value) === String(formUIProps?.queryParams?.employeeTypeId)
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        employeeTypeId: e.value,
                        employeeLabel: e.value !== "" ? e.label : "",
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);


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


              <div className="">
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

              </div>



            </div>

          </form>
        )}
      </Formik>
    </>
  );
}
