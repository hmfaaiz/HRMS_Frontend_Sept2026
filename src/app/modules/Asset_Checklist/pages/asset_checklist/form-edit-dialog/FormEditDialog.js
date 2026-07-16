import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";


export function FormEditDialog({ assetCategoryId,
  assetRegisterId,
  dateOfInspection, show, onHide, dataForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();


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
  } = useSelector((state) => {


    return {
      actionsLoading: state.users.actionsLoading,
      dataForEdit: state.asset_checklist.dataForEdit,
      isdataForRead: state.asset_checklist.dataForRead,
    };
  }, shallowEqual);




  // useEffect(() => {
  //   dispatch(actions.fetchAssetInspectionListDataForEdit(id));

  //   // dispatch(actions.fetchAssetInspectionListDataForEdit(formUIProps .queryParams))
  // }, [id, dispatch,show]);

  useEffect(() => {
    if (show) {
      dispatch(
        actions.fetchAssetInspectionListDataForEdit({
          asset_categoryId: assetCategoryId,
          asset_registerId: assetRegisterId,
          date_of_inspection: dateOfInspection,
        })
      );
    }
  }, [
    assetCategoryId,
    assetRegisterId,
    dateOfInspection,
    dispatch,
    show,
  ]);
  // const saveForm = async (data) => {



  //   if (!data.dataIsExist) {


  //     const finalObject = { data }
  //     await dispatch(actions.createAssetInspectionList(data, disbaleLoading, onHide));
  //     await dispatch(actions.fetchAssetInspectionList(usersUIProps.queryParams));


  //   } else {




  //     const formUpdatedFields = {
  //       Id: data?.exitTypeId,
  //       list:data?.list,
  //     };



  //    await dispatch(actions.updateAssetInspectionList(formUpdatedFields, disbaleLoading, onHide));
  //    await dispatch(actions.fetchAssetInspectionList(usersUIProps.queryParams));
  //   }
  // };



  const saveForm = async (data) => {
    if (!data.dataIsExist) {
      const payload = {
        ...data,
        date_of_inspection: data.date_of_inspection
          ? format(new Date(data.date_of_inspection), "yyyy-MM-dd")
          : null,
      };

      await dispatch(
        actions.createAssetInspectionList(
          payload,
          disbaleLoading,
          onHide
        )
      );

      await dispatch(
        actions.fetchAssetInspectionList(usersUIProps.queryParams)
      );
    } else {
      const formUpdatedFields = {
        asset_categoryId: data.asset_categoryId,
        asset_registerId: data.asset_registerId,
        inspected_by_employeeId: data.inspected_by_employeeId,
        reason_for_inspection: data.reason_for_inspection,
        event_for_inspection: data.event_for_inspection,
  
        date_of_inspection: data.date_of_inspection
          ? format(new Date(data.date_of_inspection), "yyyy-MM-dd")
          : null,

        list: data.list.map((item) => ({
          ...item,
          date_of_inspection: data.date_of_inspection
            ? format(new Date(data.date_of_inspection), "yyyy-MM-dd")
            : null,
        })),
      };

      await dispatch(
        actions.updateAssetInspectionList(
          formUpdatedFields,
          disbaleLoading,
          onHide
        )
      );

      await dispatch(
        actions.fetchAssetInspectionList(usersUIProps.queryParams)
      );
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={assetCategoryId} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        data={dataForEdit || formUIProps.initUser}
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
    </Modal>
  );
}
