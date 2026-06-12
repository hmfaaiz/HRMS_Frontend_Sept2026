import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

export function FormData() {
  // Customer UI Context
  const dispatch = useDispatch();
  const [budgetYearId, setBudgetYearId] = useState("");
  const { data, loading, budgetyearBySubList } = useSelector(
    (state) => ({
      data: state.manpower_budget_dashboard?.data,
      loading: state.manpower_budget_dashboard?.actionsLoading,
      budgetyearBySubList: state?.dashboard?.budgetyearBySubList,
    }),
    shallowEqual,
  );

  // Prepare options with "All" option
  const budgetYearOptions = React.useMemo(() => {
    if (!budgetyearBySubList?.length) return [];

    const allOption = {
      label: "All",
      value: "",
    };

    return [allOption, ...budgetyearBySubList];
  }, [budgetyearBySubList]);

  useEffect(() => {
    if (!budgetyearBySubList?.length) return;

    // Don't auto-set any value, keep it empty for "All"
    // Only set if budgetYearId is empty and we want to show something
    // But per requirements, we keep it empty
  }, [budgetyearBySubList]);

  useEffect(() => {
    // Only call API when a specific budget year is selected (not empty string)
    if (budgetYearId && budgetYearId !== "") {
      dispatch(actions?.fetchDasboardData({ budgetYearId }));
    } else {
      dispatch(actions?.fetchDasboardData({ budgetYearId })); // Uncomment if needed
    }
  }, [budgetYearId, dispatch]);

  return (
    <div className="grid grid-cols-8">
          <div className="col-span-6"></div>

      <div className="last:col-span-2">
        <SearchSelect
          name="budgetPeriodId"
          label={<span>Budget Year</span>}
          onChange={(e) => setBudgetYearId(e?.value || "")}
          value={
            budgetYearOptions?.find(
              (option) => option.value === budgetYearId,
            ) || ""
          }
          options={budgetYearOptions}
        />
      </div>
    </div>
  );
}
