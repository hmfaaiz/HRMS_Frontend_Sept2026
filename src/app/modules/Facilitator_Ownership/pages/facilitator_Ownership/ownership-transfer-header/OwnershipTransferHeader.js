import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";

export default function OwnershipTransferHeader({ onFilter,reset }) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector(
    (state) => ({ dashboard: state.dashboard }),
    shallowEqual,
  );

  // ---------------- STATES ----------------
  const [fromSubsidiary, setFromSubsidiary] = useState(null);
  const [fromDepartment, setFromDepartment] = useState(null);
  const [fromEmployee, setFromEmployee] = useState(null);

  const [toSubsidiary, setToSubsidiary] = useState(null);
  const [toDepartment, setToDepartment] = useState(null);
  const [toEmployee, setToEmployee] = useState(null);

  const [allSubsidiaries, setAllSubsidiaries] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);


  const [employeesBySubsidiary, setEmployeesBySubsidiary] = useState({});

  const [lastRequestedSubsidiary, setLastRequestedSubsidiary] = useState(null);

  useEffect(() => {
    setFromSubsidiary(null);
    setFromDepartment(null);
    setFromEmployee(null);
    setToSubsidiary(null);
    setToDepartment(null);
    setToEmployee(null);
  }, [reset]);

  // ---------------- FETCH STATIC DATA ----------------
  useEffect(() => {
    dispatch(dashboardActions.fetchAllSubsidiaryData("allSubsidiaryData"));
    dispatch(dashboardActions.fetchAllDept());
  }, [dispatch]);

  // ---------------- FETCH EMPLOYEES ----------------
  useEffect(() => {
    if (fromSubsidiary) {
      setLastRequestedSubsidiary(fromSubsidiary);
      dispatch(
        dashboardActions.fetchAllActiveEmployeesBySubsidiary(fromSubsidiary),
      );
    }
  }, [fromSubsidiary, dispatch]);

  useEffect(() => {
    if (toSubsidiary) {
      setLastRequestedSubsidiary(toSubsidiary);
      dispatch(
        dashboardActions.fetchAllActiveEmployeesBySubsidiary(toSubsidiary),
      );
    }
  }, [toSubsidiary, dispatch]);

  // ---------------- MAP SUBSIDIARIES & DEPARTMENTS ----------------
  useEffect(() => {
    if (dashboard?.allSubsidiaryData?.length) {
      setAllSubsidiaries(
        dashboard.allSubsidiaryData.map((s) => ({
          value: s.value,
          label: s.label,
        })),
      );
    }

    if (dashboard?.allDept?.length) {
      setAllDepartments(
        dashboard.allDept.map((d) => ({
          value: d.value,
          label: d.label,
          subsidiaryIds: d.subsidiaryId?.map(Number) || [],
        })),
      );
    }
  }, [dashboard.allSubsidiaryData, dashboard.allDept]);

  // ---------------- STORE EMPLOYEES (SAFE) ----------------
  useEffect(() => {
    if (dashboard?.allEmployees?.length && lastRequestedSubsidiary) {
      const mapped = dashboard.allEmployees.map((emp) => ({
        value: emp.value,
        label: emp.label,
        departmentId: emp.departmentId,
      }));

      setEmployeesBySubsidiary((prev) => ({
        ...prev,
        [lastRequestedSubsidiary]: mapped,
      }));
    }
  }, [dashboard.allEmployees, lastRequestedSubsidiary]);

  // ---------------- FILTER DEPARTMENTS ----------------
  const fromDepartments = allDepartments.filter((d) =>
    d.subsidiaryIds.includes(Number(fromSubsidiary)),
  );

  const toDepartments = allDepartments.filter((d) =>
    d.subsidiaryIds.includes(Number(toSubsidiary)),
  );

  // ---------------- FILTER EMPLOYEES ----------------
  const fromEmployees =
    employeesBySubsidiary[fromSubsidiary]?.filter(
      (e) => e.departmentId === fromDepartment,
    ) || [];

  // Remove selected fromEmployee from the To Employee options
  const toEmployees =
    employeesBySubsidiary[toSubsidiary]?.filter(
      (e) => e.departmentId === toDepartment && e.value !== fromEmployee,
    ) || [];

  // ---------------- RENDER ----------------
  return (
    <div className="space-y-6">
      {/* FROM */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-3 col-span-12 items-end">
        <div className="ml-3">
          <SearchSelect
            label="Subsidiary"
            options={allSubsidiaries}
            value={
              allSubsidiaries.find((o) => o.value === fromSubsidiary) || null
            }
            onChange={(e) => {
              setFromSubsidiary(e?.value || null);
              setFromDepartment(null);
              setFromEmployee(null);
            }}
          />
        </div>

        <div className="ml-3">
          <SearchSelect
            label="Department"
            options={fromDepartments}
            value={
              fromDepartments.find((o) => o.value === fromDepartment) || null
            }
            onChange={(e) => {
              setFromDepartment(e?.value || null);
              setFromEmployee(null);
            }}
            isDisabled={!fromSubsidiary}
          />
        </div>

        <div className="ml-3">
          <SearchSelect
            label="From Employee"
            options={fromEmployees}
            value={fromEmployees.find((e) => e.value === fromEmployee) || null}
            onChange={(e) => setFromEmployee(e?.value || null)}
            isDisabled={!fromDepartment}
          />
        </div>
      </div>

      {/* TO */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-3 col-span-12 items-end">
        <div className="ml-3">
          <SearchSelect
            label="Subsidiary"
            options={allSubsidiaries}
            value={
              allSubsidiaries.find((o) => o.value === toSubsidiary) || null
            }
            onChange={(e) => {
              setToSubsidiary(e?.value || null);
              setToDepartment(null);
              setToEmployee(null);
            }}
          />
        </div>

        <div className="ml-3">
          <SearchSelect
            label="Department"
            options={toDepartments}
            value={toDepartments.find((o) => o.value === toDepartment) || null}
            onChange={(e) => {
              setToDepartment(e?.value || null);
              setToEmployee(null);
            }}
            isDisabled={!toSubsidiary}
          />
        </div>

        <div className="ml-3">
          <SearchSelect
            label="To Employee"
            options={toEmployees}
            value={toEmployees.find((e) => e.value === toEmployee) || null}
            onChange={(e) => setToEmployee(e?.value || null)}
            isDisabled={!toDepartment}
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end">
        <button
          className="btn btn-primary mt-6"
          onClick={() =>
            onFilter({
              fromSubsidiary,
              fromDepartment,
              fromEmployee,
              toSubsidiary,
              toDepartment,
              toEmployee,
            })
          }
        >
          Filter
        </button>
      </div>
    </div>
  );
}
