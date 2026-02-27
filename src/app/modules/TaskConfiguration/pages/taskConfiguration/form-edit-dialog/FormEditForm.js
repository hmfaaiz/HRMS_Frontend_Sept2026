import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchRoles } from "../../../../UserMangement/_redux/usersActions";

const taskConfigEditSchema = Yup.object().shape({
  // subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),

  companyTaskApproverId: Yup.array().nullable(),
  teamTicketApproverId: Yup.array().nullable(),

}).test(
  "at-least-one-approver",
  "Please select at least one Company Task or Team Ticket approver",
  function (values) {
    const { companyTaskApproverId, teamTicketApproverId } = values;
    // Check if both are empty or undefined
    if (
      (!companyTaskApproverId || companyTaskApproverId.length === 0) &&
      (!teamTicketApproverId || teamTicketApproverId.length === 0)
    ) {
      return this.createError({
        path: "companyTaskApproverId",
        message: "Please select at least one Company Task or Team Ticket approver",
      });
    }
    return true;
  }
);

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!formData.Id) {
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

      dispatch(fetchRoles());
    }
  }, [dispatch, formData.Id]);

  const { roles } = useSelector((state) => {
    return {
   
      roles: state.users?.roles?.allRoles || []
    };
  }, shallowEqual);


  return (
    <Formik
      enableReinitialize={true}
      initialValues={formData}
      validationSchema={taskConfigEditSchema}
      onSubmit={(values) => {
        enableLoading();
       

        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">
                    {/* <div className="col-span-1">

                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                      />
                    </div> */}


                    <div className="">
                      <label>
                        Company Task Ticket
                      </label>





                      <div className="overflow-auto max-h-32 border-none scrollbar-fancy">
                        {roles?.map((option) => (
                          <div key={option.Id} className="flex justify-start items-center">
                            <input className="mr-1"
                              name="companyTaskApproverId"
                              type="checkbox"
                              value={option.value}
                              checked={Boolean(values?.companyTaskApproverId?.includes(option?.value?.toString()))}
                              onChange={handleChange}
                            />
                            <label>{option.label}
                            </label>
                          </div>
                        ))}

                      </div>

                      {errors?.companyTaskApproverId && !values?.companyTaskApproverId?.length && (
                        <div className="text-danger text-sm mt-1">
                          {errors.companyTaskApproverId}
                        </div>
                      )}


                    </div>


                    <div className="">
                      <label>
                        Team Ticket
                      </label>





                      <div className="overflow-auto max-h-32 border-none scrollbar-fancy">
                        {roles?.map((option) => (
                          <div key={option.Id} className="flex justify-start items-center">
                            <input className="mr-1"
                              name="teamTicketApproverId"
                              type="checkbox"
                              value={option.value}
                              checked={Boolean(values?.teamTicketApproverId?.includes(option?.value?.toString()))}
                              onChange={handleChange}
                            />
                            <label>{option.label}
                            </label>
                          </div>
                        ))}

                      </div>


                    </div>



                  </div>






                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isUserForRead ? (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )}

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
