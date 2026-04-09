import React, { useMemo } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import * as actions from "../../../_redux/facilitatorSetupActions";
import { useFacilitatorUIContext } from "../Facilitator_SetupUIContext";

export function FacilitatorFilter() {
  const dispatch = useDispatch();
  const facilitatorUIContext = useFacilitatorUIContext();

  const facilitatorUIProps = useMemo(
    () => ({
      queryParams: facilitatorUIContext.queryParams,
      setQueryParams: facilitatorUIContext.setQueryParams,
    }),
    [facilitatorUIContext]
  );

  const initialValues = {
    searchText: facilitatorUIProps.queryParams?.searchText || "",
  };

  const applyFilter = (values) => {
    const newQueryParams = {
      ...facilitatorUIProps.queryParams,
      filter: values.searchText ? { searchQuery: values.searchText } : {},
      pageNumber: 1,
    };
    facilitatorUIProps.setQueryParams(newQueryParams);
    dispatch(actions.fetchFacilitatorSetups(newQueryParams));
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={applyFilter}>
      {({ values, handleSubmit, handleBlur, setFieldValue }) => (
        <form onSubmit={handleSubmit} className="form form-label-right">
          <div className="flex justify-end w-full">
            <div className="max-w-xs">
              <InputSearch
                values={values}
                fieldName="searchText"
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                placeholder="Search..."
              />
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}
