import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  Checkbox,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

const getFormSchema = ({
  isComment,
  ratingSelection,
  min,
  max,
  isLastQuestion,
}) =>
  Yup.object().shape({
    ratingValue: ratingSelection
      ? Yup.number()
          .typeError("Rating selection is required")
          .required(VALIDATION_MESSAGES.required)
      : Yup.number()
          .typeError("Rating must be a number")
          .required(VALIDATION_MESSAGES.required)
          .min(min, `Rating must be at least ${min}`)
          .max(max, `Rating cannot exceed ${max}`),

    comments: isComment
      ? Yup.string()
          .trim()
          .required(VALIDATION_MESSAGES.required)
      : Yup.string().nullable(),
    feedback: isLastQuestion
      ? Yup.string()
          .trim()
          .required(VALIDATION_MESSAGES.required)
      : Yup.string().nullable(),

    recommendation: isLastQuestion
      ? Yup.string()
          .trim()
          .required(VALIDATION_MESSAGES.required)
      : Yup.string().nullable(),
  });

export function FormEditForm({
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  setLoading,
  ratingDetail,
  ratingSelection,
}) {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const {
    actionsLoading,
    userForEdit,
    employeeDetail,
    isHREvaluation,
    appraisalEmpDetail,
  } = useSelector((state) => {
    return {
      actionsLoading: state.appraisal_evaluation?.actionsLoading,
      userForEdit: state.appraisal_evaluation?.userForEdit,
      employeeDetail: state.appraisal_evaluation?.employeeDetail,
      appraisalEmpDetail: state.appraisal_evaluation?.appraisalEmpDetail,
      isHREvaluation: state.appraisal_evaluation?.isHREvaluation,
    };
  });

  const [currentQues, setCurrentQues] = useState(null);
  const [attSum, setAttSum] = useState(false);
  const [localUserForEdit, setLocalUserForEdit] = useState([]);

  // Sync local state with Redux state
  useEffect(() => {
    if (userForEdit && userForEdit.length > 0) {
      setLocalUserForEdit([...userForEdit]);
    }
  }, [userForEdit]);

  const formUIProps = useMemo(() => {
    return {
      setIds: FormUIContext.setIds,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  useEffect(() => {
    if (localUserForEdit.length > 0) {
      const findQuesInd = localUserForEdit.findIndex((el) => !el?.isSubmitted);
      if (findQuesInd !== -1) {
        setCurrentQues(localUserForEdit[findQuesInd]);
      } else {
        setCurrentQues(localUserForEdit[0]);
      }
    }
  }, [localUserForEdit]);

  const formSchema = useMemo(() => {
    const isLast =
      currentQues?.Id === localUserForEdit[localUserForEdit.length - 1]?.Id;
    return getFormSchema({
      isComment: currentQues?.isCommentRequired,
      ratingSelection,
      min: ratingDetail?.minPoint,
      max: ratingDetail?.maxPoint,
      isLastQuestion: isLast,
    });
  }, [ratingSelection, ratingDetail, currentQues, localUserForEdit]);

  const prevClick = (val) => {
    let index = localUserForEdit.findIndex((el) => el?.Id === val?.Id);
    if (index !== -1 && index !== 0) {
      setCurrentQues(localUserForEdit[index - 1]);
    }
  };

  const navigateToNextQuestion = (currentValues) => {
    let currentIndex = localUserForEdit.findIndex(
      (el) => el?.Id === currentValues?.Id,
    );

    if (currentIndex !== -1 && currentIndex < localUserForEdit.length - 1) {
      const nextQuestion = localUserForEdit[currentIndex + 1];
      setCurrentQues(nextQuestion);
    }
  };

  const nextClick = async (values, validateForm, setTouched) => {
    const errors = await validateForm();

    if (Object.keys(errors).length > 0) {
      setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      );
      return;
    }

    let findVal = localUserForEdit.find((el) => el?.Id === values?.Id);

    const hasChanges =
      findVal?.ratingValue != values?.ratingValue ||
      findVal?.comments != values?.comments;

    if (hasChanges) {
      enableLoading();
      try {
        await dispatch(
          actions.updateAppraisalEvaluation({ values, isLast: false }),
        );

        // Update local state
        const updatedLocalUserForEdit = localUserForEdit.map((question) =>
          question.Id === values.Id ? { ...question, ...values } : question,
        );
        setLocalUserForEdit(updatedLocalUserForEdit);

        // Navigate to next question
        navigateToNextQuestion(values);
      } catch (error) {
        console.error("Failed to update appraisal:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // Navigate to next question
      navigateToNextQuestion(values);
    }
  };

  const finalSubmissionClick = async (values, validateForm, setTouched) => {
    const errors = await validateForm();

    if (Object.keys(errors).length > 0) {
      setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      );
      return;
    }

    enableLoading();
    try {
      await dispatch(
        actions.updateAppraisalEvaluation({ values, isLast: true }),
      );
      // Update local state
      const updatedLocalUserForEdit = localUserForEdit.map((question) =>
        question.Id === values.Id
          ? { ...question, ...values, isSubmitted: true }
          : question,
      );
      setLocalUserForEdit(updatedLocalUserForEdit);

      setLoading(false);
      onHide();
      formUIProps.setIds([]);
      dispatch(actions.fetchAppraisalEvaluation(formUIProps.queryParams));
    } catch (error) {
      console.error("Failed to submit appraisal:", error);
      setLoading(false);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...currentQues,
        comments: currentQues?.comments || "",
        ratingValue: currentQues?.ratingValue || "",
        feedback: employeeDetail?.feedback || "",
        recommendation: employeeDetail?.recommendation || "",
      }}
      validationSchema={formSchema}
    >
      {({
        setFieldValue,
        validateForm,
        setTouched,
        errors,
        values,
        touched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && !currentQues && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-2 text-sm text-black">
                  {/* <div className="font-medium text-tprimary"> */}
                  <div className="col-span-5 lg:col-span-6">
                    {employeeDetail?.formName} for the employee:{" "}
                    <span className="text-tprimary">
                      {employeeDetail?.employeeCode} -{" "}
                      {employeeDetail?.firstName} {employeeDetail?.middleName}{" "}
                      {employeeDetail?.lastName} (
                      {employeeDetail?.designation?.formName})
                    </span>
                  </div>
                  <div className="col-span-5 lg:col-span-6 my-1" />
                  <div className="font-medium text-tprimary">Competency</div>
                  <div className="col-span-5">
                    {currentQues?.CompetencyName}
                  </div>

                  <div className="font-medium text-tprimary">
                    {currentQues?.type}
                  </div>
                  <div className="col-span-5">{currentQues?.questionName}</div>

                  <div className="font-medium text-tprimary">
                    Question{" "}
                    {localUserForEdit?.findIndex(
                      (el) => el?.Id == currentQues?.Id,
                    ) + 1}
                  </div>
                  <div className="col-span-5 whitespace-pre-line">
                    {currentQues?.questionDescription}
                  </div>

                  <hr className="col-span-5 lg:col-span-6" />
                  <div className={ratingSelection ? "col-span-3" : "col-span-2"}>
                    {ratingSelection && (
                      <span className="font-medium text-tprimary">
                        Rating
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    )}
                    {ratingSelection ? (
                      <>
                        <div className="grid grid-cols-1 gap-x-3 gap-y-1">
                          {ratingDetail?.ratingList?.map((el, ind) => {
                            return (
                              <Checkbox
                                key={ind}
                                isSelected={
                                  Number(values?.ratingValue) ===
                                  Number(el?.points)
                                }
                                onChange={() => {
                                  setFieldValue("ratingValue", el?.points);
                                  setFieldValue("ratingName", el?.name);
                                  setFieldValue(
                                    "ratingDescription",
                                    el?.description,
                                  );
                                }}
                                children={el?.name}
                              />
                            );
                          })}
                        </div>
                        {errors?.ratingValue && touched?.ratingValue && (
                          <div className="invalid-feedback">
                            {errors?.ratingValue}
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <Field
                          name="ratingValue"
                          component={Input}
                          type="number"
                          onChange={(e) => {
                            const value = Number(e?.target?.value);
                            setFieldValue("ratingValue", e?.target?.value);
                            if (ratingDetail?.ratingList?.length) {
                              const nearest = ratingDetail.ratingList.reduce(
                                (prev, curr) =>
                                  Math.abs(curr.points - value) <
                                  Math.abs(prev.points - value)
                                    ? curr
                                    : prev,
                              );
                              setFieldValue(
                                "ratingName",
                                nearest?.name || null,
                              );
                              setFieldValue(
                                "ratingDescription",
                                nearest?.description || null,
                              );
                            }
                          }}
                          label={
                            <span className="flex gap-24">
                              <span className="font-medium text-tprimary">
                                Rating
                                <span style={{ color: "red" }}>*</span>
                              </span>
                              <span className="font-medium text-black">
                                ({ratingDetail?.minPoint} -{" "}
                                {ratingDetail?.maxPoint})
                              </span>
                            </span>
                          }
                        />
                      </div>
                    )}
                  </div> 
                  {employeeDetail?.showRating && values?.selfRating && (
                    <div className="col-span-3 justify-self-end">
                      <span className="badge badge-light-info text-uppercase text-sm text-tprimary text-right">
                        {employeeDetail?.firstName} {employeeDetail?.middleName}{" "}
                        {employeeDetail?.lastName} Rating:{" "}
                        {ratingSelection
                          ? ratingDetail?.ratingList?.find(
                              (el, ind) =>
                                Number(el?.points) ==
                                Number(values?.selfRating),
                            )?.name
                          : values?.selfRating}
                      </span>
                    </div>
                  )}
                  <div className="col-span-5 lg:col-span-6">
                    <Field
                      name="comments"
                      component={TextArea}
                      type="text"
                      onChange={(e) => {
                        setFieldValue("comments", e?.target?.value);
                      }}
                      label={
                        <span>
                          Comment
                          {currentQues?.isCommentRequired && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </span>
                      }
                    />
                  </div>
                  {localUserForEdit?.length > 0 &&
                    localUserForEdit[localUserForEdit.length - 1]?.Id ===
                      currentQues?.Id && (
                      <>
                        <div className="col-span-5 lg:col-span-6">
                          <hr />
                          <span className="font-medium text-tprimary">
                            Feedback and Recommendation
                          </span>
                        </div>
                        <div className="col-span-5 lg:col-span-6">
                          <Field
                            name="feedback"
                            component={TextArea}
                            type="text"
                            onChange={(e) => {
                              setFieldValue("feedback", e?.target?.value);
                            }}
                            label={
                              <span>
                                Feedback
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          />
                        </div>
                        <div className="col-span-5 lg:col-span-6">
                          <Field
                            name="recommendation"
                            component={TextArea}
                            type="text"
                            onChange={(e) => {
                              setFieldValue("recommendation", e?.target?.value);
                            }}
                            label={
                              <span>
                                Appraisal Recommendation
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                          />
                        </div>
                      </>
                    )}
                </div>
              </fieldset>
            </Form>
            {isHREvaluation && (
              <div className="py-2 border rounded-md ">
                <div className="flex items-center mb-0">
                  <button
                    type="button"
                    onClick={() => setAttSum(!attSum)}
                    className="btn btn-primary btn-elevate"
                  >
                    View Attendance Summary
                  </button>
                </div>
                {attSum && (
                  <div className="w-full overflow-x-auto">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <thead>
                          <tr className="custom-table-header">
                            <th scope="col">Working Days</th>
                            <th scope="col">Present Days</th>
                            <th scope="col">On Time</th>
                            <th scope="col">Late In</th>
                            <th scope="col">Early Out</th>
                            <th scope="col">Half Days</th>
                            <th scope="col">Leaves</th>
                            <th scope="col">Absent</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail
                                ?.workingDays ?? "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail
                                ?.presentDays ?? "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail?.onTime ??
                                "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail?.lateIn ??
                                "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail
                                ?.earlyGoing ?? "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail?.halfDay ??
                                "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail?.onLeave ??
                                "-"}
                            </td>
                            <td>
                              {appraisalEmpDetail?.attendanceDetail
                                ?.absentDay ?? "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="flex justify-between items-center">
            {/* Center section for question navigation buttons */}
            <div className="flex justify-center items-center flex-1">
              {!isUserForRead && (
                <>
                  {localUserForEdit?.length > 0 &&
                    localUserForEdit[0]?.Id !== currentQues?.Id && (
                      <button
                        type="button"
                        onClick={() => prevClick(values)}
                        className="btn btn-primary btn-elevate mx-2"
                        disabled={loading}
                      >
                        Previous Question
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    )}
                  {localUserForEdit?.length > 1 &&
                    localUserForEdit[localUserForEdit.length - 1]?.Id !==
                      currentQues?.Id && (
                      <button
                        type="button"
                        onClick={() =>
                          nextClick(values, validateForm, setTouched)
                        }
                        className="btn btn-primary btn-elevate mx-2"
                        disabled={loading}
                      >
                        Next Question
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    )}
                  {localUserForEdit?.length > 0 &&
                    localUserForEdit[localUserForEdit.length - 1]?.Id ===
                      currentQues?.Id && (
                      <button
                        type="button"
                        onClick={() =>
                          finalSubmissionClick(values, validateForm, setTouched)
                        }
                        className="btn btn-primary btn-elevate mx-2"
                        disabled={loading}
                      >
                        Submit Feedback
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    )}
                </>
              )}
              {isUserForRead && (
                <>
                  {localUserForEdit?.length > 0 &&
                    localUserForEdit[0]?.Id !== currentQues?.Id && (
                      <button
                        type="button"
                        onClick={() => prevClick(values)}
                        className="btn btn-primary btn-elevate mx-2"
                      >
                        Previous Question
                      </button>
                    )}
                  {localUserForEdit?.length > 0 &&
                  localUserForEdit[localUserForEdit.length - 1]?.Id ===
                    currentQues?.Id ? (
                    <button
                      type="button"
                      onClick={onHide}
                      className="btn btn-primary btn-elevate mx-2"
                    >
                      OK
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigateToNextQuestion(values)}
                      className="btn btn-primary btn-elevate mx-2"
                    >
                      Next Question
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Right side for Cancel button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate ml-4"
              >
                Close
              </button>
            </div>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
