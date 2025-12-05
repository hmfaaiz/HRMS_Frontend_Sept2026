import { addDays, format, subDays } from "date-fns";
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import { formatDates, formatTime } from "../../../../../utils/common";
import { toast } from "react-toastify";

export const AttendanceMarking = () => {
  const { attRecord } = useSelector(
    (state) => ({
      attRecord: state?.dashboard?.currentAtt,
    }),
    shallowEqual
  );
  const attendanceDetail = attRecord?.attendanceDetail;
  const currentShift = attRecord?.currentShift;
  const localDate = attRecord?.localDate;
  const allowedAnywhere = attRecord?.allowedAnywhere;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);

  // 1. Update date when API updates
  useEffect(() => {
    if (localDate) {
      setDate(new Date(localDate));
    }
  }, [localDate]);

  useEffect(() => {
    if (!date) return;

    const timer = setInterval(() => {
      setDate((prev) => new Date(prev.getTime() + 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [!!date]);

  useEffect(() => {
    dispatch(action.getAttendance(setLoading));
  }, []);

  const handleToggle = () => {
    setLoading(true);
    if (!allowedAnywhere) {
      if (!navigator.geolocation) {
        toast.error("Location is not supported on this device.");
        setLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const now = new Date();
          const body = {
            AttDate: formatDates(now),
            AttDateTesting: now,
            Time: now,
            Status: attendanceDetail?.Status == "01" ? "02" : "01",
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };

          dispatch(action?.createAttendance(body, setLoading)).then(() => {
            dispatch(action.getAttendance(setLoading));
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.error(
              "Location is not enabled. Please enable location services."
            );
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            toast.error("Location information is unavailable.");
          } else if (error.code === error.TIMEOUT) {
            toast.error("Location request timed out.");
          } else {
            toast.error("An unknown error occurred while getting location.");
          }
          setLoading(false);
        }
      );
    } else {
      const now = new Date();
      const body = {
        AttDate: formatDates(now),
        AttDateTesting: now,
        Time: now,
        Status: attendanceDetail?.Status == "01" ? "02" : "01",
      };
      dispatch(action?.createAttendance(body, setLoading)).then(() => {
        dispatch(action.getAttendance(setLoading));
      });
    }
  };

  const getShiftRangeDisplay = (currentShift) => {
    if (!currentShift?.shiftDetail || !currentShift?.date) return null;

    const {
      shiftStart,
      shiftEnd,
      name,
      shiftCode,
      visibleEndTime,
      visibleStartTime,
    } = currentShift.shiftDetail;

    const shiftDate = new Date(currentShift.date);

    const isCrossDay = currentShift?.name === "today" ? true : false;

    // Start Date
    const fromDate =
      // isCrossDay
      // ?
      format(shiftDate, "dd-MMM-yyyy");
    // : format(subDays(shiftDate, 1), "dd-MMM-yyyy");

    // End Date
    const toDate =
      //  isCrossDay
      // ?
      format(addDays(shiftDate, 1), "dd-MMM-yyyy");
    // : format(shiftDate, "dd-MMM-yyyy");

    // Attendance Tag Date
    const attendanceTagDate = format(shiftDate, "dd-MMM-yyyy");

    return {
      name,
      shiftCode,
      fromDate,
      toDate,
      visibleEndTime,
      visibleStartTime,
      attendanceTagDate,
    };
  };
  const shiftInfo = getShiftRangeDisplay(currentShift);

  return (
    <div className="mt-2 rounded-lg p-3 bg-tsecondary grid grid-cols-4 gap-2 relative">
      <h6 className="font-bold mb-0 text-primary">Attendance</h6>
      <div className="inline-flex me-5 relative col-span-3">
        {/* Toggle */}
        <div className="checkbox-wrapper-3">
          <input
            type="checkbox"
            id="cbx-3"
            disabled={loading}
            checked={attendanceDetail?.Status == "01"}
            onChange={handleToggle}
          />
          <label htmlFor="cbx-3" className="toggle">
            <span></span>
          </label>
        </div>

        {/* Info section */}
        <div className="ms-3">
          <div className="text-sm text-black block">
            {attendanceDetail?.Status == "01" ? "Check Out" : "Check In"}
          </div>
          <div className="text-black text-sm block">
            {date && format(date, "EEEE do MMMM yyyy")}
          </div>
          <div className="text-black text-lg font-semibold block">
            {date && format(date, "hh:mm:ss a")}
          </div>
        </div>

        {/* Inline loader over toggle */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-tsecondary/90 rounded-lg">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="col-span-4 text-tprimary">
        {shiftInfo && !loading && (
          <>
            <p className="text-xs  mb-0">
              Shift Range of Shift : {shiftInfo.name}-{shiftInfo.shiftCode}
            </p>
            <p className="text-xs  mb-1">
              {" "}
              From {shiftInfo.fromDate}{" "}
              {formatTime(shiftInfo?.visibleStartTime)} to {shiftInfo.toDate}{" "}
              {formatTime(shiftInfo.visibleEndTime)}
            </p>

            <p className="text-xs  mb-0">
              Attendance marked will be tagged in {shiftInfo.attendanceTagDate}{" "}
              Attendance record.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
