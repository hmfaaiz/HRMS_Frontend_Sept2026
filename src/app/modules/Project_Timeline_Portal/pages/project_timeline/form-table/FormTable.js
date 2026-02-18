import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { useProjectTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import {
  PleaseWaitMessage,
  NoRecordsFoundMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";

import { TicketType, PriorityType } from "../../../../../utils/common";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";

export function FormTable({ ticketStatuses = [], ticketTypes = TicketType }) {
  const [expandedEpics, setExpandedEpics] = useState({});

  const uiContext = useProjectTimelineUIContext();
  const uiProps = useMemo(
    () => ({
      queryParams: uiContext.queryParams,
      setQueryParams: uiContext.setQueryParams,
      newTicketButtonClick: uiContext.newTicketButtonClick,
      openTicketActivity: uiContext.openTicketActivity,
    }),
    [uiContext],
  );

  const { entities, totalCount, listLoading, userAccess, userAccessForTicketActivity } = useSelector(
    (state) => ({
      entities: state.project_timeline_portal.entities,
      totalCount: state.project_timeline_portal.totalCount,
      listLoading: state.project_timeline_portal.listLoading,
      userAccess: state?.auth?.userAccess["ticket_setup_portal"],
      userAccessForTicketActivity: state?.auth?.userAccess["Task"] || state?.auth?.userAccess["ticket_activity_portal"],
    }),
    shallowEqual,
  );

  const { allEmployees } = useSelector(
    (state) => state.dashboard,
    shallowEqual,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (uiProps.queryParams.isFiltered) {
      dispatch(
        actions.fetchProjectTimeline({
          ...uiProps.queryParams,
          pageSize: 100000,
          pageNumber: 1,
        }),
      );
    } else {
      dispatch(actions.clearProjectTimeline());
    }

    if (!allEmployees || allEmployees.length === 0) {
      dispatch(fetchAllActiveEmployees());
    }
  }, [uiProps.queryParams, dispatch, allEmployees]);

  const validationSchema = Yup.object().shape({
    tickets: Yup.object(),
  });

  // Reset all epics to collapsed whenever entities change
  useEffect(() => {
    if (entities && entities.length) {
      const newExpanded = {};
      entities.forEach((ticket) => {
        if (ticket.ticketTypeId === 1) {
          newExpanded[ticket.Id] = false;
        }
      });
      setExpandedEpics(newExpanded);
    }
  }, [entities]);

  useEffect(() => {
    uiContext.setHasRecords(
      uiProps.queryParams.isFiltered &&
        Array.isArray(entities) &&
        entities.length > 0,
    );
  }, [entities, uiProps.queryParams.isFiltered]);

  const handleSave = (values) => {
    const ticketsArray = Object.values(values.tickets);

    const updatedEntities = ticketsArray
      .filter((row) => {
        const original = entities.find((e) => e.Id === row.Id);
        if (!original) return false;

        const statusChanged = row.ticketStatusId !== original.ticketStatusId;
        const typeChanged = row.ticketTypeId !== original.ticketTypeId;
        const priorityChanged =
          Number(row.priority) !== Number(original.priority);
        const assignChanged = row.assignToEmpId !== original.assignToEmpId;
        const reportChanged = row.reportToEmpId !== original.reportToEmpId;
        const dueDateChanged = row.dueDate !== original.dueDate;

        return (
          statusChanged ||
          typeChanged ||
          priorityChanged ||
          assignChanged ||
          reportChanged ||
          dueDateChanged
        );
      })
      .map((row) => ({
        Id: row.Id,
        ticketStatusId: row.ticketStatusId,
        ticketTypeId: row.ticketTypeId,
        priority: Number(row.priority),
        assignToEmpId: row.assignToEmpId,
        reportToEmpId: row.reportToEmpId,
        dueDate: row.dueDate,
      }));

    dispatch(actions.updateTicketStatuses(updatedEntities, uiProps.queryParams));
  };

  const toggleEpic = (epicId) => {
    setExpandedEpics((prev) => ({
      ...prev,
      [epicId]: !prev[epicId],
    }));
  };

  const getIndentation = (row) => {
    if (row.ticketTypeId === 1) return 0;
    if (row.ticketTypeId === 5) return 2;
    if ([2, 3, 4].includes(row.ticketTypeId)) return 1;
    return 0;
  };

  const buildHierarchicalData = (tickets) => {
    if (!tickets || !tickets.length) return { epicMap: {}, taskMap: {} };

    const epicMap = {};
    const taskMap = {};
    const subTaskMap = {};

    tickets.forEach((t) => {
      if (t.ticketTypeId === 1) {
        epicMap[t.Id] = { ...t, children: [] };
      } else if (t.ticketTypeId === 5) {
        subTaskMap[t.Id] = t;
      } else if ([2, 3, 4].includes(t.ticketTypeId)) {
        taskMap[t.Id] = { ...t, children: [] };
      }
    });

    Object.values(taskMap).forEach((task) => {
      if (task.parentEpicId && epicMap[task.parentEpicId]) {
        epicMap[task.parentEpicId].children.push(task);
      }
    });

    Object.values(epicMap).forEach((epic) => {
      epic.children.sort(
        (a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0),
      );
    });

    Object.values(subTaskMap).forEach((sub) => {
      if (sub.parentTaskId && taskMap[sub.parentTaskId]) {
        taskMap[sub.parentTaskId].children.push(sub);
      }
    });

    Object.values(taskMap).forEach((task) => {
      if (task.children && task.children.length) {
        task.children.sort(
          (a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0),
        );
      }
    });

    return { epicMap, taskMap };
  };

  // const getFlattenedData = (tickets) => {
  //   const { epicMap } = buildHierarchicalData(tickets);
  //   const flattened = [];

  //   Object.values(epicMap)
  //     .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
  //     .forEach((epic) => {
  //       flattened.push(epic);

  //       if (expandedEpics[epic.Id]) {
  //         epic.children.forEach((child) => {
  //           flattened.push(child);

  //           if (child.children && child.children.length) {
  //             child.children.forEach((subTask) => {
  //               flattened.push(subTask);
  //             });
  //           }
  //         });
  //       }
  //     });

  //   return flattened;
  // };

  // const getFlattenedData = (tickets) => {
  //   if (!tickets || !tickets.length) return [];

  //   // Get the applied ticket type filter from query params
  //   const appliedTicketTypeIds = uiProps.queryParams?.filter?.ticketTypeIds || [];
  //   const hasTicketTypeFilter = appliedTicketTypeIds.length > 0;
  //   const includesEpic = appliedTicketTypeIds.includes(1); // Assuming 1 is "Epic"

  //   if (hasTicketTypeFilter && !includesEpic) {
  //     // Filter: Exclude epics and only show matching child types (flattened, no hierarchy)
  //     return tickets.filter((ticket) => appliedTicketTypeIds.includes(ticket.ticketTypeId));
  //   } else {
  //     // No filter or includes epic: Show full hierarchy as before
  //     const { epicMap } = buildHierarchicalData(tickets);
  //     const flattened = [];

  //     Object.values(epicMap)
  //       .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
  //       .forEach((epic) => {
  //         flattened.push(epic);

  //         if (expandedEpics[epic.Id]) {
  //           epic.children.forEach((child) => {
  //             flattened.push(child);

  //             if (child.children && child.children.length) {
  //               child.children.forEach((subTask) => {
  //                 flattened.push(subTask);
  //               });
  //             }
  //           });
  //         }
  //       });

  //     return flattened;
  //   }
  // };


   const getFlattenedData = (tickets) => {
    if (!tickets || !tickets.length) return [];

    // Get the applied ticket type filter from query params
    const appliedTicketTypeIds = uiProps.queryParams?.filter?.ticketTypeIds || [];
    const hasTicketTypeFilter = appliedTicketTypeIds.length > 0;
    const includesEpic = appliedTicketTypeIds.includes(1); // Assuming 1 is "Epic"

    if (hasTicketTypeFilter && includesEpic) {
      // Filter includes Epic: Flatten all data (epics and children) without hierarchy
      const { epicMap, taskMap } = buildHierarchicalData(tickets);
      const flattened = [];

      Object.values(epicMap)
        .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
        .forEach((epic) => {
          flattened.push(epic); // Add epic as a flat row
          epic.children.forEach((child) => {
            flattened.push(child); // Add children as flat rows
            if (child.children && child.children.length) {
              child.children.forEach((subTask) => {
                flattened.push(subTask); // Add subtasks as flat rows
              });
            }
          });
        });

      return flattened;
    } else if (hasTicketTypeFilter && !includesEpic) {
      // Filter excludes Epic: Only show matching child types (flattened, no hierarchy)
      return tickets.filter((ticket) => appliedTicketTypeIds.includes(ticket.ticketTypeId));
    } else {
      // No filter or "All": Show full hierarchy as before
      const { epicMap } = buildHierarchicalData(tickets);
      const flattened = [];

      Object.values(epicMap)
        .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
        .forEach((epic) => {
          flattened.push(epic);

          if (expandedEpics[epic.Id]) {
            epic.children.forEach((child) => {
              flattened.push(child);

              if (child.children && child.children.length) {
                child.children.forEach((subTask) => {
                  flattened.push(subTask);
                });
              }
            });
          }
        });

      return flattened;
    }
  };

  const getTicketTypeLabel = (ticketTypeId) => {
    const type = TicketType.find((t) => t.value === ticketTypeId);
    return type ? type.label : "";
  };

  const isEditableType = (row) => [2, 3, 4].includes(row.ticketTypeId);

  const editableOptions = useMemo(
    () => TicketType.filter((t) => [2, 3, 4].includes(t.value)),
    [],
  );

  const initialFormValues = useMemo(() => {
    const ticketsObj = {};
    entities?.forEach((entity) => {
      ticketsObj[entity.Id] = {
        Id: entity.Id,
        ticketTypeId: entity.ticketTypeId,
        ticketStatusId: entity.ticketStatusId,
        ticketCode: entity.ticketCode,
        ticketDescription: entity.ticketDescription,
        ticketSummary: entity.ticketSummary,
        priority: entity.priority,
        startDate: entity.startDate,
        dueDate: entity.dueDate,
        parentEpicId: entity.parentEpicId,
        parentTaskId: entity.parentTaskId,
        assignToEmpId: entity.assignToEmpId || entity.AssignToEmp?.Id,
        reportToEmpId: entity.reportToEmpId || entity.ReportToEmp?.Id,
        AssignToEmp: entity.AssignToEmp,
        ReportToEmp: entity.ReportToEmp,
      };
    });
    return { tickets: ticketsObj };
  }, [entities]);

  // Check user access
  const isAccessForAdd = userAccess?.find(
    (item) => item.componentName === "CreateTicketSetup",
  );

  const isAccessForTicketActivity = userAccessForTicketActivity?.find(
    (item) => item.componentName === "ReadTicketActivity",
  );

  const headerStyle = {
    height: "30px",
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  // const columns = [
  //   {
  //     dataField: "ticketTypeId",
  //     text: "Ticket Type",
  //     sort: false,
  //     headerSortingClasses,
  //     headerStyle,
  //     style: { minWidth: "110px" },
  //     formatter: (cell, row) => {
  //       const indent = getIndentation(row);
  //       const typeLabel = getTicketTypeLabel(cell);
  //       const isEpic = row.ticketTypeId === 1;

  //       return (
  //         <div
  //           style={{
  //             paddingLeft: `${indent * 20}px`,
  //             display: "flex",
  //             alignItems: "center",
  //           }}
  //         >
  //           {isEpic && (
  //             <button
  //               type="button"
  //               onClick={() => toggleEpic(row.Id)}
  //               style={{
  //                 border: "none",
  //                 background: "none",
  //                 cursor: "pointer",
  //                 marginRight: "8px",
  //                 fontSize: "16px",
  //                 flexShrink: 0,
  //               }}
  //             >
  //               {expandedEpics[row.Id] ? "▼" : "▶"}
  //             </button>
  //           )}
  //           {isEditableType(row) ? (
  //             <div style={{ minWidth: "50px", flex: 1 }}>
  //               <Field
  //                 name={`tickets.${row.Id}.ticketTypeId`}
  //                 render={({ field, form }) => {
  //                   const selectedOption = editableOptions.find(
  //                     (t) => t.value === field.value,
  //                   );
  //                   return (
  //                     <SearchSelect
  //                       value={selectedOption || null}
  //                       options={editableOptions}
  //                       onChange={(selected) =>
  //                         selected &&
  //                         form.setFieldValue(field.name, selected.value)
  //                       }
  //                       placeholder="Select Type"
  //                     />
  //                   );
  //                 }}
  //               />
  //             </div>
  //           ) : (
  //             <span className="font-weight-bold text-dark">{typeLabel}</span>
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  const columns = [
    {
      dataField: "ticketTypeId",
      text: "Ticket Type",
      sort: false,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "110px" },
      formatter: (cell, row) => {
        const indent = getIndentation(row);
        const typeLabel = getTicketTypeLabel(cell);
        const isEpic = row.ticketTypeId === 1;

        // Check if hierarchy is active (no filter or "All" selected)
        const appliedTicketTypeIds = uiProps.queryParams?.filter?.ticketTypeIds || [];
        const hasTicketTypeFilter = appliedTicketTypeIds.length > 0;
        const includesEpic = appliedTicketTypeIds.includes(1);
        const isHierarchyActive = !hasTicketTypeFilter || !includesEpic; // Hierarchy active when no filter or epic not in filter

        return (
          <div
            style={{
              paddingLeft: `${indent * 20}px`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {isEpic && isHierarchyActive && ( // Only show expand button when hierarchy is active
              <button
                type="button"
                onClick={() => toggleEpic(row.Id)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  marginRight: "8px",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                {expandedEpics[row.Id] ? "▶" : "▶"}
              </button>
            )}
            {isEditableType(row) ? (
              <div style={{ minWidth: "50px", flex: 1 }}>
                <Field
                  name={`tickets.${row.Id}.ticketTypeId`}
                  render={({ field, form }) => {
                    const selectedOption = editableOptions.find(
                      (t) => t.value === field.value,
                    );
                    return (
                      <SearchSelect
                        value={selectedOption || null}
                        options={editableOptions}
                        onChange={(selected) =>
                          selected &&
                          form.setFieldValue(field.name, selected.value)
                        }
                        placeholder="Select Type"
                      />
                    );
                  }}
                />
              </div>
            ) : (
              <span className="font-weight-bold text-dark">{typeLabel}</span>
            )}
          </div>
        );
      },
    },
    {
      dataField: "ticketCode",
      text: "Ticket Number",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
    },
    {
      dataField: "ticketDescription",
      text: "Description",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { width: "100px" },
    },
    {
      dataField: "ticketSummary",
      text: "Task Summary",
      style: { minWidth: "100px" },
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
    },
     {
    dataField: "parentTaskId",
    text: "Linked Task",  
    sort: false,
    headerSortingClasses,
    headerStyle,
    style: { minWidth: "100px" },
    formatter: (cell, row) => {
      if (row.ticketTypeId === 1) {
        // For epics, show project name
        return row.Project?.projectName || "";
      } else if (row.ticketTypeId === 4) {
        // For linked tasks, show the existing logic
        const linkedTask = entities.find(
          (t) =>
            t.ticketTypeId === 3 &&
            t.parentEpicId === row.parentEpicId &&
            t.Id === row.parentTaskId,
        );
        return linkedTask
          ? `${linkedTask.ticketCode} ${linkedTask.ticketDescription}`
          : "";
      } else {
        return "";
      }
    },
  },

    {
      dataField: "priority",
      text: "Priority",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "70px" },
      formatter: (cell, row) => (
        <Field
          name={`tickets.${row.Id}.priority`}
          render={({ field, form }) => {
            const selectedPriority = PriorityType.find(
              (p) => p.value === Number(field.value),
            );
            return (
              <SearchSelect
                value={selectedPriority || null}
                options={PriorityType}
                onChange={(selected) =>
                  selected && form.setFieldValue(field.name, selected.value)
                }
                placeholder="Select Priority"
              />
            );
          }}
        />
      ),
    },
    {
      dataField: "ticketStatusId",
      text: "Ticket Status",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "130px" },
      formatter: (cell, row) => (
        <Field
          name={`tickets.${row.Id}.ticketStatusId`}
          render={({ field, form }) => {
            const selectedStatus = ticketStatuses.find(
              (ts) => ts.value === field.value,
            );
            return (
              <SearchSelect
                value={selectedStatus || null}
                options={ticketStatuses}
                onChange={(selected) =>
                  selected && form.setFieldValue(field.name, selected.value)
                }
                placeholder="Select Status"
              />
            );
          }}
        />
      ),
    },
    {
      dataField: "AssignToEmp.fullName",
      text: "Assigned To",
      sort: false,
      headerSortingClasses,
      style: { minWidth: "200px" },
      headerStyle,
      formatter: (cell, row) => (
        <Field
          name={`tickets.${row.Id}.assignToEmpId`}
          render={({ field, form }) => {
            const selectedEmp = allEmployees?.find(
              (e) => e.value === field.value,
            );
            return (
              <SearchSelect
                value={selectedEmp || null}
                options={allEmployees || []}
                onChange={(selected) =>
                  selected && form.setFieldValue(field.name, selected.value)
                }
                placeholder="Select Employee"
              />
            );
          }}
        />
      ),
    },
    {
      dataField: "ReportToEmp.fullName",
      text: "Report To",
      sort: false,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "200px" },
      formatter: (cell, row) => (
        <Field
          name={`tickets.${row.Id}.reportToEmpId`}
          render={({ field, form }) => {
            const selectedEmp = allEmployees?.find(
              (e) => e.value === field.value,
            );
            return (
              <SearchSelect
                value={selectedEmp || null}
                options={allEmployees || []}
                onChange={(selected) =>
                  selected && form.setFieldValue(field.name, selected.value)
                }
                placeholder="Select Employee"
              />
            );
          }}
        />
      ),
    },
    {
      dataField: "noOfHours",
      text: "Est. Hours",
      sort: false,
      headerSortingClasses,
      headerStyle,
      style: { width: "60px", textAlign: "center" },
      formatter: (cell, row) => cell ?? 0,
    },
    {
      dataField: "totalHoursLogged",
      text: "Total Hours",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { width: "60px", textAlign: "center" },
      formatter: (cell, row) => cell ?? 0,
    },
    {
      dataField: "startDate",
      text: "Start Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "90px" },
    },
    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "100px" },
      formatter: (cell, row) => (
        <Field
          name={`tickets.${row.Id}.dueDate`}
          component={DatePickerField}
          dateFormat="dd-MMM-yyyy"
          placeholder="Select Due Date"
          popperPlacement="bottom-end"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              escapeWithReference: false,
            },
          }}
        />
      ),
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        newTicketButtonClick: uiProps.newTicketButtonClick,
        openTicketActivity: uiProps.openTicketActivity,
        isAccessForAdd: isAccessForAdd ? isAccessForAdd.isAccess : false,
        isAccessForTicketActivity: isAccessForTicketActivity
          ? isAccessForTicketActivity.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "50px" },
    },
  ];

  return (
    <Formik
      enableReinitialize
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {({ handleSubmit, values }) => {
        const flattenedData = getFlattenedData(entities);

        return (
          <Form>
            <div className="w-full overflow-x-auto">
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center table-hover"
                bootstrap4
                remote={false}
                keyField="Id"
                data={flattenedData || []}
                columns={columns}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={listLoading}
                className="btn btn-primary"
              >
                Save Changes
                {listLoading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

