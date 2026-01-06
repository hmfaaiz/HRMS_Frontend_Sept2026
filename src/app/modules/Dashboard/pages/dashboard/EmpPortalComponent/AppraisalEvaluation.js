import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const AppraisalEvaluation = () => {
  const { appraisalEval, appraisalRat } = useSelector(
    (state) => ({
      appraisalEval: state?.auth?.userAccess["appraisal_evaluation"],
      appraisalRat: state?.auth?.userAccess["Appraisal"],
    }),
    shallowEqual
  );

  const isAppraisalEvaluation = appraisalEval?.find(
    (el) =>
      el?.componentName === "ReadAllAppraisalEvaluation" && el?.isResourceShow
  );

  const isAppraisalRatingFinalization = appraisalRat?.find(
    (el) =>
      el?.componentName === "AppraisalReviewFinalization" &&
      el?.isResourceShow &&
      el?.portalType === 2
  );
  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">
          Performance Evaluation Form
        </h6>
        {isAppraisalEvaluation ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a href={"/appraisal_evaluation/read-all-appraisal-evaluation"}>
                Submit Feedback{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Submit Feedback</p>
        )}
        {isAppraisalRatingFinalization ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a href={"/emp_appraisal/appraisal-review-finalization"}>
                Rating Finalization{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Rating Finalization</p>
        )}
      </div>
    </>
  );
};
