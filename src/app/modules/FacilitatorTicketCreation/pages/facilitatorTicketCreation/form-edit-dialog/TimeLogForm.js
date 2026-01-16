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

import DatePicker from "react-datepicker";
import { useFormUIContext } from "../FormUIContext";

const facilitator_ticket_creationEditSchema = (value) => {
    return Yup.object()
        .shape({





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

export function TimeLogForm({ onHide }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [timeLogData, setTimeLogData] = useState(formUIProps?.initTimeLog);
    const FormUIContext = useFormUIContext();
    const formUIProps = useMemo(() => {
        return {
            initTimeLog: FormUIContext.initTimeLog,
            setReadMode: FormUIContext.setReadMode,
            detailId: FormUIContext.detailId,

        };
    }, [FormUIContext]);





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

    const { timeLogForEdit } = currentState


    useEffect(() => {
        if (timeLogForEdit) {
            setTimeLogData(timeLogForEdit);
        }
    }, [timeLogForEdit]);


    console.log("TimeLogFetchedForEdit5555555555",timeLogForEdit,currentState)
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

    const saveForm = async (timeLogData, clearForm, onHide) => {

        timeLogData.noOfHours = parseFloat(timeLogData.noOfHours)
        timeLogData.detailId = formUIProps?.detailId ||  timeLogData.detailId



        // if (!timeLogData.Id) {

        
            dispatch(actions.createTimeLog(timeLogData, disbaleLoading, clearForm, onHide));
            dispatch(actions.fetchAllFacilitatorTimeLogDetail(timeLogData.detailId));



        // } 
        
        // else {


        //    dispatch(actions.createTimeLog(timeLogData, disbaleLoading, clearForm, onHide));


        //     await dispatch(actions.fetchAllFacilitatorTimeLogDetail(timeLogData.detailId));

        // }






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

                saveForm(values, clearForm, onHide);
            }}
        >
            {({ handleSubmit, errors, touched, values, setFieldValue, handleChange, handleReset }) => (
                <>
                    {console.log("aaaaaaaa", errors)}
                    <Modal.Body className="overlay overlay-block cursor-default">

                        <Form className="form form-label-right">
                            <fieldset >



                                <div className="grid grid-cols-4 gap-x-3 gap-y-1">










                                    <div className="">
                                        <label>
                                            {" "}
                                            Logged Date<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <DatePicker
                                            className="form-control"
                                            placeholder="Logged Date"
                                            selected={
                                                values?.loggedDate ? new Date(values.loggedDate) : new Date()
                                            }

                                            onChange={(date) => {
                                                setFieldValue("loggedDate", date);
                                            }}
                                            dateFormat="dd-MMM-yyyy"
                                            name="loggedDate"
                                            autoComplete="off"

                                            maxDate={new Date()}
                                        />

                                        {touched.loggedDate && errors.loggedDate && (
                                            <div className="invalid-feedback d-block">
                                                {errors.loggedDate}
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



                                            // value={
                                            //     values?.timeRangeFrom ? values.timeRangeFrom : ""
                                            // }

                                            value={values?.timeRangeFrom || "09:00 AM"} // default to 09:00 PM
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

                                            // value={
                                            //     values?.timeRangeTo ? values.timeRangeTo : ""
                                            // }

                                            value={values?.timeRangeTo || "09:00 PM"} // default to 09:00 PM
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


                                </div>




                                <div className="grid grid-cols-4 gap-x-3 gap-y-1">




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



                                <div className="grid grid-cols-4 gap-x-3 gap-y-1">




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

                                            isSelected={values.isBillable}
                                            children={"Biillable"}
                                        />

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
