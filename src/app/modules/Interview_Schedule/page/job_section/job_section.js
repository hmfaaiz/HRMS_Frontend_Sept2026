import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllPostedJobVacancy } from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { format } from "date-fns";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Eye, XCircle } from "lucide-react";

export default function JobSection() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      selectedJob: FormUIContext?.selectedJob,
      setSelectedJob: FormUIContext?.setSelectedJob,
      setSelectedApplicant: FormUIContext?.setSelectedApplicant,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    };
  });

  const { jobData, jobList } = useSelector((state) => {
    return {
      jobData: state?.interview_schedule?.jobData,
      jobList: state?.interview_schedule?.jobList,
    };
  }, shallowEqual);


  useEffect(() => {
    dispatch(actions.fetchJobVacancyList());
  }, []);

  useEffect(() => {
    if (formUIProps?.selectedJob) {
      dispatch(actions.fetchJobVacancy(formUIProps?.selectedJob));
      dispatch(actions.fetchApplicants(formUIProps?.selectedJob));
    }
  }, [formUIProps?.selectedJob]);

  return (
    <>
      {/* job selection area  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 col-span-12">

        {/* Employee Id Dropdown Starts */}
        <div className="ml-3">

          <SearchSelect
            name="selectedJob"
            options={jobList}
            label="Job Code/Job Title"
            onChange={(e) => {
              formUIProps.setSelectedApplicant(null);
              formUIProps.setSelectedJob(e?.value);
            }}
            value={
              jobList?.find((el) => el?.value === formUIProps.selectedJob) || ""
            }
            isClearable={false}
          />
        </div>
        {/* <div className="col-12 col-md-4 d-flex  align-items-center pt-7">
          <span
            className="svg-icon svg-icon-md svg-icon-primary"
            onClick={() => formUIProps.setPanelMode(!formUIProps.panelMode)}
          >
            <SVG
              src={toAbsoluteUrl(
                formUIProps.panelMode
                  ? "/media/svg/icons/Communication/CancelButton.svg"
                  : "/media/svg/icons/Communication/AddButton.svg"
              )}
            />
          </span>


        </div> */}
     
      <div className="mt-6">



                    {formUIProps.panelMode ? (
                      <button
                        type="button"
                        className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                        onClick={() => formUIProps.setPanelMode(!formUIProps.panelMode)}
                      >
                        <XCircle className="w-3 h-3 text-black" />
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => formUIProps.setPanelMode(!formUIProps.panelMode)}
                      >


                        <Eye className="w-4 h-4 text-white" />
                        View Details
                      </button>
                    )}




                  </div>
     
     
      </div>
      <br />
      {/* job detail collapsable panel  */}
      {formUIProps.panelMode && (
        <div className="px-2">



          {jobData && Object?.keys(jobData)?.length > 0 ? (
            <>
              <div className="grid lg:grid-cols-4 gap-x-3 gap-y-1 bg-tsecondary px-4 py-3 ">

                <div >

                  <h6 className="font-bold mb-0 text-primary my-2">
                    Job Detail
                  </h6>
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
                    <React.Fragment>
                      <div className="font-medium">Designation:  </div>
                      <div > {jobData?.Designation?.formName || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Job Title:  </div>
                      <div >  {jobData?.jobTitle || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Subsidiary:  </div>
                      <div >  {jobData?.Subsidiary?.name || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Department: </div>
                      <div > {jobData?.Department?.deptName || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Country:  </div>
                      <div >  {jobData?.Country?.name || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">City: </div>
                      <div >  {jobData?.cities?.map((e) => e?.name).join(" , ") ||
                        "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Locations: </div>
                      <div >  {jobData?.locations
                        ?.map((e) => e?.formName)
                        .join(" , ") || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Job Posting Date : </div>
                      <div >  {jobData?.jobPostingDateFrom
                        ? format(
                          new Date(jobData?.jobPostingDateFrom),
                          "dd-MMM-yyyy"
                        )
                        : "N/A"}{" "}
                        to{" "}
                        {jobData?.jobPostingDateTo
                          ? format(
                            new Date(jobData?.jobPostingDateTo),
                            "dd-MMM-yyyy"
                          )
                          : "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Employee Type: </div>
                      <div >  {jobData?.EmployeeType?.formName || "N/A"} </div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Employee Status: </div>
                      <div > {jobData?.EmployeeStatus?.formName || "N/A"} </div>
                    </React.Fragment>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center m-2">Please Select Job</p> // Improved message for clarity
          )}


        </div>

      )}
    </>
  );
}
