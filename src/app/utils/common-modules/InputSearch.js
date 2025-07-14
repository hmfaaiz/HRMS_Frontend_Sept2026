import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SVG from "react-inlinesvg";

export const InputSearch = ({
    values,
    fieldName = "searchText",
    setFieldValue,
    handleBlur,
    handleSubmit,
}) => {
    return (
        <div className="position-relative col-12" style={{ height: "38px" }}>
            <input
                type="text"
                className="form-control pr-12"
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
                    className="position-absolute mr-5"
                    style={{
                        top: "50%",
                        right: "12px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setFieldValue(fieldName, "");
                        handleSubmit();
                    }

                    }
                >
                    <SVG
                        src={toAbsoluteUrl(
                            "/media/svg/icons/Communication/CancelButton.svg"
                        )}
                        style={{ width: "16px", height: "16px" }}
                        className="svg-icon svg-icon-primary"
                    />
                </span>
            )}
        </div>
    );
};
