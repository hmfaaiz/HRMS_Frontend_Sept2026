import React, { useMemo, useState, useEffect } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useBanksUIContext } from "../BanksUIContext";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import {
  fetchAllCity,
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubCenter,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { fetchUsers } from "../../../_redux/bankActions";


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

export function BanksFilter({
  listLoading,
  user,
  setCity,
  seletCity,
  setCenter,
  center,
  setSubcenter,
  isUserForRead,
  subCenter,
  alarmTime,
  setAlarmTime,
  setVehicle,
}) {
  const [defCity, setDefaultCity] = useState({});
  const dispatch = useDispatch();
  const banksUIContext = useBanksUIContext();
  const { dashboard } = useSelector((state) => state);
  const banksUIProps = useMemo(() => {
    return {
      queryParams: banksUIContext.queryParams,
      setQueryParams: banksUIContext.setQueryParams,
    };
  }, [banksUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(banksUIProps.queryParams, values);
    if (!isEqual(newQueryParams, banksUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      banksUIProps.setQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
  }, [dispatch]);

  useEffect(()=>{

    if(!dashboard?.allSubsidiaryList?.length) return

    const defaultSubsId = dashboard?.allSubsidiaryList?.find((e)=> e?.isDefault)?.value
    if(!defaultSubsId) return

      const updatedQueryParams = {
      ...banksUIProps.queryParams,
      subsidiaryId: defaultSubsId,
      pageNumber: 1,
      };
      banksUIProps.setQueryParams(updatedQueryParams);
      dispatch(fetchUsers(banksUIProps.queryParams));
      dispatch(fetchAllDept(defaultSubsId));

  },[dashboard?.allSubsidiaryList])
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values) => {
          // createPdf(values);
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
            <div className="grid md:grid-cols-5 gap-3 mb-2 ">




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
                        (item) => item.value === banksUIProps?.queryParams?.subsidiaryId
                      ) || { label: "All", value: "" }
                    }

                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...banksUIProps.queryParams,
                        subsidiaryId: e.value,
                        pageNumber: 1,
                      };


                      banksUIProps.setQueryParams(updatedQueryParams);

                      dispatch(fetchUsers(banksUIProps.queryParams));

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
                        (item) => item.value === banksUIProps?.queryParams?.departmentId
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...banksUIProps.queryParams,
                        departmentId: e.value,
                        pageNumber: 1,
                      };


                      banksUIProps.setQueryParams(updatedQueryParams);


                      dispatch(fetchUsers(banksUIProps.queryParams));
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
                    name="employeeTypeId"
                    label={
                      <span>
                        {" "}
                        Designation

                      </span>
                    }


                    value={
                      (dashboard?.allDesignations || []).find(
                        (item) => item.value === banksUIProps?.queryParams?.designationId
                      ) || { label: "All", value: "" }
                    }
                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...banksUIProps.queryParams,
                        designationId: e.value,
                        pageNumber: 1,
                      };


                      banksUIProps.setQueryParams(updatedQueryParams);


                      dispatch(fetchUsers(banksUIProps.queryParams));
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


                    onChange={(e) => {

                      const updatedQueryParams = {
                        ...banksUIProps.queryParams,
                        employeeTypeId: e.value,
                        pageNumber: 1,
                      };


                      banksUIProps.setQueryParams(updatedQueryParams);


                      dispatch(fetchUsers(banksUIProps.queryParams));
                    }}
                    value={
                      (dashboard?.allEmpTypeDynamicChildMenus || []).find(
                        (item) => item.value === banksUIProps?.queryParams?.employeeTypeId
                      ) || { label: "All", value: "" }
                    }

                    options={[
                      { label: "All", value: "" },
                      ...(dashboard?.allEmpTypeDynamicChildMenus || []),
                      ...(dashboard?.allEmpTypeChildMenus || []),
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
