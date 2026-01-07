// import React, { useState, useEffect, useMemo } from "react";
// import { Modal } from "react-bootstrap";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { FacilitatorEditForm } from "./FacilitatorEditForm";
// import { FacilitatorEditDialogHeader } from "./FacilitatorEditDialogHeader";
// import * as actions from "../../../_redux/facilitatorSetupActions";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useFacilitatorUIContext } from "../Facilitator_SetupUIContext";

// export function FacilitatorEditDialog({ id, show, onHide, isUserForRead }) {
//   const [loading, setLoading] = useState(false);

//   const facilitatorUIContext = useFacilitatorUIContext();
//   const facilitatorUIProps = useMemo(() => ({
//     queryParams: facilitatorUIContext.queryParams,
//     setQueryParams: facilitatorUIContext.setQueryParams,
//     initFacilitator: facilitatorUIContext.initFacilitator,
//   }), [facilitatorUIContext]);

//   const dispatch = useDispatch();
//   const { actionsLoading, facilitatorForEdit } = useSelector(
//     (state) => ({
//       actionsLoading: state.facilitatorSetup.actionsLoading,
//       facilitatorForEdit: state.facilitatorSetup.facilitatorForEdit,
//     }),
//     shallowEqual
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(actions.fetchFacilitatorSetup(id));
//     }
//   }, [id, dispatch]);

//   const enableLoading = () => setLoading(true);
//   const disableLoading = () => setLoading(false);

//   const saveFacilitator = async (data) => {
//     if (!id) {
//       // Create new facilitator
//       await dispatch(actions.createFacilitatorSetup(data, disableLoading, onHide));
//     } else {
//       // Update existing facilitator
//       await dispatch(
//         actions.updateFacilitatorSetup(
//           { Id: data.Id, ...data },
//           disableLoading,
//           onHide
//         )
//       );
//     }

//     // Refresh table after save
//     dispatch(actions.fetchFacilitatorSetups(facilitatorUIProps.queryParams));
//   };

//   return (
//     <Modal
//       size="lg"
//       show={show}
//       onHide={onHide}
//       aria-labelledby="facilitator-edit-dialog"
//     >
//       <FacilitatorEditDialogHeader id={id} isUserForRead={isUserForRead} />

//       <FacilitatorEditForm
//         saveForm={saveFacilitator}
//         data={facilitatorForEdit || facilitatorUIProps.initFacilitator}
//         onHide={onHide}
//         isUserForRead={isUserForRead}
//         enableLoading={enableLoading}
//         loading={loading}
//         id={id}
//       />

//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </Modal>
//   );
// }
import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FacilitatorEditForm } from "./FacilitatorEditForm";
import { useFacilitatorUIContext } from "../Facilitator_SetupUIContext";
import * as actions from "../../../_redux/facilitatorSetupActions";

export function FacilitatorEditDialog({ id, show, onHide, status, dataForRead }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [facilitatorForEdit, setFacilitatorForEdit] = useState(null);

  // UI context
  const facilitatorUIContext = useFacilitatorUIContext();
  const facilitatorUIProps = useMemo(() => {
    return {
      queryParams: facilitatorUIContext.queryParams,
      initFacilitator: facilitatorUIContext.initFacilitator,
    };
  }, [facilitatorUIContext]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  // Get facilitator data from Redux (fallback)
  const { facilitatorDataFromRedux, actionsLoading } = useSelector(
    (state) => ({
      facilitatorDataFromRedux: state.facilitator_setup?.facilitatorForEdit,
      actionsLoading: state.facilitator_setup?.actionsLoading,
    }),
    shallowEqual
  );

  // Load data based on mode
  useEffect(() => {
    if (status === "edit" || status === "read") {
      // Try to get data from sessionStorage first
      const storageKey = status === "edit" ? "facilitatorEditData" : "facilitatorReadData";
      const storedData = sessionStorage.getItem(storageKey);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setFacilitatorForEdit(parsedData);
        } catch (error) {
          console.error("Error parsing stored facilitator data:", error);
          // Fallback: try to fetch by ID if available
          if (id) {
            dispatch(actions.fetchFacilitatorSetup(id));
          }
        }
      } else if (id) {
        // Fallback: fetch by ID
        dispatch(actions.fetchFacilitatorSetup(id));
      }
    } else {
      // For new records, clear any stored data
      setFacilitatorForEdit(null);
      sessionStorage.removeItem("facilitatorEditData");
      sessionStorage.removeItem("facilitatorReadData");
    }
  }, [id, status, dispatch]);

  // Update local state when redux data changes (fallback scenario)
  useEffect(() => {
    if (facilitatorDataFromRedux && (status === "edit" || status === "read")) {
      setFacilitatorForEdit(facilitatorDataFromRedux);
    }
  }, [facilitatorDataFromRedux, status]);

  // Save handler
  const saveFacilitator = async (formData) => {
    enableLoading();
    try {
      if (status === "new" || !id) {
        // Create new facilitator
        await dispatch(actions.createFacilitatorSetup(formData, disableLoading, onHide));
      } else {
        // Update existing facilitator
        await dispatch(actions.updateFacilitatorSetup(formData, disableLoading, onHide));
      }

      // Refresh table after save
      await dispatch(actions.fetchFacilitatorSetups(facilitatorUIProps.queryParams));
    } catch (err) {
      console.error("Facilitator save failed:", err);
      disableLoading();
    }
  };

  // Determine what data to use
  const initialValues = facilitatorForEdit || facilitatorUIProps.initFacilitator || {};
  const dataLoaded = status === "new" || facilitatorForEdit || facilitatorDataFromRedux;

  // Determine if read-only
  const isReadOnly = dataForRead || status === "read";

  // Modal title
  const getTitle = () => {
    if (status === "read" || isReadOnly) return "View Facilitator Setup";
    if (status === "edit") return "Edit Facilitator Setup";
    return "Add Facilitator Setup";
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="facilitator-edit-dialog"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="overlay overlay-block cursor-default">
        {actionsLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}

        {dataLoaded ? (
          <FacilitatorEditForm
            saveFacilitator={saveFacilitator}
            data={initialValues}
            onHide={onHide}
            isUserForRead={isReadOnly}
            loading={loading}
          />
        ) : (
          // Show spinner while waiting for data
          <div className="d-flex justify-content-center align-items-center p-5">
            <span className="spinner spinner-lg spinner-success"></span>
          </div>
        )}
      </Modal.Body>

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