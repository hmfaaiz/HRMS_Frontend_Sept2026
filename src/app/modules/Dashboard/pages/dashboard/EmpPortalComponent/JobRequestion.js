import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const JobRequestion = () => {
  const { requisition_job_vacancy } = useSelector(
    (state) => ({
      requisition_job_vacancy: state?.auth?.userAccess.requisition_job_vacancy,
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
              <Link
                to={"/requisition_job_vacancy/read-all-requisition-job-vacancy"}
              >
                Request Job Vacancy{" "}
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">No Request for Job Vacancy Found</p>
        )}
      </div>
    </>
  );
};
