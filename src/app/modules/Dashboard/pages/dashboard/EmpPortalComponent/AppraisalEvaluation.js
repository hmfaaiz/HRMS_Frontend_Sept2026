import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const AppraisalEvaluation = () => {
  const { appraisal } = useSelector(
    (state) => ({
      appraisal: state?.auth?.userAccess["appraisal_evaluation"],
    }),
    shallowEqual
  );

  const isAppraisalEvaluation = appraisal?.find(
    (el) =>
      el?.componentName === "ReadAllAppraisalEvaluation" && el?.isResourceShow
  );
  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">
          Appraisal Evaluation Form
        </h6>
        {isAppraisalEvaluation ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <Link to={"/appraisal_evaluation/read-all-appraisal-evaluation"}>
                Appraisal Evaluation{" "}
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Appraisal Evaluation</p>
        )}
      </div>
    </>
  );
};
