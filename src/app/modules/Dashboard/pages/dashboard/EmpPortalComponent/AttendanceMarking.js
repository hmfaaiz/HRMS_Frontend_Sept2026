import { format } from "date-fns";
import React, { useState, useEffect } from "react";

export const AttendanceMarking = () => {
    const [date, setDate] = useState(new Date());
    const [isPresent, setIsPresent] = useState(false); // toggle state

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleToggle = () => {
        setIsPresent((prev) => !prev);
    };

    return (
        <div className="mt-2 rounded-lg p-3 bg-tsecondary flex gap-2">
            <h6 className="font-bold mb-0 text-primary">Attendance</h6>

            <div className="inline-flex me-5 cursor-pointer" onClick={handleToggle}>
                {/* Hidden input just for accessibility */}
                <input type="checkbox" className="sr-only" checked={isPresent} readOnly />

                <div
                    className={`relative w-11 h-6 rounded-full transition-colors
            ${isPresent ? "bg-tprimary" : "bg-tlight"}
          `}
                >
                    <div
                        className={`absolute top-0.5 left-[2px] h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform
              ${isPresent ? "translate-x-full" : "translate-x-0"}
            `}
                    ></div>
                </div>

                <div className="ms-3">
                    <div className="text-sm text-black block">
                        {isPresent ? "Check Out" : "Check In"}
                    </div>
                    <div className="text-black text-sm block">
                        {format(date, "EEEE do MMMM yyyy")}
                    </div>
                    <div className="text-black text-lg font-semibold block">
                        {format(date, "hh:mm:ss a")}
                    </div>
                </div>
            </div>
        </div>
    );
};
