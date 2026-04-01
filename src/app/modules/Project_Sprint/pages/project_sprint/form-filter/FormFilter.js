import React, { useEffect, useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects } from "../../../../Dashboard/_redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../_redux/redux-Actions";

const prepareFilter = (queryParams, values) => {
  const { searchText, projectId } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};
  if (searchText) {
    filter.searchQuery = searchText;
  }
  if (projectId) {
    filter.projectId = projectId;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFilter({ listLoading }) {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          searchText: "",
          projectId: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <form
            onSubmit={handleSubmit}
            className="form form-label-right grid grid-cols-3 gap-x-3 items-end"
          >
            <div className="col-span-2">
              <SearchSelect
                name="projectId"
                label={
                  <span>
                    Project <span style={{ color: "red" }}>*</span>
                  </span>
                }
                value={dashboard?.allProjects?.find(
                  (el) => el?.value === values?.sprintOwnerEmpId,
                )}
                options={dashboard.allProjects || []}
                onChange={(e) => {
                  setFieldValue("projectId", e.value);
                  handleSubmit();
                  dispatch(actions.fetchLinkedTickets(e?.value));
                }}
              />
            </div>
            <InputSearch
              values={values}
              fieldName="searchText"
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
            />
          </form>
        )}
      </Formik>
    </>
  );
}
