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
            setHeadOfHrId: FormUIContext?.setHeadOfHrId,
            setHrId: FormUIContext?.setHrId,
            hrId: FormUIContext?.hrId,
            headOfHrId: FormUIContext?.headOfHrId,
            signatoryisShow: FormUIContext?.signatoryisShow,

        };
    });

    // const { applicants, applicantProfile } = useSelector((state) => {
    //     return {
    //         applicants: state?.job_offer?.applicants,
    //         applicantProfile: state?.job_offer?.applicantProfile,
    //     };
    // }, shallowEqual);
    const { dashboard } = useSelector((state) => state);


    const previewOfferLetter = (values) => {

        const updatedBody = {
            ...values,
            regenerated: false, // add new field here
        };
        dispatch(actions.Previewjob_offer_letter(updatedBody));
    }


    useEffect(() => {
        dispatch(fetchAllFormsMenu(158, "allDesignations"));
        dispatch(fetchAllEmployeesWithNoPermissionData('allEmployeesWithNoPermissionList'));
    }, [dispatch])


    const { applicants } = useSelector((state) => {
        return {
            applicants: state?.job_offer?.applicants,

        };
    }, shallowEqual);

    return (
        <Formik
            initialValues={{}} // Provide initial values
            onSubmit={() => { }} // Dummy onSubmit or real one
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <div className="col-12">


                        <div className="col-12 col-md-12  row  m-0 p-0">
                            <div className="col-12 col-md-4 m-0 p-0">
                                <SearchSelect
                                    name="headOfHrId"
                                    label={<span>Signatory 1</span>}
                                    isDisabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId ||
                                        formUIProps.signatoryisShow
                                    }
                                    onChange={(e) => {
                                        setFieldValue("headOfHrId", e?.value || null);

                                        formUIProps.setHeadOfHrId(e?.value);

                                    }}

                                    value={
                                        dashboard?.allEmployeesWithNoPermissionList?.find(
                                            (option) => option.value === values.headOfHrId
                                        ) || null
                                    }
                                    options={
                                        dashboard?.allEmployeesWithNoPermissionList?.filter(
                                            (option) => option.value !== values.hrId // prevent same as Signatory 2
                                        )
                                    }
                                />
                            </div>

                            <div className="col-12 col-md-4 ">
                                <SearchSelect
                                    name="hrId"
                                    label={<span>Signatory 2</span>}
                                    isDisabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId ||
                                        formUIProps.signatoryisShow
                                    }
                                    onChange={(e) => {
                                        setFieldValue("hrId", e?.value || null);
                                        formUIProps.setHrId(e?.value);
                                    }}
                                    value={
                                        dashboard?.allEmployeesWithNoPermissionList?.find(
                                            (option) => option.value === values.hrId
                                        ) || null
                                    }
                                    options={
                                        dashboard?.allEmployeesWithNoPermissionList?.filter(
                                            (option) => option.value !== values.headOfHrId // prevent same as Signatory 1
                                        )
                                    }
                                />
                            </div>

                        </div>


                        <div className="col-12 col-md-12 mt-3 row">



                        </div>

                        <div className="col-12 col-md-12 mt-4 row">
                            {/* <div className="">
                                <button
                                    className="ml-3 btn btn-primary btn-elevate"
                                    onClick={() => {
                                        generateOfferLetter({
                                            applicantId: formUIProps.applicantId,
                                            applicantVacancyId: formUIProps.applicantVacancyId,
                                            jobVacancyId: formUIProps.jobVacancyId,
                                            headOfHrId: values.headOfHrId,

                                            hrId: values.hrId,

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
                            </div> */}

                            <div className="">
                                <button
                                    className="ml-3 btn btn-primary btn-elevate"
                                    disabled={
                                        !formUIProps.applicantVacancyId ||
                                        !formUIProps.applicantId ||
                                        !formUIProps.jobVacancyId ||
                                        !values.hrId && !values.headOfHrId
                                    }
                                    onClick={() => {

                                        localStorage.setItem('formUIProps', JSON.stringify(formUIProps));
                                        previewOfferLetter({
                                            applicantId: formUIProps.applicantId,
                                            applicantVacancyId: formUIProps.applicantVacancyId,
                                            jobVacancyId: formUIProps.jobVacancyId,
                                            headOfHrId: values.headOfHrId,

                                            hrId: values.hrId,



                                        });
                                     
                                          
                                    


                                        // if (raw) {

                                        window.open('/job_offer/read-job-offer-preview');

                                          dispatch(actions.Clear());
                                        // }
                                    }}
                                >
                                    Preview Offer Letter
                                </button>
                            </div>
                        </div>

                    </div>
                </Form>
            )
            }
        </Formik >
    );
}