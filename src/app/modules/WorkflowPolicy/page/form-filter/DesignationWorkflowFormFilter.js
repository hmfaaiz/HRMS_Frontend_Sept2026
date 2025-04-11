import React, { useEffect } from "react";
import { Field, Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu } from "../../../../../_metronic/redux/dashboardActions";

const DesignationWorkflowFormFilter = () => {
  const { queryParamsDesig, setQueryParamsDesig } = useFormUIContext();
  const dispatch = useDispatch();
  const applyFilter = (values) => {
    const filter = values.searchQuery
      ? { searchQuery: values.searchQuery }
      : { searchQuery: "" };
    const newQueryParams = { ...queryParamsDesig, filter, pageNumber: 1 };

    if (!isEqual(newQueryParams, queryParamsDesig)) {
      setQueryParamsDesig(newQueryParams);
    }
  };
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    dispatch(fetchAllFormsMenu(380, "allEmployeeRequestTypeList"));
  }, [dispatch]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...queryParamsDesig?.filter }}
      onSubmit={applyFilter}
    >
      {({ values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          <div className="row">
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="form-control"
                name="searchQuery"
                placeholder="Search"
                onBlur={handleBlur}
                value={values.searchQuery}
                onChange={(e) => {
                  setFieldValue("searchQuery", e.target.value);
                  // handleSubmit(values);
                }}
              />
            </div>
            <div className="col-12 col-md-6">
              <Field
                name="workflowType"
                as="select"
                className="form-control"
                onChange={({ value }) => {
                  setFieldValue("workflowType", value);
                  // handleSubmit(values);
                }}
              >
                <option value="">All </option>
                {dashboard?.allEmployeeRequestTypeList?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              {/* <SearchSelect
                name="workflowType"
                onChange={({ value }) => {
                  setFieldValue("workflowType", value);
                  // handleSubmit();
                }}
                value={
                  dashboard?.allEmployeeRequestTypeList?.find(
                    (e) => e?.value == values?.workflowType
                  ) || null
                }
                options={dashboard.allEmployeeRequestTypeList}
              /> */}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default DesignationWorkflowFormFilter;
