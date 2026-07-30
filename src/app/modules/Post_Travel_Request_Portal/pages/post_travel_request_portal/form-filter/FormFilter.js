import React, { useMemo } from "react"
import { Formik } from "formik"
import { isEqual, debounce } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { InputSearch } from "../../../../../utils/common-modules/InputSearch"
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";

const requestFilter = [
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Rejected", value: 2 },
];

const prepareFilter = (queryParams, values) => {
  const { searchText, approvedStatus } = values;
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

  // Map form field 'approvedStatus' to backend field 'approved_status'
  if (approvedStatus !== undefined) {
    if (approvedStatus && approvedStatus.length > 0) filter.approved_status = approvedStatus;
    else delete filter.approved_status;
    delete filter.approvedStatus;
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
        approvedStatus: formUIProps.queryParams?.filter?.approved_status || [0],
      }}
      onSubmit={(values) => {
        debouncedApplyFilter(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <form className="form form-label-right">
          <div style={{ width: "120px" }}>
            <MultiSelect
              label={<span>Status</span>}
              options={requestFilter}
              value={requestFilter?.filter((el) =>
                values?.approvedStatus?.includes(Number(el.value)),
              ) || []}
              onChange={(items = []) => {
                const vals = items.map(el => Number(el.value));
                setFieldValue("approvedStatus", vals);
                debouncedApplyFilter({ ...values, approvedStatus: vals });
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
