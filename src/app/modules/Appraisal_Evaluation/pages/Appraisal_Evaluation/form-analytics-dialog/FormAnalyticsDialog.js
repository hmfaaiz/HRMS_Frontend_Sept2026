import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormAnalyticsDialog({ id, empId, show, onHide }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };

  const dispatch = useDispatch();
  const { appraisalEmpDetail, actionsLoading } = useSelector((state) => ({
    appraisalEmpDetail: state.appraisal_evaluation.appraisalEmpDetail,
    actionsLoading: state.appraisal_evaluation.actionsLoading,
  }));

  useEffect(() => {
    // dispatch(actions.fetchAppraisalEmployeeDetail(empId, id));
  }, [id, empId, dispatch]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          View Analysis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Employee Information */}
        <div className="p-3 border rounded mb-3">
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>ID:</strong> DSC-076
              </p>
              <p>
                <strong>Name:</strong> Hafiz Muhammad Faaiz Azeem
              </p>
              <p>
                <strong>Position:</strong> Software Engineer
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Department:</strong> Product Development
              </p>
              <p>
                <strong>Manager:</strong> Syed Mubin H Zaidi
              </p>
              <p>
                <strong>Title:</strong> Technical Project Manager
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="p-3 border rounded mb-3">
          <h5 className="mb-3">Attendance Summary</h5>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th>Working Days</th>
                <th>Present Days</th>
                <th>On Time</th>
                <th>Late Arrivals</th>
                <th>Leaves (Paid)</th>
                <th>Leaves (Unpaid)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>182</td>
                <td>180</td>
                <td>178</td>
                <td>2</td>
                <td>2</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Incidents */}
        <div className="p-3 border rounded mb-3">
          <h5 className="mb-2">Incident Detail - During the Period</h5>
          <p className="text-muted">
            No incidents recorded during this period.
          </p>
        </div>

        {/* Skills & Certifications */}
        <div className="p-3 border rounded mb-3">
          <h5 className="mb-2">
            Skill & Certification - Done During the Period
          </h5>
          <ul>
            <li>Completed React Advanced Training</li>
            <li>AWS Cloud Practitioner Certificate</li>
          </ul>
        </div>

        {/* Qualification */}
        <div className="p-3 border rounded mb-3">
          <h5 className="mb-2">Qualification - During This Period</h5>
          <p>Bachelors in Software Engineering (Updated Record)</p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}
