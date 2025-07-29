import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Pen } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as action from "../../../_redux/dashboardActions";

const EmployeeProfile = () => {
  const dispatch = useDispatch();
  // First useEffect: Fetch basic data when selectedEmp changes
  const { user, data } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      data: state?.dashboard?.profileInfo,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(action.fetchProfileInfo(user?.employeeIdMapping));
  }, [user?.employeeIdMapping]);
  return (
    <>
      <div className="d-flex align-items-center p-3 rounded-lg bg-white w-full">
        <div>
          <img
            name="profile_image"
            src={
              data?.profile_image
                ? `${data?.profile_image}`
                : toAbsoluteUrl("/media/users/profileImage.png")
            }
            alt="Profile"
            width={130}
            height={130}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = toAbsoluteUrl("/media/users/profileImage.png");
            }}
          />
          <p className="font-size-xs mt-3 text-center">
            Change Picture <Pen style={{ width: "11px" }} />
          </p>
        </div>
        <div className="text-black mx-5">
          <h5 className="font-weight-boldest text-black">
            {data?.firstName || ""} {data?.middleName || ""}{" "}
            {data?.lastName || ""}
          </h5>
          <p className="text-sm m-0">{data?.designation?.formName || ""}</p>
          <p className="text-sm m-0">
            {" "}
            {data?.city?.name ? data?.city?.name + "," : ""}
            {data?.country?.name || ""}
          </p>
        </div>
      </div>
      <div className="px-5 py-2 rounded-lg bg-white w-full">
        {data ? (
          <div>
            <h6 className="font-weight-bolder">Employee Details</h6>
            <div className="mt-3">
              <h6 className="font-weight-bolder text-primary">
                Office Information
              </h6>
              <Row className="text-sm text-black font-weight-light">
                {/* comapny  */}
                <Col className="font-weight-normal" md={4}>
                  Company
                </Col>
                <Col md={8}>{data?.company?.name || "N/A"}</Col>
                {/* subsidiary  */}
                <Col className="font-weight-normal" md={4}>
                  Subsidiary
                </Col>
                <Col md={8}>{data?.subsidiary.name || "N/A"}</Col>
                {/* Department  */}
                <Col className="font-weight-normal" md={4}>
                  Department
                </Col>
                <Col md={8}>{data?.department?.deptName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Reporting To
                </Col>
                <Col md={8}>
                  {data?.ReportTo?.firstName
                    ? data?.ReportTo?.firstName +
                      " " +
                      data?.ReportTo?.middleName +
                      " " +
                      data?.ReportTo?.lastName
                    : "N/A"}
                </Col>
                <Col className="font-weight-normal" md={4}>
                  Grade
                </Col>
                <Col md={8}>{data?.grade?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Designation
                </Col>
                <Col md={8}>{data?.designation?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Employee Type
                </Col>
                <Col md={8}>{data?.employeeType?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Payroll Group
                </Col>
                <Col md={8}>{data?.payrollGroup?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Team
                </Col>
                <Col md={8}>{data?.team?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Employee Status
                </Col>
                <Col md={8}>{data?.employeeStatus?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Default Shift:
                </Col>
                <Col md={8}>{data?.defaultShift?.name || "N/A"}</Col>
              </Row>
            </div>
            <div className="mt-3">
              <h6 className="font-weight-bolder text-primary">
                Personal Information
              </h6>
              <Row className="text-sm text-black font-weight-light">
                <Col className="font-weight-normal" md={4}>
                  Country
                </Col>
                <Col md={8}>{data?.country?.name || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  City
                </Col>
                <Col md={8}>{data?.city?.name || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Location
                </Col>
                <Col md={8}>{data?.location?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Region
                </Col>
                <Col md={8}>{data?.region?.formName || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Gender
                </Col>
                <Col md={8}>{data?.gender || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Date of joining
                </Col>
                <Col md={8}>
                  {data?.dateOfJoining
                    ? format(new Date(data?.dateOfJoining), "yy-MMM-yyyy")
                    : "N/A"}
                </Col>
                <Col className="font-weight-normal" md={4}>
                  Date of Confirmation
                </Col>
                <Col md={8}>
                  {data?.dateOfConfirmation
                    ? format(new Date(data?.dateOfConfirmation), "yy-MMM-yyyy")
                    : "N/A"}
                </Col>
                <Col className="font-weight-normal" md={4}>
                  Date of Birth
                </Col>
                <Col md={8}>
                  {data?.dateOfBirth
                    ? format(new Date(data?.dateOfBirth), "yy-MMM-yyyy")
                    : "N/A"}
                </Col>
                <Col className="font-weight-normal" md={4}>
                  Id Card No
                </Col>
                <Col md={8}>{data?.nic_no || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Offical Email
                </Col>
                <Col md={8}>{data?.email_official || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Cell No
                </Col>
                <Col md={8}>{data?.phone_cell || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Phone (Home)
                </Col>
                <Col md={8}>{data?.phone_home || "N/A"}</Col>
                <Col className="font-weight-normal" md={4}>
                  Passport No
                </Col>
                <Col md={8}>{data?.passportNo || "N/A"}</Col>
              </Row>
            </div>
          </div>
        ) : (
          <p>Employee Data Not Exists</p> // Improved message for clarity
        )}
        {/* </Accordion> */}
      </div>
    </>
  );
};

export default EmployeeProfile;
