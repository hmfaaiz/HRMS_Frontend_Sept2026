import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Button, Card, Form, Modal } from "react-bootstrap";
import { CirclePlus  } from "lucide-react";
import { CircleMinus  } from "lucide-react";

import {
  CardBody,
  DatePickerField,
  CardHeader,
  Input,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { format } from "date-fns";
import { formatDates, TicketType } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import TCard from "../../../../../utils/common-modules/TCard";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllProjects, fetchAllTicketStatus, fetchMasterTicketType } from "../../../../Dashboard/_redux/dashboardActions";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  from_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from_date"), "'To Date' should not be less than 'From Date'."),
});

export function FormCard() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [bodyValues, setBodyValues] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const customSubmit = (values) => {
    let formattedFromDate = formatDates(values?.from_date, "yyyy-MM-dd");
    let formattedToDate = formatDates(values?.to_date, "yyyy-MM-dd");

    dispatch(
      actions.fetchCalendar(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
  };

  const { currentState, dashboard } = useSelector((state) => {
    return {
      currentState: state?.ticket_calendar,
      dashboard: state?.dashboard,
    };
  });

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllProjects());
    dispatch(fetchAllTicketStatus());
    dispatch(fetchAllFormsMenu(545, "allTicketTypeList"));
     dispatch(fetchMasterTicketType());
  }, [dispatch]);

  const { ticketCalendar } = currentState;

  const setInitialValues = (firstSubsidiary) => {
    setBodyValues({
      from_date: firstSubsidiary?.payrollMonth?.startDate || "",
      to_date: firstSubsidiary?.payrollMonth?.endDate || "",
      subsidiaryId: firstSubsidiary?.value || "",
    });
    setIsDataLoaded(true); // Mark data as loaded
    dispatch(fetchAllActiveEmployeesBySubsidiary(firstSubsidiary?.value));
  };

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return
    const findDefaultSubs = dashboard.allSubsidiaryList?.find((e) => e?.isDefault)
    if (!findDefaultSubs?.value) return
    dispatch(fetchAllDept(findDefaultSubs?.value));
    setInitialValues(findDefaultSubs);
  }, [dashboard.allSubsidiaryList]);

  useEffect(() => {
    // Automatically submit when data is loaded
    if (isDataLoaded && bodyValues?.subsidiaryId) {
      customSubmit(bodyValues);
    }
  }, [isDataLoaded, bodyValues]);



  const clearFields = (values = [], setFieldValue) => {
    values.forEach((field) => {

      setFieldValue(field, ""); // Set each field to an empty value
    });
  };

  const ticketStatusOptions = [

    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "Send for Review" },
  ];

 const [activeKey, setActiveKey] = useState(null);
  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="">
          <Formik
            enableReinitialize={true}
            initialValues={{
              from_date: bodyValues?.from_date || null,
              to_date: bodyValues?.to_date || null,
              employeeId: "",


              isEnable_via_task_project: false,
              isEnable_via_task_assignment: false,
              ticketTypeIds: [],
              ticketStatusIds: [],
              taskTicketTypeIds: [],
              taskTicketStatusIds: [],
              projectTicketDescription: "",
              taskTicketDescription: "",
            }}
            validationSchema={formValidation}
          // onSubmit={(values) => {

          //   customSubmit(values);
          // }}
          >
            {({
              handleSubmit,
              handleBlur,
              setFieldValue,
              handleReset, handleChange,
              values,
              touched,
              errors,
            }) => {
              // Handle subsidiaryId change to reset all fields
              const handleSubsidiaryChange = (e) => {
                const selectedValue = e.value || null;

                Object.keys(values).forEach((key) => {
                  setFieldValue(key, null); // Reset each field to null
                });

                // Set the newly selected subsidiaryId
                setFieldValue("subsidiaryId", selectedValue);
                dispatch(fetchAllDept(selectedValue));
                setInitialValues(
                  dashboard?.allSubsidiaryList?.find(
                    (option) => option?.value === selectedValue
                  ) || null
                );
              };

              return (
                <>
                  <Modal.Body className="overlay overlay-block cursor-default">
                    <Form className="form form-label-right">
                      <fieldset>

                        <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)} >
                          <Card>
                            <Card.Header className="d-flex justify-content-center">
                              <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                                <Accordion.Toggle
                                  as={Button}
                                  eventKey="0"
                                  className="flex justify-start text-bold"
                                >

                                  {activeKey === "0" ? <CircleMinus className="h-4 w-4 text-black mr-1" /> : <CirclePlus className="h-4 w-4 text-black mr-1" />}<span className="text-black">Filters</span>

                                </Accordion.Toggle>
                              </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">

                              <>
                                <div>
                                  <h6 className="font-bold mb-0 text-primary my-2">
                                    Project
                                  </h6>
                                  <div className="col-span-3">
                                    <input
                                      name="isEnable_via_task_project"
                                      type="checkbox"
                                      // onChange={handleChange}
                                      onChange={(e) => {
                                        clearFields(["taskTicketDescription"], setFieldValue);
                                        setFieldValue("taskTicketStatusIds", [])
                                        setFieldValue("taskTicketTypeIds", [])
                                        setFieldValue("isEnable_via_task_assignment", false);
                                        clearFields(["projectId", "projectTicketDescription",], setFieldValue);

                                        setFieldValue('ticketStatusIds', [])
                                        setFieldValue('ticketTypeIds', [])
                                        handleChange(e); // Trigger the form change handler
                                        // if (!e.target.checked) {
                                        //   clearFields(
                                        //     ["shiftId", "offDay_1", "offDay_2"],
                                        //     setFieldValue
                                        //   );
                                        // }
                                      }}
                                      onBlur={handleBlur}
                                      value={values.isEnable_via_task_project}
                                      checked={values.isEnable_via_task_project}

                                    />
                                    <label>
                                      &nbsp;<span>Search Via Project</span>
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-4 gap-x-3 gap-y-1">

                                    <div>
                                      <SearchSelect
                                        name="projectId"
                                        isDisabled={!values.isEnable_via_task_project}
                                        label={
                                          <label>
                                            Project

                                          </label>
                                        }
                                        onChange={(e) => {
                                          const value =
                                            e.value == "Select" ? "" : Number(e.value);
                                          setFieldValue("projectId", value);

                                        }}
                                        value={
                                          dashboard?.allProjects?.find(
                                            (option) =>
                                              option?.value === values?.projectId
                                          ) || null
                                        }

                                        options={dashboard?.allProjects}
                                        error={errors.projectId}
                                        touched={touched.projectId}
                                      />

                                    </div>



                                    <div className="">
                                      <MultiSelect
                                        disabled={!values.isEnable_via_task_project}
                                        name="ticketTypeIds"
                                        label="Ticket Type"
                                        value={TicketType.filter(t =>
                                          values.ticketTypeIds?.includes(t.value)
                                        )}
                                        options={TicketType}
                                        onChange={(items = []) =>
                                          setFieldValue(
                                            "ticketTypeIds",
                                            items.map((i) => i.value)
                                          )
                                        }
                                      />
                                    </div>

                                    <div>
                                      <Field
                                        name="projectTicketDescription"
                                        component={Input}
                                        maxLength={200}
                                        disabled={!values.isEnable_via_task_project}
                                        label={
                                          <span>
                                            Ticket Description{" "}

                                          </span>
                                        }
                                      />
                                    </div>

                                    <div className="">
                                      <MultiSelect
                                        disabled={!values.isEnable_via_task_project}
                                        name="ticketStatusIds"
                                        label="Ticket Status"
                                        value={dashboard.allTicketStatus.filter(t =>
                                          values.ticketStatusIds?.includes(t.value)
                                        )}
                                        options={dashboard.allTicketStatus}
                                        onChange={(items = []) =>
                                          setFieldValue(
                                            "ticketStatusIds",
                                            items.map((i) => i.value)
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <h6 className="font-bold mb-0 text-primary my-2">
                                    Task Assignment
                                  </h6>
                                  <div className="col-span-3 mt-3">
                                    <input
                                      name="isEnable_via_task_assignment"
                                      type="checkbox"
                                      // onChange={handleChange}
                                      onChange={(e) => {
                                        clearFields(["projectId", "projectTicketDescription",], setFieldValue);
                                        setFieldValue("isEnable_via_task_project", false);
                                        setFieldValue('ticketStatusIds', [])
                                        setFieldValue('ticketTypeIds', [])

                                        clearFields(["taskTicketDescription"], setFieldValue);
                                        setFieldValue("taskTicketStatusIds", [])
                                        setFieldValue("taskTicketTypeIds", [])

                                        handleChange(e); // Trigger the form change handler
                                        // if (!e.target.checked) {
                                        //   clearFields(
                                        //     ["shiftId", "offDay_1", "offDay_2"],
                                        //     setFieldValue
                                        //   );
                                        // }
                                      }}
                                      onBlur={handleBlur}
                                      value={values.isEnable_via_task_assignment}
                                      checked={values.isEnable_via_task_assignment}

                                    />
                                    <label>
                                      &nbsp;<span>Search Via Task Assignment</span>
                                    </label>
                                  </div>


                                  <div className="grid grid-cols-4 gap-x-3 gap-y-1">




                                    <div className="">
                                      <MultiSelect
                                        name="taskTicketTypeIds"
                                        label="Ticket Type"
                                        disabled={!values.isEnable_via_task_assignment}
                                        value={dashboard.allMasterTicketType.filter(t =>
                                          values.taskTicketTypeIds?.includes(t.value)
                                        )}
                                        options={dashboard.allMasterTicketType}
                                        onChange={(items = []) =>
                                          setFieldValue(
                                            "taskTicketTypeIds",
                                            items.map((i) => i.value)
                                          )
                                        }
                                      />
                                    </div>

                                    <div>
                                      <Field
                                        name="taskTicketDescription"
                                        disabled={!values.isEnable_via_task_assignment}
                                        component={Input}
                                        maxLength={200}
                                        label={
                                          <span>
                                            Ticket Description{" "}

                                          </span>
                                        }
                                      />
                                    </div>

                                    <div className="">
                                      <MultiSelect
                                        name="taskTicketStatusIds"
                                        label="Ticket Status"
                                        disabled={!values.isEnable_via_task_assignment}
                                        value={ticketStatusOptions.filter(t =>
                                          values.taskTicketStatusIds?.includes(t.value)
                                        )}
                                        options={ticketStatusOptions}
                                        onChange={(items = []) =>
                                          setFieldValue(
                                            "taskTicketStatusIds",
                                            items.map((i) => i.value)
                                          )
                                        }
                                      />
                                    </div>

                                  </div>

                                </div>
                              </>

                            </Accordion.Collapse>
                          </Card>
                        </Accordion>



                        <div className="grid grid-cols-1 gap-x-3 gap-y-1 ">

                          <div className="">
                            <h6 className="font-bold mb-0 text-primary my-2">
                              Date
                            </h6>

                            <div className="grid grid-cols-4 gap-x-3 gap-y-1 ">


                              <div>
                                <label>
                                  From<span style={{ color: "red" }}>*</span>
                                </label>
                                <DatePicker
                                  className="form-control"
                                  placeholder="From "
                                  selected={
                                    values?.from_date
                                      ? new Date(values.from_date)
                                      : null
                                  }
                                  onChange={(date) => {
                                    setFieldValue("from_date", date);
                                    setFieldValue("to_date", date); // Sync from_date and to_date
                                  }}
                                  timeInputLabel="Time:"
                                  dateFormat="dd-MMM-yyyy"
                                  // showTimeInput
                                  name="from_date"
                                  autoComplete="off"
                                />
                              </div>


                              <div>
                                <label>
                                  To<span style={{ color: "red" }}>*</span>
                                </label>
                                <DatePicker
                                  className="form-control"
                                  placeholder="To "
                                  selected={
                                    values?.to_date
                                      ? new Date(values.to_date)
                                      : null
                                  }
                                  onChange={(date) => {
                                    setFieldValue("to_date", date);
                                  }}
                                  timeInputLabel="Time:"
                                  dateFormat="dd-MMM-yyyy"
                                  // showTimeInput
                                  name="to_date"
                                  autoComplete="off"
                                />
                              </div>

                              <div>
                                <SearchSelect
                                  name="employeeId"
                                  label={<span>Employee</span>}
                                  onChange={(e) => {
                                    setFieldValue("employeeId", e.value || null);
                                  }}
                                  value={
                                    dashboard?.allEmployees?.find(
                                      (option) =>
                                        option?.value === values?.employeeId
                                    ) || null
                                  }


                                  options={[
                                    { label: "Select", value: "" },
                                    ...(Array.isArray(
                                      values?.departmentId
                                        ? dashboard?.allEmployees?.filter(
                                          (emp) =>
                                            emp?.departmentId ===
                                            values.departmentId
                                        )
                                        : dashboard?.allEmployees
                                    )
                                      ? values?.departmentId
                                        ? dashboard?.allEmployees?.filter(
                                          (emp) =>
                                            emp?.departmentId ===
                                            values.departmentId
                                        )
                                        : dashboard?.allEmployees
                                      : []),
                                  ]}
                                  error={errors.employeeId}
                                  touched={touched.employeeId}
                                />
                              </div>

                            </div>
                          </div>



                        </div>
                      </fieldset>
                    </Form>
                  </Modal.Body >

                  <Modal.Footer className="relative">
                    <div className="text-xs absolute left-0 d-flex justify-content-center ">
                      <div className="d-flex align-items-center m-3">
                        <span className="dot bg_custom_color_1 me-2"></span>{" "}
                        Assigned
                      </div>
                      <div className="d-flex align-items-center m-3">
                        <span className="dot bg_custom_color_16 me-2"></span>{" "}
                        Log Time
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleReset();
                        dispatch(actions.clearEvents()); // Reset form and clear events
                      }}
                      className="btn btn-light"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        // customSubmit({ ...values, from_date: formattedFromDate, to_date: formattedToDate });
                        customSubmit(values);
                      }}
                      disabled={!values.from_date || !values.to_date || (values.isEnable_via_task_assignment && values.isEnable_via_task_project)}
                      className="btn btn-primary btn-elevate"
                    >
                      Filter
                    </button>
                  </Modal.Footer>
                </>
              );
            }}
          </Formik>
        </div>
        {ticketCalendar && ticketCalendar.length > 0 && <FormTable />}
      </TCard >
    </>
  );
}
