import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../FormUIContext";
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import * as actions from "../../../_redux/redux-Actions";
import { Banknote, Calendar, MapPin, ArrowRight, MoveRight } from "lucide-react";

export function DashboardSummaryHeader() {
    const [selectedJobIndex, setSelectedJobIndex] = useState(null);

    //Users UI Context
    const formUIContext = useFormUIContext();

    const formUIProps = useMemo(() => {
        return {
            ids: formUIContext.ids,
            setIds: formUIContext.setIds,
            queryParams: formUIContext.queryParams,
            setQueryParams: formUIContext.setQueryParams,
            openEditFormDialog: formUIContext.openEditFormDialog,
            openReadFormDialog: formUIContext.openReadFormDialog,
        };
    }, [formUIContext]);

    const { currentState, userAccess } = useSelector((state) => {
        return {
            currentState: state.recruitment_dashboard,
            userAccess: state?.auth?.userAccess["recruitment_dashboard"],
        };
    }, shallowEqual);

    const { totalCount, entities, listLoading } = currentState;

    //totalCount = 10

    const dispatch = useDispatch();

    useEffect(() => {
        formUIProps.setIds([]);

        dispatch(actions.fetchRecruitmentDashboard(formUIProps.queryParams));
    }, []);

    // const jobListings = [
    //     {
    //         jobTitle: "0000 - Technical Product Manager",
    //         postedDate: "4-June-2025",
    //         expiryDate: "26-June-2025",
    //         location: "Karachi, PK",
    //         salaryRange: "PKR 300K - 400K",
    //         entities: [
    //             {
    //                 phaseTitle: "Phase 1",
    //                 total: 340,
    //                 color: "bg-primary",
    //                 dropdownTitle: "Application",
    //                 steps: [
    //                     { title: "Applied", count: "120" },
    //                     { title: "Review", count: "80" },
    //                     { title: "Rejected", count: "100" },
    //                     { title: "No Show", count: "40" },
    //                 ],
    //             },
    //             {
    //                 phaseTitle: "Phase 2",
    //                 total: 200,
    //                 color: "bg-warning",
    //                 dropdownTitle: "Evaluation",
    //                 steps: [
    //                     { title: "Shortlisted", count: "60" },
    //                     { title: "Scheduled", count: "70" },
    //                     { title: "Recommended", count: "30" },
    //                     { title: "Test", count: "20" },
    //                     { title: "Rejected", count: "20" },
    //                 ],
    //             },
    //             {
    //                 phaseTitle: "Phase 3",
    //                 total: 100,
    //                 color: "bg-purple",
    //                 dropdownTitle: "Decision",
    //                 steps: [
    //                     { title: "Hiring", count: "30" },
    //                     { title: "Offer Issued", count: "30" },
    //                     { title: "Accepted", count: "20" },
    //                     { title: "Rejected", count: "10" },
    //                     { title: "Final Rejection", count: "10" },
    //                 ],
    //             },
    //             {
    //                 phaseTitle: "Phase 4",
    //                 total: 40,
    //                 color: "bg-success",
    //                 dropdownTitle: "Completion",
    //                 steps: [
    //                     { title: "Hired", count: "40" },
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         jobTitle: "0001 - UI/UX Designer",
    //         postedDate: "5-June-2025",
    //         expiryDate: "30-June-2025",
    //         location: "Lahore, PK",
    //         salaryRange: "PKR 200K - 300K",
    //         entities: [
    //             {
    //                 phaseTitle: "Phase 1",
    //                 total: 200,
    //                 color: "bg-primary",
    //                 dropdownTitle: "Application",
    //                 steps: [
    //                     { title: "Applied", count: "100" },
    //                     { title: "Review", count: "50" },
    //                     { title: "Rejected", count: "30" },
    //                     { title: "No Show", count: "20" },
    //                 ],
    //             },
    //             // Additional phases for this job...
    //         ],
    //     },
    //     // Add more jobs similarly
    // ];

    return (
        // <>
        //     {entities && entities.map((job, jobIndex) => (
        //         <div key={jobIndex}
        //             className={`mb-10  p-5 border-bottom border-light ${selectedJobIndex === jobIndex ? 'bg-white' : ''}`}
        //             onClick={() => setSelectedJobIndex(jobIndex)}
        //             style={{ cursor: "pointer", transition: "background-color 0.3s ease" }}>
        //             {/* Job Heading */}
        //             <h6 className="text-primary mb-5">{job.jobTitle}</h6>

        //             {/* Job Info Row */}
        //             <div className="d-flex justify-content-between flex-wrap mb-5">
        //                 <div className="d-flex mb-2">
        //                     <span className="svg-icon svg-icon-md svg-icon-primary mr-4">
        //                         <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Calendar.svg")} />
        //                     </span>
        //                     <b >Posted: {job.postedDate}</b>
        //                 </div>

        //                 <div className="d-flex mb-2">
        //                     <span className="svg-icon svg-icon-md svg-icon-primary mr-4">
        //                         <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Calendar.svg")} />
        //                     </span>
        //                     <b >Expiry: {job.expiryDate}</b>
        //                 </div>

        //                 <div className="d-flex mb-2" style={{ width: '30%' }}>
        //                     <span className="svg-icon svg-icon-md svg-icon-primary mr-3">
        //                         <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Map.svg")} />
        //                     </span>
        //                     <b className="ml-3 text-truncate"  title={job.cityNames?.map(city => city.name).join(', ')}>
        //                         {Array.isArray(job.cityNames)
        //                             ? job.cityNames.map(city => city.name).join(', ')
        //                             : 'N/A'}
        //                     </b>
        //                 </div>

        //                 <div className="d-flex mb-2">
        //                     <span className="svg-icon svg-icon-md svg-icon-primary mr-5">
        //                         <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Salary.svg")} />
        //                     </span>
        //                     <b className="ml-3" >{job.salaryRange}</b>
        //                 </div>
        //             </div>

        //             {/* Phases for the Job */}
        //             <div className="d-flex justify-content-between mt-5">
        //                 {job.entities.map((phase, index) => (
        //                     <div key={index} className={`d-flex justify-content-between mt-5 col-3  ${index !== 0 ? '' : ''}`}>
        //                         <div className={`${phase.color} rounded-circle d-flex justify-content-center align-items-center text-white`} style={{ width: '65px', height: '50px' }}>
        //                             {phase.total}
        //                         </div>

        //                         <div className="d-flex flex-column w-100 ml-3">
        //                             <div className="mb-0"><strong>{phase.phaseTitle}</strong></div>
        //                             <div style={{ width: '100%', height: '2px', backgroundColor: '#d4d5d6' }}></div>

        //                             <div className="mt-5">
        //                                 <Accordion>
        //                                     <Card>
        //                                         <Accordion.Toggle
        //                                             variant="link"
        //                                             eventKey="0"
        //                                             className={`text-primary font-weight-bold text-decoration-none d-flex justify-content-between align-items-center border-0  ${selectedJobIndex === jobIndex ? 'bg-white' : 'body-color'}`}
        //                                         >
        //                                             <span className={`${phase.textColor} `} style={{ fontSize: "1.3rem", fontWeight: "700" }} >
        //                                                 {phase.dropdownTitle}
        //                                             </span>
        //                                             <span><KeyboardArrowDown className={`${phase.textColor} `} style={{ fontSize: "25px" }} /></span>
        //                                         </Accordion.Toggle>

        //                                         <Accordion.Collapse eventKey="0">
        //                                             <div className={`${selectedJobIndex === jobIndex ? 'bg-white' : 'body-color'} `} style={{ width: "100%", overflow: "auto", fontSize: "13px", fontWeight: "bold" }}>
        //                                                 {phase.steps.map((step, idx) => (
        //                                                     <div key={idx}
        //                                                         //  className="d-flex justify-content-between pointer"  onClick={() => formUIProps.openReadFormDialog(step.interviewStatusId)}>
        //                                                         className={`d-flex justify-content-between }`}
        //                                                         onClick={step.count > 0 ? () => formUIProps.openReadFormDialog(job.id,step.interviewStatusId) : undefined}>
        //                                                         <span>{step.title}</span>
        //                                                         <span className={`${phase.textColor}`}>{step.count}</span>

        //                                                     </div>
        //                                                 ))}
        //                                             </div>
        //                                         </Accordion.Collapse>
        //                                     </Card>
        //                                 </Accordion>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>

        //         </div>

        //     ))}
        // </>

        <>
            {entities &&
                entities.map((job, jobIndex) => (
                    <div
                        key={jobIndex}
                        className={` border-gray-200   ${selectedJobIndex === jobIndex ? "bg-white" : ""
                            }`}
                        onClick={() => setSelectedJobIndex(jobIndex)}
                        style={{
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                    >
                        {/* Job Heading */}

                        <div className=" flex gap-x-1 gap-y-1 ">
                            <div className="">
                                <h6 className="font-bold mb-0 text-primary my-2 ">
                                    {job.jobTitle}
                                </h6>
                            </div>

                            {/* <div className="flex gap-x-1 items-center  ">

                   
                                <label className="text-gray-500">Posted:</label>
                                <label className="text-gray-500">{job.postedDate} | </label>

                            </div> */}

                            <div className="flex gap-x-1 items-center">
                                {job.postedDate && (
                                    <>
                                        <label className="text-gray-500">Posted:</label>
                                        <label className="text-gray-500">{job.postedDate} | </label>
                                    </>
                                )}
                            </div>



                            {/* <div className="flex gap-x-1 items-center">

                                <label
                                    className={`${new Date(job.expiryDate) < new Date() ? "text-red-600 font-bold" : "text-gray-500"
                                        }`}
                                >
                                    Expiry:
                                </label>
                              
                                <label
                                    className={`${new Date(job.expiryDate) < new Date() ? "text-red-600 font-bold" : "text-gray-500"
                                        }`}
                                >
                                    {job.expiryDate} |
                                </label>

                            </div> */}

                            <div className="flex gap-x-1 items-center">
                                {job.expiryDate && (
                                    <>
                                        <label
                                            className={`${new Date(job.expiryDate) < new Date() ? "text-red-600 font-bold" : "text-gray-500"}`}
                                        >
                                            Expiry:
                                        </label>
                                        <label
                                            className={`${new Date(job.expiryDate) < new Date() ? "text-red-600 font-bold" : "text-gray-500"}`}
                                        >
                                            {job.expiryDate} |
                                        </label>
                                    </>
                                )}
                            </div>



                            <div className="flex gap-x-1 items-center ">

                                {/* <div><Banknote className="w-4 h-4 " /></div> */}

                                <label className="text-gray-500">Salary:</label>
                                <label className="text-gray-500">{job.salaryRange} | </label>

                            </div>
                            <div className="flex gap-x-1 items-center ">

                                {/* <div><Banknote className="w-4 h-4 " /></div> */}

                                <label className="text-gray-500"> No.of Positions:</label>
                                <label className="text-gray-500">{job.noOfPosition} | </label>

                            </div>


                            <div className="flex gap-x-1 items-center">

                                {/* <div><MapPin className="w-4 h-4" /></div> */}
                                <label className="text-gray-500">City:</label>
                                <label className=" truncate text-gray-500"
                                    title={job.cityNames?.map((city) => city.name).join(", ")}
                                >
                                    {Array.isArray(job.cityNames)
                                        ? job.cityNames.map((city) => city.name).join(", ")
                                        : "N/A"}
                                </label>


                            </div>









                        </div>


                        {/* Summary */}

                             <div className=" flex gap-x-1 gap-y-1 ">
                       
                        <div className="flex gap-x-1 items-center ">
                            {job.totalApplications != null && (  // <- checks for null or undefined only
                                <>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">Total Applications:</label>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">{job.totalApplications} | </label>
                                </>
                            )}
                        </div>

                        <div className="flex gap-x-1 items-center ">
                            {job.activeApplicants != null && (
                                <>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">Active Applicants:</label>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">{job.activeApplicants} | </label>
                                </>
                            )}
                        </div>

                        <div className="flex gap-x-1 items-center ">
                            {job.rejectedApplicants != null && (
                                <>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">Rejected Applicants:</label>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">{job.rejectedApplicants} | </label>
                                </>
                            )}
                        </div>

                        <div className="flex gap-x-1 items-center ">
                            {job.applicantHired != null && (
                                <>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">Applicant Hired:</label>
                                    <label className="text-gray-500 font-bold mb-0 text-primary my-2">{job.applicantHired} </label>
                                </>
                            )}
                        </div>

  </div>
                        {/* Job Info Row */}


                        {/* Phases for the Job */}
                        <div className="flex flex-wrap gap-y-6 mt-1">
                            {job.entities.map((phase, index) => (
                                <div key={index} className="flex w-full sm:w-1/2 lg:w-1/4">
                                    <div
                                        className={`${phase.color} rounded-full flex justify-center items-center text-white w-10 h-9`}

                                    >
                                        {phase.total}
                                    </div>

                                    <div className="flex flex-col w-full ml-3">
                                        <div className="mb-0">


                                            <h6 className="font-semibold mb-0 text-black my-2 text-sm">
                                                {phase.phaseTitle}
                                            </h6>
                                        </div>




                                        <div className="mt-1">
                                            <Accordion>
                                                <Card>
                                                    <Accordion.Toggle
                                                        variant="link"
                                                        eventKey="0"
                                                        className={`text-primary font-bold no-underline flex justify-between items-center border-0 ${selectedJobIndex === jobIndex
                                                            ? "bg-white"
                                                            : "body-color"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`${phase.textColor}`}

                                                        >


                                                            <h6 className={`font-semibold mb-0 text-${phase.textColor} my-2 text-sm pl-2`}>
                                                                {phase.dropdownTitle}
                                                            </h6>
                                                        </span>
                                                        <span>
                                                            <KeyboardArrowDown
                                                                className={`${phase.textColor}`}

                                                            />
                                                        </span>
                                                    </Accordion.Toggle>

                                                    <Accordion.Collapse eventKey="0">
                                                        <div
                                                            className={`${selectedJobIndex === jobIndex
                                                                ? "bg-white"
                                                                : "body-color"
                                                                } w-full overflow-auto text-[13px]`}

                                                        >
                                                            {phase.steps.map((step, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex justify-between cursor-pointer"
                                                                    onClick={
                                                                        step.count > 0
                                                                            ? () =>
                                                                                formUIProps.openReadFormDialog(
                                                                                    job.id,
                                                                                    step.interviewStatusId
                                                                                )
                                                                            : undefined
                                                                    }
                                                                >
                                                                    <label className="pl-2">{step.title}</label>

                                                                    <h6 className={`font-bold mb-0 ${phase.textColor} pr-2`}>
                                                                        {step.count}
                                                                    </h6>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>
                                        </div>

                                    </div>

                                </div>
                            ))}
                        </div>
                        <hr></hr>
                    </div>
                ))}
        </>
    );
}
