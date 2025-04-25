import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/formaction";
import { useFormUIContext } from "../FormUIContext";
import { useParams } from "react-router-dom";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { Field } from "formik";
export function DuplicateDialog({ show, onHide }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [duplicateDetail, setDuplicateDetail] = useState("");
  const [selectedDesignationList, setSelectedDesignationList] = useState([]);
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
      currentState: state?.workflow_policy,
    }),
    shallowEqual
  );

  const { entities, designationList } = currentState;

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!id) {
      onHide();
    } else {
      const currentRecord = entities?.find((el) => el.Id == id);
      setDuplicateDetail(
        currentRecord
          ? `${currentRecord?.designation?.formName} of ${currentRecord?.workflowType?.formName}`
          : ""
      );
    }
  }, [id, currentState]);

  useEffect(() => {
    const currentRecord = entities?.find((el) => el.Id == id);
    dispatch(actions.fetchDesignationRecord(currentRecord?.workflowTypeId));
  }, [id, entities]);

  const handleClick = () => {
    enableLoading();
    dispatch(
      actions.createMultipleRecord(
        {
          id: id,
          designationsIds: selectedDesignationList,
        },
        disableLoading,
        "DWP"
      )
    ).then(() => {
      onHide();
      dispatch(actions.fetchAllRecord(formUIProps.queryParams, "DWP"));
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
          Copy workflow policy to other designations
          <h6>{duplicateDetail}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-12 col-md-12 mt-3">
          Designation List
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
                {designationList.map((option, index) => (
                  <div
                    key={option.value || `fallback-key-${index}`}
                    className="dropdown-option"
                  >
                    <input
                      type="checkbox"
                      name={option?.key}
                      checked={selectedDesignationList?.includes(option?.value)}
                      onChange={(e) => {
                        const isSelected = selectedDesignationList?.includes(
                          option?.value
                        );
                        const updatedSelectedDesignation = isSelected
                          ? selectedDesignationList.filter(
                              (el) => el !== option?.value
                            ) // remove
                          : [...selectedDesignationList, option?.value]; // add

                        setSelectedDesignationList(updatedSelectedDesignation);
                      }}
                      style={{ width: "25px" }}
                    />

                    {option.label}
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
