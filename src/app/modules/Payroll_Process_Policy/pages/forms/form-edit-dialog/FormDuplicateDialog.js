import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formActions"
import { useFormUIContext } from "../FormUIContext";
import { useParams } from "react-router-dom";

import { Field } from "formik";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";




export function DuplicateDialog({ show,onHide }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [duplicateDetail, setDuplicateDetail] = useState("");
  const [selectedSubsidiaryList, setSelectedSubsidiaryList] = useState([]);
  // Customers UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

  // Customers Redux state
  const dispatch = useDispatch();
  const { isLoading, currentState } = useSelector(
    (state) => ({
      isLoading: state.customers.actionsLoading,
      currentState: state?.payroll_process_policy,
    }),
    shallowEqual
  );

  const { subsidiaryForPayrollList} = currentState;

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };



  const handleClick = () => {
    enableLoading();
    console.log("selectedSubsidiaryList1111",id,selectedSubsidiaryList)
    dispatch(
      actions.copyPayrollPolicyById(
        {
          Id: id,
          subsidiaryIds: selectedSubsidiaryList,
        },
        disableLoading,
  
      )
    ).then(() => {
      onHide();
      dispatch(actions.fetchUsers(formUIProps.queryParams));
      disableLoading();
    });
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Copy payroll configuration to other subsidiary
          <h6>{duplicateDetail}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-12 col-md-12 mt-3">
          Subsidiary List
          <div
            style={{
              backgroundColor: "#ffffff",
              height: "350px",
              padding: "10px",
              overflow: "scroll",
            }}
          >
            <div className="multi-select">
              <div className="dropdown-label"></div>
              <div
                className="dropdown-options"
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "5px",
                }}
              >
                {subsidiaryForPayrollList.map((option, index) => (
                  <div
                    key={option.Id || `fallback-key-${index}`}
                    className="dropdown-option"
                  >
                    <input
                      type="checkbox"
                      name={option?.key}
                      checked={selectedSubsidiaryList?.includes(option?.Id)}
                      onChange={(e) => {
                        const isSelected = selectedSubsidiaryList?.includes(
                          option?.Id
                        );
                        const updatedSelectedDesignation = isSelected
                          ? selectedSubsidiaryList.filter(
                              (el) => el !== option?.Id
                            ) // remove
                          : [...selectedSubsidiaryList, option?.Id]; // add

                        setSelectedSubsidiaryList(updatedSelectedDesignation);
                      }}
                      style={{ width: "25px" }}
                    />

                    {option?.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            // disabled={enableLoading}
            onClick={handleClick}
            className="btn btn-primary btn-elevate"
          >
            Save
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}