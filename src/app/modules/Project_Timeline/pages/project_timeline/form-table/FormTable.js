import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { sizePerPageList } from "../../../pages/project_timeline/FormUIHelpers";

import { useProjectTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import {
  PleaseWaitMessage,
  NoRecordsFoundMessage,
  getHandlerTableChange,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";

import { TicketType, PriorityType } from "../../../../../utils/common";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";

export function FormTable({ ticketStatuses = [], ticketTypes = TicketType }) {
  const uiContext = useProjectTimelineUIContext();
  const uiProps = useMemo(
    () => ({
      queryParams: uiContext.queryParams,
      setQueryParams: uiContext.setQueryParams,
    }),
    [uiContext],
  );

  const { entities, totalCount, listLoading } = useSelector(
    (state) => state.project_timeline,
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
          pageSize: 100000, //  get all tickets
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

    dispatch(actions.updateTicketStatuses(updatedEntities));
  };

  const getIndentation = (row) => {
    if (row.ticketTypeId === 1) return 0; // EPIC
    if (row.ticketTypeId === 5) return 2; // SUB-TASK
    if ([2, 3, 4].includes(row.ticketTypeId)) return 1; // TASK/USER STORY/BUG
    return 0;
  };

  const sortTicketsByHierarchy = (tickets) => {
    if (!tickets || !tickets.length) return [];

    const epicMap = {},
      taskMap = {},
      subTaskMap = {};

    tickets.forEach((t) => {
      if (t.ticketTypeId === 1) epicMap[t.Id] = { ...t, children: [] };
      else if (t.ticketTypeId === 5) subTaskMap[t.Id] = t;
      else if ([2, 3, 4].includes(t.ticketTypeId))
        taskMap[t.Id] = { ...t, children: [] };
    });

    Object.values(taskMap).forEach((task) => {
      if (task.parentEpicId && epicMap[task.parentEpicId])
        epicMap[task.parentEpicId].children.push(task);
    });

    Object.values(epicMap).forEach((epic) => {
      epic.children.sort(
        (a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0),
      );
    });

    Object.values(subTaskMap).forEach((sub) => {
      if (sub.parentTaskId && taskMap[sub.parentTaskId])
        taskMap[sub.parentTaskId].children.push(sub);
    });

    Object.values(taskMap).forEach((task) => {
      if (task.children && task.children.length)
        task.children.sort(
          (a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0),
        );
    });

    const sorted = [];
    Object.values(epicMap).forEach((epic) => {
      sorted.push(epic);
      epic.children.forEach((child) => {
        sorted.push(child);
        if (child.children && child.children.length)
          child.children.forEach((subTask) => sorted.push(subTask));
      });
    });

    return sorted;
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

  // Set same header height for all columns

  const headerStyle = {
    height: "30px",
    textAlign: "left",
    whiteSpace: "nowrap", // keep header text in one line
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const columns = [
    {
      dataField: "ticketTypeId",
      text: "Ticket Type",
      sort: false,
      headerSortingClasses,
      headerStyle,
      style: { minWidth: "100px" },
      formatter: (cell, row) => {
        const indent = getIndentation(row);
        const typeLabel = getTicketTypeLabel(cell);
        return (
          <div style={{ paddingLeft: `${indent * 20}px` }}>
            {isEditableType(row) ? (
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
      sort: true,
      sortCaret,
      headerSortingClasses,
      headerStyle,
    },
    {
      dataField: "ticketDescription",
      text: "Description",
      sort: true,
      sortCaret,
      headerSortingClasses,
      headerStyle,
    },
    {
      dataField: "ticketSummary",
      text: "Task Summary",
      sort: true,
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
        if (row.ticketTypeId !== 4) return "";
        const linkedTask = entities.find(
          (t) =>
            t.ticketTypeId === 3 &&
            t.parentEpicId === row.parentEpicId &&
            t.Id === row.parentTaskId,
        );
        return linkedTask
          ? `${linkedTask.ticketCode} ${linkedTask.ticketDescription}`
          : "";
      },
    },
    {
      dataField: "priority",
      text: "Priority",
      sort: true,
      sortCaret,
      headerSortingClasses,
      headerStyle,
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
      sort: true,
      sortCaret,
      headerSortingClasses,
      headerStyle,
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
      style: { minWidth: "150px" },

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
      style: { minWidth: "150px" },
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
      dataField: "estimatedHours",
      text: "Est. Hours",
      sort: false,
      headerSortingClasses,
      headerStyle,
      style: { width: "80px", textAlign: "center" },

      formatter: (cell, row) => cell ?? 0,
    },
    {
      dataField: "totalHoursLogged",
      text: "Total Hours",
      sort: false,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { width: "80px", textAlign: "center" },
      formatter: (cell, row) => cell ?? 0,
    },

    {
      dataField: "startDate",
      text: "Start Date",
      sort: true,
      sortCaret,
      headerSortingClasses,
      headerStyle,
    },
    {
      dataField: "dueDate",
      text: "Due Date",
      sort: true,
      sortCaret,
      headerSortingClasses,
      headerStyle,
      style: { width: "90px" },
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
  ];

  return (
    <Formik
      enableReinitialize
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={handleSave}
    >
      {({ handleSubmit, values }) => {
        const sortedTickets = sortTicketsByHierarchy(
          Object.values(values.tickets),
        );

        return (
          <Form>
            <div className="w-full overflow-x-auto">
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center table-hover"
                bootstrap4
                remote={false} // no remote pagination
                keyField="Id"
                data={sortTicketsByHierarchy(entities) || []}
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
                className="btn btn-success"
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




