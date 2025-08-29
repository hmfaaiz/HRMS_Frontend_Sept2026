import { Field, FieldArray, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Accordion, Card, Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../_metronic/_partials/controls";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu,
} from "../../../../../_metronic/redux/dashboardActions";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../utils/constants";
import { getProfileInfo } from "../../_redux/formCrud";
import { KeyboardArrowDown } from "@material-ui/icons";
import { TimePickerField } from "../../../../../_metronic/_partials/controls/forms/TimePickerField";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import { formatDates } from "../../../../utils/common";

const formValidation = Yup.object().shape({
  interview_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  interview_time: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .trim()
    .min(1, VALIDATION_MESSAGES.required) // catches empty string
    .matches(
      /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
      "Enter time as hh:mm AM/PM"
    ),
  locationId: Yup.string().required(VALIDATION_MESSAGES.required),
  interviewers: Yup.array()
    .of(
      Yup.object().shape({
        employeeId: Yup.string().required(VALIDATION_MESSAGES.required),
      })
    )
    .min(1, "At least one interviewer is required"),
});

const InterviewerRow = ({
  index,
  interviewer,
  errors,
  touched,
  values,
  setFieldValue,
  dashboard,
  isUserForRead,
  remove,
  employeeDetails,
  setEmployeeDetails,
}) => {
  const empDetail = employeeDetails[interviewer.employeeId] || {};
  const selectedEmployeeIds = values.interviewers.map((i) => i.employeeId);
  return (
    <tr key={index}>

      <td>
        <SearchSelect
          name={`interviewers[${index}].employeeId`}
          className="form-control"
          style={{ width: "200px", zIndex: 9999 }}
          isDisabled={isUserForRead}
          value={
            dashboard?.allEmployees?.find(
              (x) => x.value === values.interviewers[index]?.employeeId
            ) || null
          }
          onChange={(e) => {
            if (e?.value) {
              setFieldValue(`interviewers[${index}].employeeId`, e?.value);
              setEmployeeDetails({ ...employeeDetails, [e?.value]: {} });
            }
          }}
          options={dashboard?.allEmployees.map((e) => {
            return {
              ...e,
              isDisabled: selectedEmployeeIds.includes(e.value),
            };
          })}
          getOptionLabel={(x) => x.label}
          getOptionValue={(x) => x.value}
          isOptionDisabled={(x) => x.disabled}
          placeholder="Select--"
        />

        {errors.interviewers?.[index]?.employeeId &&
          touched.interviewers?.[index]?.employeeId && (
            <div className="invalid-feedback">
              {errors.interviewers[index]?.employeeId}
            </div>
          )}
      </td>
      <td>{empDetail?.department?.deptName || ""}</td>
      <td>{empDetail?.designation?.formName || ""}</td>
      <td>{empDetail?.grade?.formName || ""}</td>
      <td>{empDetail?.employeeType?.formName || ""}</td>
      <td>{empDetail?.subsidiary?.name || ""}</td>
      <td>{empDetail?.location?.formName || ""}</td>
      <td className="text-right">
        <button className="bg-transparent border-none"
          disabled={isUserForRead}

          type="button"
          onClick={() => remove(index)}
        >
          <Trash2 className="w-4 h-4 text-black cursor-pointer" />
        </button>
      </td>
    </tr>
  );
};

