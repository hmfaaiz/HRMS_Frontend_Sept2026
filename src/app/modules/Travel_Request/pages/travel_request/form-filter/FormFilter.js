import React, { useMemo } from "react"
import { Formik } from "formik"
import { isEqual, debounce } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { InputSearch } from "../../../../../utils/common-modules/InputSearch"
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";

const requestFilter = [
  { label: "Pending", value: "P" },
  { label: "Approved", value: "A" },
  { label: "Rejected", value: "R" },
];

const prepareFilter = (queryParams, values) => {
  const { searchText, requestStatus } = values;
  const newQueryParams = { ...queryParams };
  const filter = { ...queryParams.filter };

  if (searchText !== undefined) {
    if (searchText) {
      filter.searchQuery = searchText;
      newQueryParams.searchQuery = searchText;
    } else {
      delete filter.searchQuery;
      delete newQueryParams.searchQuery;
    }
  }

  // Map form field 'requestStatus' to backend field 'request_status'
  if (requestStatus !== undefined) {
    if (requestStatus && requestStatus.length > 0) filter.request_status = requestStatus;
    else delete filter.request_status;
    delete filter.requestStatus;
  }

  newQueryParams.filter = filter;
  return newQueryParams;
};

export function FormFilter() {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const debouncedApplyFilter = useMemo(
    () =>
      debounce((values) => {
        formUIProps.setQueryParams((prev) => {
          const newQueryParams = prepareFilter(prev, values);
          if (!isEqual(newQueryParams, prev)) {
            return { ...newQueryParams, pageNumber: 1 };
          }
          return prev;
        });
      }, 400),
    [formUIProps.setQueryParams],
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        requestStatus: formUIProps.queryParams?.filter?.request_status || ["P"],
      }}
      onSubmit={(values) => {
        debouncedApplyFilter(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <form className="form form-label-right">
          <div style={{ width: "180px", paddingLeft: "12px" }}>
            <MultiSelect
              label={<span>Status</span>}
              options={requestFilter}
              value={requestFilter?.filter((el) =>
                values?.requestStatus?.includes(String(el.value)),
              ) || []}
              onChange={(items = []) => {
                const vals = items.map(el => String(el.value));
                setFieldValue("requestStatus", vals);
                debouncedApplyFilter({ ...values, requestStatus: vals });
              }}
            />
          </div>
        </form>
      )}
    </Formik>
  );
}

export function FormSearch() {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const debouncedApplyFilter = useMemo(
    () =>
      debounce((values) => {
        formUIProps.setQueryParams((prev) => {
          const newQueryParams = prepareFilter(prev, values);
          if (!isEqual(newQueryParams, prev)) {
            return { ...newQueryParams, pageNumber: 1 };
          }
          return prev;
        });
      }, 500),
    [formUIProps.setQueryParams],
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        searchText: formUIProps.queryParams?.filter?.searchQuery || "",
      }}
      onSubmit={(values) => {
        debouncedApplyFilter(values);
      }}
    >
      {({ values, handleSubmit, handleBlur, setFieldValue }) => (
        <form className="form form-label-right">
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
  );
}
