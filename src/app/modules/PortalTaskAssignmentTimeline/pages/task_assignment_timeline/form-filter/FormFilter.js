import React, { useEffect, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import { FileText, FileSpreadsheet, Sheet, CirclePlus } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { fetchAllEmployeesWithNoPermissionData } from "../../../../../../_metronic/redux/dashboardActions";
import { useDispatch, useSelector } from "react-redux";
import { formatDates, getFirstDayOfCurrentMonth, getLastDayOfCurrentMonth } from "../../../../../utils/common";
export function FormFilter({
  employees = [],
  ticketTypes = [],
  ticketStatuses = [],
  priorityLevels = [],
  loading,
  onPrint,
  showTicketDetails,
  onTicketDetailsChange,
  setCurrentStatusToggle,
  currentStatusToggle,
}) {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const { hasRecords, queryParams } = uiContext;
  const dispatch = useDispatch();
  const uiProps = useMemo(
    () => ({
      queryParams: uiContext.queryParams || {},
      setQueryParams: uiContext.setQueryParams,
    }),
    [uiContext],
  );

  const ticketStatusOptions = [
    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];


  const assignmentTypeOptions = [
    { value: 0, label: "All" },
    { value: 1, label: "Assign By" },
    { value: 2, label: "Assign To" },

  ];

  const applyFilter = (values) => {
    const cleanFilter = { ...values };
    Object.keys(cleanFilter).forEach((k) => {
      if (
        cleanFilter[k] === null ||
        cleanFilter[k] === "" ||
        (Array.isArray(cleanFilter[k]) && cleanFilter[k].length === 0)
      ) {
        delete cleanFilter[k];
      }
    });
    uiProps.setQueryParams({
      ...uiProps.queryParams,
      filter: {
        ...cleanFilter,
        ticketStatusIds:
          cleanFilter.ticketStatus != null ? [cleanFilter.ticketStatus] : [],
      },
      pageNumber: 1,
      isFiltered: true,
      pdf: false,
      csv: false,
      excel: false,
    });
    uiContext.setShowFilter(true);
  };

  const handleExport = (type) => {
    if (!queryParams.isFiltered) {
      alert("Please apply filter before downloading.");
      return;
    }
    if (!hasRecords) {
      alert("No records available to download.");
      return;
    }
    onPrint(type);
  };

  const {
    allEmployeesWithNoPermissionList,

  } = useSelector((state) => state.dashboard);
  useEffect(() => {
    dispatch(
      fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList"),
    );
  }, [dispatch]);
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployeesWithNoPermissionList?.map((item) => [item.value, item]));
  }, [allEmployeesWithNoPermissionList]);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        ticketTypeIds: uiProps.queryParams?.filter?.ticketTypeIds || [],
        // ticketStatus: uiProps.queryParams?.filter?.ticketStatus || null,
        employeeId: uiProps.queryParams?.filter?.employeeId || "",
        assignment_type: uiProps.queryParams?.filter?.assignment_type || 0,
        ticketStatus: 1,
        priorityLevelIds: uiProps.queryParams?.filter?.priorityLevelIds || [],
        ticketDescription: uiProps.queryParams?.filter?.ticketDescription || "",
        // ticketDateFrom: uiProps.queryParams?.filter?.ticketDateFrom || null,
        // ticketDateTo: uiProps.queryParams?.filter?.ticketDateTo || null,

        ticketDateFrom: formatDates(getFirstDayOfCurrentMonth(), "dd-MMM-yyyy") || "",
        ticketDateTo: formatDates(getLastDayOfCurrentMonth(), "dd-MMM-yyyy") || "",
        dueDateFrom: uiProps.queryParams?.filter?.dueDateFrom || null,
        dueDateTo: uiProps.queryParams?.filter?.dueDateTo || null,

        priorityLevelIds: priorityLevels.map(pl => pl.value) || [],
        ticketTypeIds: ticketTypes.map(pl => pl.value) || []
      }}
      onSubmit={applyFilter}
    >
      {({ values, setFieldValue, handleSubmit, handleReset }) => (
        <>
          <Form className="form form-label-right">
            <fieldset>
              <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
              <div className="grid grid-cols-12 gap-4 mb-2 ">



                <div className="col-span-6 sm:col-span-2">
                  <MultiSelect
                    name="ticketTypeIds"
                    label="Ticket Type"
                    value={ticketTypes?.filter((tt) =>
                      values.ticketTypeIds.includes(tt.value),
                    )}
                    options={ticketTypes}
                    onChange={(items = []) =>
                      setFieldValue(
                        "ticketTypeIds",
                        items.map((i) => i.value),
                      )
                    }
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <MultiSelect
                    name="priorityLevelIds"
                    label="Priority Level"
                    value={priorityLevels.filter((pl) =>
                      values.priorityLevelIds.includes(pl.value),
                    )}
                    options={priorityLevels}
                    onChange={(items = []) =>
                      setFieldValue(
                        "priorityLevelIds",
                        items.map((i) => i.value),
                      )
                    }
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <SearchSelect
                    name="ticketStatus"
                    label="Ticket Status"
                    value={
                      ticketStatusOptions.find(
                        (o) => o.value === values.ticketStatus,
                      ) || { label: "All", value: null }
                    }
                    options={[
                      { label: "All", value: null },
                      ...ticketStatusOptions,
                    ]}
                    onChange={(e) =>
                      setFieldValue(
                        "ticketStatus",
                        e?.value === null ? null : e.value,
                      )
                    }
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="form-label">Ticket Description</label>
                  <Field
                    name="ticketDescription"
                    type="text"
                    className="form-control"
                    placeholder="Ticket Description"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <Field
                    name="employeeId"
                    component={SearchSelect}

                    onChange={(e) => {
                      const value = e.value == "All" ? "" : e.value;
                      setFieldValue("employeeId", value);
                      if (e?.value === "All" || e?.value === "") {
                        setFieldValue("assignment_type", 0);
                      }
                    }}
                    label={<span>Employee</span>}
                    // value={
                    //   allEmployeesMap?.get(values?.reportTo || "") || ""
                    // }
                    value={
                      values.employeeId === ""
                        ? { label: "All", value: "" }
                        : allEmployeesMap?.get(values.employeeId) || ""
                    }
                    autoComplete="off"
                    // options={allEmployees}
                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(allEmployeesWithNoPermissionList)
                        ? allEmployeesWithNoPermissionList
                        : []),
                    ]}
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <SearchSelect
                    name="assignment_type"
                    label="Assignment Type"
                    isDisabled={!values.employeeId}
                    value={
                      assignmentTypeOptions.find(
                        (o) => o.value === values.assignment_type
                      ) || null
                    }
                    options={[

                      ...assignmentTypeOptions,
                    ]}
                    onChange={(e) =>
                      setFieldValue(
                        "assignment_type",
                        e?.value === null ? null : e.value,
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Start Date falling between
                  </p>
                  <div className="grid grid-cols-2 gap-x-4">
                    <Field
                      name="ticketDateFrom"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="From"
                      selected={
                        values?.ticketDateFrom
                          ? new Date(values.ticketDateFrom)
                          : null
                      }
                      onChange={(d) =>
                        setFieldValue("ticketDateFrom", d || null)
                      }
                    />
                    <Field
                      name="ticketDateTo"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="To"
                      selected={
                        values?.ticketDateTo
                          ? new Date(values.ticketDateTo)
                          : null
                      }
                      onChange={(d) => setFieldValue("ticketDateTo", d || null)}
                    />
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Due Date falling between
                  </p>
                  <div className="grid grid-cols-2 gap-x-4">
                    <Field
                      name="dueDateFrom"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="From"
                      onChange={(d) => setFieldValue("dueDateFrom", d || null)}
                    />
                    <Field
                      name="dueDateTo"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="To"
                      onChange={(d) => setFieldValue("dueDateTo", d || null)}
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </Form>

          {/* ── Legend row + buttons ── */}
          <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
            {/* LEFT: Priority legend + Ticket Details checkbox */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* High */}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    display: "inline-block",
                  }}
                />
                <span className="text-md">High</span>
              </div>
              {/* Medium */}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    display: "inline-block",
                  }}
                />
                <span className="text-md">Medium</span>
              </div>
              {/* Low */}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "green",
                    display: "inline-block",
                  }}
                />
                <span className="text-md">Low</span>
              </div>

              {/* Divider */}
              <span style={{ borderLeft: "1px solid #ccc", height: 18 }} />

              {/* Ticket Details checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ticketDetailsToggle"
                  checked={showTicketDetails}
                  onChange={(e) => onTicketDetailsChange(e.target.checked)}
                  style={{ cursor: "pointer", width: 15, height: 15 }}
                />
                <label
                  htmlFor="ticketDetailsToggle"
                  className="text-md mb-0"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Show Ticket Detail
                </label>
              </div>
            </div>


  <div className="flex flex-col items-end gap-2">
              {/* Show Current Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentStatusToggle"
                  checked={currentStatusToggle}
                  onChange={(e) => setCurrentStatusToggle(e.target.checked)}
                  style={{ cursor: "pointer", width: 15, height: 15 }}
                />

                <label
                  htmlFor="currentStatusToggle"
                  className="text-md mb-0"
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  Show Ticket Current Status
                </label>
              </div>
            {/* Action buttons */}
            <div className="flex justify-end gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-primary"
                onClick={uiContext.addNewTicket}
              >
                <CirclePlus className="w-3 h-3 text-white mb-1 stroke-3" /> Add
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary"
              >
                Filter
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  uiProps.setQueryParams({
                    ...uiProps.queryParams,
                    filter: {},
                    pageNumber: 1,
                    isFiltered: false,
                  });
                  uiContext.setShowFilter(false);
                }}
                className="btn btn-light"
              >
                Cancel
              </button>
              {onPrint && (
                <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm ml-3">
                  {/* PDF */}
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="export-pdf-tooltip">Export PDF</Tooltip>
                    }
                  >
                    <button
                      type="button"
                      className="border-none bg-transparent"
                      onClick={() => handleExport("pdf")}
                    >
                      <FileText className="w-4 h-4 cursor-pointer" />
                    </button>
                  </OverlayTrigger>

                  {/* CSV */}
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="export-csv-tooltip">Export CSV</Tooltip>
                    }
                  >
                    <button
                      type="button"
                      className="border-none bg-transparent"
                      onClick={() => handleExport("csv")}
                    >
                      <FileSpreadsheet className="w-4 h-4 cursor-pointer" />
                    </button>
                  </OverlayTrigger>

                  {/* Excel */}
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="export-excel-tooltip">Export Excel</Tooltip>
                    }
                  >
                    <button
                      type="button"
                      className="border-none bg-transparent"
                      onClick={() => handleExport("excel")}
                    >
                      <Sheet className="w-4 h-4 cursor-pointer" />
                    </button>
                  </OverlayTrigger>
                </div>
              )}
            </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
}
