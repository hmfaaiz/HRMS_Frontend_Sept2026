import React, { useMemo, useEffect } from "react"
import { Formik } from "formik"
import { isEqual, debounce } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { InputSearch } from "../../../../../utils/common-modules/InputSearch"
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";

const requestFilter = [
  { label: "Pending", value: "P" },
  { label: "Approved", value: "A" },
  { label: "Rejected", value: "R" },
];

const prepareFilter = (queryParams, values) => {
  const { searchText, subsidiaryId, departmentId, designationId, requestStatus } = values;
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

  if (subsidiaryId !== undefined) {
    if (subsidiaryId) filter.subsidiaryId = subsidiaryId;
    else delete filter.subsidiaryId;
  }

  if (departmentId !== undefined) {
    if (departmentId) filter.departmentId = departmentId;
    else delete filter.departmentId;
  }

  if (designationId !== undefined) {
    if (designationId) filter.designationId = designationId;
    else delete filter.designationId;
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
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { dashboard } = useSelector((state) => state);

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
  }, [dispatch]);

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
        subsidiaryId: formUIProps.queryParams?.filter?.subsidiaryId || "",
        departmentId: formUIProps.queryParams?.filter?.departmentId || "",
        designationId: formUIProps.queryParams?.filter?.designationId || "",
        requestStatus: formUIProps.queryParams?.filter?.request_status || ["P"],
      }}
      onSubmit={(values) => {
        debouncedApplyFilter(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <form className="form form-label-right" style={{ margin: '0.8rem 0' }}>
          <div className="grid grid-cols-12 gap-3 mb-2">
            <div className="col-span-12 sm:col-span-2">
              <SearchSelect
                name="subsidiaryId"
                label={<span>Subsidiary</span>}
                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allSubsidiaryList || []),
                ]}
                value={
                  [{ label: "All", value: "" }, ...(dashboard?.allSubsidiaryList || [])]
                    ?.find((opt) => opt.value === values?.subsidiaryId) || { label: "All", value: "" }
                }
                onChange={(e) => {
                  const val = e?.value || "";
                  setFieldValue("subsidiaryId", val);
                  debouncedApplyFilter({ ...values, subsidiaryId: val });
                }}
              />
            </div>

            <div className="col-span-12 sm:col-span-2">
              <SearchSelect
                name="departmentId"
                label={<span>Department</span>}
                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allDept || []),
                ]}
                value={
                  [{ label: "All", value: "" }, ...(dashboard?.allDept || [])]
                    ?.find((opt) => opt.value === values?.departmentId) || { label: "All", value: "" }
                }
                onChange={(e) => {
                  const val = e?.value || "";
                  setFieldValue("departmentId", val);
                  debouncedApplyFilter({ ...values, departmentId: val });
                }}
              />
            </div>

            <div className="col-span-12 sm:col-span-2">
              <SearchSelect
                name="designationId"
                label={<span>Designation</span>}
                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allDesignations || []),
                ]}
                value={
                  [{ label: "All", value: "" }, ...(dashboard?.allDesignations || [])]
                    ?.find((opt) => opt.value === values?.designationId) || { label: "All", value: "" }
                }
                onChange={(e) => {
                  const val = e?.value || "";
                  setFieldValue("designationId", val);
                  debouncedApplyFilter({ ...values, designationId: val });
                }}
              />
            </div>

            <div className="col-span-12 sm:col-span-2">
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
