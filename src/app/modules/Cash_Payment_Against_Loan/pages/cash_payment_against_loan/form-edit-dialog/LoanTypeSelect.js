import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Eye, XCircle } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";

export function LoanTypeSelect({
  employeeId,
  loanTypeId,         
  setLoanTypeId,
  loanPanelMode,
  setLoanPanelMode,
}) {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const { loanRequests, loanTypeList } = useSelector(
    (state) => ({
      loanRequests: state.employee_loan_request?.entities  || [],
      loanTypeList: state.employee_loan_request?.loan_type || [],
    }),
    shallowEqual
  );

  // Reset only when employee changes (not when loanTypeId changes from row click)
  useEffect(() => {
    setLoanPanelMode(false);
    setIsFetching(false);
    setHasFetched(false);
    dispatch(actions.clearLoanOutstanding());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  
  useEffect(() => {
    if (loanTypeId) {
      setHasFetched(true);
    }
  }, [loanTypeId]);

  // Only active + continuing loan types
  // Active + continuing loans for new selection,
  // PLUS always include the pre-selected loanTypeId (edit/view from table row)
  const activeLoanOptions = React.useMemo(() => {
    const activeIds = new Set();

    if (employeeId && loanRequests?.length) {
      loanRequests
        .filter((lr) => lr.isActive && lr.isLoanContinuing)
        .forEach((lr) => activeIds.add(lr.loan_typeId));
    }

    // Always include the currently selected value so edit/view always shows it
    if (loanTypeId) activeIds.add(Number(loanTypeId));

    return [...activeIds].reduce((acc, ltId) => {
      const match = loanTypeList.find((lt) => lt.value === ltId);
      if (match) acc.push({ label: match.label, value: match.value });
      return acc;
    }, []);
  }, [loanRequests, loanTypeList, employeeId, loanTypeId]);

  const handleLoanTypeChange = async (e, setFieldValue) => {
    const val = e?.value === "Select" || !e?.value ? "" : Number(e.value);
    setFieldValue("loan_typeId", val);
    setLoanTypeId(val);
    setLoanPanelMode(false);
    setHasFetched(false);

    if (val && employeeId) {
      setIsFetching(true);
      await dispatch(actions.fetchLoanOutstanding(employeeId, val));
      setIsFetching(false);
      setHasFetched(true);
    } else {
      dispatch(actions.clearLoanOutstanding());
    }
  };

  return (

    <Formik
      enableReinitialize={true}
      initialValues={{ loan_typeId: loanTypeId || "" }}
    >
      {({ values, setFieldValue }) => (
        <Form className="form form-label-right">
          <fieldset>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 mt-2 col-span-12">

              {/* Loan Type dropdown */}
              <div className="ml-3">
                <SearchSelect
                  name="loan_typeId"
                  label={<span>Loan Type</span>}
                  isDisabled={!employeeId}
                  onChange={(e) => handleLoanTypeChange(e, setFieldValue)}
                  value={
                    activeLoanOptions.find(
                      (o) => o.value === Number(values.loan_typeId)
                    ) || null
                  }
                  options={[
                    { label: "Select", value: "" },
                    ...activeLoanOptions,
                  ]}
                  isSearchable={true}
                />
                {/* {!employeeId && (
                  <small className="text-muted" style={{ fontStyle: "italic" }}>
                    Select an employee first
                  </small>
                )} */}
                {employeeId && activeLoanOptions.length === 0 && (
                  <small className="text-warning" style={{ fontStyle: "italic" }}>
                    No active loans found for this employee
                  </small>
                )}
              </div>

              {/* View Details / Cancel button */}
              <div className="mt-6">
                {loanPanelMode ? (
                  <button
                    type="button"
                    className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                    onClick={() => setLoanPanelMode(false)}
                  >
                    <XCircle className="w-3 h-3 text-black" />
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => setLoanPanelMode(true)}
                    disabled={!values.loan_typeId || isFetching || !hasFetched}
                  >
                    {isFetching ? (
                      <>
                        <span className="spinner spinner-white spinner-sm mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}