import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const JobRequestion = () => {
  const { requisition_job_vacancy, interview_recommendations } = useSelector(
    (state) => ({
      requisition_job_vacancy: state?.auth?.userAccess.requisition_job_vacancy,
      interview_recommendations: state?.auth?.userAccess.interview_recommendations
    }),
    shallowEqual
  );

  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">
          Job Requisition Form
        </h6>

        {requisition_job_vacancy?.length > 0 ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a
                href={"/requisition_job_vacancy/read-all-requisition-job-vacancy"}
              >
                Request Job Vacancy{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">No Request for Job Vacancy Found</p>
        )}
        {interview_recommendations?.length > 0 ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a
                href={"/interview_recommendations/read-all-interview-recommendations"}
              >
                Interview Recommendations{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">No Request for Job Vacancy Found</p>
        )}
      </div>
    </>
  );
};
