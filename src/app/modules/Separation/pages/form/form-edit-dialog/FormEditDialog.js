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
      setemployeeId: FormUIContext.setemployeeId,
      setPanelMode: FormUIContext.setPanelMode,
      panelMode: FormUIContext.panelMode,
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
    dataForEdit,
    isdataForRead,
  } = useSelector((state) => ({


    actionsLoading: state.users.actionsLoading,
    dataForEdit: state.separation.dataForEdit,
    isdataForRead: state.separation.dataForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchSeparationById(id));

  }, [id, dispatch]);


  const saveForm = async (formData) => {

    delete formData.employeetatus
    delete formData.all_report_to




    if (!formData.Id) {
      if (formData?.resignationAttachment && typeof formData?.resignationAttachment === "object") {
        try {
          const uploadRes = await actions.uploadFile(formData.resignationAttachment);
          formData.resignationAttachment = uploadRes.data.filename;  // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.resignationAttachment == "string") {
        formData.resignationAttachment = formData.resignationAttachment;
      }



      dispatch(actions.createSeparation(formData, disbaleLoading, onHide,formUIProps.queryParams));
      dispatch(actions.fetchSeparation(formUIProps.queryParams));



    } else 
      {




      const formUpdatedFields = {
        Id: formData.Id,
        employeeId: formData.employeeId,
        exitTypeId: formData.exitTypeId,
        exitReasonId: formData.exitReasonId,
        exitRemark: formData.exitRemark,

        acceptedEmployeeId: formData.acceptedEmployeeId,
        acceptanceRemarks: formData.acceptanceRemarks,

        resignationDate: formData.resignationDate,                // DATE
        resignationAcceptanceDate: formData.resignationAcceptanceDate, // DATE
        lastWorkingDate: formData.lastWorkingDate,                // DATE

        finalSettlementPolicy: formData.finalSettlementPolicy,
        noticePeriodDays: formData.noticePeriodDays,
        noticePeriodtype: formData.noticePeriodtype,

        hrRemarks: formData.hrRemarks,
        blackList: formData.blackList,
        blackListRemarks: formData.blackListRemarks,
        resignationAttachment: formData.resignationAttachment,

        resignedFlag: formData.resignedFlag,
        separatedFlag: formData.separatedFlag,
        reinstatedFlag: formData.reinstatedFlag,
        reinstatedRemarks: formData.reinstatedRemarks,
      };


      if (formData?.resignationAttachment && typeof formData?.resignationAttachment === "object") {
        try {
          const uploadRes = await actions.uploadFile(formData.resignationAttachment);
          formUpdatedFields.resignationAttachment = uploadRes.data.filename;  // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.resignationAttachment == "string") {
        formUpdatedFields.resignationAttachment = formData.resignationAttachment;
      }

      // ✅ Now call the update API after file is correctly set
      await dispatch(actions.updateSeparation(formUpdatedFields, disbaleLoading, onHide));

      await dispatch(actions.fetchSeparation(usersUIProps.queryParams));
    }
  };

  return (


    <div className="mt-3 bg-white">
      <FormEditDialogHeader id={id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        formData={dataForEdit || formUIProps.initUser}
        onHide={onHide}
        isdataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}
        disbaleLoading={disbaleLoading}
        setemployeeId={formUIProps.setemployeeId}
        setPanelMode={formUIProps.setPanelMode}
        panelMode={formUIProps.panelMode}

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
    // </Modal> */}
  );
}
