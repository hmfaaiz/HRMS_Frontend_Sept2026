import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as actions from "../../../_redux/redux-Actions";
import {
    Checkbox,
    Input,
    TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { TimePickerField } from "../../../../../../_metronic/_partials/controls/forms/TimePickerField";
import { FetchAllFacilitatorEmployee } from "../../../../Dashboard/_redux/dashboardActions";
import DatePicker from "react-datepicker";
import { useFormUIContext } from "../FormUIContext";

const facilitator_ticket_creationEditSchema = (value) => {
    return Yup.object()
        .shape({



            loggedDate: Yup.date()

                .nullable()
                .required(VALIDATION_MESSAGES.required),



            timeRangeFrom: Yup.string()
                .when("timeRangeTo", {
                    is: (value) => value !== null && value !== "",
                    then: Yup.string().required(VALIDATION_MESSAGES.required),
                    otherwise: Yup.string().notRequired(),
                }),

            timeRangeTo: Yup.string()
                .when("timeRangeFrom", {
                    is: (value) => value !== null && value !== "",
                    then: Yup.string().required(VALIDATION_MESSAGES.required),
                    otherwise: Yup.string().notRequired(),
                }),



            noOfHours: Yup.number()

                .nullable()
                .required(VALIDATION_MESSAGES.required),




            timeRangeFrom: Yup.string().test(
                "from-required-if-to",
                VALIDATION_MESSAGES.required,
                function (value) {
                    const { timeRangeTo } = this.parent;
                    if (timeRangeTo && !value) {
                        return false;
                    }
                    return true;
                }
            ),

            timeRangeTo: Yup.string().test(
                "to-required-if-from",
                VALIDATION_MESSAGES.required,
                function (value) {
                    const { timeRangeFrom } = this.parent;
                    if (timeRangeFrom && !value) {
                        return false;
                    }
                    return true;
                }
            ),



            workDescription: Yup.string()
                .trim()
                .nullable(),
            // .required(VALIDATION_MESSAGES.required),

        }
        );
};

export function TimeLogForm() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const FormUIContext = useFormUIContext();
    const formUIProps = useMemo(() => {
        return {
            initTimeLog: FormUIContext.initTimeLog,
            setReadMode: FormUIContext.setReadMode,

        };
    }, [FormUIContext]);


    let timeLogData = formUIProps?.initTimeLog;
    const { dashboard } = useSelector((state) => state);
    const inputFile = useRef(null);



    const { currentState, userAccess, allEmployees, facilitatorEmployeeList } = useSelector((state) => {
        return {
            currentState: state.facilitator_ticket_creation,
            userAccess: state?.auth?.userAccess["facilitator_ticket_creation"],
            allEmployees: state.dashboard.allEmployees,
            facilitatorEmployeeList: state.dashboard.facilitatorEmployeeList
        };
    }, shallowEqual);


    const ticketStatusOptions = [

        { value: 1, label: "Open" },
        { value: 0, label: "Completed" },
        { value: 3, label: "Re-opened" },
        { value: 2, label: "Send for Review" },
    ];


    const calculateHours = (fromTime, toTime) => {
        if (!fromTime || !toTime) return 0;

        // Convert string like "12:49 PM" to Date objects
        const parseTime = (timeStr) => {
            const [time, modifier] = timeStr.split(" "); // ["12:49", "PM"]
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return { hours, minutes };
        };

        const from = parseTime(fromTime);
        const to = parseTime(toTime);

        // Total hours difference
        let diffHours = to.hours - from.hours;
        let diffMinutes = to.minutes - from.minutes;

        if (diffMinutes < 0) {
            diffMinutes += 60;
            diffHours -= 1;
        }

        const totalHours = diffHours + diffMinutes / 60;

        // Prevent negative hours
        console.log("totalHours1111", totalHours)
        return totalHours > 0 ? totalHours : 0;
    };
    const disbaleLoading = () => {
        setLoading(false);
    };

    const enableLoading = () => {
        setLoading(true);
    };

    const saveForm = async (timeLogData, clearForm) => {

        timeLogData.noOfHours = parseFloat(timeLogData.noOfHours)



        if (!timeLogData.Id) {

            dispatch(actions.createTimeLog(timeLogData, disbaleLoading, clearForm));
           


        } else {






            const formUpdatedFields = {
                Id: timeLogData.Id,
                loggedByEmpId: timeLogData.loggedByEmpId,
                workDescription: timeLogData.workDescription,
                loggedDate: timeLogData.loggedDate,
                timeRangeFrom: timeLogData.timeRangeFrom,
                timeRangeTo: timeLogData.timeRangeTo,
                noOfHours: timeLogData.noOfHours,
               
            };




            await dispatch(actions.updateTicketCreation(formUpdatedFields, disbaleLoading, clearForm));


            await dispatch(actions.fetchReceiveTickets(formUIProps.queryParams));
        }






    };


    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                ...timeLogData,



            }}
            // validationSchema={facilitator_ticket_creationEditSchema}
            validationSchema={facilitator_ticket_creationEditSchema(timeLogData)}
            onSubmit={(values, { resetForm }) => {
                enableLoading();


                const clearForm = () => {

                    resetForm();

                };

                saveForm(values, clearForm);
            }}
        >
            {({ handleSubmit, errors, touched, values, setFieldValue, handleChange, handleReset }) => (
                <>
                    {console.log("aaaaaaaa", errors)}
                    <Modal.Body className="overlay overlay-block cursor-default">

                        <Form className="form form-label-right">
                            <fieldset >



                                <div className="grid grid-cols-8 gap-x-3 gap-y-1">

                                    {/* <div className="">
                                        <SearchSelect
                                            name="ticketTypeId"
                                            label={
                                                <span>
                                                    Ticket Type<span style={{ color: "red" }}>*</span>
                                                </span>
                                            }
                                            isDisabled={!values.initiator}
                                            onChange={(e) => {
                                                setFieldValue("ticketTypeId", e.value || null);
                                                dispatch(FetchAllFacilitatorEmployee(e.value));
                                                // setAssignTo(setFieldValue)
                                                // if (facilitatorEmployeeList?.length === 1) {
                                                //   console.log("Auto-assigning:", facilitatorEmployeeList[0].value);
                                                //   setFieldValue("assignTo", facilitatorEmployeeList[0].value);
                                                // }
                                            }}
                                            value={
                                                dashboard.allTicketTypeList.find(
                                                    (option) => option.value === values.ticketTypeId
                                                ) || null
                                            }
                                            // options={dashboard.allTicketTypeList}
                                            options={dashboard.allTicketTypeList.filter(option => option.label !== "Escalation Ticket")}
                                            error={errors.ticketTypeId}
                                            touched={touched.ticketTypeId}
                                        />
                                    </div>






                                    <div className="">
                                        <SearchSelect
                                            name="assignTo"
                                            label={
                                                <span>
                                                    Logged By
                                                </span>
                                            }
                                            // Disable if read mode, no initiator, or auto-assigned
                                            isDisabled={

                                                !values.initiator ||
                                                facilitatorEmployeeList?.length === 1
                                            }
                                            onChange={(e) => {
                                                setFieldValue("assignTo", e.value || null);
                                            }}
                                            // Auto-assign if only 1 record
                                            value={
                                                facilitatorEmployeeList?.length === 1
                                                    ? facilitatorEmployeeList[0]
                                                    : facilitatorEmployeeList?.find(option => option.value === values.assignTo) || null
                                            }
                                            options={facilitatorEmployeeList}
                                            error={errors.assignTo}
                                            touched={touched.assignTo}
                                        />
                                    </div> */}

                                    <div className="">
                                        <label>
                                            {" "}
                                            Ticket Date<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <DatePicker
                                            className="form-control"
                                            placeholder="Ticket Date"
                                            selected={
                                                values?.ticketDate ? new Date(values.ticketDate) : new Date()
                                            }
                                            disabled={true}
                                            dateFormat="dd-MMM-yyyy"
                                            name="ticketDate"
                                            autoComplete="off"
                                            minDate={new Date()}
                                            maxDate={new Date()}
                                        />

                                        {touched.ticketDate && errors.ticketDate && (
                                            <div className="invalid-feedback d-block">
                                                {errors.ticketDate}
                                            </div>
                                        )}
                                    </div>


                                    <div className="">
                                        <label>
                                            <span>
                                                From Time

                                            </span>
                                        </label>
                                        <TimePickerField
                                            className="form-control"


                                            name="timeRangeFrom"



                                            value={
                                                values?.timeRangeFrom ? values.timeRangeFrom : ""
                                            }
                                            onChange={(val) => {
                                                setFieldValue("timeRangeFrom", val);
                                                const hours = calculateHours(val, values.timeRangeTo);
                                                setFieldValue("noOfHours", hours.toFixed(2)); // 2 decimal places
                                            }}
                                            // onBlur={() => setFieldTouched("timeRangeFrom", true)}
                                            touched={touched.timeRangeFrom}
                                            errors={errors.timeRangeFrom}
                                        />
                                    </div>


                                    <div className="">
                                        <label>
                                            <span>
                                                To Time

                                            </span>
                                        </label>
                                        <TimePickerField
                                            className="form-control"

                                            name="timeRangeTo"

                                            value={
                                                values?.timeRangeTo ? values.timeRangeTo : ""
                                            }
                                            onChange={(val) => {
                                                setFieldValue("timeRangeTo", val);
                                                const hours = calculateHours(values.timeRangeFrom, val);
                                                setFieldValue("noOfHours", hours.toFixed(2));
                                            }}
                                            // onBlur={() => setFieldTouched("timeRangeTo", true)}
                                            touched={touched.timeRangeTo}
                                            errors={errors.timeRangeTo}
                                        />
                                    </div>


                                    <div className="">
                                        <label>
                                            <span>
                                                No.of Hours
                                                <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </label>
                                        {/* <Field
                      name="noOfHours"
                      component={Input}
                      placeholder="Enter no of hours"
                      type="number"
                    /> */}

                                        <Field
                                            name="noOfHours"
                                            component={Input}
                                            placeholder="Enter no of hours"
                                            type="number"

                                            disabled={values.timeRangeFrom || values.timeRangeTo}
                                        />

                                    </div>

                                    <div className="flex items-center gap-1 mt-3">
                                        <Field
                                            name={`isBillable`}
                                            component={Checkbox}
                                            onChange={(e) => {
                                                setFieldValue(
                                                    `isBillable`,
                                                    e.target.checked
                                                );
                                            }}
                                            disabled
                                            isSelected={values.isBillable}
                                            children={"Biillable"}
                                        />

                                    </div>
                                </div>




                                <div className="grid grid-cols-8 gap-x-3 gap-y-1">




                                    <div className="col-span-8">
                                        <Field
                                            name="workDescription"
                                            component={TextArea}
                                            disabled={timeLogData?.Master?.workDescription}
                                            placeholder="Enter ticket description"
                                            className="form-control" // Force full height


                                            label={
                                                <span>
                                                    {" "}
                                                    Work Description
                                                    {/* <span style={{ color: "red" }}>*</span> */}
                                                </span>
                                            }
                                            autoComplete="off"
                                        />
                                        <div>

                                        </div>
                                    </div>







                                </div>










                            </fieldset>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>




                        <button
                            type="button"
                            onClick={() => {
                               
                                if (facilitatorEmployeeList?.length === 1) {
                                    values.assignTo = facilitatorEmployeeList[0].value;
                                }
                                handleSubmit();
                                // setId("");
                                // handleReset();


                                if (inputFile?.current) {
                                    inputFile.current.value = "";
                                }
                            }}

                            className="btn btn-primary btn-elevate"
                        >
                            Save

                        </button>

                    </Modal.Footer>
                </>
            )}
        </Formik>
    );
}
