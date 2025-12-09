import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormAnalyticsDialog({ id, empId, show, onHide }) {
  const dispatch = useDispatch();
  const { appraisalEmpDetail, actionsLoading } = useSelector((state) => ({
    appraisalEmpDetail: state.appraisal_evaluation.appraisalEmpDetail,
    actionsLoading: state.appraisal_evaluation.actionsLoading,
  }));

  const FormUIContext = useFormUIContext();

  useEffect(() => {
    if (empId && id) {
      dispatch(actions.fetchAppraisalEmployeeDetail(empId, id, onHide));
    }
  }, [id, empId, dispatch, onHide]);

  const emp = appraisalEmpDetail?.employee;
  const attendance = appraisalEmpDetail?.attendanceDetail;
  const incidents = appraisalEmpDetail?.empIncidents || [];
  const skills = appraisalEmpDetail?.empSkills || [];
  const qualifications = appraisalEmpDetail?.empExp || [];

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      className="text-gray-800"
    >
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton className="border-b">
        <Modal.Title
          id="example-modal-sizes-title-lg"
          className="text-xl font-semibold"
        >
          View Analysis
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="space-y-4">
        {/* Employee Information */}
        <div className="p-2 border rounded-md ">
          <div className="grid grid-cols-2 text-sm gap-1">
            <p className="mb-0">
              <span className="font-semibold">Code:</span> {emp?.employeeCode}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Name:</span> {emp?.firstName}{" "}
              {emp?.middleName} {emp?.lastName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Designaion:</span>{" "}
              {emp?.designation?.formName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Department:</span>{" "}
              {emp?.department?.deptName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Manager:</span>{" "}
              {emp?.ReportTo?.firstName} {emp?.ReportTo?.middleName}{" "}
              {emp?.ReportTo?.lastName}
            </p>
            <p className="mb-0">
              <span className="font-semibold">Manager Designaion:</span>{" "}
              {emp?.ReportTo?.designation?.formName}
            </p>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="p-2 border rounded-md ">
          <div className="flex items-center mb-1">
            <h6 className="font-bold w-fit mb-0 text-primary">
              Attendance Summary
            </h6>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                <thead>
                  <tr className="custom-table-header">
                    <th>Working Days</th>
                    <th>Present Days</th>
                    <th>On Time</th>
                    <th>Late In</th>
                    <th>Early Out</th>
                    <th>Leaves (Paid)</th>
                    <th>Leaves (Unpaid)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{attendance?.workingDays}</td>
                    <td>{attendance?.presentDays}</td>
                    <td>{attendance?.onTime}</td>
                    <td>{attendance?.lateIn}</td>
                    <td>{attendance?.earlyGoing}</td>
                    <td>{attendance?.onLeave}</td>
                    <td>{attendance?.absentDay}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Incidents */}
        {incidents?.length > 0 && (
          <div className="p-2 border rounded-md ">
            <div className="flex items-center mb-1">
              <h6 className="font-bold w-fit mb-0 text-primary">
                Incident Detail - During the Period
              </h6>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th>Incident Detail</th>
                      <th>Action Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents?.map((e) => {
                      return (
                        <tr>
                          <td>{e?.incidentDetail || "-"}</td>
                          <td>{e?.actionTaken || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Skills & Certifications */}
        {skills?.length > 0 && (
          <div className="p-2 border rounded-md ">
            <div className="flex items-center mb-1">
              <h6 className="font-bold w-fit mb-0 text-primary">
                Skill & Certification - Done During the Period
              </h6>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th>Name</th>
                      <th>Detail</th>
                      <th>Rating</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills?.map((e) => {
                      return (
                        <tr>
                          <td>{e?.skill || "-"}</td>
                          <td>{e?.description || "-"}</td>
                          <td>{e?.ratingScale || "-"}</td>
                          <td>{e?.startDate || "-"}</td>
                          <td>{e?.endDate || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Qualification */}
        {qualifications?.length > 0 && (
          <div className="p-2 border rounded-md ">
            <div className="flex items-center mb-1">
              <h6 className="font-bold w-fit mb-0 text-primary">
                Qualification - During This Period
              </h6>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th>Degree</th>
                      <th>Institution</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualifications?.map((e) => {
                      return (
                        <tr>
                          <td>{e?.degree?.formName || "-"}</td>
                          <td>{e?.institution?.formName || "-"}</td>
                          <td>{e?.city?.name || "-"}</td>
                          <td>{e?.country?.name || "-"}</td>
                          <td>{e?.startDate || "-"}</td>
                          <td>{e?.endDate || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-t">
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate ml-4"
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}
