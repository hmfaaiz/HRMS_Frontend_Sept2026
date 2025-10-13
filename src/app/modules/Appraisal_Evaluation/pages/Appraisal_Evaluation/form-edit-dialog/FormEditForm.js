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

const getFormSchema = ({ isComment, ratingSelection, min, max }) =>
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
  const { actionsLoading, userForEdit } = useSelector((state) => {
    return {
      actionsLoading: state.appraisal_evaluation?.actionsLoading,
      userForEdit: state.appraisal_evaluation?.userForEdit,
    };
  });

  const [currentQues, setCurrentQues] = useState(null);
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
    return getFormSchema({
      isComment: currentQues?.isCommentRequired,
      ratingSelection,
      min: ratingDetail?.minPoint,
      max: ratingDetail?.maxPoint,
    });
  }, [ratingSelection, ratingDetail, currentQues]);

  const prevClick = (val) => {
    let index = localUserForEdit.findIndex((el) => el?.Id === val?.Id);
    if (index !== -1 && index !== 0) {
      setCurrentQues(localUserForEdit[index - 1]);
    }
  };

  const navigateToNextQuestion = (currentValues) => {
    let currentIndex = localUserForEdit.findIndex(
      (el) => el?.Id === currentValues?.Id
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
        }, {})
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
          actions.updateAppraisalEvaluation({ values, isLast: false })
        );

        // Update local state
        const updatedLocalUserForEdit = localUserForEdit.map((question) =>
          question.Id === values.Id ? { ...question, ...values } : question
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
        }, {})
      );
      return;
    }

    enableLoading();
    try {
      await dispatch(
        actions.updateAppraisalEvaluation({ values, isLast: true })
      );

      // Update local state
      const updatedLocalUserForEdit = localUserForEdit.map((question) =>
        question.Id === values.Id
          ? { ...question, ...values, isSubmitted: true }
          : question
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
      }}
      validationSchema={formSchema}
    >
      {({ setFieldValue, validateForm, setTouched, errors, values }) => (
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
                  <div className="font-medium">Competency</div>
                  <div className="col-span-5">
                    {currentQues?.CompetencyName}
                  </div>
                  <div className="font-medium">{currentQues?.type}</div>
                  <div className="col-span-5">{currentQues?.questionName}</div>
                  <div className="font-medium">Question</div>
                  <div className="col-span-5">
                    {currentQues?.questionDescription}
                  </div>
                  <hr className="col-span-5 lg:col-span-6" />
                  {ratingSelection && (
                    <span>
                      Rating
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  )}
                  {ratingSelection ? (
                    <>
                      <div className="grid grid-cols-4 gap-x-3 gap-y-1 col-span-5 lg:col-span-6">
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
                                  el?.description
                                );
                              }}
                              children={el?.name}
                            />
                          );
                        })}
                      </div>
                      {errors?.ratingValue && (
                        <div className="invalid-feedback">
                          {errors?.ratingValue}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="col-span-2">
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
                                  : prev
                            );
                            setFieldValue("ratingName", nearest?.name || null);
                            setFieldValue(
                              "ratingDescription",
                              nearest?.description || null
                            );
                          }
                        }}
                        label={
                          <span>
                            Rating
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
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
                </div>
              </fieldset>
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
              <>
                {/* Prev button (if not first question) */}
                {localUserForEdit?.length > 0 &&
                  localUserForEdit[0]?.Id !== currentQues?.Id && (
                    <button
                      type="button"
                      onClick={() => prevClick(values)}
                      className="btn btn-primary btn-elevate"
                    >
                      Prev
                    </button>
                  )}

                {/* Next or OK button */}
                {localUserForEdit?.length > 0 &&
                localUserForEdit[localUserForEdit.length - 1]?.Id ===
                  currentQues?.Id ? (
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-primary btn-elevate"
                  >
                    OK
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigateToNextQuestion(values)}
                    className="btn btn-primary btn-elevate"
                  >
                    Next
                  </button>
                )}
              </>
              // <button
              //   type="button"
              //   onClick={onHide}
              //   className="btn btn-primary btn-elevate"
              // >
              //   OK
              // </button>
            )}

            {!isUserForRead && (
              <>
                {localUserForEdit?.length > 0 &&
                  localUserForEdit[0]?.Id !== currentQues?.Id && (
                    <button
                      type="button"
                      onClick={() => {
                        prevClick(values);
                      }}
                      className="btn btn-primary btn-elevate"
                      disabled={loading}
                    >
                      Prev
                      {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>
                  )}
                {localUserForEdit?.length > 1 &&
                  localUserForEdit[localUserForEdit?.length - 1]?.Id !==
                    currentQues?.Id && (
                    <button
                      type="button"
                      onClick={() => {
                        nextClick(values, validateForm, setTouched);
                      }}
                      className="btn btn-primary btn-elevate"
                      disabled={loading}
                    >
                      Next
                      {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>
                  )}
                {localUserForEdit?.length > 0 &&
                  localUserForEdit[localUserForEdit?.length - 1]?.Id ===
                    currentQues?.Id && (
                    <button
                      type="button"
                      onClick={() => {
                        finalSubmissionClick(values, validateForm, setTouched);
                      }}
                      className="btn btn-primary btn-elevate"
                      disabled={loading}
                    >
                      Submit Appraisal
                      {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )}
                    </button>
                  )}
              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
