import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllEmployeeShifts,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { Formik, Form, Field } from "formik";
import { format } from "date-fns";

export function EmployeeRosterFilterBar({ queryParams, setQueryParams, payrollData }) {
  const dispatch = useDispatch();
  
  // Get default dates from payrollData or use null
  const getDefaultDates = () => {
    return {
      from: payrollData?.startDate || null,
      to: payrollData?.endDate || null
    };
  };

  const [localFilters, setLocalFilters] = useState({
    employeeId: queryParams?.filter?.employeeId || null,
    shiftId: queryParams?.filter?.shiftId || null,
    ...getDefaultDates()
  });

  const { allEmployees, allEmployeeShifts, allSubsidiaryList } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
      allEmployeeShifts: state.dashboard.allEmployeeShifts,
      allSubsidiaryList: state.dashboard.allSubsidiaryList,
    }),
    shallowEqual
  );

  // Get the default subsidiary
  const defaultSubsidiary = useMemo(() => {
    return allSubsidiaryList?.find((el) => el?.isDefault)?.value;
  }, [allSubsidiaryList]);

  // Fetch employees and shifts for default subsidiary on component mount
  useEffect(() => {
    if (defaultSubsidiary) {
      dispatch(fetchAllActiveEmployeesBySubsidiary(defaultSubsidiary));
      dispatch(fetchAllEmployeeShifts("allEmployeeShifts"));
    }
  }, [defaultSubsidiary, dispatch]);

  // Update local filters when queryParams changes from parent
  useEffect(() => {
    if (queryParams?.filter) {
      setLocalFilters(prev => ({
        ...prev,
        employeeId: queryParams.filter.employeeId ?? null,
        shiftId: queryParams.filter.shiftId ?? null,
        from: queryParams.filter.from ?? payrollData?.startDate ?? null,
        to: queryParams.filter.to ?? payrollData?.endDate ?? null,
      }));
    }
  }, [queryParams?.filter, payrollData]);

  // Create dropdown options for shifts
  const shiftOptions = useMemo(() => {
    return (
      allEmployeeShifts?.map((shift) => ({
        label: shift.label,
        value: shift.value,
      })) || []
    );
  }, [allEmployeeShifts]);

  // Create dropdown options for employees
  const employeeOptions = useMemo(() => {
    return (
      allEmployees?.map((emp) => ({
        label: emp.label,
        value: emp.value,
      })) || []
    );
  }, [allEmployees]);

  const handleFilterChange = (field, value) => {
    const updatedFilters = {
      ...localFilters,
      [field]: value,
    };
    setLocalFilters(updatedFilters);

    // Update queryParams with the new filter
    setQueryParams({
      ...queryParams,
      filter: {
        ...queryParams?.filter,
        [field]: value,
      },
      pageNumber: 1, // Reset to first page when filter changes
    });
  };

  const handleResetFilters = () => {
    // Get default dates from payrollData
    const defaultDates = getDefaultDates();
    
    const defaultFilters = {
      employeeId: null,
      shiftId: null,
      from: defaultDates.from,
      to: defaultDates.to,
    };
    
    setLocalFilters(defaultFilters);

    // Keep subsidiaryId from existing filter if present
    const subsidiaryId = queryParams?.filter?.subsidiaryId || null;

    setQueryParams({
      ...queryParams,
      filter: {
        subsidiaryId: subsidiaryId,
        employeeId: null,
        shiftId: null,
        from: defaultDates.from,
        to: defaultDates.to,
      },
      pageNumber: 1,
    });
  };

  return (
    <div className="mt-2">
      <Formik
        initialValues={localFilters}
        enableReinitialize={true}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched, handleBlur }) => (
          <Form className="form">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Employee Filter */}
              <div>
                <label className=" mb-1 block">
                  Employee
                </label>
                <SearchSelect
                  name="employeeId"
                  onChange={(e) => {
                    const value = e?.value || null;
                    setFieldValue("employeeId", value);
                    handleFilterChange("employeeId", value);
                  }}
                  onBlur={handleBlur}
                  value={
                    employeeOptions?.find(
                      (option) => option.value === values.employeeId
                    ) || null
                  }
                  options={employeeOptions}
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select Employee"
                  autoComplete="off"
                />
              </div>

              {/* Shift Filter */}
              {/* <div>
                <label className=" mb-1 block">
                  Shift
                </label>
                <SearchSelect
                  name="shiftId"
                  onChange={(e) => {
                    const value = e?.value || null;
                    setFieldValue("shiftId", value);
                    handleFilterChange("shiftId", value);
                  }}
                  onBlur={handleBlur}
                  value={
                    shiftOptions?.find(
                      (option) => option.value === values.shiftId
                    ) || null
                  }
                  options={shiftOptions}
                  isClearable={true}
                  isSearchable={true}
                  placeholder="Select Shift"
                  autoComplete="off"
                />
              </div> */}

              {/* From Date Filter */}
              <div>
                <label className=" mb-1 block">
                  From Date
                </label>
                <Field
                  name="from"
                  component={DatePickerField}
                  dateFormat="dd-MMM-yyyy"
                  onChange={(date) => {
                    const value = date ? format(date, "yyyy-MM-dd") : null;
                    setFieldValue("from", value);
                    handleFilterChange("from", value);
                  }}
                  onBlur={handleBlur}
                  autoComplete="off"
                  placeholder="From Date"
                />
              </div>

              {/* To Date Filter */}
              <div>
                <label className=" mb-1 block">
                  To Date
                </label>
                <Field
                  name="to"
                  component={DatePickerField}
                  dateFormat="dd-MMM-yyyy"
                  minDate={values.from ? new Date(values.from) : null}
                  onChange={(date) => {
                    const value = date ? format(date, "yyyy-MM-dd") : null;
                    setFieldValue("to", value);
                    handleFilterChange("to", value);
                  }}
                  onBlur={handleBlur}
                  autoComplete="off"
                  placeholder="To Date"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-light btn-sm"
              >
                Reset Filters
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}