import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux"
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
export function SelectTaxSetup({
    actionsLoading,
    setFetchSubsidiaryId,

    setFetchTaxSetupId,
}) {

    const dispatch = useDispatch();
    const { dashboard } = useSelector((state) => state);

    useEffect(() => {

        dispatch(fetchAllSubsidiaryData("allSubsidiaryList"))
        dispatch(actions.fetchgetAllTaxYearSetup());

    }, [dispatch]);


    const { currentState, } = useSelector(
        (state) => {
            return {

                currentState: state.tax_slab,
                userAccess: state?.auth?.userAccess["tax_slab"],
            }
        },

    );


    const { taxYearSetup, } = currentState;



    return (
        <>
            {/* Formik Starts */}

            <Formik
                enableReinitialize={true}
                initialValues={{}}
            >
                {({
                    errors,
                    touched,
                    values,
                    handleBlur,
                    setFieldValue,
                }) => (
                    <>

                        {actionsLoading && (
                            <div className="overlay-layer bg-transparent">
                                <div className="spinner spinner-lg spinner-success" />
                            </div>
                        )}
                        {/* Form Starts */}
                        <Form className="form form-label-right">
                            <fieldset>
                                <div className="from-group row m-5">

                                    {/* Employee Id Dropdown Starts */}
                                    <div className="col-4 col-md-4 mt-3">
                                        <SearchSelect
                                            name="subsidiaryId"
                                            label={
                                                <span>
                                                    Subsidiary<span style={{ color: "red" }}>*</span>
                                                </span>
                                            }

                                            onChange={(e) => {
                                                setFieldValue("subsidiaryId", e.value || null);
                                                setFetchSubsidiaryId(e.value)
                                                setFetchTaxSetupId(null)
                                                setFieldValue("taxSetupId",null);


                                            }}

                                            options={dashboard?.allSubsidiaryList}


                                            error={errors.subsidiaryId}
                                            touched={touched.subsidiaryId}
                                        />
                                    </div>

                                    <div className="col-4 col-md-4 mt-3">
                                        <SearchSelect
                                            name="taxSetupId"
                                            label={
                                                <span>
                                                 Tax Year<span style={{ color: "red" }}>*</span>
                                                </span>
                                            }
                                            isDisabled={!values.subsidiaryId}
                                            onChange={(e) => {

                                                setFieldValue("taxSetupId", e.value || null);

                                                setFetchTaxSetupId(e)

                                            }}

                                    
                                            // options={taxYearSetup
                                            //     ?.filter(option => option?.subsidiaryId === values?.subsidiaryId) // Filtering by subsidiaryId
                                            //     .map(option => ({
                                            //         label: `${option?.startDate} - ${option?.endDate} ${option?.isActive ? "Active" : ""}`, // Adding Active status
                                            //         value: option?.Id, // Use Id as the value
                                            //         isActive: option?.isActive,
                                            //     })) || []}


                                            options={taxYearSetup
                                                ?.filter(option => option?.subsidiaryId === values?.subsidiaryId) // Filtering by subsidiaryId
                                            }


                                            error={errors.taxSetupId}
                                            touched={touched.taxSetupId}
                                        />
                                    </div>

                                </div>
                            </fieldset>
                        </Form>
                        {/* Form Ends */}
                    </>
                )}
            </Formik>
            {/* Formik Ends */}
        </>
    );
}
