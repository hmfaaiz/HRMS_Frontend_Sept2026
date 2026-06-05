import React, { useRef, useState, useEffect, useCallback } from "react";
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

// ── Moved OUTSIDE to prevent recreation on every render ────────────────────

const MultiValue = () => null;

const ClearIndicator = (props) => {
  const selected = props.getValue();
  if (selected?.length > 0) {
    return <components.ClearIndicator {...props} />;
  }
  return null;
};

const ValueContainer = ({ children, selectProps, ...props }) => {
  const selectedValues = props.getValue();
  const allValues = props?.options || [];

  return (
    <components.ValueContainer {...props} selectProps={selectProps}>
      {selectedValues.length > 0 && (
        <div
          title={selectedValues.map((v) => v?.label).join(", ")}
          onClick={() => selectProps.onMenuOpen?.()} // ← change this line
          className="text-[10.4px] text-gray-700 truncate whitespace-nowrap overflow-hidden mr-8"
          style={{ flex: 1 }}
        >
          {allValues?.length === selectedValues?.length
            ? "All"
            : selectedValues.map((v) => v?.label).join(", ")}
        </div>
      )}
      {children}
    </components.ValueContainer>
  );
};

const MenuList = (props) => {
  const { selectProps, children } = props;
  const childrenArray = React.Children.toArray(children);

  const isAllSelected = selectProps.value?.length === selectProps.options?.length && selectProps.options?.length > 0;

  return (
    <components.MenuList {...props}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isAllSelected) return;
          const selectableOptions = selectProps.options.filter(opt => !opt.isDisabled);
          selectProps.onChange(selectableOptions, { action: 'select-option' });
        }}
        style={{
          padding: '5px 10px',
          fontSize: '10.4px',
          cursor: isAllSelected ? 'not-allowed' : 'pointer',
          backgroundColor: isAllSelected ? '#F5F5F5' : '#e6f8ff',
          color: '#374151',
        }}
        onMouseEnter={(e) => {
          if (!isAllSelected) e.target.style.backgroundColor = '#dcdfe0';
        }}
        onMouseLeave={(e) => {
          if (!isAllSelected) e.target.style.backgroundColor = '#e6f8ff';
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        All
      </div>

      <div style={{
        padding: '5px 10px', backgroundColor: '#e6f8ff',
      }}>
        <input
          type="text"
          placeholder="Search..."
          value={selectProps.inputValue}
          onChange={(e) => selectProps.onInputChange(e.target.value, { action: 'input-change' })}
          style={{
            width: '100%',
            padding: '6px',
            fontSize: '10.4px',
            border: '1px solid #dcdfe0',
            borderRadius: '4px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            e.target.focus();
          }}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Enter') {
              e.stopPropagation();
            }
          }}
          autoFocus
        />
      </div>

      {childrenArray.length > 0 ? (
        childrenArray
      ) : (
        <div style={{ padding: '5px 10px', fontSize: '10.4px', color: '#9ca3af', textAlign: 'center' }}>
          No options found
        </div>
      )}
    </components.MenuList>
  );
};

// ───────────────────────────────────────────────────────────────────────────

const CUSTOM_COMPONENTS = { MultiValue, ValueContainer, ClearIndicator, MenuList };

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
  const [searchText, setSearchText] = useState("");

  // Close on outside click (works in modal too)
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, []);

  const classes = useStyles();

  const handleChange = (selected) => {
    if (!selected) {
      onChange([]);
      return;
    }
    onChange([...selected]);
  };

  // Passed via selectProps so ValueContainer can toggle without closure issues
  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const customStyles = {
    control: (base) => ({
      ...base,
      border: error && touched ? "0.5px solid #f64e60" : "0.5px solid #000000",
      backgroundColor: "#e6f8ff",
      fontSize: "10.4px",
      "&:hover": { borderColor: error && touched ? "#f64e60" : "#000000" },
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
    input: (base) => ({ ...base, margin: 0, padding: 0, fontSize: "10.4px", width: 0, opacity: 0 }),
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
    multiValue: (base) => ({ ...base, display: "none", fontSize: "10.4px" }),
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
        options={options}
        value={value}
        onChange={handleChange}
        isDisabled={disabled}
        isLoading={loading}
        styles={customStyles}
        closeMenuOnSelect={false}
        menuShouldCloseOnBlur={false}
        hideSelectedOptions={false}
        isClearable={true}
        isSearchable={false}
        menuIsOpen={menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => {
          // Let the outside click handler manage closing menu
        }}
        onFocus={() => setMenuOpen(true)}
        inputValue={searchText}
        onInputChange={(val, actionMeta) => {
          if (actionMeta.action === "input-change") {
            setSearchText(val);
          }
        }}
        onBlur={(e) => {
          // Do nothing. We rely on the useEffect outside click handler to close the menu.
        }}
        onMenuToggle={handleMenuToggle} // custom prop consumed by ValueContainer
        components={CUSTOM_COMPONENTS} // stable reference — never recreated
        {...props}
      />

      {error && touched ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
    </div>
  );
};

export default MultiSelect;
