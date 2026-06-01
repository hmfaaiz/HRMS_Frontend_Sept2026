import React, { useMemo } from "react";
import { useFormUIContext } from "../FormUIContext";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function FormFilter() {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => ({
    taskFilter: formUIContext.taskFilter,
    setTaskFilter: formUIContext.setTaskFilter,
  }), [formUIContext]);

  return (
    <div className="d-flex align-items-center gap-3 mb-3">
      <label className="font-bold mb-0 text-sm text-black text-nowrap">
        Task Status:
      </label>
      <div className="d-flex gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`btn btn-sm ${
              formUIProps.taskFilter === opt.value
                ? "btn-primary"
                : "btn-light"
            }`}
            onClick={() => formUIProps.setTaskFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
