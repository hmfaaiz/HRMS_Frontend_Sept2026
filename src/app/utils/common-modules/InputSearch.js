import React, { useEffect, useRef } from "react";
import { CircleX } from "lucide-react";

export const InputSearch = ({
    values,
    fieldName = "searchText",
    setFieldValue,
    handleBlur,
    handleSubmit,
    debounceDelay = 500,
}) => {
     const firstRenderRef = useRef(true);

  useEffect(() => {
    // initial render par submit na chale
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      handleSubmit();
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [values[fieldName]]);
    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control"
                name={fieldName}
                placeholder="Search"
                onBlur={handleBlur}
                value={values[fieldName]}
                onChange={(e) => {
                    setFieldValue(fieldName, e.target.value);
                    // handleSubmit();
                }}
            />

            {values[fieldName] && (
                <span
                    style={{
                        position: "absolute",
                        right: "7px",
                        top: "45%",
                        transform: "translateY(-50%)",
                        color: "#000000",
                    }}
                    onClick={() => {
                        setFieldValue(fieldName, "");
                        handleSubmit();
                    }

                    }
                >
                <CircleX className="w-4 h-4 text-black cursor-pointer" />
                </span>
            )}
        </div>
    );
};
