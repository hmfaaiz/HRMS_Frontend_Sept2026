import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { formatDates } from "../../../utils/common";
import {
  fetchAllSubsidiaryData,
  fetchAllCountry,
  fetchAllCity,
  fetchAllFormsMenu,
  fetchAllEmployeeShifts,
  fetchAllDept,
} from "../../../../_metronic/redux/dashboardActions";
import { fetchDataFromEmployeeProfileById } from "../_redux/redux-Actions";
import EmployeeProfile from "../../../utils/common-modules/EmployeeProfile";
import DatePicker from "react-datepicker";
import { differenceInYears, differenceInMonths } from "date-fns";
import { CirclePlus, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "../../../../_metronic/_partials/controls/forms/ConfirmationDialog";

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
  employeeId,
  panelMode,
}) {
  const dispatch = useDispatch();
  const { dashboard, Employee_Profile_Workflow_Portal } = useSelector((state) => state);
  const [currentEmployeeData, setCurrentEmployeeData] = React.useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  // ── List States ─────────────────────────────────────────────────────────
  const [defContactList, setDefaultContactList] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [skillsList, setSkillList] = useState([]);
  const [deferrors, setErrors] = useState({});

  useEffect(() => {
    // Fetch the employee profile data from backend.
    // Backend automatically uses req.user.employeeIdMapping, so we just pass a dummy if none is present
    dispatch(fetchDataFromEmployeeProfileById(employeeId || formData?.employeeId || 0)).then((res) => {
      if (res?.data) {
        setCurrentEmployeeData(res.data);
      }
    });
  }, [employeeId, dispatch, formData?.Id, formData?.employeeId]);

  // Populate list states — from saved record (edit mode) or from live profile (create mode)
  useEffect(() => {
    if (formData?.Id) {
      // Edit mode: use keys saved on the workflow record
      setDefaultContactList(
        formData?.employeeContactWorkflow || formData?.employeeContacts || []
      );
      setAcademicList(
        formData?.employeeAcademicWorkflow || formData?.employeeAcademics || []
      );
      setSkillList(
        formData?.employeeSkillWorkflow || formData?.employeeSkills || []
      );
    } else if (currentEmployeeData) {
      // Create mode: pre-populate with the employee's existing profile data
      setDefaultContactList(currentEmployeeData?.employeeContactWorkflow || []);
      setAcademicList(currentEmployeeData?.employeeAcademicWorkflow || []);
      setSkillList(currentEmployeeData?.employeeSkillWorkflow || []);
    }
  }, [
    formData?.Id,
    formData?.employeeContactWorkflow,
    formData?.employeeAcademicWorkflow,
    formData?.employeeSkillWorkflow,
    currentEmployeeData,
  ]);

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllCountry());
    dispatch(fetchAllCity());
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(fetchAllEmployeeShifts("allJobShiftList"));
    dispatch(fetchAllFormsMenu(86, "allRegionChildMenus"));
    dispatch(fetchAllFormsMenu(174, "allTeamsChildMenus"));
    dispatch(fetchAllFormsMenu(190, "allMaritalStatus"));
    dispatch(fetchAllFormsMenu(109, "allInstitution"));
    dispatch(fetchAllFormsMenu(108, "allDegreeTitle"));
  }, [dispatch]);

  // ── Contact Handlers ─────────────────────────────────────────────────────
  const addRowContact = () => {
    setDefaultContactList([
      ...defContactList,
      { transactionType: "Other", employeeId: employeeId },
    ]);
  };

  const handleFieldChangedContact = (index, field, value) => {
    const newContactList = [...defContactList];
    newContactList[index][field] = value;
    setDefaultContactList(newContactList);
  };

  const deleteRowContact = (index) => {
    const data = [...defContactList];
    data.splice(index, 1);
    setDefaultContactList([...data]);
  };

  const getServicePeriod = (start, end, isYear) => {
    if (!start || !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    let totalMonths = years * 12 + months;
    const maxDaysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
    const fraction = days > 0 ? days / maxDaysInMonth : 0;

    totalMonths += fraction;
    if (isYear) {
      const lengthInYears = parseFloat((totalMonths / 12).toFixed(2));
      return lengthInYears >= 0 ? lengthInYears : 0;
    } else {
      const lengthInMonths = Math.round(totalMonths * 10) / 10;
      return lengthInMonths >= 0 ? lengthInMonths : 0;
    }
  };

  // ── Academic Handlers ────────────────────────────────────────────────────
  const addRowAcademic = () => {
    setAcademicList([
      ...academicList,
      { transactionType: "Academic", employeeId: employeeId },
    ]);
  };

  const handleDatePickerAcademic = (el, key, index) => {
    setAcademicList([
      ...academicList.map((val, ind) => {
        if (ind === index) {
          let sd = key === "startDate" ? el : (val.startDate ? new Date(val.startDate) : null);
          let ed = key === "endDate" ? el : (val.endDate ? new Date(val.endDate) : null);

          val[key] = el ? formatDates(el, "dd-MMM-yyyy") : null;

          if (sd && ed) {
            val.lengthInYear = getServicePeriod(sd, ed, true);
          } else {
            val.lengthInYear = "";
          }
        }
        return val;
      }),
    ]);
  };

  const handleFieldChangedAcademic = (index, field, value) => {
    const newList = [...academicList];
    newList[index][field] = value;
    if (field === "countryId") {
      newList[index]["cityId"] = null;
      newList[index]["city"] = "";
    }
    setAcademicList(newList);
  };

  const deleteRowAcademic = (index) => {
    const data = [...academicList];
    data.splice(index, 1);
    setAcademicList([...data]);
  };

  // ── Skills Handlers ──────────────────────────────────────────────────────
  const addRowSkills = () => {
    setSkillList([
      ...skillsList,
      { transactionType: "Skills", employeeId: employeeId },
    ]);
  };

  const handleDatePickerSkills = (el, key, index) => {
    setSkillList([
      ...skillsList.map((val, ind) => {
        if (ind === index) {
          let sd = key === "startDate" ? el : (val.startDate ? new Date(val.startDate) : null);
          let ed = key === "endDate" ? el : (val.endDate ? new Date(val.endDate) : null);

          val[key] = el ? formatDates(el, "dd-MMM-yyyy") : null;

          if (sd && ed) {
            val.lengthInMonths = getServicePeriod(sd, ed, false);
          } else {
            val.lengthInMonths = "";
          }
        }
        return val;
      }),
    ]);
  };

  const handleFieldChangedSkills = (index, field, value) => {
    const newList = [...skillsList];
    newList[index][field] = value;
    setSkillList(newList);
  };

  const deleteRowSkills = (index) => {
    const data = [...skillsList];
    data.splice(index, 1);
    setSkillList([...data]);
  };

  // ── Validation Schema ────────────────────────────────────────────────────
  const employeeProfileWorkflowPortalEditSchema = useMemo(() => {
    return Yup.object().shape({
      phoneHome: Yup.string()
        .nullable()
        .matches(/^[0-9]*$/, "Must contain only digits")
        .max(15, "Must be at most 15 characters long"),
      cellNo: Yup.string()
        .nullable()
        .matches(/^[0-9]*$/, "Must contain only digits")
        .max(15, "Must be at most 15 characters long"),
      personalEmail: Yup.string()
        .nullable()
        .email("Invalid email address"),
    });
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        maritalStatus: formData?.toMaritalStatusId || formData?.maritalStatus || currentEmployeeData?.maritalStatus || "",
        phoneHome: formData?.toPhoneHome || formData?.phoneHome || currentEmployeeData?.phone_home || "",
        cellNo: formData?.toPhoneCell || formData?.cellNo || currentEmployeeData?.phone_cell || "",
        personalEmail: formData?.toEmailPersonal || formData?.personalEmail || currentEmployeeData?.email_personal || "",
        address: formData?.toAddress || formData?.address || currentEmployeeData?.additional_summary || "",
      }}
      validationSchema={employeeProfileWorkflowPortalEditSchema}
      onSubmit={(values) => {
        setPendingValues(values);
        setShowConfirm(true);
      }}
    >
      {({ handleSubmit, values, handleChange, errors, touched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isdataForRead}>

                {/* ══════════════════════════════════════
                    PERSONAL INFORMATION (From / To)
                ══════════════════════════════════════ */}
                <h6 className="font-bold mb-0 text-primary my-2 mt-4">
                  Personal Information
                </h6>
                <hr className="mt-1 mb-2" />

                {/* Sub-header row */}
                <div className="grid md:grid-cols-2 gap-x-12 mb-2">
                  <span className="text-black" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Current
                  </span>
                  <span className="text-black" style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                    Requested Change
                  </span>
                </div>

                {/* ── Marital Status ── */}
                <div className="grid md:grid-cols-2 gap-x-12 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "120px", flexShrink: 0 }}>Marital Status:</label>
                    <p className="text-sm font-bold mb-0">
                      {dashboard?.allMaritalStatus?.find(
                        (m) => String(m.value) === String(formData?.Id ? formData?.fromMaritalStatusId : currentEmployeeData?.maritalStatus)
                      )?.label || (formData?.Id ? formData?.fromMaritalStatusId : currentEmployeeData?.maritalStatus) || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "120px", flexShrink: 0 }}>Marital Status:</label>
                    <div className="flex-1">
                      <select
                        className="form-control"
                        name="maritalStatus"
                        disabled={isdataForRead}
                        value={values.maritalStatus}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {dashboard?.allMaritalStatus?.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Phone (Home) ── */}
                <div className="grid md:grid-cols-2 gap-x-12 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "120px", flexShrink: 0 }}>Phone (Home):</label>
                    <p className="text-sm font-bold mb-0">
                      {(formData?.Id ? formData?.fromPhoneHome : currentEmployeeData?.phone_home) || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "120px", flexShrink: 0 }}>Phone (Home):</label>
                    <div className="flex-1">
                      <input
                        className="form-control"
                        type="text"
                        name="phoneHome"
                        placeholder="Enter home phone"
                        disabled={isdataForRead}
                        value={values.phoneHome}
                        onChange={handleChange}
                      />
                      {errors.phoneHome && touched.phoneHome && (
                        <div className="form-feedBack" style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
                          {errors.phoneHome}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Cell No ── */}
                <div className="grid md:grid-cols-2 gap-x-12 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "120px", flexShrink: 0 }}>Cell No:</label>
                    <p className="text-sm font-bold mb-0">
                      {(formData?.Id ? formData?.fromPhoneCell : currentEmployeeData?.phone_cell) || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "120px", flexShrink: 0 }}>Cell No:</label>
                    <div className="flex-1">
                      <input
                        className="form-control"
                        type="text"
                        name="cellNo"
                        placeholder="Enter cell number"
                        disabled={isdataForRead}
                        value={values.cellNo}
                        onChange={handleChange}
                      />
                      {errors.cellNo && touched.cellNo && (
                        <div className="form-feedBack" style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
                          {errors.cellNo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Personal Email ── */}
                <div className="grid md:grid-cols-2 gap-x-12 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "120px", flexShrink: 0 }}>Personal Email:</label>
                    <p className="text-sm font-bold mb-0">
                      {(formData?.Id ? formData?.fromEmailPersonal : currentEmployeeData?.email_personal) || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "120px", flexShrink: 0 }}>Personal Email:</label>
                    <div className="flex-1">
                      <input
                        className="form-control"
                        type="email"
                        name="personalEmail"
                        placeholder="Enter personal email"
                        disabled={isdataForRead}
                        value={values.personalEmail}
                        onChange={handleChange}
                      />
                      {errors.personalEmail && touched.personalEmail && (
                        <div className="form-feedBack" style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}>
                          {errors.personalEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Address ── */}
                <div className="grid md:grid-cols-2 gap-x-12 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap font-normal" style={{ width: "120px", flexShrink: 0 }}>Address:</label>
                    <p className="text-sm font-bold mb-0">
                      {(formData?.Id ? formData?.fromAddress : currentEmployeeData?.additional_summary) || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="mb-0 whitespace-nowrap" style={{ width: "120px", flexShrink: 0 }}>Address:</label>
                    <div className="flex-1">
                      <input
                        className="form-control"
                        type="text"
                        name="address"
                        placeholder="Enter address"
                        disabled={isdataForRead}
                        value={values.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* ══════════════════════════════════════
                    EMERGENCY CONTACT INFORMATION
                ══════════════════════════════════════ */}
                <div className="w-full overflow-x-auto">
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Emergency Contact Information
                    </h6>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="Other"
                      onClick={addRowContact}
                    >
                      <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                      Add
                    </button>
                  </div>
                  <div className="w-full overflow-x-auto mt-2">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          <td className="min-w-40">Name</td>
                          <td className="min-w-40">Relation</td>
                          <td className="min-w-40">Contact No</td>
                          <td className="text-right">Action</td>
                        </tr>
                        {defContactList?.map((obj, rightindex) => {
                          const isFromBackend = !!(obj.Id || obj.id);
                          return (
                            <React.Fragment key={rightindex}>
                              <tr>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      handleFieldChangedContact(rightindex, "relation_name", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`relation_name-${rightindex}`]: "" }));
                                    }}
                                    value={obj.relation_name || ""}
                                  />
                                  {deferrors[`relation_name-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`relation_name-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      handleFieldChangedContact(rightindex, "relation_text", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`relation_text-${rightindex}`]: "" }));
                                    }}
                                    value={obj.relation_text || ""}
                                  />
                                  {deferrors[`relation_text-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`relation_text-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      const newValue = e.target.value.trim();
                                      handleFieldChangedContact(rightindex, "contactNo", newValue);
                                      if (newValue && !/^[0-9]*$/.test(newValue)) {
                                        setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: "Must contain only digits" }));
                                      } else if (newValue && (newValue.length < 7 || newValue.length > 15)) {
                                        setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: "Contact No must be between 7 to 15 digits" }));
                                      } else {
                                        const isDuplicate = defContactList.some(
                                          (c, idx) => c.contactNo?.trim() === newValue && idx !== rightindex
                                        );
                                        if (isDuplicate) {
                                          setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: "Duplicate contact number not allowed!" }));
                                        } else {
                                          setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: "" }));
                                        }
                                      }
                                    }}
                                    value={obj.contactNo || ""}
                                  />
                                  {deferrors[`contactNo-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`contactNo-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td className="text-right">
                                  {!isFromBackend && (
                                    <button
                                      id={rightindex}
                                      onClick={() => deleteRowContact(rightindex)}
                                      className="border-none bg-transparent"
                                      type="button"
                                    >
                                      <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* ══════════════════════════════════════
                    ACADEMIC INFO
                ══════════════════════════════════════ */}
                <div className="w-full overflow-x-auto">
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Academic Info
                    </h6>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="Academic"
                      onClick={addRowAcademic}
                    >
                      <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                      Add
                    </button>
                  </div>
                  <div className="w-full overflow-x-auto mt-2">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          <td className="min-w-40">Institution</td>
                          <td className="min-w-40">Degree</td>
                          <td className="min-w-40">Country</td>
                          <td className="min-w-40">City</td>
                          <td className="min-w-40">CGPA</td>
                          <td className="min-w-40">Start Date</td>
                          <td className="min-w-40">End Date</td>
                          <td className="min-w-40">Length In Year</td>
                          <td className="text-right">Action</td>
                        </tr>
                        {academicList?.map((obj, rightindex) => {
                          const isFromBackend = !!(obj.Id || obj.id);
                          return (
                            <React.Fragment key={rightindex}>
                              <tr>
                                <td>
                                  <select
                                    className="form-control"
                                    disabled={isFromBackend || isdataForRead}
                                    value={obj.institutionId || ""}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, "institutionId", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`institutionId-${rightindex}`]: "" }));
                                    }}
                                    id={"institutionId-" + rightindex}
                                  >
                                    <option value="">Select</option>
                                    {dashboard.allInstitution?.map((x) => (
                                      <option key={x.value} value={x.value}>{x.label}</option>
                                    ))}
                                  </select>
                                  {deferrors[`institutionId-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`institutionId-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className="form-control"
                                    disabled={isFromBackend || isdataForRead}
                                    value={obj.degreeId || ""}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, "degreeId", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`degreeId-${rightindex}`]: "" }));
                                    }}
                                    id={"degreeId-" + rightindex}
                                  >
                                    <option value="">Select</option>
                                    {dashboard.allDegreeTitle?.map((x) => (
                                      <option key={x.value} value={x.value}>{x.label}</option>
                                    ))}
                                  </select>
                                  {deferrors[`degreeId-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`degreeId-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className="form-control"
                                    disabled={isFromBackend || isdataForRead}
                                    value={obj.countryId || ""}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, "countryId", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`countryId-${rightindex}`]: "" }));
                                    }}
                                    id={"countryId-" + rightindex}
                                  >
                                    <option value="">Select</option>
                                    {dashboard.allCountry?.map((x) => (
                                      <option key={x.value} value={x.value}>{x.label}</option>
                                    ))}
                                  </select>
                                  {deferrors[`countryId-A-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`countryId-A-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className="form-control"
                                    disabled={isFromBackend || isdataForRead}
                                    value={obj.cityId || ""}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, "cityId", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`cityId-${rightindex}`]: "" }));
                                    }}
                                    id={"cityId-" + rightindex}
                                  >
                                    <option value="">Select</option>
                                    {dashboard.allCity?.map((x) => {
                                      if (String(x.code) === String(obj.countryId)) {
                                        return <option key={x.value} value={x.value}>{x.label}</option>;
                                      }
                                      return null;
                                    })}
                                  </select>
                                  {deferrors[`cityId-A-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`cityId-A-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleFieldChangedAcademic(rightindex, "gpa", val);
                                      if (val && !/^[0-9.]*$/.test(val)) {
                                        setErrors((prev) => ({ ...prev, [`gpa-${rightindex}`]: "Must contain only digits/decimal" }));
                                      } else {
                                        setErrors((prev) => ({ ...prev, [`gpa-${rightindex}`]: "" }));
                                      }
                                    }}
                                    value={obj.gpa || ""}
                                    id={"gpa-" + rightindex}
                                  />
                                  {deferrors[`gpa-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`gpa-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="Start Date"
                                    selected={obj?.startDate ? new Date(obj?.startDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerAcademic(el, "startDate", rightindex)}
                                    id={"startDate_A-" + rightindex}
                                    dateFormat="dd-MMM-yyyy"
                                    name="startDate"
                                    disabled={isFromBackend || isdataForRead}
                                    autoComplete="off"
                                    maxDate={new Date()}
                                  />
                                  {deferrors[`startDate-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`startDate-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="End Date"
                                    selected={obj?.endDate ? new Date(obj?.endDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerAcademic(el, "endDate", rightindex)}
                                    id={"endDate_A-" + rightindex}
                                    dateFormat="dd-MMM-yyyy"
                                    name="endDate"
                                    disabled={isFromBackend || isdataForRead}
                                    autoComplete="off"
                                    minDate={obj?.startDate ? new Date(obj?.startDate) : null}
                                  />
                                  {deferrors[`endDate-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`endDate-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead || !!(obj.startDate || obj.endDate)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleFieldChangedAcademic(rightindex, "lengthInYear", val);
                                      if (val) {
                                        if (!/^\d+(\.\d{1,2})?$/.test(val)) {
                                          setErrors((prev) => ({ ...prev, [`lengthInYear-${rightindex}`]: "Must be a valid number" }));
                                        } else if (parseFloat(val) < 0) {
                                          setErrors((prev) => ({ ...prev, [`lengthInYear-${rightindex}`]: "Cannot be negative" }));
                                        } else if (parseFloat(val) > 99.99) {
                                          setErrors((prev) => ({ ...prev, [`lengthInYear-${rightindex}`]: "Must be less than 100" }));
                                        } else {
                                          setErrors((prev) => ({ ...prev, [`lengthInYear-${rightindex}`]: "" }));
                                        }
                                      } else {
                                        setErrors((prev) => ({ ...prev, [`lengthInYear-${rightindex}`]: "" }));
                                      }
                                    }}
                                    value={obj.lengthInYear !== undefined && obj.lengthInYear !== null ? obj.lengthInYear : ""}
                                    id={"lengthInYear-" + rightindex}
                                  />
                                  {deferrors[`lengthInYear-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`lengthInYear-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td className="text-right">
                                  {!isFromBackend && (
                                    <button
                                      className="border-none bg-transparent"
                                      type="button"
                                      id={rightindex}
                                      onClick={() => deleteRowAcademic(rightindex)}
                                    >
                                      <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* ══════════════════════════════════════
                    EMPLOYEE SKILLS
                ══════════════════════════════════════ */}
                <div className="w-full overflow-x-auto">
                  <div className="flex justify-between items-center">
                    <h6 className="font-bold mb-0 text-primary">
                      Employee Skills
                    </h6>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="Skills"
                      onClick={addRowSkills}
                    >
                      <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                      Add
                    </button>
                  </div>
                  <div className="w-full overflow-x-auto mt-2">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr className="custom-table-header">
                          <td className="min-w-40">Skill</td>
                          <td className="min-w-40">Description</td>
                          <td className="min-w-40">Rating</td>
                          <td className="min-w-40">Start Date</td>
                          <td className="min-w-40">End Date</td>
                          <td className="min-w-40">Length In Months</td>
                          <td className="text-right">Action</td>
                        </tr>
                        {skillsList?.map((obj, rightindex) => {
                          const isFromBackend = !!(obj.Id || obj.id);
                          return (
                            <React.Fragment key={rightindex}>
                              <tr>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, "skill", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`skill-${rightindex}`]: "" }));
                                    }}
                                    value={obj.skill || ""}
                                    id={"skill-" + rightindex}
                                  />
                                  {deferrors[`skill-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`skill-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, "description", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`description-${rightindex}`]: "" }));
                                    }}
                                    value={obj.description || ""}
                                    id={"description-" + rightindex}
                                  />
                                  {deferrors[`description-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`description-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className="form-control"
                                    disabled={isFromBackend || isdataForRead}
                                    value={obj.ratingScale || ""}
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, "ratingScale", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`ratingScale-${rightindex}`]: "" }));
                                    }}
                                    id={"ratingScale-" + rightindex}
                                  >
                                    <option value="">Select</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                      <option key={n} value={n}>{n}</option>
                                    ))}
                                  </select>
                                  {deferrors[`ratingScale-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`ratingScale-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="Start Date"
                                    selected={obj?.startDate ? new Date(obj?.startDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerSkills(el, "startDate", rightindex)}
                                    id={"startDate_S-" + rightindex}
                                    dateFormat="dd-MMM-yyyy"
                                    name="startDate"
                                    disabled={isFromBackend || isdataForRead}
                                    autoComplete="off"
                                    maxDate={new Date()}
                                  />
                                  {deferrors[`startDate-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`startDate-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <DatePicker
                                    className="form-control"
                                    placeholder="End Date"
                                    selected={obj?.endDate ? new Date(obj?.endDate) : null}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                    onChange={(el) => handleDatePickerSkills(el, "endDate", rightindex)}
                                    id={"endDate_S-" + rightindex}
                                    dateFormat="dd-MMM-yyyy"
                                    name="endDate"
                                    disabled={isFromBackend || isdataForRead}
                                    autoComplete="off"
                                    minDate={obj?.startDate ? new Date(obj?.startDate) : null}
                                  />
                                  {deferrors[`endDate-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`endDate-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    disabled={isFromBackend || isdataForRead || !!(obj.startDate || obj.endDate)}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      handleFieldChangedSkills(rightindex, "lengthInMonths", val);
                                      if (val) {
                                        if (!/^\d+(\.\d{1,2})?$/.test(val)) {
                                          setErrors((prev) => ({ ...prev, [`lengthInMonths-${rightindex}`]: "Must be a valid number" }));
                                        } else if (parseFloat(val) < 0) {
                                          setErrors((prev) => ({ ...prev, [`lengthInMonths-${rightindex}`]: "Cannot be negative" }));
                                        } else if (parseFloat(val) > 1200) {
                                          setErrors((prev) => ({ ...prev, [`lengthInMonths-${rightindex}`]: "Must be less than 1200" }));
                                        } else {
                                          setErrors((prev) => ({ ...prev, [`lengthInMonths-${rightindex}`]: "" }));
                                        }
                                      } else {
                                        setErrors((prev) => ({ ...prev, [`lengthInMonths-${rightindex}`]: "" }));
                                      }
                                    }}
                                    value={obj.lengthInMonths !== undefined && obj.lengthInMonths !== null ? obj.lengthInMonths : ""}
                                    id={"lengthInMonths-" + rightindex}
                                  />
                                  {deferrors[`lengthInMonths-${rightindex}`] && (
                                    <div className="form-feedBack">{deferrors[`lengthInMonths-${rightindex}`]}</div>
                                  )}
                                </td>
                                <td className="text-right">
                                  {!isFromBackend && (
                                    <button
                                      className="border-none bg-transparent"
                                      type="button"
                                      id={rightindex}
                                      onClick={() => deleteRowSkills(rightindex)}
                                    >
                                      <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>

              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light btn-elevate"
              disabled={actionsLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={actionsLoading || isdataForRead}
            >
              {loading ? (
                <span>
                  Save
                  <span className="ml-3 spinner spinner-white" />
                </span>
              ) : (
                "Save"
              )}
            </button>
          </Modal.Footer>

          <ConfirmationDialog
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              enableLoading();
              const payload = {
                employeeContacts: defContactList.filter(c => !c.Id && !c.id),
                employeeAcademics: academicList.filter(a => !a.Id && !a.id),
                employeeSkills: skillsList.filter(s => !s.Id && !s.id),
                // Map current fields (from)
                fromMaritalStatus: formData?.Id ? (formData.fromMaritalStatusId || formData.fromMaritalStatus) : (currentEmployeeData?.maritalStatus || ""),
                fromPhoneHome: formData?.Id ? formData.fromPhoneHome : (currentEmployeeData?.phone_home || ""),
                fromPhoneCell: formData?.Id ? formData.fromPhoneCell : (currentEmployeeData?.phone_cell || ""),
                fromEmailPersonal: formData?.Id ? formData.fromEmailPersonal : (currentEmployeeData?.email_personal || ""),
                fromAddress: formData?.Id ? formData.fromAddress : (currentEmployeeData?.additional_summary || ""),
                // Map requested fields (to)
                toMaritalStatus: pendingValues?.maritalStatus,
                toPhoneHome: pendingValues?.phoneHome,
                toPhoneCell: pendingValues?.cellNo,
                toEmailPersonal: pendingValues?.personalEmail,
                toAddress: pendingValues?.address,
              };
              if (formData?.Id) {
                payload.Id = formData.Id;
              }
              saveForm(payload);
            }}
            message="Are you sure you want to submit this profile update request?"
            title="Confirm Request"
          />
        </>
      )}
    </Formik>
  );
}
