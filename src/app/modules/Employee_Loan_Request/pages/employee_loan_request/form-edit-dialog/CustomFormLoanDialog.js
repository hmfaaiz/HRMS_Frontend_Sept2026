import React, { useState } from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you're using React-Bootstrap
import * as actions from "../../../_redux/redux-Actions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";


const CustomFormLoanDialog = ({ showModal, handleClose,userForEdit,message ,handleReset, setIds,formUIProps}) => {

  const dispatch = useDispatch();
 const [loading, setLoading] = useState(false);
  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

const handleSubmit=async()=>{
  const formUpdatedFields = {
    Id: userForEdit.Id,
    isLoanContinuing:false
  };

  await dispatch(
    actions.updateEmployeeLoanRequest(
      formUpdatedFields,
      disbaleLoading,
      // clearForm
      handleClose(),
      handleReset(),
      setIds("")
    )
  );

  await dispatch(actions.fetchEmployeeLoanRequest(formUIProps));

}

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Loan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>{message}</span>

      </Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={handleClose} className="btn btn-light btn-elevate">
          Cancel
        </button>
        {/* {save} */}
        {/* <button type="button" className="btn btn-primary btn-elevate">
          Save Record
        </button> */}


          <button
                              type="submit"
                              // onClick={() => handleSubmit()}
                              onClick={() => {
                                handleSubmit();
                              
                              
                                
                              }}
                              className="btn btn-primary btn-elevate"
                              disabled={ loading}
                            >
                              Save
                              {loading && (
                                <span className="ml-3 mr-3 spinner spinner-white"></span>
                              )}
            
            
                            </button> 
      </Modal.Footer>
    </Modal>
  );
};

export default CustomFormLoanDialog;
