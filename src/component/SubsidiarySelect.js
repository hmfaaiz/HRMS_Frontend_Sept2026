import React, { useEffect, useState } from "react";
import { SearchSelect } from "../_metronic/_helpers/SearchSelect";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { fetchAllSubsidiaryData } from "../_metronic/redux/dashboardActions";

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

export const SubsidiarySelect = ({
  name,
  label,
  isDisabled,
  onBlur,
  onChange,
  value: propValue,
  initializeSubsidiary,
  error,
  touched,
  currentValue,
}) => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  const { defaultSubsidiary, allSubsidiaryList } = useSelector(
    (state) => ({
      defaultSubsidiary: state?.auth?.user?.EmployeeMapping?.subsidiaryId,
      allSubsidiaryList: state?.dashboard?.allSubsidiaryList,
    }),
    shallowEqual
  );
  useEffect(() => {
    if (!initialized && allSubsidiaryList?.length > 0) {
      setInitialized(true);
      const result = setDefaultSubsidiary(
        currentValue,
        allSubsidiaryList,
        defaultSubsidiary
      );

      if (result && !currentValue) {
        initializeSubsidiary(result);
      }
    }
  }, [currentValue, defaultSubsidiary, initialized, allSubsidiaryList]);

  const selectedValue =
    allSubsidiaryList?.find((option) => option.value === currentValue) || null;

//   useEffect(() => {
//       dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
//   }, []);

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
      options={allSubsidiaryList}
    />
  );
};
