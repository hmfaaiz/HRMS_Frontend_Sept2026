import React, { useEffect, useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllActiveCustomers } from "../../../../Dashboard/_redux/dashboardActions";

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
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const { dashboard } = useSelector((state) => state);

  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      setCustomerId: formUIContext.setCustomerId,
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
    dispatch(fetchAllActiveCustomers());
  }, [dispatch]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          searchText: "",
          customerId: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="grid grid-cols-3 gap-x-2 items-end">
              <div className="grid grid-cols-5 gap-x-2 col-span-2">
                <div>
                  <SearchSelect
                    name="customerId"
                    label={<span>Customer</span>}
                    value={
                      [
                        { label: "Select", value: "" },
                        ...dashboard?.allCustomers,
                      ]?.find((el) => el?.value == values?.customerId) || ""
                    }
                    options={
                      [
                        { label: "Select", value: "" },
                        ...dashboard?.allCustomers,
                      ] || []
                    }
                    onChange={(e) => {
                      setFieldValue("customerId", e?.value);
                      const updateValue = {
                        ...formUIProps.queryParams,
                        filter: {
                          ...formUIProps?.queryParams?.filter,
                          projectId: e?.value,
                        },
                      };
                      formUIProps.setCustomerId(e?.value);
                      formUIProps.setQueryParams(updateValue);
                    }}
                  />
                </div>
                {values?.customerId ? (
                  <p className="m-0 underline font-size-sm text-black flex items-end ms-2">
                    <a
                      target="_blank"
                      href={`${process.env.REACT_APP_CUSTOMER_PORTAL_URL +
                        values?.customerId}`}
                    >
                      Go To Customer Portal
                    </a>
                  </p>
                ) : (
                  ""
                )}
              </div>
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
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
