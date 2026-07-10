import React, { useMemo } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import * as actions from "../../../_redux/redux-Actions";
import { useTicketEscalationPolicyUIContext } from "../FormUIContext";

export function TicketEscalationPolicyFilter() {
  const dispatch = useDispatch();
  const UIContext = useTicketEscalationPolicyUIContext();

  const UIProps = useMemo(() => ({
    queryParams: UIContext.queryParams,
    setQueryParams: UIContext.setQueryParams,
  }), [UIContext]);

  const initialValues = {
    searchText: UIProps.queryParams?.filter?.searchQuery || "",
  };

  const applyFilter = (values) => {
    const newQueryParams = {
      ...UIProps.queryParams,
      filter: values.searchText ? { searchQuery: values.searchText } : {},
      pageNumber: 1,
    };
    UIProps.setQueryParams(newQueryParams);
    dispatch(actions.fetchTicketEscalationPolicies(newQueryParams));
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