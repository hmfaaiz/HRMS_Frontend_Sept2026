import React, { useEffect, useMemo } from "react";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllEmployeesWithNoPermissionData, fetchAllFormsMenu } from "../../../../../_metronic/redux/dashboardActions";
import { Formik, Form, Field } from "formik";

export default function GenerateSection() {

    const dispatch = useDispatch();
    const FormUIContext = useFormUIContext();
    const formUIProps = useMemo(() => {
        return {
            applicantId: FormUIContext?.selectedApplicant,
            setSelectedApplicant: FormUIContext?.setSelectedApplicant,
            setApplicantVacancyId: FormUIContext?.setApplicantVacancyId,
            applicantVacancyId: FormUIContext?.applicantVacancyId,
            jobVacancyId: FormUIContext?.selectedJob,
        };
    });

    // const { applicants, applicantProfile } = useSelector((state) => {
    //     return {
    //         applicants: state?.job_offer?.applicants,
    //         applicantProfile: state?.job_offer?.applicantProfile,
    //     };
    // }, shallowEqual);
    const { dashboard } = useSelector((state) => state);
    const generateOfferLetter = (values) => {

        const updatedBody = {
            ...values,
            regenerated: false, // add new field here
        };
        dispatch(actions.Generatejob_offer_letter(updatedBody));
    }


    useEffect(() => {
        dispatch(fetchAllFormsMenu(158, "allDesignations"));
        dispatch(fetchAllEmployeesWithNoPermissionData('allEmployeesWithNoPermissionList'));
    }, [dispatch])

    return (
        <Formik
            initialValues={{ designationId: "" }} // Provide initial values
            onSubmit={() => { }} // Dummy onSubmit or real one
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <div className="col-12">


                        <div className="col-12 col-md-12 mt-3 row">
                            <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                    name="headOfHrId"
                                    label={
                                        <span>
                                            Head Of HR
                                        </span>
                                    }
                                    isDisabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId
                                    }
                                    onChange={(e) => {
                                        setFieldValue("headOfHrId", e?.value || null);
                                    }}
                                    value={
                                        dashboard?.allEmployeesWithNoPermissionList?.find(
                                            (option) => option.value === values.headOfHrId
                                        ) || null
                                    }
                                    options={dashboard?.allEmployeesWithNoPermissionList}
                                />
                            </div>

                            <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                    name="headOfHrDesignationId"
                                    label={
                                        <span>
                                            Designation
                                        </span>
                                    }
                                    isDisabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId
                                    }
                                    onChange={(e) => {
                                        setFieldValue("headOfHrDesignationId", e?.value || null);
                                    }}
                                    value={
                                        dashboard?.allDesignations?.find(
                                            (option) => option.value === values.headOfHrDesignationId
                                        ) || null
                                    }
                                    options={dashboard?.allDesignations}
                                />
                            </div>
                        </div>


                        <div className="col-12 col-md-12 mt-3 row">
                            <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                    name="hrId"
                                    label={
                                        <span>
                                            HR
                                        </span>
                                    }
                                    isDisabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId
                                    }
                                    onChange={(e) => {
                                        setFieldValue("hrId", e?.value || null);
                                    }}
                                    value={
                                        dashboard?.allEmployeesWithNoPermissionList?.find(
                                            (option) => option.value === values.hrId
                                        ) || null
                                    }
                                    options={dashboard?.allEmployeesWithNoPermissionList}
                                />
                            </div>

                            <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                    name="hrDesignationId"
                                    label={
                                        <span>
                                            Designation
                                        </span>
                                    }
                                    isDisabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId
                                    }
                                    onChange={(e) => {
                                        setFieldValue("hrDesignationId", e?.value || null);
                                    }}
                                    value={
                                        dashboard?.allDesignations?.find(
                                            (option) => option.value === values.hrDesignationId
                                        ) || null
                                    }
                                    options={dashboard?.allDesignations}
                                />
                            </div>
                        </div>


                        <div className="col-12 col-md-3 mt-4">
                            <button
                                className="ml-3 btn btn-primary btn-elevate"
                                onClick={() => {
                                    generateOfferLetter({
                                        applicantId: formUIProps.applicantId,
                                        applicantVacancyId: formUIProps.applicantVacancyId,
                                        jobVacancyId: formUIProps.jobVacancyId,
                                        headOfHrId:values.headOfHrId,
                                        headOfHrDesignationId: values.headOfHrDesignationId,
                                        hrId: values.hrId,
                                        hrDesignationId: values.hrDesignationId,
                                    });
                                }}
                                type="button"
                                disabled={
                                    !formUIProps.applicantVacancyId ||
                                    !formUIProps.applicantId ||
                                    !formUIProps.jobVacancyId
                                }
                            >
                                Generate Offer Letter
                            </button>
                        </div>
                    </div>
                </Form>
            )
            }
        </Formik >
    );
}