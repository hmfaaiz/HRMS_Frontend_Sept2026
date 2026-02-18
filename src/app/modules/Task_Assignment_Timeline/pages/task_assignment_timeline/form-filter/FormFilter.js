// import React, { useMemo } from "react";
// import { Formik, Form, Field } from "formik";
// import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
// import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
// import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
// import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
// import { FileText, FileSpreadsheet, Sheet } from "lucide-react"; // Export icons

// export function FormFilter({
//   employees = [],
//   ticketTypes = [],
//   ticketStatuses = [],
//   priorityLevels = [],
//   loading,
//   onPrint, 
// }) {
//   const uiContext = useTaskAssignmentTimelineUIContext();
//   const { hasRecords, queryParams } = uiContext;
//   const uiProps = useMemo(
//     () => ({
//       queryParams: uiContext.queryParams || {},
//       setQueryParams: uiContext.setQueryParams,
//     }),
//     [uiContext],
//   );

//   const ticketStatusOptions = [
//     { value: 1, label: "Open" },
//     { value: 0, label: "Completed" },
//     { value: 3, label: "Re-opened" },
//     { value: 2, label: "In Review" },
//   ];

//   const applyFilter = (values) => {
//     const cleanFilter = { ...values };

//     Object.keys(cleanFilter).forEach((k) => {
//       if (
//         cleanFilter[k] === null ||
//         cleanFilter[k] === "" ||
//         (Array.isArray(cleanFilter[k]) && cleanFilter[k].length === 0)
//       ) {
//         delete cleanFilter[k];
//       }
//     });

//     uiProps.setQueryParams({
//       ...uiProps.queryParams,
//       filter: {
//         ...cleanFilter,
//         ticketStatusIds:
//           cleanFilter.ticketStatus != null ? [cleanFilter.ticketStatus] : [],
//       },
//       pageNumber: 1,
//       isFiltered: true,
//       pdf: false,
//       csv: false,
//       excel: false,
//     });

//     uiContext.setShowFilter(true);
//   };

  

//   const handleExport = (type) => {
//     if (!queryParams.isFiltered) {
//       alert("Please apply filter before downloading.");
//       return;
//     }

//     if (!hasRecords) {
//       alert("No records available to download.");
//       return;
//     }

//     onPrint(type);
//   };


//   return (
//     <Formik
//       enableReinitialize
//       initialValues={{
//         ticketTypeIds: uiProps.queryParams?.filter?.ticketTypeIds || [],
//         ticketStatus: uiProps.queryParams?.filter?.ticketStatus || null,
//         priorityLevelIds: uiProps.queryParams?.filter?.priorityLevelIds || [],
//         ticketDescription: uiProps.queryParams?.filter?.ticketDescription || "",
//         ticketDateFrom: uiProps.queryParams?.filter?.ticketDateFrom || null,
//         ticketDateTo: uiProps.queryParams?.filter?.ticketDateTo || null,
//         dueDateFrom: uiProps.queryParams?.filter?.dueDateFrom || null,
//         dueDateTo: uiProps.queryParams?.filter?.dueDateTo || null,
//       }}
//       onSubmit={applyFilter}
//     >
//       {({ values, setFieldValue, handleSubmit, handleReset }) => (
//         <>
//           <Form className="form form-label-right">
//             <fieldset>
//               <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>

//               <div className="grid grid-cols-12 gap-4">
//                 {/* Ticket Type */}
//                 <div className="col-span-6 sm:col-span-3">
//                   <MultiSelect
//                     name="ticketTypeIds"
//                     label="Ticket Type"
//                     value={ticketTypes.filter((tt) =>
//                       values.ticketTypeIds.includes(tt.value),
//                     )}
//                     options={ticketTypes}
//                     onChange={(items = []) =>
//                       setFieldValue(
//                         "ticketTypeIds",
//                         items.map((i) => i.value),
//                       )
//                     }
//                   />
//                 </div>

