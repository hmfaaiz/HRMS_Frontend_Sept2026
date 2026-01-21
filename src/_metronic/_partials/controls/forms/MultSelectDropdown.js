import React, { useRef, useState, useEffect } from "react";
import Select, { components } from "react-select";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {},
  label: {
    display: "block",
    marginBottom: "4px",
    fontWeight: 500,
    color: "#374151",
  },
}));

const MultiSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  touched,
  disabled = false,
  loading = false,
  ...props
}) => {
  const wrapperRef = useRef(null);
  const selectRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);

  // CLOSE on outside click (works in modal too)
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current) return;

      // if click is outside wrapper => close
      if (!wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);

        // also blur select (extra safety)
        if (selectRef.current?.blur) selectRef.current.blur();
      }
    };

    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, []);

  const classes = useStyles();

  const allOption = { label: "All", value: "" };
  const isAllSelected =
    value?.length === options?.length && options?.length > 0;

  const optionsWithAll = [
    { ...allOption, isDisabled: isAllSelected },
    ...options,
  ];

  const handleChange = (selected) => {
    if (!selected) {
      onChange([]);
      return;
    }

    // ALL selected
    if (selected.some((opt) => opt.value === "")) {
      onChange([...options]); //  clone
      return;
    }

    onChange([...selected]); // clone
  };

  /* ---------- Custom Value Container (FIX) ---------- */
  const ValueContainer = ({ children, ...props }) => {
    const selectedValues = props.getValue();

    return (
      <components.ValueContainer {...props}>
        {selectedValues.length > 0 ? (
          <div
            title={selectedValues?.map((v) => v?.label)?.join(", ")}
            onClick={(e)=> setMenuOpen(!menuOpen)}
            className="text-[10.4px] text-gray-700 truncate whitespace-nowrap overflow-hidden mr-8"
          >
            {selectedValues?.map((v) => v?.label)?.join(", ")}
          </div>
        ) : (
          children
        )}
      </components.ValueContainer>
    );
  };

  /* ---------- Hide badges ---------- */
  const MultiValue = () => null;

  // Show clear button whenever at least 1 value is selected
  const ClearIndicator = (props) => {
    if (value?.length > 0) {
      return <components.ClearIndicator {...props} />;
    }
    return null;
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: error ? "0.5px solid #000000" : "0.5px solid #000000", // same border always
      backgroundColor: disabled ? "#e6f8ff" : "#e6f8ff",
      fontSize: "10.4px",
      "&:hover": { borderColor: error ? "#000000" : "#000000" }, // matches default border
      boxShadow: "none",
      minHeight: "initial",
      borderRadius: "0.32rem",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0.27rem 0.5rem",
      fontSize: "10.4px",
      cursor: "pointer",
    }),
    input: (base) => ({ ...base, margin: 0, padding: 0, fontSize: "10.4px" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "10.4px" }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      borderRadius: "6px",
      fontSize: "10.4px",
      marginTop: "2px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#0093DD"
        : state.isFocused
        ? "#dcdfe0"
        : state.isDisabled
        ? "#F5F5F5"
        : "#e6f8ff",
      color: state.isSelected ? "white" : "#374151",
      padding: "5px 10px",
      fontSize: "10.4px",
      "&:active": { backgroundColor: "#000000", color: "white" },
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    multiValue: (base) => ({ ...base, display: "none", fontSize: "10.4px" }), // hide badges
    // CUSTOM INDICATOR STYLES
    clearIndicator: (base) => ({
      ...base,
      padding: "0px 1px",
      width: "15px",
      color: "#000000",
      alignItems: "flex-start",
      position: "absolute",
      top: "2px",
      right: "12px",
      cursor: "pointer",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0px 1px",
      width: "15px",
      color: "#000000",
      alignItems: "flex-start",
      position: "absolute",
      top: "2px",
      right: "2px",
      cursor: "pointer",
    }),
  };

  return (
    <div ref={wrapperRef} className={classes.container}>
      {label && <label className={classes.label}>{label}</label>}

      <Select
        ref={selectRef}
        isMulti
        options={optionsWithAll}
        value={value}
        onChange={handleChange}
        isDisabled={disabled}
        isLoading={loading}
        styles={customStyles}
        closeMenuOnSelect={false}
        menuShouldCloseOnBlur={true}
        hideSelectedOptions={false}
        isClearable={true}
        isSearchable={true}
        menuIsOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        onFocus={() => setMenuOpen(true)}
        onBlur={() => setMenuOpen(false)}
        components={{
          MultiValue,
          ValueContainer,
          ClearIndicator,
        }}
        {...props}
      />
      {error && touched ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
