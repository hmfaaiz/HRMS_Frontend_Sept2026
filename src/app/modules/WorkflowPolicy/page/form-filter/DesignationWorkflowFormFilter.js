import React, { useEffect } from "react";
import { Field, Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFormsMenu } from "../../../../../_metronic/redux/dashboardActions";
import { Select } from "../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../utils/common-modules/CustomDropdown";

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

  useEffect(() => {
    dispatch(fetchAllFormsMenu(380, "allEmployeeRequestTypeList"));
  }, [dispatch]);
  return (
    <Formik
      enableReinitialize
      initialValues={queryParamsDesig?.filter}
      onSubmit={applyFilter}
    >
      {({ values, handleSubmit, handleBlur, setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          {/* <div className="row"> */}
            <div className="col-12 col-md-12">
              <input
                type="text"
                className="form-control"
                name="searchQuery"
                placeholder="Search"
                onBlur={handleSubmit}
                value={values.searchQuery}
                onChange={(e) => {
                  setFieldValue("searchQuery", e.target.value);
                  applyFilter({
                    ...values,
                    searchQuery: e.target.value,
                  });
                }}
              />
            </div>
            {/* <div className="col-12 col-md-6">
              <Field
                name="workflowType"
                component={Select}
                className={"form-control"}
                placeholder=""
                onBlur={handleBlur}
                onChange={(e) => {
                  const value =
                    e.target.value == "--Select--"
                      ? ""
                      : Number(e.target.value);
                  setFieldValue("workflowType", e.target.value);
                  applyFilter({
                    ...values,
                    workflowType: value,
                  });
                }}
                label={""}
                value={values.workflowType}
                autoComplete="off"
                children={CustomDropdown({
                  data: dashboard?.allEmployeeRequestTypeList || [],
                  firstElement: { label: "All", value: "" },
                })}
              />
            </div> */}
          {/* </div> */}
        </form>
      )}
    </Formik>
  );
};

export default DesignationWorkflowFormFilter;
