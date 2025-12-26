import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllEarningList,
  fetchAllDeductionList,
} from "../../../../../../_metronic/redux/dashboardActions";

import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { CirclePlus, Eye, Trash2, XCircle } from "lucide-react";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import * as actions from "../../../_redux/formActions";
import { useFromUIContext } from "../FormUIContext";
import { TextArea } from "../../../../../../_metronic/_partials/controls";

const formValidation = (minPoint, maxPoint) =>
  Yup.object().shape({
    employeeId: Yup.string().required(VALIDATION_MESSAGES.required),

    hrSetup: Yup.array().of(
      Yup.object().shape({
        finalizedRating: Yup.number()
          .required(VALIDATION_MESSAGES.required)
          .min(minPoint, `Rating cannot be less than ${minPoint}`)
          .max(maxPoint, `Rating cannot exceed ${maxPoint}`),
        // finalizedComments: Yup.string().required(VALIDATION_MESSAGES.required),
        finalizedComments: Yup.string().optional(),
      })
    ),

    goalSetup: Yup.array().of(
      Yup.object().shape({
        finalizedRating: Yup.number()
          .required(VALIDATION_MESSAGES.required)
          .min(minPoint, `Rating cannot be less than ${minPoint}`)
          .max(maxPoint, `Rating cannot exceed ${maxPoint}`),
        // finalizedComments: Yup.string().required(VALIDATION_MESSAGES.required),
        finalizedComments: Yup.string().optional(),
      })
    ),

    generalSetup: Yup.array().of(
      Yup.object().shape({
        finalizedRating: Yup.number()
          .required(VALIDATION_MESSAGES.required)
          .min(minPoint, `Rating cannot be less than ${minPoint}`)
          .max(maxPoint, `Rating cannot exceed ${maxPoint}`),
        // finalizedComments: Yup.string().required(VALIDATION_MESSAGES.required),
        finalizedComments: Yup.string().optional(),
      })
    ),
    incrementPercentageRecommendedByManager: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(0, `Rating cannot be less than 0`)
      .max(100, `Rating cannot exceed 100`),
    managerRecomendationAfterFinalization: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    additionalRemarks: Yup.string()
      .nullable()
      .optional(),
  });

function calculateWeightedScore(setupArray = [], weight = 0) {
  if (!setupArray.length) {
    return { avg: 0, weighted: 0 };
  }

  const totalRating = setupArray.reduce(
    (sum, item) => sum + Number(item.finalizedRating || 0),
    0
  );

  const avg = totalRating / setupArray.length;
  const weighted = (avg * weight) / 100;
  return { avg: avg.toFixed(2), weighted: weighted.toFixed(2) };
}

