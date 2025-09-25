import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import * as action from "../../../_redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";
import { toast } from "react-toastify";

export const AttendanceMarking = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const { currentAtt, isAttendanceLocation } = useSelector(
    (state) => ({
      currentAtt: state?.dashboard?.currentAtt,
      isAttendanceLocation:
        state?.auth?.user?.EmployeeMapping?.subsidiary?.isAttendanceLocation,
    }),
    shallowEqual
  );

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(action.getAttendance(setLoading));
  }, []);

  const handleToggle = () => {
    setLoading(true);
    if (isAttendanceLocation) {
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
            Status: currentAtt?.Status == "01" ? "02" : "01",
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };

          dispatch(action?.createAttendance(body, setLoading));
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
        Status: currentAtt?.Status == "01" ? "02" : "01",
      };
      dispatch(action?.createAttendance(body, setLoading));
    }
  };

  return (
    <div className="mt-2 rounded-lg p-3 bg-tsecondary flex gap-2 relative">
      <h6 className="font-bold mb-0 text-primary">Attendance</h6>

      <div className="inline-flex me-5 relative">
        {/* Toggle */}
        <div className="checkbox-wrapper-3">
          <input
            type="checkbox"
            id="cbx-3"
            disabled={loading}
            checked={currentAtt?.Status == "01"}
            onChange={handleToggle}
          />
          <label htmlFor="cbx-3" className="toggle">
            <span></span>
          </label>
        </div>

        {/* Info section */}
        <div className="ms-3">
          <div className="text-sm text-black block">
            {currentAtt?.Status == "01" ? "Check Out" : "Check In"}
          </div>
          <div className="text-black text-sm block">
            {format(date, "EEEE do MMMM yyyy")}
          </div>
          <div className="text-black text-lg font-semibold block">
            {format(date, "hh:mm:ss a")}
          </div>
        </div>

        {/* Inline loader over toggle */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-tsecondary/90 rounded-lg">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};
