import React, { useEffect } from "react";
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
      <div className="p-3 rounded-lg bg-white w-full">
        <div className="d-flex align-items-center ">
          <div>
            <img
              name="profile_image"
              src={
                data?.profile_image
                  ? `${data?.profile_image}`
                  : toAbsoluteUrl("/media/users/profileImage.png")
              }
              alt="Profile"
              width={120}
              height={120}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = toAbsoluteUrl("/media/users/profileImage.png");
              }}
            />
          </div>
          <div className="text-black mx-5">
            <h5 className="font-weight-boldest text-black">
              {data?.firstName || ""} {data?.middleName || ""}{" "}
              {data?.lastName || ""}
            </h5>
            <p className="text-sm m-0">{data?.department?.deptName || ""}</p>
            <p className="text-sm m-0">{data?.designation?.formName || ""}</p>
          </div>
        </div>
        {/* <p className="font-size-xs mt-3">
          Change Picture <Pen style={{ width: "11px" }} />
        </p> */}
      </div>
      <div className="px-5 py-2 rounded-lg bg-white w-full">
        {data ? (
          <div>
            <h5 className="font-weight-bolder m-0 py-1">Employee Details</h5>
            {/* Office Information */}
            <div className="mt-4">
              <h6 className="font-bold mb-0 text-primary my-2">
                Office Information
              </h6>
              <div className="grid grid-cols-2 text-sm text-black gap-y-2 mt-2">
                <div className="font-medium">Company</div>
                <div>{data?.company?.name || "N/A"}</div>

                <div className="font-medium">Subsidiary</div>
                <div>{data?.subsidiary?.name || "N/A"}</div>

                <div className="font-medium">Reporting To</div>
                <div>
                  {data?.ReportTo?.firstName
                    ? `${data?.ReportTo?.firstName} ${data?.ReportTo?.middleName} ${data?.ReportTo?.lastName}`
                    : "N/A"}
                </div>

                <div className="font-medium">Grade</div>
                <div>{data?.grade?.formName || "N/A"}</div>

                <div className="font-medium">Employee Type</div>
                <div>{data?.employeeType?.formName || "N/A"}</div>

                <div className="font-medium">Payroll Group</div>
                <div>{data?.payrollGroup?.formName || "N/A"}</div>

                <div className="font-medium">Team</div>
                <div>{data?.team?.formName || "N/A"}</div>

                <div className="font-medium">Employee Status</div>
                <div>{data?.employeeStatus?.formName || "N/A"}</div>

                <div className="font-medium">Default Shift</div>
                <div>{data?.defaultShift?.name || "N/A"}</div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mt-6">
              <h6 className="font-bold mb-0 text-primary my-2">
                Personal Information
              </h6>
              <div className="grid grid-cols-2 text-sm text-black gap-y-2 mt-2">
                <div className="font-medium">Country</div>
                <div>{data?.country?.name || "N/A"}</div>

                <div className="font-medium">City</div>
                <div>{data?.city?.name || "N/A"}</div>

                <div className="font-medium">Location</div>
                <div>{data?.location?.formName || "N/A"}</div>

                <div className="font-medium">Region</div>
                <div>{data?.region?.formName || "N/A"}</div>

                <div className="font-medium">Gender</div>
                <div>{data?.gender || "N/A"}</div>

                <div className="font-medium">Date of Joining</div>
                <div>
                  {data?.dateOfJoining
                    ? format(new Date(data?.dateOfJoining), "yy-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">Date of Confirmation</div>
                <div>
                  {data?.dateOfConfirmation
                    ? format(new Date(data?.dateOfConfirmation), "yy-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">Date of Birth</div>
                <div>
                  {data?.dateOfBirth
                    ? format(new Date(data?.dateOfBirth), "dd-MMM-yyyy")
                    : "N/A"}
                </div>

                <div className="font-medium">ID Card No</div>
                <div>{data?.nic_no || "N/A"}</div>

                <div className="font-medium">Official Email</div>
                <div>{data?.email_official || "N/A"}</div>

                <div className="font-medium">Cell No</div>
                <div>{data?.phone_cell || "N/A"}</div>

                <div className="font-medium">Phone (Home)</div>
                <div>{data?.phone_home || "N/A"}</div>

                <div className="font-medium">Passport No</div>
                <div>{data?.passportNo || "N/A"}</div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-500">Employee Data Not Exists</p>
        )}

        {/* </Accordion> */}
      </div>
    </>
  );
};

export default EmployeeProfile;
