import React, { useCallback, useEffect, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Button, Card, Form, Modal } from "react-bootstrap";

import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import TCard from "../../../../../utils/common-modules/TCard";
import {
  fetchAllProjects,
  fetchMasterTicketType,
} from "../../../../Dashboard/_redux/dashboardActions";
import {
  Checkbox,
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { CircleMinus, CirclePlus } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import FormData from "../form-data/FormData";

const PROJECT_SECTION_OPTIONS = [
  { key: "recent_activity_date_wise", label: "Recent Activity - Date Wise" },
  {
    key: "employee_wise_ticket_status_overview",
    label: "Employee Wise Ticket Status Wise Overview",
  },
  { key: "overdue_tickets", label: "Overdue Tickets" },
  { key: "ticket_wise_time_log", label: "Tickets Wise Time Log" },
  { key: "employee_wise_time_log", label: "Employee Wise Time Log" },
  {
    key: "employee_ticket_wise_time_log",
    label: "Employee Ticket Wise Time Log",
  },
  {
    key: "pending_in_progress_ticket_time_log",
    label: "Pending In Progress Ticket Time Log",
  },
  { key: "completed_ticket_time_log", label: "Completed Ticket Time Log" },
  { key: "ticket_status_overview", label: "Ticket Status Overview" },
  { key: "ticket_type_wise_overview", label: "Ticket Type Wise Overview" },
  { key: "priority_status_overview", label: "Priority Status Overview" },
  { key: "employee_wise_overview", label: "Employee Wise Overview" },
];

const TASK_SECTION_OPTIONS = [
  { key: "recent_activity_date_wise", label: "Recent Activity - Date Wise" },
  {
    key: "employee_wise_task_status_overview",
    label: "Employee Wise Task Status Overview",
  },
  { key: "overdue_task", label: "Overdue Task" },
  { key: "task_wise_time_log", label: "Task Wise Time Log" },
  { key: "employee_wise_time_log", label: "Employee Wise Time Log" },
  { key: "employee_task_wise_time_log", label: "Employee Task Wise Time Log" },
  {
    key: "pending_in_progress_task_time_log",
    label: "Pending In Progress Task Time Log",
  },
  { key: "completed_task_time_log", label: "Completed Task Time Log" },
  { key: "task_status_overview", label: "Task Status Overview" },
  { key: "priority_wise_overview", label: "Priority Wise Overview" },
];

const getDefaultVisibleSections = (options) =>
  options.slice(0, 4).map((option) => option.key);

const formValidation = Yup.object()
  .shape({
    projectId: Yup.string().when(
      ["isEnable_via_task_project", "isEnable_via_task_assignment"],
      {
        is: (isEnable_via_task_project, isEnable_via_task_assignment) =>
          isEnable_via_task_project && !isEnable_via_task_assignment,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string(),
      },
    ),
    taskId: Yup.string().when(
      ["isEnable_via_task_assignment", "isEnable_via_task_project"],
      {
        is: (isEnable_via_task_assignment, isEnable_via_task_project) =>
          isEnable_via_task_assignment && !isEnable_via_task_project,
        then: Yup.string().required(VALIDATION_MESSAGES.required),
        otherwise: Yup.string(),
      },
    ),
    from_date: Yup.date().nullable(),

    to_date: Yup.date()
      .nullable()
      .when("from_date", (from_date, schema) => {
        if (from_date) {
          return schema.min(
            Yup.ref("from_date"),
            VALIDATION_MESSAGES.endDateMustBeAfterStartDate,
          );
        }
        return schema;
      }),
  })
  .test(
    "at-least-one-required",
    "Either Project or Task must be selected",
    function(value) {
      const {
        isEnable_via_task_project,
        isEnable_via_task_assignment,
        projectId,
        taskId,
      } = value;

      // Agar project checkbox checked hai aur project selected hai
      if (isEnable_via_task_project && projectId) {
        return true;
      }

      // Agar task checkbox checked hai aur task selected hai
      if (isEnable_via_task_assignment && taskId) {
        return true;
      }

      // Agar dono unchecked hain ya selected nahi hain
      return this.createError({
        path: "isEnable_via_task_project",
        message: "Please select either Project or Task",
      });
    },
  );

export function FormCard() {
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("1");
  const [visibleSections, setVisibleSections] = useState({
    project: getDefaultVisibleSections(PROJECT_SECTION_OPTIONS),
    task: getDefaultVisibleSections(TASK_SECTION_OPTIONS),
  });
  const [payload, setPayload] = useState({
    isEnable_via_task_project: true,
    isEnable_via_task_assignment: false,
    projectId: "",
    taskId: "",
    from_date: "",
    to_date: "",
  });
  const { dashboard, currentState } = useSelector((state) => {
    return {
      dashboard: state?.dashboard,
      currentState: state.task_dashboard,
    };
  });

  const { actionsLoading, data } = currentState;

  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(fetchMasterTicketType());
  }, [dispatch]);

  useEffect(() => {
    if (!dashboard?.allProjects?.length) return;

    setPayload({
      ...payload,
      projectId: dashboard?.allProjects?.[0]?.value,
    });
    fetchData({
      ...payload,
      projectId: dashboard?.allProjects?.[0]?.value,
    });
  }, [dashboard?.allProjects]);

  const fetchData = (data) => {
    const isValidSelection =
      (data.isEnable_via_task_project && data.projectId) ||
      (data.isEnable_via_task_assignment && data.taskId);

    if (!isValidSelection) return dispatch(actions.clearEvents());

    if (data?.from_date && data?.to_date) {
      const from = new Date(data.from_date);
      const to = new Date(data.to_date);

      if (from > to) {
        return; //
      }
    }

    let from_date = data?.from_date
      ? formatDates(data?.from_date, "yyyy-MM-dd")
      : null;
    let to_date = data?.to_date
      ? formatDates(data?.to_date, "yyyy-MM-dd")
      : null;

    dispatch(actions.fetchTaskDashboard({ ...data, from_date, to_date }));
  };

  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="">
          <Formik
            enableReinitialize={true}
            initialValues={payload}
            validationSchema={formValidation}
          >
            {({ setFieldValue, values, touched, errors, handleSubmit }) => {
              const activeSectionType = values.isEnable_via_task_project
                ? "project"
                : "task";
              const activeSectionOptions =
                activeSectionType === "project"
                  ? PROJECT_SECTION_OPTIONS
                  : TASK_SECTION_OPTIONS;
              const activeVisibleSections = visibleSections[activeSectionType];

              return (
                <>
                  <Modal.Body className="overlay overlay-block cursor-default">
                    <Form
                      className="form form-label-right"
                      onSubmit={handleSubmit}
                    >
                      <Accordion
                        activeKey={activeKey}
                        onSelect={(key) => setActiveKey(key)}
                      >
                        <Card>
                          <Card.Header className="d-flex justify-content-center">
                            <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                              <Accordion.Toggle
                                as={Button}
                                eventKey="0"
                                className="flex justify-start text-bold"
                              >
                                {activeKey === "0" ? (
                                  <CircleMinus className="h-4 w-4 text-black mr-1" />
                                ) : (
                                  <CirclePlus className="h-4 w-4 text-black mr-1" />
                                )}
                                <span className="text-black">Filters</span>
                              </Accordion.Toggle>
                            </div>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <fieldset disabled={actionsLoading}>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                                <div className="mt-2">
                                  <Checkbox
                                    isSelected={
                                      values.isEnable_via_task_project
                                    }
                                    children={"Search Via Project"}
                                    key={"isEnable_via_task_project"}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "isEnable_via_task_project",
                                        e.target.checked,
                                      );
                                      setFieldValue("taskId", "");
                                      setFieldValue(
                                        "isEnable_via_task_assignment",
                                        !e.target.checked,
                                      );
                                      dispatch(actions.clearEvents());
                                      setPayload({
                                        ...payload,
                                        isEnable_via_task_project:
                                          e.target.checked,
                                        taskId: "",
                                        isEnable_via_task_assignment: !e.target
                                          .checked,
                                      });
                                    }}
                                  />
                                  {touched.isEnable_via_task_project &&
                                    errors.isEnable_via_task_project && (
                                      <div className="text-danger text-sm mt-1">
                                        {errors.isEnable_via_task_project}
                                      </div>
                                    )}
                                </div>
                                <div className="mt-2">
                                  <Checkbox
                                    isSelected={
                                      values.isEnable_via_task_assignment
                                    }
                                    children={"Search Via Task Assignment"}
                                    key={"isEnable_via_task_assignment"}
                                    name="isEnable_via_task_assignment"
                                    type="checkbox"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "isEnable_via_task_project",
                                        !e.target.checked,
                                      );
                                      setFieldValue("projectId", "");
                                      setFieldValue(
                                        "isEnable_via_task_assignment",
                                        e.target.checked,
                                      );
                                      dispatch(actions.clearEvents());
                                      setPayload({
                                        ...payload,
                                        isEnable_via_task_project: !e.target
                                          .checked,
                                        isEnable_via_task_assignment:
                                          e.target.checked,
                                        projectId: "",
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3">
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <SearchSelect
                                      name="projectId"
                                      isDisabled={
                                        !values.isEnable_via_task_project
                                      }
                                      label={<label>Project</label>}
                                      onChange={(e) => {
                                        const value =
                                          e.value == "Select"
                                            ? ""
                                            : Number(e.value);
                                        setFieldValue("projectId", value);
                                        setPayload({
                                          ...payload,
                                          projectId: value,
                                        });
                                        fetchData({
                                          ...payload,
                                          projectId: value,
                                        });
                                      }}
                                      value={
                                        dashboard?.allProjects?.find(
                                          (option) =>
                                            option?.value === values?.projectId,
                                        ) || null
                                      }
                                      options={dashboard?.allProjects}
                                      error={errors.projectId}
                                      touched={touched.projectId}
                                    />
                                  </div>

                                  <div>
                                    <SearchSelect
                                      name="taskId"
                                      label="Task"
                                      isDisabled={
                                        !values.isEnable_via_task_assignment
                                      }
                                      options={dashboard.allMasterTicketType}
                                      onChange={(e) => {
                                        const value =
                                          e.value == "Select"
                                            ? ""
                                            : Number(e.value);
                                        setFieldValue("taskId", value);
                                        setPayload({
                                          ...payload,
                                          taskId: value,
                                        });
                                        fetchData({
                                          ...payload,
                                          taskId: value,
                                        });
                                      }}
                                      value={
                                        dashboard?.allMasterTicketType?.find(
                                          (option) =>
                                            option?.value === values?.taskId,
                                        ) || null
                                      }
                                      error={errors.taskId}
                                      touched={touched.taskId}
                                    />
                                    {touched.taskId && errors.taskId && (
                                      <div className="text-danger text-sm mt-1">
                                        {errors.taskId}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <Field
                                      name="from_date"
                                      component={DatePickerField}
                                      dateFormat="dd-MMM-yyyy"
                                      onChange={(date) => {
                                        setFieldValue("from_date", date);
                                        setFieldValue("to_date", date);
                                        setPayload({
                                          ...payload,
                                          from_date: date,
                                          to_date: date,
                                        });
                                        fetchData({
                                          ...payload,
                                          from_date: date,
                                          to_date: date,
                                        });
                                      }}
                                      label={<span>From</span>}
                                    />
                                  </div>

                                  <div>
                                    <Field
                                      name="to_date"
                                      component={DatePickerField}
                                      dateFormat="dd-MMM-yyyy"
                                      onChange={(date) => {
                                        setFieldValue("to_date", date);
                                        setPayload({
                                          ...payload,
                                          to_date: date,
                                        });
                                        fetchData({
                                          ...payload,
                                          to_date: date,
                                        });
                                      }}
                                      label={<span>To</span>}
                                    />
                                    {errors?.to_date ? (
                                      <span className="invalid-feedback">
                                        {errors?.to_date}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="md:col-span-6">
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                                    {activeSectionOptions.map((section) => (
                                      <Checkbox
                                        key={section.key}
                                        isSelected={activeVisibleSections.includes(
                                          section.key,
                                        )}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setVisibleSections((prev) => {
                                            const current =
                                              prev[activeSectionType] || [];
                                            if (checked) {
                                              if (current.includes(section.key))
                                                return prev;
                                              return {
                                                ...prev,
                                                [activeSectionType]: [
                                                  ...current,
                                                  section.key,
                                                ],
                                              };
                                            }

                                            return {
                                              ...prev,
                                              [activeSectionType]: current.filter(
                                                (key) => key !== section.key,
                                              ),
                                            };
                                          });
                                        }}
                                      >
                                        {section.label}
                                      </Checkbox>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Form>
                  </Modal.Body>
                </>
              );
            }}
          </Formik>
        </div>
      </TCard>
      <FormData
        data={data}
        isProject={payload.isEnable_via_task_project && payload?.projectId}
        isTask={payload.isEnable_via_task_assignment && payload?.taskId}
        actionsLoading={actionsLoading}
        projectVisibleSections={visibleSections.project}
        taskVisibleSections={visibleSections.task}
      />
    </>
  );
}
