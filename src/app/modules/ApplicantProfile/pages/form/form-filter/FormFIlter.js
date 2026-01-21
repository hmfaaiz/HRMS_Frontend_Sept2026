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
import { fetchApplicantProfile } from "../../../_redux/redux-Actions";


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

  // const waitapplyFilter = useCallback(
  //   debounce((values) => applyFilter(values), 500),
  //   []
  // );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllCountry());
    dispatch(fetchAllCity());
    dispatch(fetchAllFormsMenu(408, "allApplicationStatusList"));

  }, [dispatch]);

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

    dispatch(fetchApplicantProfile(formUIProps.queryParams));

    dispatch(fetchAllDept(findDefaultSubs.value));
  }, [dashboard?.allSubsidiaryList]);

  const filteredCities = (countryId) => {

    return dashboard?.allCity?.filter((city) => city.code == countryId) || [];
  };


    const profileCreatedOptions = [
    { value: 1, label: "Yes" },
    { value: 2, label: "No" },
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

                      dispatch(fetchApplicantProfile(formUIProps.queryParams));

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
                    name="countryId"
                    label={
                      <span>
                        {" "}
                        Country

                      </span>
                    }

                    value={
                      (dashboard?.allCountry || []).find(
                        (item) => item.value === formUIProps?.queryParams?.countryId
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        countryId: e.value,
                        cityId: null,
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);


                      // dispatch(actions.fetchUsers(formUIProps.queryParams));
                    }}


                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(dashboard?.allCountry)
                        ? dashboard?.allCountry
                        : []),
                    ]}
                  />
                </div>
              </div>


              <div className="">
                <div>
                  <SearchSelect
                    name="cityId"
                    label={
                      <span>
                        {" "}
                        City

                      </span>
                    }

                    value={
                      (filteredCities(formUIProps.queryParams.countryId) || []).find(
                        (item) => item.value === formUIProps?.queryParams?.cityId
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        cityId: e.value,
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);


                      // dispatch(actions.fetchUsers(formUIProps.queryParams));
                    }}

                    // options={filteredCities(formUIProps.queryParams.countryId)}
                    options={[
                      { label: "All", value: "" },
                      ...(filteredCities(formUIProps.queryParams.countryId) || []),
                    ]}
                  // options={[
                  //   { label: "All", value: "" },
                  //   ...(Array.isArray(dashboard?.allCountry)
                  //     ? dashboard?.allCountry
                  //     : []),
                  // ]}
                  />
                </div>
              </div>



              <div className="">
                <div>
                  <SearchSelect
                    name="applicantStatusId"
                    label={
                      <span>
                        {" "}
                        Applicant Status

                      </span>
                    }
                    value={
                      (dashboard?.allApplicationStatusList || []).find(
                        (item) => item.value === formUIProps?.queryParams?.applicantStatusId
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        applicantStatusId: e.value,
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);

                      dispatch(fetchApplicantProfile(formUIProps.queryParams));


                    }}


                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(dashboard?.allApplicationStatusList)
                        ? dashboard.allApplicationStatusList
                        : []),
                    ]}
                  />
                </div>
              </div>

                <div className="">
                <div>
                  <SearchSelect
                    name="applicantStatusId"
                    label={
                      <span>
                        {" "}
                        Profile Created

                      </span>
                    }
                    value={
                      (profileCreatedOptions || []).find(
                        (item) => item.value === formUIProps?.queryParams?.isProfileCreated
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...formUIProps.queryParams,
                        isProfileCreated: e.value,
                        pageNumber: 1,
                      };


                      formUIProps.setQueryParams(updatedQueryParams);

                      dispatch(fetchApplicantProfile(formUIProps.queryParams));


                    }}


                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(profileCreatedOptions)
                        ? profileCreatedOptions
                        : []),
                    ]}
                  />
                </div>
              </div>


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
