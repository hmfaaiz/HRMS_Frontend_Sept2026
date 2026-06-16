import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const DepartmentWiseBudget = () => {
  const {
    portal_department_wise_budget,
    auth,

  } = useSelector(
    (state) => ({
      portal_department_wise_budget: state?.auth?.userAccess.portal_department_wise_budget,

      auth: state?.auth?.userAccess,
    }),
    shallowEqual,
  );

  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">Task Assignment</h6>

        {portal_department_wise_budget?.length > 0 ?(
          <>
            {portal_department_wise_budget?.length > 0 && (
              <div className="font-size-xs text-black font-bold">
                <p className="m-0 underline">
                  <Link to="/portal_department_wise_budget/read-all-portal-department-wise-budget">
              Manpower Budget
                  </Link>
                </p>
              </div>
            )}

           
          </>
        ) : (
          <p className="text-sm mb-0">No Record</p>
        )}
      </div>
    </>
  );
};
