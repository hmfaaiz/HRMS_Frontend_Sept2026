import React, { useEffect, useMemo, useState } from "react"
import { useFormUIContext } from "../FormUIContext"
import SVG from "react-inlinesvg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import * as actions from "../../../_redux/redux-Actions";




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


    const { currentState, userAccess } = useSelector(
        (state) => {
            return {


                currentState: state.recruitment_dashboard,
                userAccess: state?.auth?.userAccess["recruitment_dashboard"],
            }
        },
        shallowEqual
    );


    const { totalCount, entities, listLoading } = currentState;

    //totalCount = 10

    const dispatch = useDispatch();

    useEffect(() => {
        formUIProps.setIds([]);


        dispatch(actions.fetchRecruitmentDashboard(formUIProps.queryParams));
    }, []);
    // useEffect(() => {
    //     formUIProps.setIds([]);

    //     dispatch(actions.FetchRecruitmentDashboardFetched(formUIProps.queryParams));
    // }, [formUIProps.queryParams, dispatch, totalCount]);







    const jobListings = [
        {
            jobTitle: "0000 - Technical Product Manager",
            postedDate: "4-June-2025",
            expiryDate: "26-June-2025",
            location: "Karachi, PK",
            salaryRange: "PKR 300K - 400K",
            entities: [
                {
                    phaseTitle: "Phase 1",
                    total: 340,
                    color: "bg-primary",
                    dropdownTitle: "Application",
                    steps: [
                        { title: "Applied", count: "120" },
                        { title: "Review", count: "80" },
                        { title: "Rejected", count: "100" },
                        { title: "No Show", count: "40" },
                    ],
                },
                {
                    phaseTitle: "Phase 2",
                    total: 200,
                    color: "bg-warning",
                    dropdownTitle: "Evaluation",
                    steps: [
                        { title: "Shortlisted", count: "60" },
                        { title: "Scheduled", count: "70" },
                        { title: "Recommended", count: "30" },
                        { title: "Test", count: "20" },
                        { title: "Rejected", count: "20" },
                    ],
                },
                {
                    phaseTitle: "Phase 3",
                    total: 100,
                    color: "bg-purple",
                    dropdownTitle: "Decision",
                    steps: [
                        { title: "Hiring", count: "30" },
                        { title: "Offer Issued", count: "30" },
                        { title: "Accepted", count: "20" },
                        { title: "Rejected", count: "10" },
                        { title: "Final Rejection", count: "10" },
                    ],
                },
                {
                    phaseTitle: "Phase 4",
                    total: 40,
                    color: "bg-success",
                    dropdownTitle: "Completion",
                    steps: [
                        { title: "Hired", count: "40" },
                    ],
                },
            ],
        },
        {
            jobTitle: "0001 - UI/UX Designer",
            postedDate: "5-June-2025",
            expiryDate: "30-June-2025",
            location: "Lahore, PK",
            salaryRange: "PKR 200K - 300K",
            entities: [
                {
                    phaseTitle: "Phase 1",
                    total: 200,
                    color: "bg-primary",
                    dropdownTitle: "Application",
                    steps: [
                        { title: "Applied", count: "100" },
                        { title: "Review", count: "50" },
                        { title: "Rejected", count: "30" },
                        { title: "No Show", count: "20" },
                    ],
                },
                // Additional phases for this job...
            ],
        },
        // Add more jobs similarly
    ];







    return (
        <>
            {entities && entities.map((job, jobIndex) => (
                <div key={jobIndex}
                    className={`mb-10  p-5 border-bottom border-light ${selectedJobIndex === jobIndex ? 'bg-white' : ''}`}
                    onClick={() => setSelectedJobIndex(jobIndex)}
                    style={{ cursor: "pointer", transition: "background-color 0.3s ease" }}>
                    {/* Job Heading */}
                    <h6 className="text-primary mb-5">{job.jobTitle}</h6>

                    {/* Job Info Row */}
                    <div className="d-flex justify-content-between flex-wrap mb-5">
                        <div className="d-flex mb-2">
                            <span className="svg-icon svg-icon-md svg-icon-primary mr-4">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Calendar.svg")} />
                            </span>
                            <span>Posted {job.postedDate}</span>
                        </div>

                        <div className="d-flex mb-2">
                            <span className="svg-icon svg-icon-md svg-icon-primary mr-4">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Calendar.svg")} />
                            </span>
                            <span>Expiry {job.expiryDate}</span>
                        </div>

                        <div className="d-flex mb-2" style={{ width: '30%' }}>
                            <span className="svg-icon svg-icon-md svg-icon-primary mr-3">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Map.svg")} />
                            </span>
                            <span className="ml-3 text-truncate" title={job.cityNames?.map(city => city.name).join(', ')}>
                                {Array.isArray(job.cityNames)
                                    ? job.cityNames.map(city => city.name).join(', ')
                                    : 'N/A'}
                            </span>
                        </div>

                        <div className="d-flex mb-2">
                            <span className="svg-icon svg-icon-md svg-icon-primary mr-5">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Salary.svg")} />
                            </span>
                            <span className="ml-3">{job.salaryRange}</span>
                        </div>
                    </div>


                    {/* Phases for the Job */}
                    <div className="d-flex justify-content-between mt-5">
                        {job.entities.map((phase, index) => (
                            <div key={index} className={`d-flex justify-content-between mt-5 col-3  ${index !== 0 ? '' : ''}`}>
                                <div className={`${phase.color} rounded-circle d-flex justify-content-center align-items-center text-white`} style={{ width: '65px', height: '50px' }}>
                                    {phase.total}
                                </div>

                                <div className="d-flex flex-column w-100 ml-3">
                                    <div className="mb-0"><strong>{phase.phaseTitle}</strong></div>
                                    <div style={{ width: '100%', height: '2px', backgroundColor: '#d4d5d6' }}></div>

                                    <div className="mt-5">
                                        <Accordion>
                                            <Card>
                                                <Accordion.Toggle
                                                    variant="link"
                                                    eventKey="0"
                                                    className={`text-primary font-weight-bold text-decoration-none d-flex justify-content-between align-items-center border-0  ${selectedJobIndex === jobIndex ? 'bg-white' : 'body-color'}`}
                                                >
                                                    <span className={`${phase.textColor} `} style={{ fontSize: "1.3rem", fontWeight: "700" }} >
                                                        {phase.dropdownTitle}
                                                    </span>
                                                    <span><KeyboardArrowDown className={`${phase.textColor} `} style={{ fontSize: "25px" }} /></span>
                                                </Accordion.Toggle>

                                                <Accordion.Collapse eventKey="0">
                                                    <div className={`${selectedJobIndex === jobIndex ? 'bg-white' : 'body-color'} `} style={{ width: "100%", overflow: "auto", fontSize: "13px", fontWeight: "bold" }}>
                                                        {phase.steps.map((step, idx) => (
                                                            <div key={idx}
                                                                //  className="d-flex justify-content-between pointer"  onClick={() => formUIProps.openReadFormDialog(step.interviewStatusId)}>
                                                                className={`d-flex justify-content-between }`}
                                                                onClick={step.count > 0 ? () => formUIProps.openReadFormDialog(job.id,step.interviewStatusId) : undefined}>
                                                                <span>{step.title}</span>
                                                                <span className={`${phase.textColor}`}>{step.count}</span>
                                                              
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


                </div>

            ))}
        </>
    );

}

