import React, { useEffect, useState } from "react";
import { SearchSelect } from "../_metronic/_helpers/SearchSelect";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
// import { fetchAllSubsidiaryData } from "../_metronic/redux/dashboardActions";

/**
 * Helper to get default subsidiary option
 * - If `value` is present, return the matching subsidiary
 * - Otherwise, return the subsidiary matching the defaultValue
 */
export const setDefaultSubsidiary = (
  value,
  allSubsidiaryList,
  defaultValue
) => {
  if (!Array.isArray(allSubsidiaryList)) return null;

  if (value) {
    return allSubsidiaryList.find((el) => el?.value === value) || null;
  } else {
    return allSubsidiaryList.find((el) => el?.value === defaultValue) || null;
  }
};

/**
 * SubsidiarySelect Component
 * - Shows a dropdown of subsidiaries
 * - Supports two modes:
 *   1. Uses `options` prop if provided (external options)
 *   2. Falls back to `allSubsidiaryList` from Redux store
 * - Initializes a default subsidiary if no current value is set
 */
export const SubsidiarySelect = ({
  name,
  label,
  isDisabled,
  onBlur,
  onChange,
  options, // external options (optional)
  value: propValue, // (not used directly, we use currentValue instead)
  initializeSubsidiary,
  isIntializeDisable, // function to set initial value in Formik
  error,
  touched,
  isAllValue,
  currentValue, // the currently selected subsidiaryId from Formik
}) => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  // Get subsidiary list from Redux if no external `options` are passed
  const { defaultSubsidiary, allSubsidiaryList } = useSelector(
    (state) => ({
      defaultSubsidiary: state?.auth?.user?.EmployeeMapping?.subsidiaryId,
      allSubsidiaryList: state?.dashboard?.allSubsidiaryList,
    }),
    shallowEqual
  );

  // Prepend "All" if required (but do not count it for initialization check)
  let effectiveOptions =
    options?.length > 0 ? options : allSubsidiaryList ?? [];

  const effectiveOptionsWithAll = isAllValue
    ? [{ value: null, label: "All" }, ...effectiveOptions]
    : effectiveOptions;

  useEffect(() => {
    // debugger
    // Only run initialization when we have real subsidiaries (not just "All")
    if (!initialized && effectiveOptions.length > 0) {
      setInitialized(true);

      const result = setDefaultSubsidiary(
        currentValue,
        effectiveOptions,
        defaultSubsidiary
      );

      if (result && !currentValue) {
        initializeSubsidiary(result);
        if (isIntializeDisable) {
          setInitialized(false);
        }
      }
    }
  }, [currentValue, defaultSubsidiary, initialized, effectiveOptions]);

  // Match the selected value
  const selectedValue =
    effectiveOptionsWithAll?.find((option) => option?.value === currentValue) ||
    null;

  return (
    <SearchSelect
      name={name}
      label={label}
      isDisabled={isDisabled}
      onBlur={onBlur}
      onChange={onChange}
      value={selectedValue}
      error={error}
      touched={touched}
      options={effectiveOptionsWithAll}
    />
  );
};