export default function MasterEditForm({
  saveForm,
  data,
  onHide,
  isUserForRead,
  loading,
  actionsLoading,
  minDate,
}) {
  const dispatch = useDispatch();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [showSection, setShowSection] = useState(false);
  const { dashboard, applicantStatusList } = useSelector((state) => ({
    dashboard: state?.dashboard,
    applicantStatusList: state?.interview_schedule?.applicantStatusList,
  }));

  useEffect(() => {
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // for all location
    dispatch(fetchAllActiveEmployees());
  }, []);

  // Fetch employee details when interviewers change
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!Object.keys(employeeDetails).length) return;
      for (const interviewer of Object.keys(employeeDetails)) {
        if (Object.values(employeeDetails[interviewer]).length === 0) {
          let result = await getProfileInfo({
            Id: interviewer,
          });
          setEmployeeDetails({
            ...employeeDetails,
            [interviewer]: result?.data?.data || {},
          });
        }
      }
    };
    fetchEmployeeDetails();
  }, [employeeDetails]);

  useEffect(() => {
    if (data?.interviewers) {
      let obj = {};
      data.interviewers.map((interviewer) => {
        obj[interviewer.employeeId] = {};
      });
      setEmployeeDetails(obj);
    }
  }, [data]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={formValidation}
      onSubmit={(values) => {
         const payload = {
                  ...values,
                  interview_date: values.interview_date
                    ? formatDates(values.interview_date, "dd-MMM-yyyy")
                    : null,

                    }


        saveForm(payload);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        setFieldTouched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <div >
                <fieldset disabled={isUserForRead}>
                  <div className="grid lg:grid-cols-3 gap-x-3 gap-y-1">
                    <div className="">
                      <label>
                        Interview Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="interview_date"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        value={
                          values?.interview_date
                            ? new Date(values?.interview_date)
                            : ""
                        }
                        type="date"
                        onChange={(e) => {
                          setFieldValue("interview_date", e ? e : "");
                        }}
                        minDate={new Date(minDate)}
                      />
                    </div>
                    <div className="">
                      <TimePickerField
                        className="form-control"
                       
                        name="interview_time"
                        label={
                          <span>
                            {" "}
                            Interview Time
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          values?.interview_time ? values.interview_time : ""
                        }
                        onChange={(val) => {
                          setFieldValue("interview_time", val);
                        }}
                        onBlur={() => setFieldTouched("interview_time", true)}
                        touched={touched.interview_time}
                        errors={errors.interview_time}
                      />
                    </div>
                    <div className="">
                      <SearchSelect
                        name="locationId"
                        label={
                          <span>
                            Location<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("locationId", e.value || null);
                        }}
                        value={
                          dashboard?.allLocationChildMenus?.find(
                            (option) => option.value === values.locationId
                          ) || null
                        }
                        options={dashboard?.allLocationChildMenus}
                        error={errors.locationId}
                        touched={touched.locationId}
                      />
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-1 gap-x-3 mt-1">

                    <div className="">
                      <label>
                        <span>Interview Detail</span>
                      </label>
                      <Field
                        name="interview_detail"
                        component={TextArea}
                        placeholder="Enter Detail"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-1 gap-x-3 mt-1">
                    <div className="w-full overflow-x-auto">
                      <FieldArray name="interviewers">
                        {({ push, remove }) => (
                          <div>
                            <div className="flex justify-between items-center">
                              <h6 className="font-bold mb-0 text-primary">
                                Interviewers{"  "}
                              </h6>
                              {!isUserForRead && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      employeeId: "",
                                    })
                                  }
                                  className="btn btn-primary btn-sm mt-1"
                                >
                                  <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                                  Add Interviewer
                                </button>
                              )}
                            </div>
                            <div className="w-full overflow-x-auto">
                              <div className="react-bootstrap-table table-responsive">
                                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                  <tr className="custom-table-header">

                                    <td className="">Interviewer</td>
                                    <td className="">Department</td>
                                    <td className="">Designation</td>
                                    <td className="">Grade</td>
                                    <td className="">Employee Type</td>
                                    <td className="">Subsidiary</td>
                                    <td className="">Location</td>
                                    <td className="">Action</td>
                                  </tr>

                                  <tbody>
                                    {values?.interviewers?.map(
                                      (interviewer, index) => (
                                        <InterviewerRow
                                          key={index}
                                          index={index}
                                          interviewer={interviewer}
                                          errors={errors}
                                          touched={touched}
                                          values={values}
                                          setFieldValue={setFieldValue}
                                          dashboard={dashboard}
                                          isUserForRead={isUserForRead}
                                          remove={remove}
                                          employeeDetails={employeeDetails}
                                          setEmployeeDetails={setEmployeeDetails}
                                        />
                                      )
                                    )}
                                  </tbody>
                                </table>


                                {typeof errors?.interviewers === "string" && (
                                  <div>
                                    <span
                                      style={{ color: "red", marginTop: "5px" }}
                                    >
                                      {errors?.interviewers}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </FieldArray>

                    </div>
                  </div>
                </fieldset>
                <div className="">
                  <div className="flex justify-end">

                    <button
                      type="button"
                      onClick={() => setShowSection(!showSection)}
                      className="btn btn-primary btn-sm mt-1 text-right"
                    >

                      {showSection ? (
                        <CircleMinus className="h-4 w-4 mr-1" />
                      ) : (
                        <CirclePlus className="h-4 w-4 mr-1" />
                      )}
                      Interview Recommendations

                    </button>
                  </div>
                  {showSection && (
                    <div className="">
                      <div className="">
                        <label>
                          <span>Interview Remarks</span>
                        </label>
                        <Field
                          name="interview_remarks"
                          component={TextArea}
                          disabled={isUserForRead}
                          placeholder="Enter Interview Remarks"
                          type="text"
                        />
                      </div>
                      <div className="mt-1">
                        <label>
                          <span>Interviewer Recommendation</span>
                        </label>
                        <Field
                          name="interview_recommendation"
                          disabled={isUserForRead}
                          component={TextArea}
                          placeholder="Enter Interviewer Recommendation"
                          type="text"
                        />
                      </div>
                      <div className="grid lg:grid-cols-3">
                        <div className="mt-1">
                          <SearchSelect
                            name="recommendedApplicantStatusId"
                            label={<span>Recommended Applicant Status</span>}
                            isDisabled={isUserForRead}
                            onChange={(e) => {
                              setFieldValue(
                                "recommendedApplicantStatusId",
                                e.value || null
                              );
                            }}
                            value={
                              applicantStatusList?.find(
                                (option) =>
                                  option.value ===
                                  values.recommendedApplicantStatusId
                              ) || null
                            }
                            options={applicantStatusList}
                            error={errors.recommendedApplicantStatusId}
                            touched={touched.recommendedApplicantStatusId}
                          />
                        </div>
                      </div>

                    </div>
                  )}



                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isUserForRead ? (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )}

            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
