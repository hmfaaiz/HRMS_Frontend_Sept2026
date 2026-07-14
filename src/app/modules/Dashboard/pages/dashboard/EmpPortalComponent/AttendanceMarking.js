import { addDays, format, subDays } from "date-fns";
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import { formatDates, formatTime } from "../../../../../utils/common";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

export const AttendanceMarking = () => {
  const { attRecord, currentDateTime } = useSelector(
    (state) => ({
      attRecord: state?.dashboard?.currentAtt,
      currentDateTime: state?.dashboard?.currentDateTime,
    }),
    shallowEqual,
  );

  const attendanceDetail = attRecord?.attendanceDetail;
  const currentShift = attRecord?.currentShift;
  const localDate = currentDateTime;
  const allowedAnywhere = attRecord?.allowedAnywhere;
  const isLateReasonAllow = attRecord?.isLateReasonAllow;
  const recordAlreadyExist = attRecord?.recordAlreadyExist;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);

  const reasons = [
  "Late due to rain",
  "Late due to traffic",
  "Late due to bike / car issue",
  "Others",
];

const [showLateModal, setShowLateModal] = useState(false);
const [selectedReason, setSelectedReason] = useState("");
const [otherReason, setOtherReason] = useState("");
const [pendingAttendanceBody, setPendingAttendanceBody] = useState(null);

  // server/current time ko state me set karna
  useEffect(() => {
    if (localDate?.dateTime) {
      setDate(new Date(localDate.dateTime));
    }
  }, [localDate]);

  // clock ko har second update karna
  useEffect(() => {
    if (!date) return;

    const timer = setInterval(() => {
      setDate((prev) => new Date(prev.getTime() + 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [date]);

  useEffect(() => {
    dispatch(action.getCurrentTimeAndAttendance(setLoading));
  }, [dispatch]);

   const defaultShift = attRecord?.defaultShift;
  const shiftStartHour = defaultShift?.earlyIn;
  const shiftEndHour = defaultShift?.earlyOut;

 

    const isLateOrEarly = (
    status,
    shiftHour,
  ) => {
    if (!shiftHour) return false;

    const shiftHourNum = parseInt(shiftHour.slice(0, 2));
    const shiftMinNum = parseInt(shiftHour.slice(2, 4));

    const now = new Date();
    const shiftTime = new Date();
    shiftTime.setHours(shiftHourNum, shiftMinNum, 0, 0);
console.log("now",now,"shiftTime",shiftTime)
    if (status === "01") {
      return now > shiftTime;
    } else {
      return now < shiftTime;
    }
  };

  // const handleToggle = () => {
  //   setLoading(true);

  //   const now = new Date();

  //   const attendanceBody = {
  //     AttDate: formatDates(now),
  //     AttDateTesting: now,
  //     Time: now,
  //     Status: attendanceDetail?.Status === "01" ? "02" : "01",
  //   };

  //   const onSuccess = () => {
  //     dispatch(action.getCurrentTimeAndAttendance(setLoading));
  //   };

  //   if (!allowedAnywhere) {
  //     if (!navigator.geolocation) {
  //       toast.error("Location is not supported on this device.");
  //       setLoading(false);
  //       return;
  //     }

  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const body = {
  //           ...attendanceBody,
  //           lat: position.coords.latitude,
  //           long: position.coords.longitude,
  //         };

  //         dispatch(action.createAttendance(body, setLoading)).then(onSuccess);
  //       },
  //       (error) => {
  //         if (error.code === error.PERMISSION_DENIED) {
  //           toast.error(
  //             "Location is not enabled. Please enable location services.",
  //           );
  //         } else if (error.code === error.POSITION_UNAVAILABLE) {
  //           toast.error("Location information is unavailable.");
  //         } else if (error.code === error.TIMEOUT) {
  //           toast.error("Location request timed out.");
  //         } else {
  //           toast.error("An unknown error occurred while getting location.");
  //         }

  //         setLoading(false);
  //       },
  //     );
  //   } else {
  //     dispatch(action.createAttendance(attendanceBody, setLoading)).then(
  //       onSuccess,
  //     );
  //   }
  // };

  const submitAttendance = (attendanceBody) => {
  const onSuccess = () => {
    dispatch(action.getCurrentTimeAndAttendance(setLoading));
  };

  if (!allowedAnywhere) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const body = {
          ...attendanceBody,
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };

        dispatch(action.createAttendance(body, setLoading)).then(onSuccess);
      },
      () => {
        toast.error("Unable to get location");
        setLoading(false);
      },
    );
  } else {
    dispatch(action.createAttendance(attendanceBody, setLoading)).then(
      onSuccess,
    );
  }
};

const handleToggle = () => {
  setLoading(true);

  const now = new Date();

  const isLate = isLateOrEarly(
    attendanceDetail?.Status === "01" ? "02" : "01",
    shiftStartHour
  );

  const attendanceBody = {
    AttDate: formatDates(now),
    // AttDateTesting: now,
    // Time: now,
    AttDateTesting: format(now, "yyyy-MM-dd HH:mm:ss"),
    Time: format(now, "HH:mm:ss"),
    Status: attendanceDetail?.Status === "01" ? "02" : "01",
    isLate,
  };
console.log("attendanceBody11111",attendanceBody)
  if (isLate && attendanceBody.Status === "01" && isLateReasonAllow && !recordAlreadyExist) {
    setPendingAttendanceBody(attendanceBody);
    setShowLateModal(true);
    setLoading(false);
    return;
  }

  submitAttendance({
    ...attendanceBody,
    lateRemarks: "",
    isForWorkFLow: false,
  });
};

const handleLateReasonSubmit = () => {
  if (!selectedReason) {
    toast.error("Please select a reason");
    return;
  }

  const finalReason =
    selectedReason === "Others"
      ? otherReason.trim()
      : selectedReason;

  if (!finalReason) {
    toast.error("Please enter reason");
    return;
  }

  setShowLateModal(false);

  submitAttendance({
    ...pendingAttendanceBody,
    lateRemarks: finalReason,
    isForWorkFLow: true,
  });

  setSelectedReason("");
  setOtherReason("");
  setPendingAttendanceBody(null);
};
  const getShiftRangeDisplay = (currentShift) => {
    if (!currentShift?.shiftDetail || !currentShift?.date) return null;

    const {
      name,
      shiftCode,
      visibleEndTime,
      visibleStartTime,
      shiftStart,
      shiftEnd,
    } = currentShift.shiftDetail;

    const shiftDate = new Date(currentShift.date);
    const isOvernightShift = shiftStart > shiftEnd;

    let fromDate = format(shiftDate, "dd-MMM-yyyy");
    let toDate = format(shiftDate, "dd-MMM-yyyy");
    let attendanceTagDate = format(shiftDate, "dd-MMM-yyyy");

    if (isOvernightShift) {
      toDate = format(addDays(shiftDate, 1), "dd-MMM-yyyy");
    }

    return {
      name,
      shiftCode,
      fromDate,
      toDate,
      visibleStartTime,
      visibleEndTime,
      attendanceTagDate,
      isOvernightShift,
    };
  };

  const shiftInfo = getShiftRangeDisplay(currentShift);

  return (
    <>
    <Modal
  show={showLateModal}
  onHide={() => setShowLateModal(false)}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Late Check In Reason</Modal.Title>
  </Modal.Header>

<Modal.Body>
  <div>
    <label className="form-label">Select Reason</label>

    <select
      className="form-control"
      value={selectedReason}
      onChange={(e) => setSelectedReason(e.target.value)}
    >
      <option value="">Select Reason</option>

      {reasons.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>

    {selectedReason === "Others" && (
      <textarea
        className="form-control mt-3"
        rows={3}
        placeholder="Enter reason..."
        value={otherReason}
        onChange={(e) => setOtherReason(e.target.value)}
      />
    )}
  </div>
</Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowLateModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="primary"
      onClick={handleLateReasonSubmit}
    >
      Submit
    </Button>
  </Modal.Footer>
</Modal>
      <div className="mt-2 rounded-lg p-3 bg-tsecondary grid grid-cols-4 gap-2 relative">
      <h6 className="font-bold mb-0 text-primary">Attendance</h6>

      <div className="inline-flex me-5 relative col-span-3">
        {date && (
          <>
            <div className="checkbox-wrapper-3">
              <input
                type="checkbox"
                id="cbx-3"
                disabled={loading}
                checked={attendanceDetail?.Status === "01"}
                onChange={handleToggle}
              />
              <label htmlFor="cbx-3" className="toggle">
                <span></span>
              </label>
            </div>

            <div className="ms-3">
              <div className="text-sm text-black block">
                {attendanceDetail?.Status === "01" ? "Check Out" : "Check In"}
              </div>

              <div className="text-black text-sm block">
                {format(date, "EEEE do MMMM yyyy")}
              </div>

              <div className="text-black text-lg font-semibold block">
                {format(date, "hh:mm:ss a")}
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-tsecondary/90 rounded-lg">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="col-span-4 text-tprimary">
        {shiftInfo && !loading && (
          <>
            <p className="text-xs mb-0">
              Range of Shift:{" "}
              <strong>
                {shiftInfo.shiftCode} - {shiftInfo.name}
              </strong>{" "}
              is scheduled
            </p>

            <p className="text-xs mb-1">
              From
              <strong>
                {" "}
                {shiftInfo.fromDate} {formatTime(shiftInfo.visibleStartTime)}
              </strong>{" "}
              to
              <strong>
                {" "}
                {shiftInfo.toDate} {formatTime(shiftInfo.visibleEndTime)}
              </strong>
            </p>

            <p className="text-xs mb-0">
              Attendance will be recorded in{" "}
              <strong>{shiftInfo.attendanceTagDate}</strong> attendance entry.
            </p>
          </>
        )}
      </div>
    </div>
    </>
  
  );
};
