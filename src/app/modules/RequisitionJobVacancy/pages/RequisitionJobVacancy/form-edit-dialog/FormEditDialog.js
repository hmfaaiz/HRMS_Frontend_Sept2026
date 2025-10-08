import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";



export function FormEditDialog({ id, show, onHide, dataForRead, status }) {
  
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();

  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {

    setActiveKey("0"); // jab new user aaye to accordion open kar do

  }, [id, status]);
  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const {
    actionsLoading,
    user,
    dataForEdit,
    roles,
    centers,
    userStatusTypes,
    isdataForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    dataForEdit: state.job_vacancy.dataForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isdataForRead: state.job_vacancy.dataForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchJobVacancyById(id));

    // dispatch(actions.fetchJobVacancy(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData, diffInDate) => {



    if (!formData.Id) {

      dispatch(actions.createJobVacancy(formData, disbaleLoading, onHide));



    } else {



      // user.number_of_days=
      const formUpdatedFields = {
        Id: formData.Id,
        jobCode: formData.jobCode || "",
        dateOfRequest: formData.dateOfRequest || null,
        jobTitle: formData.jobTitle || "",
        locationId: formData.locationId, // safe array
        departmentId: formData.departmentId,
        noOfPosition: formData.noOfPosition,
        hiringReasonId: formData.hiringReasonId,
        jobPreferenceId: formData.jobPreferenceId,
        desireDateOfApp: formData.desireDateOfApp,

        jobPreferenceId: formData.jobPreferenceId,

        preferredQualificationId: formData.preferredQualificationId || null,

        salaryRangeFrom: formData.salaryRangeFrom,

        salaryRangeTo: formData.salaryRangeTo,

        jobSummary: formData.jobSummary || "",
        isReplacement: formData.isReplacement,
        replacementEmpId: formData.replacementEmpId,
        reasonForRequest: formData.reasonForRequest,
        keyResponsibility: formData.keyResponsibility,
        workExpFrom: formData.workExpFrom,
        workExpTo: formData.workExpTo,
      };



      await dispatch(actions.updateJobVacancy(formUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchJobVacancy(usersUIProps.queryParams));
    }
  };

  return (
    // <Modal
    //   size="xl"
    //   show={show}
    //   onHide={onHide}
    //   aria-labelledby="example-modal-sizes-title-lg"
    //   backdrop="static"
    // >


    // <Accordion activeKey={activeKey}>
    //   <Card>
    //     <Card.Header className="d-flex justify-content-center">
    //       <div className="accordion-header-btn w-100  d-flex justify-content-center">
    //         <Accordion.Toggle
    //           as={Button}
    //           eventKey="0"
    //           className="flex-between-center text-bold"
    //            onClick={() =>
    //             setActiveKey(activeKey === "0" ? null : "0")
    //           }
    //         >
    //           Job Vacancy 
    //           <KeyboardArrowDown />
    //         </Accordion.Toggle>
    //       </div>
    //     </Card.Header>
    //     <Accordion.Collapse eventKey="0">
    //       <Card.Body>


    //       </Card.Body>
    //     </Accordion.Collapse>
    //   </Card>
    // </Accordion>

    <div className="bg-white">
      <hr></hr>
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        formData={dataForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isdataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}

      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>

    // </Modal>
  );
}