//                 {/* Priority Level */}
//                 <div className="col-span-6 sm:col-span-3">
//                   <MultiSelect
//                     name="priorityLevelIds"
//                     label="Priority Level"
//                     value={priorityLevels.filter((pl) =>
//                       values.priorityLevelIds.includes(pl.value),
//                     )}
//                     options={priorityLevels}
//                     onChange={(items = []) =>
//                       setFieldValue(
//                         "priorityLevelIds",
//                         items.map((i) => i.value),
//                       )
//                     }
//                   />
//                 </div>

//                 {/* Ticket Status */}
//                 <div className="col-span-6 sm:col-span-3">
//                   <SearchSelect
//                     name="ticketStatus"
//                     label="Ticket Status"
//                     value={
//                       ticketStatusOptions.find(
//                         (option) => option.value === values.ticketStatus,
//                       ) || { label: "All", value: null }
//                     }
//                     options={[
//                       { label: "All", value: null },
//                       ...ticketStatusOptions,
//                     ]}
//                     onChange={(e) =>
//                       setFieldValue(
//                         "ticketStatus",
//                         e?.value === null ? null : e.value,
//                       )
//                     }
//                   />
//                 </div>

//                 {/* Ticket Description */}
//                 <div className="col-span-6 sm:col-span-3">
//                   <label className="form-label">Ticket Description</label>
//                   <Field
//                     name="ticketDescription"
//                     type="text"
//                     className="form-control"
//                     placeholder="Ticket Description"
//                   />
//                 </div>

//                 {/* Ticket Date */}
//                 <div className="col-span-12 sm:col-span-6">
//                   <p className="text-sm mb-0 text-black font-semibold">
//                     Start Date falling between
//                   </p>
//                   <div className="grid grid-cols-2 gap-x-4">
//                     <Field
//                       name="ticketDateFrom"
//                       component={DatePickerField}
//                       dateFormat="dd-MMM-yyyy"
//                       label="From"
//                       onChange={(d) =>
//                         setFieldValue("ticketDateFrom", d || null)
//                       }
//                     />
//                     <Field
//                       name="ticketDateTo"
//                       component={DatePickerField}
//                       dateFormat="dd-MMM-yyyy"
//                       label="To"
//                       onChange={(d) => setFieldValue("ticketDateTo", d || null)}
//                     />
//                   </div>
//                 </div>

//                 {/* Due Date */}
//                 <div className="col-span-12 sm:col-span-6">
//                   <p className="text-sm mb-0 text-black font-semibold">
//                     Due Date falling between
//                   </p>
//                   <div className="grid grid-cols-2 gap-x-4">
//                     <Field
//                       name="dueDateFrom"
//                       component={DatePickerField}
//                       dateFormat="dd-MMM-yyyy"
//                       label="From"
//                       onChange={(d) => setFieldValue("dueDateFrom", d || null)}
//                     />
//                     <Field
//                       name="dueDateTo"
//                       component={DatePickerField}
//                       dateFormat="dd-MMM-yyyy"
//                       label="To"
//                       onChange={(d) => setFieldValue("dueDateTo", d || null)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </fieldset>
//           </Form>

//           {/* Buttons & Export Icons */}
//           <div className="flex justify-end gap-2 mt-2">
//             <button
//               type="button"
//               onClick={() => {
//                 handleReset();
//                 uiProps.setQueryParams({
//                   ...uiProps.queryParams,
//                   filter: {},
//                   pageNumber: 1,
//                   isFiltered: false,
//                 });
//                 uiContext.setShowFilter(false);
//               }}
//               className="btn btn-light"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="btn btn-primary"
//             >
//               Filter
//               {loading && (
//                 <span className="ml-3 mr-3 spinner spinner-white"></span>
//               )}
//             </button>

//             {/* Export Buttons */}
//             {onPrint && (
//               <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm ml-3">
//                 <button
//                   type="button"
//                   className="border-none bg-transparent"
//                   onClick={() => handleExport("pdf")}
//                   disabled={loading || !queryParams.isFiltered || !hasRecords}
//                 >
//                   <FileText className="w-4 h-4" />
//                 </button>

