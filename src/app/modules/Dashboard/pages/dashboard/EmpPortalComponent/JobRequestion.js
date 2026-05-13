import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const JobRequestion = () => {
  const {
    requisition_job_vacancy,
    interview_recommendations,
    // requisition_job_approval,
  } = useSelector(
    (state) => ({
      // requisition_job_approval: state?.auth?.userAccess?.Recruitment,
      interview_recommendations:
        state?.auth?.userAccess?.["Interview Recommendations"],
      requisition_job_vacancy:
        state?.auth?.userAccess?.["Job Requisition Vacancy"],
    }),
    shallowEqual,
  );

  // const approvalForm = requisition_job_approval?.find(
  //   (el) =>
  //     el?.componentName == "ReadAllJobRequestionApproval" &&
  //     el?.isResourceShow &&
  //     el?.portalType == 2,
  // );

  const requestForm = requisition_job_vacancy?.find(
    (el) =>
      el?.componentName === "ReadAllRequisitionJobVacancy" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const interviewForm = interview_recommendations?.find(
    (el) =>
      el?.componentName === "ReadAllInterviewRecommendations" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">
          Job Requisition Form
        </h6>

        {requestForm ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a
                href={
                  "/requisition_job_vacancy/read-all-requisition-job-vacancy"
                }
              >
                Request Job Vacancy{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0"> Request Job Vacancy</p>
        )}
        {interviewForm ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a
                href={
                  "/interview_recommendations/read-all-interview-recommendations"
                }
              >
                Interview Recommendations{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0"> Interview Recommendations</p>
        )}
        {/* {approvalForm ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a
                href={
                  "/job_requestion_approval/read-all-job-requestion-approval"
                }
              >
                Job Requestion Approval{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Job Requestion Approval</p>
        )} */}
      </div>
    </>
  );
};
