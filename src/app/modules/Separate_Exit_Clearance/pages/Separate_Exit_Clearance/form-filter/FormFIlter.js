import React, { useMemo ,useEffect } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchExitTypeExitReason } from "../../../_redux/redux-Actions";
import { fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";


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
  const FormUIContext = useFormUIContext();
const dispatch = useDispatch();
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

    useEffect(() => {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllDept());
      dispatch(fetchAllFormsMenu(158, "allDesignations"));
      dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
      dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
    }, [dispatch]);
  
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
                                    subsidiaryLabel: e.value !== "" ?  e.label:"",
                                    pageNumber: 1,
                                  };
            
            
                                  formUIProps.setQueryParams(updatedQueryParams);
            
            
                                  dispatch(fetchExitTypeExitReason(updatedQueryParams));
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
                                    departmentLabel: e.value !== "" ?  e.label:"",
                                    pageNumber: 1,
                                  };
            
            
                                  formUIProps.setQueryParams(updatedQueryParams);
            
            
                                  dispatch(fetchExitTypeExitReason(updatedQueryParams));
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
                                    designationLabel:e.value !== "" ?  e.label:"",
                                    pageNumber: 1,
                                  };
            
            
                                  formUIProps.setQueryParams(updatedQueryParams);
            
            
                                  dispatch(fetchExitTypeExitReason(updatedQueryParams));
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
                                    employeeLabel: e.value !== "" ?  e.label:"",
                                    pageNumber: 1,
                                  };
            
            
                                  formUIProps.setQueryParams(updatedQueryParams);
            
            
                                  dispatch(fetchExitTypeExitReason(updatedQueryParams));
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
            
            
            
                        </div>
          </form>
        )}
      </Formik>

      <Formik enableReinitialize={true} onSubmit={(values) => {}}>
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
            <div className="row"></div>
            <div className="row"></div>
          </form>
        )}
      </Formik>
    </>
  );

  return <></>;
}
