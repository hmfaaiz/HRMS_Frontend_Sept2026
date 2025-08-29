import React from "react";
import { CircleX } from "lucide-react";

export const InputSearch = ({
    values,
    fieldName = "searchText",
    setFieldValue,
    handleBlur,
    handleSubmit,
}) => {
    return (
        <div className="position-relative">
            <input
                type="text"
                className="form-control min-w-72"
                name={fieldName}
                placeholder="Search"
                onBlur={handleBlur}
                value={values[fieldName]}
                onChange={(e) => {
                    setFieldValue(fieldName, e.target.value);
                    handleSubmit();
                }}
            />

            {values[fieldName] && (
                <span
                    style={{
                        position: "absolute",
                        right: "18px",
                        top: "40%",
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
