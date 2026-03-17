import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { CirclePlus } from "lucide-react";

const prepareFilter = (queryParams, values) => {
  const { searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText;
  }

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFilter({ accessUser, newButtonClick }) {
  const formUIContext = useFormUIContext();

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

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          searchText: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="flex gap-2 justify-end items-center">
              <InputSearch
                values={values}
                fieldName="searchText"
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
              />
              {accessUser && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={newButtonClick}
                >
                  <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              )}
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
