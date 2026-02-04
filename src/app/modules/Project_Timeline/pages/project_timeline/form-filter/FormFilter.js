import React, { useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useProjectTimelineUIContext } from "../FormUIContext";
import { formatDates } from "../../../../../utils/common";


export function FormFilter({
  projects = [],
  ticketTypes = [],
  ticketStatuses = [],
  loading,
}) {
  const uiContext = useProjectTimelineUIContext();

  const uiProps = useMemo(
    () => ({
      queryParams: uiContext.queryParams || {},
      setQueryParams: uiContext.setQueryParams,
    }),
    [uiContext]
  );

  const applyFilter = (values) => {
    const newQueryParams = {
      ...uiProps.queryParams,
      filter: { ...values },
      pageNumber: 1,
      isFiltered: true,  // Set to true when applying filter
    };
    uiProps.setQueryParams(newQueryParams);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        projectId: uiProps.queryParams?.filter?.projectId || null,
        ticketTypeIds: uiProps.queryParams?.filter?.ticketTypeIds || [],
        ticketStatusIds: uiProps.queryParams?.filter?.ticketStatusIds || [],
        ticketDescription:
          uiProps.queryParams?.filter?.ticketDescription || "",
        startFrom: uiProps.queryParams?.filter?.startFrom || null,
        startTo: uiProps.queryParams?.filter?.startTo || null,
        dueFrom: uiProps.queryParams?.filter?.dueFrom || null,
        dueTo: uiProps.queryParams?.filter?.dueTo || null,
      }}
      onSubmit={applyFilter}
    >
      {({ values, setFieldValue, handleSubmit, handleReset }) => (
        <>
          <Form className="form form-label-right">
            <fieldset>
              <h6 className="font-bold mb-0 text-primary my-2">
                Filters
              </h6>

              <div className="grid grid-cols-12 gap-4">
                {/* Project */}
                <div className="col-span-6 sm:col-span-3">
                  <SearchSelect
                    name="projectId"
                    label="Project"
                    value={
                      projects.find(
                        (p) => p.value === values.projectId
                      ) ||  { label: "All", value: null }
                    }
                     options={[{ label: "All", value: null }, ...projects]}
                    onChange={(e) =>
                      setFieldValue("projectId", e?.value || null)
                    }
                  />
                </div>

                {/* Ticket Type */}
                <div className="col-span-6 sm:col-span-3">
                  <MultiSelect
                    name="ticketTypeIds"
                    label="Ticket Type"
                    value={ticketTypes.filter((tt) =>
                      values.ticketTypeIds.includes(tt.value)
                    )}
                    options={ticketTypes}
                    onChange={(items = []) =>
                      setFieldValue(
                        "ticketTypeIds",
                        items.map((i) => i.value)
                      )
                    }
                  />
                </div>

                {/* Ticket Description */}
                <div className="col-span-6 sm:col-span-3">
                  <label className="form-label">
                    Ticket Description
                  </label>
                  <Field
                    name="ticketDescription"
                    type="text"
                    className="form-control"
                    placeholder="Ticket Description"
                  />
                </div>

                {/* Ticket Status */}
                <div className="col-span-6 sm:col-span-3">
                  <MultiSelect
                    name="ticketStatusIds"
                    label="Ticket Status"
                    value={ticketStatuses.filter((ts) =>
                      values.ticketStatusIds.includes(ts.value)
                    )}
                    options={ticketStatuses}
                    onChange={(items = []) =>
                      setFieldValue(
                        "ticketStatusIds",
                        items.map((i) => i.value)
                      )
                    }
                  />
                </div>

                {/* Start Date */}
                <div className="col-span-12 sm:col-span-6">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Start Date falling between
                  </p>
                  <div className="grid grid-cols-2 gap-x-4">
                    <Field
                      name="startFrom"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="From"
                      onChange={(d) =>
                        setFieldValue("startFrom", d || null)
                      }
                    />
                    <Field
                      name="startTo"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="To"
                      onChange={(d) =>
                        setFieldValue("startTo", d || null)
                      }
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
                      name="dueFrom"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="From"
                      onChange={(d) =>
                        setFieldValue("dueFrom", d || null)
                      }
                    />
                    <Field
                      name="dueTo"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label="To"
                      onChange={(d) =>
                        setFieldValue("dueTo", d || null)
                      }
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </Form>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                handleReset();
                // Reset to empty filter and set isFiltered to false
                const resetQueryParams = {
                  ...uiProps.queryParams,
                  filter: {},
                  pageNumber: 1,
                  isFiltered: false,
                };
                uiProps.setQueryParams(resetQueryParams);
              }}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary "
            >
              Filter
              {loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </div>
        </>
      )}
    </Formik>
  );
}