//                 <button
//                   type="button"
//                   className="border-none bg-transparent"
//                   onClick={() => handleExport("csv")}
//                   disabled={loading || !queryParams.isFiltered || !hasRecords}
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                 </button>

//                 <button
//                   type="button"
//                   className="border-none bg-transparent"
//                   onClick={() => handleExport("excel")}
//                   disabled={loading || !queryParams.isFiltered || !hasRecords}
//                 >
//                   <Sheet className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </Formik>
//   );
// }


import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import { FileText, FileSpreadsheet, Sheet, CirclePlus } from "lucide-react";

export function FormFilter({
  employees = [],
  ticketTypes = [],
  ticketStatuses = [],
  priorityLevels = [],
  loading,
  onPrint,
}) {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const { hasRecords, queryParams } = uiContext;
  
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

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ticketTypeIds: uiProps.queryParams?.filter?.ticketTypeIds || [],
        ticketStatus: uiProps.queryParams?.filter?.ticketStatus || null,
        priorityLevelIds: uiProps.queryParams?.filter?.priorityLevelIds || [],
        ticketDescription: uiProps.queryParams?.filter?.ticketDescription || "",
        ticketDateFrom: uiProps.queryParams?.filter?.ticketDateFrom || null,
        ticketDateTo: uiProps.queryParams?.filter?.ticketDateTo || null,
        dueDateFrom: uiProps.queryParams?.filter?.dueDateFrom || null,
        dueDateTo: uiProps.queryParams?.filter?.dueDateTo || null,
      }}
      onSubmit={applyFilter}
    >
      {({ values, setFieldValue, handleSubmit, handleReset }) => (
        <>
          <Form className="form form-label-right">
            <fieldset>
              <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>

              <div className="grid grid-cols-12 gap-4">
                {/* Ticket Type */}
                <div className="col-span-6 sm:col-span-3">
                  <MultiSelect
                    name="ticketTypeIds"
                    label="Ticket Type"
                    value={ticketTypes.filter((tt) =>
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

                {/* Priority Level */}
                <div className="col-span-6 sm:col-span-3">
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

                {/* Ticket Status */}
                <div className="col-span-6 sm:col-span-3">
                  <SearchSelect
                    name="ticketStatus"
                    label="Ticket Status"
                    value={
                      ticketStatusOptions.find(
                        (option) => option.value === values.ticketStatus,
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

                {/* Ticket Description */}
                <div className="col-span-6 sm:col-span-3">
                  <label className="form-label">Ticket Description</label>
                  <Field
                    name="ticketDescription"
                    type="text"
                    className="form-control"
                    placeholder="Ticket Description"
                  />
                </div>

                {/* Ticket Date */}
                <div className="col-span-12 sm:col-span-6">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Start Date falling between
                  </p>
                  <div className="grid grid-cols-2 gap-x-4">
                    <Field
                      name="ticketDateFrom"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="From"
                      onChange={(d) =>
                        setFieldValue("ticketDateFrom", d || null)
                      }
                    />
                    <Field
                      name="ticketDateTo"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="To"
                      onChange={(d) => setFieldValue("ticketDateTo", d || null)}
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-span-12 sm:col-span-6">
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

          {/* Buttons & Export Icons */}
          <div className="flex justify-end gap-2 mt-2">
             {/* ADD: Add Button before filters */}
         
            <button
              type="button"
              className="btn btn-primary"
              onClick={uiContext.addNewTicket}
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
             <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
            >
              Filter
              {loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
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
       

            {/* Export Buttons */}
            {onPrint && (
              <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm ml-3">
                <button
                  type="button"
                  className="border-none bg-transparent"
                  onClick={() => handleExport("pdf")}
                  disabled={loading || !queryParams.isFiltered || !hasRecords}
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="border-none bg-transparent"
                  onClick={() => handleExport("csv")}
                  disabled={loading || !queryParams.isFiltered || !hasRecords}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="border-none bg-transparent"
                  onClick={() => handleExport("excel")}
                  disabled={loading || !queryParams.isFiltered || !hasRecords}
                >
                  <Sheet className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </Formik>
  );
}