function truncateText(text = "", maxLength = 90) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export function MasterEditForm({
  saveFrom,
  user,
  isUserForRead,
  loading,
  id,
  onHide,
}) {
  const formUIContext = useFromUIContext();

  const formUIProps = useMemo(() => {
    return {
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
      employeeId: formUIContext.employeeId,
      setEmployeeId: formUIContext.setEmployeeId,
      subsidiaryId: formUIContext.subsidiaryId,
      appraisalCategoryId: formUIContext.appraisalCategoryId,
    };
  }, [formUIContext]);

  const { actionsLoading, employee, dashboard } = useSelector((state) => {
    return {
      actionsLoading: state.appraisal_review.actionsLoading,
      employee: state.appraisal_review?.employee,
      dashboard: state.dashboard,
    };
  });
  const dispatch = useDispatch();

  function getIncrementByPoint(ratingList = [], finalPoint = 0) {
    if (!ratingList.length || !finalPoint) return null;

    const point = Math.floor(Number(finalPoint));

    return ratingList.find((item) => Number(item.points) === point);
  }

  const handleSubmitWithFinalize = (isFinalize, handleSubmit, values) => {
    // handleSubmit(); // trigger Formik validation
    const valuesWithFlag = { ...values, isFinalize };
    saveFrom(valuesWithFlag);
  };

  useEffect(() => {
    if (user?.employeeId) {
      formUIProps.setEmployeeId(user.employeeId);
    }
  }, [user?.employeeId]);

  useEffect(() => {
    if (user?.Id) {
      dispatch(fetchAllActiveEmployees());
    }
  }, [dispatch, user?.Id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...user,
        }}
        validationSchema={formValidation(
          user?.minPoint || 0,
          user?.maxPoint || 1
        )}
      >
        {({ handleSubmit, values, setFieldValue, isValid }) => {
          return (
            <>
              <ScoreCalculator values={values} setFieldValue={setFieldValue} />
              <Modal.Body className="overlay overlay-block cursor-default">
                {actionsLoading && (
                  <div className="overlay-layer bg-transparent">
                    <div className="spinner spinner-lg spinner-success" />
                  </div>
                )}
                <Form className="form form-label-right">
                  <fieldset disabled={values.isFinalize}>
                    {/* Employee Selection */}
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">
                      <div className="flex item-end gap-1 justify-end">
                        <div className="w-full">
                          <SearchSelect
                            name="employeeId"
                            label={
                              <span>
                                Employee<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            isDisabled={id}
                            onChange={(e) => {
                              setFieldValue("employeeId", e?.value);
                              formUIProps.setEmployeeId(e?.value);
                              dispatch(
                                actions.fetchAppraisalReview({
                                  Id: e.value,
                                  isEmployeeId: true,
                                  appraisalCategoryId:
                                    formUIProps?.appraisalCategoryId,
                                  subsidiaryId: formUIProps.subsidiaryId,
                                })
                              );
                            }}
                            value={
                              (id ? dashboard.allEmployees : employee)?.find(
                                (item) => item?.value == formUIProps?.employeeId
                              ) || null
                            }
                            options={id ? dashboard.allEmployees : employee}
                          />
                        </div>
                        {/* View/Cancel button */}
                        <div className="flex items-end justify-end">
                          {formUIProps?.panelMode ? (
                            <button
                              type="button"
                              className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                              onClick={() => {
                                formUIProps.setPanelMode(
                                  !formUIProps?.panelMode
                                );
                              }}
                            >
                              <XCircle className="w-3 h-3 text-black" />
                              Cancel
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary d-flex align-items-center gap-2"
                              onClick={() =>
                                formUIProps.setPanelMode(
                                  !formUIProps?.panelMode
                                )
                              }
                            >
                              <Eye className="w-4 h-4 text-white" />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <EmployeeProfile
                      employeeId={formUIProps?.employeeId}
                      panelMode={formUIProps?.panelMode}
                    />
                    {/* HR Evaluation */}
                    {values?.hrSetup?.length > 0 && (
                      <>
                        <hr />
                        <FieldArray name="hrSetup">
                          {() => {
                            return (
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-bold mb-0 text-primary">
                                    HR Evaluation
                                  </h6>
                                </div>
                                <div className="w-full overflow-x-auto">
                                  <div className="react-bootstrap-table table-responsive">
                                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                      <thead>
                                        <tr className="custom-table-header">
                                          <th className="w-1/12">Competency</th>
                                          <th className="w-3/12">
                                            Description
                                          </th>
                                          <th className="w-1/12">HR Rating</th>
                                          <th className="w-3/12">Comments</th>
                                          <th className="w-1/12">
                                            Finalize Rating
                                          </th>
                                          <th className="w-3/12">Comments</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {values.hrSetup.map((e, i) => {
                                          return (
                                            <tr key={i}>
                                              <td>{e?.CompetencyName || ""}</td>
                                              <td
                                                title={e?.questionDescription}
                                              >
                                                {truncateText(
                                                  e?.questionDescription,
                                                  140
                                                )}
                                              </td>
                                              <td>{e?.rating || 0}</td>
                                              <td title={e?.comments}>
                                                {truncateText(e?.comments, 140)}
                                              </td>
                                              <td>
                                                <Field
                                                  name={`hrSetup[${i}].finalizedRating`}
                                                >
                                                  {({ field, form }) => (
                                                    <AmountInput
                                                      field={field}
                                                      form={form}
                                                      disabled={isUserForRead}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name={`hrSetup[${i}].finalizedRating`}
                                                  component="div"
                                                  className="invalid-feedback d-block"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  name={`hrSetup[${i}].finalizedComments`}
                                                >
                                                  {({ field, form }) => (
                                                    <input
                                                      {...field}
                                                      type="text"
                                                      className={`form-control ${
                                                        form.errors.hrSetup?.[i]
                                                          ?.finalizedComments &&
                                                        form.touched.hrSetup?.[
                                                          i
                                                        ]?.finalizedComments
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      disabled={isUserForRead}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name={`hrSetup[${i}].finalizedComments`}
                                                  component="div"
                                                  className="invalid-feedback d-block"
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </FieldArray>
                      </>
                    )}
                    {/* General Evaluation */}
                    {values?.generalSetup?.length > 0 && (
                      <>
                        <hr />
                        <FieldArray name="generalSetup">
                          {() => {
                            return (
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-bold mb-0 text-primary">
                                    General Evaluation
                                  </h6>
                                </div>
                                <div className="w-full overflow-x-auto">
                                  <div className="react-bootstrap-table table-responsive">
                                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                      <thead>
                                        <tr className="custom-table-header">
                                          <th className="w-1/12">Competency</th>
                                          <th className="w-2/12">
                                            Description
                                          </th>
                                          <th className="w-1/12">
                                            Self Rating
                                          </th>
                                          <th className="w-2/12">
                                            Self Comments
                                          </th>
                                          <th className="w-1/12">
                                            Avg. Manager Rating
                                          </th>
                                          <th className="w-2/12">
                                            Manager Comments
                                          </th>
                                          <th className="w-1/12">
                                            Finalize Rating
                                          </th>
                                          <th className="w-2/12">Comments</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {values.generalSetup.map((e, i) => {
                                          return (
                                            <tr key={i}>
                                              <td>{e?.CompetencyName || ""}</td>
                                              <td
                                                title={e?.questionDescription}
                                              >
                                                {truncateText(
                                                  e?.questionDescription,
                                                  80
                                                )}
                                              </td>
                                              <td>{e?.selfRating || 0}</td>
                                              <td title={e?.selfComments}>
                                                {truncateText(
                                                  e?.selfComments,
                                                  80
                                                )}
                                              </td>
                                              <td>{e?.managerRating || 0}</td>
                                              <td title={e?.managerComments}>
                                                {truncateText(
                                                  e?.managerComments,
                                                  80
                                                )}
                                              </td>
                                              <td>
                                                <Field
                                                  name={`generalSetup[${i}].finalizedRating`}
                                                >
                                                  {({ field, form }) => (
                                                    <AmountInput
                                                      field={field}
                                                      form={form}
                                                      disabled={isUserForRead}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name={`generalSetup[${i}].finalizedRating`}
                                                  component="div"
                                                  className="invalid-feedback d-block"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  name={`generalSetup[${i}].finalizedComments`}
                                                >
                                                  {({ field, form }) => (
                                                    <input
                                                      {...field}
                                                      type="text"
                                                      className={`form-control ${
                                                        form.errors
                                                          .generalSetup?.[i]
                                                          ?.finalizedComments &&
                                                        form.touched
                                                          .generalSetup?.[i]
                                                          ?.finalizedComments
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      disabled={isUserForRead}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name={`generalSetup[${i}].finalizedComments`}
                                                  component="div"
                                                  className="invalid-feedback d-block"
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </FieldArray>
                      </>
                    )}
                    {/* Goal Assessment */}
                    {values?.goalSetup?.length > 0 && (
                      <>
                        <hr />
                        <FieldArray name="goalSetup">
                          {() => {
                            return (
                              <div className="mt-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-bold mb-0 text-primary">
                                    Goal Assessment
                                  </h6>
                                </div>
                                <div className="w-full overflow-x-auto">
                                  <div className="react-bootstrap-table table-responsive">
                                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                      <thead>
                                        <tr className="custom-table-header">
                                          <th className="w-1/12">Competency</th>
                                          <th className="w-2/12">
                                            Description
                                          </th>
                                          <th className="w-1/12">
                                            Self Rating
                                          </th>
                                          <th className="w-2/12">
                                            Self Comments
                                          </th>
                                          <th className="w-1/12">
                                            Avg. Manager Rating
                                          </th>
                                          <th className="w-2/12">
                                            Manager Comments
                                          </th>
                                          <th className="w-1/12">
                                            Finalize Rating
                                          </th>
                                          <th className="w-2/12">Comments</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {values.goalSetup.map((e, i) => {
                                          return (
                                            <tr key={i}>
                                              <td>{e?.CompetencyName || ""}</td>
                                              <td
                                                title={e?.questionDescription}
                                              >
                                                {truncateText(
                                                  e?.questionDescription,
                                                  80
                                                )}
                                              </td>
                                              <td>{e?.selfRating || 0}</td>
                                              <td title={e?.selfComments}>
                                                {truncateText(
                                                  e?.selfComments,
                                                  80
                                                )}
                                              </td>
                                              <td>{e?.managerRating || 0}</td>
                                              <td title={e?.managerComments}>
                                                {truncateText(
                                                  e?.managerComments,
                                                  80
                                                )}
                                              </td>
                                              <td>
                                                <Field
                                                  name={`goalSetup[${i}].finalizedRating`}
                                                >
                                                  {({ field, form }) => (
                                                    <AmountInput
                                                      field={field}
                                                      form={form}
                                                      disabled={isUserForRead}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name={`goalSetup[${i}].finalizedRating`}
                                                  component="div"
                                                  className="invalid-feedback d-block"
                                                />
                                              </td>
                                              <td>
                                                <Field
                                                  name={`goalSetup[${i}].finalizedComments`}
                                                >
                                                  {({ field, form }) => (
                                                    <input
                                                      {...field}
                                                      type="text"
                                                      className={`form-control ${
                                                        form.errors.goalSetup?.[
                                                          i
                                                        ]?.finalizedComments &&
                                                        form.touched
                                                          .goalSetup?.[i]
                                                          ?.finalizedComments
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      disabled={isUserForRead}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name={`goalSetup[${i}].finalizedComments`}
                                                  component="div"
                                                  className="invalid-feedback d-block"
                                                />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </FieldArray>
                      </>
                    )}

                    {/* Manager's Overall Assessment */}
                    {values?.hrWeight &&
                      values.generalWeight &&
                      values.goalWeight && (
                        <>
                          <hr />
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-3">
                              <h6 className="font-bold mb-0 text-primary">
                                Manager's Overall Assessment
                              </h6>
                            </div>
                            <div className="w-full overflow-x-auto">
                              <div className="react-bootstrap-table table-responsive">
                                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                  <thead>
                                    <tr className="custom-table-header text-center">
                                      <th className="text-left">Criteria</th>
                                      <th className="text-left">Weightage</th>
                                      <th>
                                        <div className="flex flex-col">
                                          Self Score
                                          <span className="text-sm font-normal">
                                            Rating | W.R
                                          </span>
                                        </div>
                                      </th>
                                      <th>
                                        <div className="flex flex-col">
                                          Manager Score
                                          <span className="text-sm font-normal">
                                            Rating | W.R
                                          </span>
                                        </div>
                                      </th>
                                      <th>
                                        <div className="flex flex-col">
                                          HR Score
                                          <span className="text-sm font-normal">
                                            Rating | W.R
                                          </span>
                                        </div>
                                      </th>
                                      <th>
                                        <div className="flex flex-col">
                                          Finalized Score
                                          <span className="text-sm font-normal">
                                            Rating | W.R
                                          </span>
                                        </div>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <strong style={{ fontWeight: 700 }}>
                                          HR Evaluation
                                        </strong>
                                      </td>
                                      <td>{values?.hrWeight}%</td>
                                      <td className="text-center">
                                        {values?.hrSelfRating} |{" "}
                                        {values?.hrSelfWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.hrManagerRating} |{" "}
                                        {values?.hrManagerWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.hrHRRating} |{" "}
                                        {values?.hrHRWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.hrFinalize} |{" "}
                                        {values?.hrFinalizeWeight}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong style={{ fontWeight: 700 }}>
                                          General Evaluation
                                        </strong>
                                      </td>
                                      <td>{values?.generalWeight}%</td>
                                      <td className="text-center">
                                        {values?.generalSelfRating} |{" "}
                                        {values?.generalSelfWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.generalManagerRating} |{" "}
                                        {values?.generalManagerWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.generalHRRating} |{" "}
                                        {values?.generalHRWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.generalFinalize} |{" "}
                                        {values?.generalFinalizeWeight}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <strong style={{ fontWeight: 700 }}>
                                          Goals & Objective
                                        </strong>
                                      </td>
                                      <td>{values?.goalWeight}%</td>
                                      <td className="text-center">
                                        {values?.goalSelfRating} |{" "}
                                        {values?.goalSelfWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.goalManagerRating} |{" "}
                                        {values?.goalManagerWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.goalHRRating} |{" "}
                                        {values?.goalHRWeight}
                                      </td>
                                      <td className="text-center">
                                        {values?.goalFinalize} |{" "}
                                        {values?.goalFinalizeWeight}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="text-tprimary">
                                        <strong style={{ fontWeight: 700 }}>
                                          Final Rating
                                        </strong>
                                      </td>
                                      <td></td>
                                      <td className="text-center"></td>
                                      <td className="text-center"></td>
                                      <td className="text-center"></td>
                                      <td className="text-center font-semibold text-tprimary">
                                        {Number(
                                          (Number(values?.goalFinalizeWeight) ||
                                            0) +
                                            (Number(
                                              values?.generalFinalizeWeight
                                            ) || 0) +
                                            (Number(values?.hrFinalizeWeight) ||
                                              0)
                                        ).toFixed(2)}{" "}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                    {/* {Recommendation of increment && ( */}
                    {values?.employeeId && (
                      <div>
                        <h6 className="font-bold mb-0 text-primary">
                          Increment Suggested :{" "}
                          {(values?.ratingList?.length > 0 &&
                            [...values.ratingList]
                              .sort(
                                (a, b) =>
                                  parseFloat(a.points) - parseFloat(b.points)
                              )
                              .reduce((acc, curr) => {
                                const total =
                                  (Number(values?.goalFinalizeWeight) || 0) +
                                  (Number(values?.generalFinalizeWeight) || 0) +
                                  (Number(values?.hrFinalizeWeight) || 0);

                                return total >= parseFloat(curr.points)
                                  ? curr
                                  : acc;
                              }, null)?.increment_percentage) ||
                            0}
                          %
                        </h6>
                      </div>
                    )}
                    {/* Recomentdation */}
                    {values?.selfRecommendation && (
                      <>
                        <hr />
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-bold mb-0 text-primary">
                              Recommendation
                            </h6>
                          </div>
                          <div className="w-full overflow-x-auto">
                            <div className="react-bootstrap-table table-responsive">
                              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                                <tbody>
                                  <tr>
                                    <td>
                                      <strong style={{ fontWeight: 700 }}>
                                        Self Recommendation
                                      </strong>
                                    </td>
                                    <td>{values?.selfRecommendation || ""}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong style={{ fontWeight: 700 }}>
                                        HR Recommendation
                                      </strong>
                                    </td>
                                    <td>{values?.hrRecommendation || ""}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <strong style={{ fontWeight: 700 }}>
                                        Manager Recommendation
                                      </strong>
                                    </td>
                                    <td
                                      dangerouslySetInnerHTML={{
                                        __html: values?.managerRecommendation,
                                      }}
                                    ></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {values?.employeeId && (
                      <>
                        <div className="w-2/12">
                          <Field
                            name="incrementPercentageRecommendedByManager"
                            component={AmountInput}
                            label="Increment Percentage Recommended by Manager"
                            disabled={values?.isFinalize || isUserForRead}
                          />
                        </div>
                        <div className="w-9/12">
                          <Field
                            name="managerRecomendationAfterFinalization"
                            component={TextArea}
                            label="Manager Recommendation after Finalization"
                            disabled={values?.isFinalize || isUserForRead}
                          />
                        </div>
                        <div className="w-9/12">
                          <Field
                            name="additionalRemarks"
                            component={TextArea}
                            label="Additional Remarks"
                            disabled={values?.isFinalize || isUserForRead}
                          />
                        </div>{" "}
                      </>
                    )}
                    {/* )} */}
                  </fieldset>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex gap-2">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    className="btn btn-light btn-elevate"
                    onClick={() => {
                      dispatch(actions.clearAppraisalReview(onHide));
                    }} // or your modal close function
                  >
                    Close
                  </button>
                  {/* Save Button */}
                  {!isUserForRead && !values.isFinalize && (
                    <button
                      type="button"
                      className="btn btn-primary btn-elevate"
                      onClick={() =>
                        handleSubmitWithFinalize(false, handleSubmit, values)
                      }
                      disabled={loading || !isValid || !values?.employeeId}
                    >
                      Save
                      {loading && (
                        <span className="ml-3 spinner spinner-white"></span>
                      )}
                    </button>
                  )}

                  {/* Finalize Button */}
                  {!isUserForRead && !values.isFinalize && id && (
                    <button
                      type="button"
                      className="btn btn-success btn-elevate"
                      onClick={() =>
                        handleSubmitWithFinalize(true, handleSubmit, values)
                      }
                      disabled={loading || !isValid || !values?.employeeId}
                    >
                      Finalize
                      {loading && (
                        <span className="ml-3 spinner spinner-white"></span>
                      )}
                    </button>
                  )}
                </div>
              </Modal.Footer>
            </>
          );
        }}
      </Formik>
    </>
  );
}

function useCalculateAndUpdateScores(values, setFieldValue) {
  useEffect(() => {
    // Goal
    if (values.goalSetup?.length > 0 && values.goalWeight) {
      const { avg, weighted } = calculateWeightedScore(
        values.goalSetup,
        values.goalWeight
      );
      setFieldValue("goalFinalize", avg);
      setFieldValue("goalFinalizeWeight", weighted);
    }

    // General
    if (values.generalSetup?.length > 0 && values.generalWeight) {
      const { avg, weighted } = calculateWeightedScore(
        values.generalSetup,
        values.generalWeight
      );
      setFieldValue("generalFinalize", avg);
      setFieldValue("generalFinalizeWeight", weighted);
    }

    // HR
    if (values.hrSetup?.length > 0 && values.hrWeight) {
      const { avg, weighted } = calculateWeightedScore(
        values.hrSetup,
        values.hrWeight
      );
      setFieldValue("hrFinalize", avg);
      setFieldValue("hrFinalizeWeight", weighted);
    }

    // Final Recommendation
    if (values.ratingList?.length) {
      const finalPoint =
        parseFloat(values.goalFinalizeWeight || 0) +
        parseFloat(values.generalFinalizeWeight || 0) +
        parseFloat(values.hrFinalizeWeight || 0);

      const ratingListSorted = [...values.ratingList].sort(
        (a, b) => parseFloat(a.points) - parseFloat(b.points)
      );

      const matchedRating = ratingListSorted.reduce((acc, curr) => {
        if (finalPoint >= parseFloat(curr.points)) {
          return curr; // jab tak cross karta rahe, update hota rahe
        }
        return acc;
      }, null); // initial null → agar total < first point → increment 0

      setFieldValue("recommendedPoint", finalPoint.toFixed(2));
      setFieldValue(
        "recommendedIncrement",
        matchedRating?.increment_percentage || 0
      );
    }
  }, [
    values.goalSetup,
    values.generalSetup,
    values.hrSetup,
    values.goalWeight,
    values.generalWeight,
    values.hrWeight,
    values.ratingList,
    values.selfRecommendation,
    setFieldValue,
  ]);
}

const ScoreCalculator = ({ values, setFieldValue }) => {
  useCalculateAndUpdateScores(values, setFieldValue);
  return null;
};
