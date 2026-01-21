// import React, { useEffect, useMemo, useState } from "react";
// import { Modal } from "react-bootstrap";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
// import * as actions from "../../../_redux/facilitatorSetupActions";
// import { useFacilitatorUIContext } from "../FacilitatorUIContext";

// export function FacilitatorDeleteDialog({ id, show, onHide }) {
//   const [loading, setLoading] = useState(false);

//   // Facilitators UI Context
//   const facilitatorUIContext = useFacilitatorUIContext();
//   const facilitatorUIProps = useMemo(() => {
//     return {
//       queryParams: facilitatorUIContext.queryParams,
//     };
//   }, [facilitatorUIContext]);

//   // Redux
//   const dispatch = useDispatch();
//   const { actionsLoading } = useSelector(
//     (state) => ({ actionsLoading: state.facilitatorSetup.actionsLoading }),
//     shallowEqual
//   );

//   const enableLoading = () => setLoading(true);
//   const disableLoading = () => setLoading(false);

//   // Close modal if no ID
//   useEffect(() => {
//     if (!id) onHide();
//   }, [id, onHide]);

//   const deleteFacilitator = () => {
//     enableLoading();
//     dispatch(actions.deleteFacilitator({ Id: id })).then(() => {
//       // Refresh list
//       dispatch(actions.fetchFacilitators(facilitatorUIProps.queryParams));
//       disableLoading();
//       onHide();
//     });
//   };

//   return (
//     <Modal 
//       show={show} 
//       onHide={onHide} 
//       aria-labelledby="delete-facilitator-modal">
//       {/* Loading */}
//       {actionsLoading && <ModalProgressBar />}
//       <Modal.Header closeButton>
//         <Modal.Title id="delete-facilitator-modal">Delete Facilitator</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {!actionsLoading && <label>Are you sure you want to delete this facilitator?</label>}
//         {actionsLoading && <label>Deleting facilitator...</label>}
//       </Modal.Body>
//       <Modal.Footer>
//         <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
//           Cancel
//         </button>
//         <button type="button" onClick={deleteFacilitator} className="btn btn-danger">
//           Delete
//           {loading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
//         </button>
//       </Modal.Footer>
//     </Modal>
//   );
// }



import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/facilitatorSetupActions";
import { useFacilitatorUIContext } from "../Facilitator_SetupUIContext";

export function FacilitatorDeleteDialog({ id, show, onHide }) {
  // Facilitators UI Context
  const facilitatorUIContext = useFacilitatorUIContext();
  const facilitatorUIProps = useMemo(() => ({
    queryParams: facilitatorUIContext.queryParams,
  }), [facilitatorUIContext]);

  // Redux
  const dispatch = useDispatch();
  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.facilitator_setup.actionsLoading, 
    }),
    shallowEqual
  );

  // Close modal if no ID
  useEffect(() => {
    if (!id) onHide();
  }, [id, onHide]);

  const deleteFacilitator = () => {
    if (!id) return;
    dispatch(actions.deleteFacilitatorSetup(id)) 
      .then(() => {
        
        dispatch(actions.fetchFacilitatorSetups(facilitatorUIProps.queryParams));
        onHide();
      });
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="delete-facilitator-modal">
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="delete-facilitator-modal">Delete Facilitator</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!actionsLoading && <label>Are you sure you want to delete this facilitator?</label>}
        {actionsLoading && <label>Deleting facilitator...</label>}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
          Cancel
        </button>
        <button type="button" onClick={deleteFacilitator} className="btn btn-danger">
          Delete
          {actionsLoading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
