import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { formatDates, getUploadUrl, getFileName } from "../../../utils/common";
import {
  fetchAllSubsidiaryData,
  fetchAllCountry,
  fetchAllCity,
  fetchAllFormsMenu,
  fetchAllEmployeeShifts,
  fetchAllDept,
} from "../../../../_metronic/redux/dashboardActions";
import { fetchDataFromEmployeeProfileById, fetchDataFromEmployeeDocumentById, fetchDataFromEmployeeDocumentOriginalById } from "../_redux/redux-Actions";
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
  status,
}) {
  // In HRMS edit mode the form is always read-only (only Approve action is allowed)
  const isReadOnly = isdataForRead || status === "edit" || status === "read";
  const dispatch = useDispatch();
  const { dashboard, Employee_Profile_Workflow_Hrms } = useSelector((state) => state);
  const [currentEmployeeData, setCurrentEmployeeData] = React.useState(null);
  const [currentDocumentData, setCurrentDocumentData] = React.useState([]);
  const [originalDocumentData, setOriginalDocumentData] = React.useState([]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const [pendingAction, setPendingAction] = useState("approve");

  // ── List States ─────────────────────────────────────────────────────────
  const [defContactList, setDefaultContactList] = useState([]);
  const [academicList, setAcademicList] = useState([]);
  const [skillsList, setSkillList] = useState([]);
  const [deferrors, setErrors] = useState({});
  const [documentsList, setDocumentsList] = useState([]);
  const fileInputRefs = useRef({});

  useEffect(() => {
    // Fetch the employee profile data from backend.
    // Backend automatically uses req.user.employeeIdMapping, so we just pass a dummy if none is present
    dispatch(fetchDataFromEmployeeProfileById(employeeId || formData?.employeeId || 0)).then((res) => {
      if (res?.data) {
        setCurrentEmployeeData(res.data);
      }
    });
    // Fetch employee documents (existing + workflow combined)
    dispatch(fetchDataFromEmployeeDocumentById(employeeId || formData?.employeeId || 0)).then((res) => {
      if (res?.data) {
        setCurrentDocumentData(Array.isArray(res.data) ? res.data : []);
      }
    });
    // Fetch original/committed documents only (EmployeeDocModel) — shown in approved view
    dispatch(fetchDataFromEmployeeDocumentOriginalById(employeeId || formData?.employeeId || 0)).then((res) => {
      if (res?.data) {
        setOriginalDocumentData(Array.isArray(res.data) ? res.data : []);
      }
    });
  }, [employeeId, dispatch, formData?.Id, formData?.employeeId]);

  const isApprovedRequest =
    formData?.isApproved === 1 ||
    formData?.isApproved === "1" ||
    formData?.isApproved === true;

  // Populate list states — from saved record (edit mode) or from live profile (create mode)
  useEffect(() => {
    if (isApprovedRequest && currentEmployeeData) {
      // Approved HRMS request: show applied employee profile data
      setDefaultContactList(currentEmployeeData?.employeeContactWorkflow || []);
      setAcademicList(currentEmployeeData?.employeeAcademicWorkflow || []);
      setSkillList(currentEmployeeData?.employeeSkillWorkflow || []);
      // Show original committed documents (EmployeeDocModel) not the pending workflow ones
      setDocumentsList(originalDocumentData);
    } else if (formData?.Id) {
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
      setDocumentsList(currentDocumentData);
    } else if (currentEmployeeData) {
      // Create mode: pre-populate with the employee's existing profile data
      setDefaultContactList(currentEmployeeData?.employeeContactWorkflow || []);
      setAcademicList(currentEmployeeData?.employeeAcademicWorkflow || []);
      setSkillList(currentEmployeeData?.employeeSkillWorkflow || []);
      setDocumentsList(currentDocumentData);
    }
  }, [
    formData?.Id,
    formData?.employeeContactWorkflow,
    formData?.employeeAcademicWorkflow,
    formData?.employeeSkillWorkflow,
    formData?.employeeDocWorkflow,
    currentEmployeeData,
    currentDocumentData,
    originalDocumentData,
    isApprovedRequest,
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
          val[key] = el ? formatDates(el, "dd-MMM-yyyy") : null;

          const start = key === "startDate" ? el : (val.startDate ? new Date(val.startDate) : null);
          const end = key === "endDate" ? el : (val.endDate ? new Date(val.endDate) : null);
          if (start && end) {
            val.lengthInYear = differenceInYears(new Date(end), new Date(start));
            if (val.lengthInYear < 0) val.lengthInYear = 0;
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
          val[key] = el ? formatDates(el, "dd-MMM-yyyy") : null;

          const start = key === "startDate" ? el : (val.startDate ? new Date(val.startDate) : null);
          const end = key === "endDate" ? el : (val.endDate ? new Date(val.endDate) : null);
          if (start && end) {
            val.lengthInMonths = differenceInMonths(new Date(end), new Date(start));
            if (val.lengthInMonths < 0) val.lengthInMonths = 0;
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

  // ── Document Handlers ────────────────────────────────────────────────────
  const addRowDocument = () => {
    setDocumentsList([
      ...documentsList,
      { transactionType: "Document", employeeId: employeeId },
    ]);
  };

  const handleFieldChangedDocument = (index, field, value) => {
    const newList = [...documentsList];
    newList[index][field] = value;
    setDocumentsList(newList);
  };

  const deleteRowDocument = (index) => {
    const data = [...documentsList];
    data.splice(index, 1);
    setDocumentsList([...data]);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };

  // ── Validation Schema ────────────────────────────────────────────────────
  const employeeProfileWorkflowPortalEditSchema = useMemo(() => {
    return Yup.object().shape({});
  }, []);

  const getHighlightClass = (fromVal, toVal) => {
    if (!formData?.Id || isApprovedRequest) return "";
    if (String(fromVal || "").trim() !== String(toVal || "").trim()) {
      return "bg-yellow-300 border-warning";
    }
    return "";
  };

  const workflowChangeKeys = {
    contact: ["relation_name", "relation_text", "contactNo"],
    academic: ["institutionId", "degreeId", "countryId", "cityId", "gpa", "startDate", "endDate", "lengthInYear"],
    skills: ["skill", "description", "ratingScale", "startDate", "endDate", "lengthInMonths"],
    documents: ["docName", "docDesc", "empAttachment"],
  };

  const findOriginalListItem = (originalList, item, index) => {
    if (!Array.isArray(originalList)) return undefined;
    const itemId = item?.Id || item?.id;
    if (itemId != null) {
      return originalList.find((orig) => String(orig?.Id || orig?.id) === String(itemId));
    }
    return originalList[index];
  };

  const hasSectionChanges = (originalList, currentList, keys) => {
    if (!Array.isArray(currentList) || currentList.length === 0) return false;
    return currentList.some((item, index) => {
      const original = findOriginalListItem(originalList, item, index);
      if (!original) {
        return keys.some((key) => String(item?.[key] || "").trim() !== "");
      }
      return keys.some((key) => String(original?.[key] || "").trim() !== String(item?.[key] || "").trim());
    });
  };

  const getWorkflowFieldHighlight = (item, key, originalList, index) => {
    if (isApprovedRequest) return "";
    const original = findOriginalListItem(originalList, item, index);
    if (!original) {
      return String(item?.[key] || "").trim() ? "bg-yellow-300 border-warning" : "";
    }
    return getHighlightClass(original[key], item[key]);
  };

  const contactSectionChanged = useMemo(
    () => isApprovedRequest ? false : hasSectionChanges(currentEmployeeData?.employeeContactWorkflow || [], defContactList, workflowChangeKeys.contact),
    [currentEmployeeData?.employeeContactWorkflow, defContactList, isApprovedRequest]
  );

  const academicSectionChanged = useMemo(
    () => isApprovedRequest ? false : hasSectionChanges(currentEmployeeData?.employeeAcademicWorkflow || [], academicList, workflowChangeKeys.academic),
    [currentEmployeeData?.employeeAcademicWorkflow, academicList, isApprovedRequest]
  );

  const skillsSectionChanged = useMemo(
    () => isApprovedRequest ? false : hasSectionChanges(currentEmployeeData?.employeeSkillWorkflow || [], skillsList, workflowChangeKeys.skills),
    [currentEmployeeData?.employeeSkillWorkflow, skillsList, isApprovedRequest]
  );

  // Documents section: highlight heading if any pending workflow docs exist
  const documentsSectionChanged = useMemo(() => {
    if (isApprovedRequest) return false;
    // Backend tags rows from EmployeeDocModelWorkflow with _isWorkflow: true
    return documentsList.some((d) => d._isWorkflow === true);
  }, [documentsList, isApprovedRequest]);

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
        setPendingAction(status === "edit" ? "approve" : "save");
        setShowConfirm(true);
      }}
    >
      {({ handleSubmit, values, handleChange }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isReadOnly}>

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
                    <label className={`mb-0 whitespace-nowrap ${getHighlightClass(formData?.fromMaritalStatusId, values.maritalStatus)}`} style={{ width: "120px", flexShrink: 0 }}>Marital Status:</label>
                    <div className="flex-1">
                      <select
                        className={`form-control ${getHighlightClass(formData?.fromMaritalStatusId, values.maritalStatus)}`}
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
                    <label className={`mb-0 whitespace-nowrap ${getHighlightClass(formData?.fromPhoneHome, values.phoneHome)}`} style={{ width: "120px", flexShrink: 0 }}>Phone (Home):</label>
                    <div className="flex-1">
                      <input
                        className={`form-control ${getHighlightClass(formData?.fromPhoneHome, values.phoneHome)}`}
                        type="text"
                        name="phoneHome"
                        placeholder="Enter home phone"
                        disabled={isdataForRead}
                        value={values.phoneHome}
                        onChange={handleChange}
                      />
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
                    <label className={`mb-0 whitespace-nowrap ${getHighlightClass(formData?.fromPhoneCell, values.cellNo)}`} style={{ width: "120px", flexShrink: 0 }}>Cell No:</label>
                    <div className="flex-1">
                      <input
                        className={`form-control ${getHighlightClass(formData?.fromPhoneCell, values.cellNo)}`}
                        type="text"
                        name="cellNo"
                        placeholder="Enter cell number"
                        disabled={isdataForRead}
                        value={values.cellNo}
                        onChange={handleChange}
                      />
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
                    <label className={`mb-0 whitespace-nowrap ${getHighlightClass(formData?.fromEmailPersonal, values.personalEmail)}`} style={{ width: "120px", flexShrink: 0 }}>Personal Email:</label>
                    <div className="flex-1">
                      <input
                        className={`form-control ${getHighlightClass(formData?.fromEmailPersonal, values.personalEmail)}`}
                        type="email"
                        name="personalEmail"
                        placeholder="Enter personal email"
                        disabled={isdataForRead}
                        value={values.personalEmail}
                        onChange={handleChange}
                      />
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
                    <label className={`mb-0 whitespace-nowrap ${getHighlightClass(formData?.fromAddress, values.address)}`} style={{ width: "120px", flexShrink: 0 }}>Address:</label>
                    <div className="flex-1">
                      <input
                        className={`form-control ${getHighlightClass(formData?.fromAddress, values.address)}`}
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
                    <h6 className={`font-bold mb-0 text-primary ${contactSectionChanged ? "bg-yellow-300 border-warning" : ""}`}>
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
                        </tr>
                        {defContactList?.map((obj, rightindex) => {
                          const isFromBackend = !!(obj.Id || obj.id);
                          return (
                            <React.Fragment key={rightindex}>
                              <tr>
                                <td>
                                  <input
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "relation_name", currentEmployeeData?.employeeContactWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "relation_text", currentEmployeeData?.employeeContactWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "contactNo", currentEmployeeData?.employeeContactWorkflow || [], rightindex)}`}
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      const newValue = e.target.value.trim();
                                      const isDuplicate = defContactList.some(
                                        (c, idx) => c.contactNo?.trim() === newValue && idx !== rightindex
                                      );
                                      if (isDuplicate) {
                                        setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: "Duplicate contact number not allowed!" }));
                                      } else {
                                        handleFieldChangedContact(rightindex, "contactNo", newValue);
                                        setErrors((prev) => ({ ...prev, [`contactNo-${rightindex}`]: "" }));
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
                    <h6 className={`font-bold mb-0 text-primary ${academicSectionChanged ? "bg-yellow-300 border-warning" : ""}`}>
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
                        </tr>
                        {academicList?.map((obj, rightindex) => {
                          const isFromBackend = !!(obj.Id || obj.id);
                          return (
                            <React.Fragment key={rightindex}>
                              <tr>
                                <td>
                                  <select
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "institutionId", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "degreeId", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "countryId", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "cityId", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "gpa", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
                                    type="text"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, "gpa", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`gpa-${rightindex}`]: "" }));
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "startDate", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "endDate", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "lengthInYear", currentEmployeeData?.employeeAcademicWorkflow || [], rightindex)}`}
                                    type="number"
                                    disabled={isFromBackend || isdataForRead}
                                    onChange={(e) => {
                                      handleFieldChangedAcademic(rightindex, "lengthInYear", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`lengthInYear-${rightindex}`]: "" }));
                                    }}
                                    value={obj.lengthInYear || ""}
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
                    <h6 className={`font-bold mb-0 text-primary ${skillsSectionChanged ? "bg-yellow-300 border-warning" : ""}`}>
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
                        </tr>
                        {skillsList?.map((obj, rightindex) => {
                          const isFromBackend = !!(obj.Id || obj.id);
                          return (
                            <React.Fragment key={rightindex}>
                              <tr>
                                <td>
                                  <input
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "skill", currentEmployeeData?.employeeSkillWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "description", currentEmployeeData?.employeeSkillWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "ratingScale", currentEmployeeData?.employeeSkillWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "startDate", currentEmployeeData?.employeeSkillWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "endDate", currentEmployeeData?.employeeSkillWorkflow || [], rightindex)}`}
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
                                    className={`form-control ${getWorkflowFieldHighlight(obj, "lengthInMonths", currentEmployeeData?.employeeSkillWorkflow || [], rightindex)}`}
                                    type="number"
                                    disabled={isFromBackend || isdataForRead || !!(obj.startDate || obj.endDate)}
                                    onChange={(e) => {
                                      handleFieldChangedSkills(rightindex, "lengthInMonths", e.target.value);
                                      setErrors((prev) => ({ ...prev, [`lengthInMonths-${rightindex}`]: "" }));
                                    }}
                                    value={obj.lengthInMonths || ""}
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


                {/* ══════════════════════════════════════
                    EMPLOYEE DOCUMENT
                ══════════════════════════════════════ */}
                <hr className="my-4" />
                <div className="w-full overflow-x-auto">
                  <div className="flex justify-between items-center">
                    <h6 className={`font-bold mb-0 text-primary ${documentsSectionChanged ? "bg-yellow-300 border-warning" : ""}`}>
                      Employee Document
                    </h6>
                    {!isdataForRead && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="Document"
                        onClick={addRowDocument}
                      >
                        <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                        Add
                      </button>
                    )}
                  </div>
                  <div className="w-full overflow-x-auto mt-2">
                    <div className="react-bootstrap-table table-responsive">
                      <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <thead>
                          <tr className="custom-table-header">
                            <td className="min-w-40">Document Name</td>
                            <td className="min-w-40">Document Description</td>
                            <td className="min-w-40">Document Upload Date</td>
                            <td className="min-w-40">Employee Attachment</td>
                          </tr>
                        </thead>
                        <tbody>
                          {documentsList?.map((obj, rightindex) => {
                            const isFromBackend = !!(obj.Id || obj.id);
                            return (
                              <React.Fragment key={rightindex}>
                                <tr>
                                  {/* Document Name */}
                                  <td>
                                    <input
                                      className="form-control"
                                      type="text"
                                      disabled={isFromBackend || isdataForRead}
                                      placeholder="Document name"
                                      onChange={(e) => {
                                        handleFieldChangedDocument(rightindex, "docName", e.target.value);
                                        setErrors((prev) => ({ ...prev, [`docName-${rightindex}`]: "" }));
                                      }}
                                      value={obj.docName || ""}
                                      id={"docName-" + rightindex}
                                    />
                                    {deferrors[`docName-${rightindex}`] && (
                                      <div className="form-feedBack">{deferrors[`docName-${rightindex}`]}</div>
                                    )}
                                  </td>

                                  {/* Document Description */}
                                  <td>
                                    <input
                                      className="form-control"
                                      type="text"
                                      disabled={isFromBackend || isdataForRead}
                                      placeholder="Description"
                                      onChange={(e) => {
                                        handleFieldChangedDocument(rightindex, "docDesc", e.target.value);
                                      }}
                                      value={obj.docDesc || ""}
                                      id={"docDesc-" + rightindex}
                                    />
                                  </td>

                                  {/* Document Upload Date */}
                                  <td>
                                    <input
                                      className="form-control"
                                      type="text"
                                      disabled={true}
                                      placeholder="-"
                                      value={obj.createdAt ? formatDates(obj.createdAt, "dd-MMM-yyyy") : ""}
                                      readOnly
                                    />
                                  </td>

                                  {/* Employee Attachment */}
                                  <td style={{ minWidth: "200px" }}>
                                    {!isFromBackend && !isdataForRead && (
                                      <>
                                        {/* Hidden real file input */}
                                        <input
                                          type="file"
                                          accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                                          style={{ display: "none" }}
                                          id={`empAttachment-input-${rightindex}`}
                                          ref={(el) => (fileInputRefs.current[rightindex] = el)}
                                          onChange={(e) => {
                                            const file = e.currentTarget.files[0];
                                            if (file) {
                                              const maxSizeBytes = 0.5 * 1024 * 1024; // 0.5 MB
                                              if (file.size > maxSizeBytes) {
                                                setErrors((prev) => ({ ...prev, [`empAttachment-${rightindex}`]: "File size must not exceed 0.5 MB." }));
                                                e.currentTarget.value = ""; // reset input
                                              } else {
                                                setErrors((prev) => ({ ...prev, [`empAttachment-${rightindex}`]: "" }));
                                                handleFieldChangedDocument(rightindex, "empAttachment", file);
                                              }
                                            }
                                          }}
                                        />
                                        {/* Browse button */}
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={() =>
                                            document.getElementById(`empAttachment-input-${rightindex}`).click()
                                          }
                                        >
                                          Browse
                                        </button>
                                      </>
                                    )}

                                    {/* Show file name / preview link */}
                                    {obj.empAttachment && (
                                      <div className="mt-1" style={{ fontSize: "0.8rem" }}>
                                        {typeof obj.empAttachment === "string" ? (
                                          // Already saved on backend — show link
                                          <a
                                            href={getUploadUrl(obj.empAttachment)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary"
                                          >
                                            {getFileName(obj.empAttachment)}
                                          </a>
                                        ) : (
                                          // Newly selected File object — show name
                                          <span className="text-muted"> {obj.empAttachment.name}</span>
                                        )}
                                      </div>
                                    )}
                                    {deferrors[`empAttachment-${rightindex}`] && (
                                      <div className="form-feedBack">{deferrors[`empAttachment-${rightindex}`]}</div>
                                    )}
                                  </td>

                                  {/* Delete */}
                                  <td className="text-right">
                                    {!isFromBackend && !isdataForRead && (
                                      <button
                                        className="border-none bg-transparent"
                                        type="button"
                                        id={`doc-del-${rightindex}`}
                                        onClick={() => deleteRowDocument(rightindex)}
                                      >
                                        <Trash2 className="w-4 h-4 text-black cursor-pointer" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
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
            {!isdataForRead && status === "edit" && (
              <button
                type="button"
                onClick={() => {
                  setPendingAction("reject");
                  setShowConfirm(true);
                }}
                className="btn btn-danger mr-2"
                disabled={actionsLoading}
              >
                {loading && pendingAction === "reject" ? (
                  <span>
                    Reject
                    <span className="ml-3 spinner spinner-white" />
                  </span>
                ) : (
                  "Reject"
                )}
              </button>
            )}
            {!isdataForRead && (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={actionsLoading}
              >
                {loading && pendingAction !== "reject" ? (
                  <span>
                    {status === "edit" ? "Approve" : "Save"}
                    <span className="ml-3 spinner spinner-white" />
                  </span>
                ) : (
                  status === "edit" ? "Approve" : "Save"
                )}
              </button>
            )}
          </Modal.Footer>

          <ConfirmationDialog
            show={showConfirm}
            onHide={() => setShowConfirm(false)}
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              enableLoading();
              // HRMS only sends Id + isApproved — all data is already stored in the workflow tables from the portal submission
              const payload = {
                Id: formData?.Id,
                isApproved: pendingAction === "reject" ? 2 : (pendingAction === "approve" ? 1 : 0),
              };
              saveForm(payload);
            }}
            message={
              pendingAction === "reject"
                ? "Are you sure you want to reject this profile change request?"
                : status === "edit"
                  ? "Are you sure you want to approve this profile change request?"
                  : "Are you sure you want to submit this profile change request?"
            }
            title={
              pendingAction === "reject"
                ? "Confirm Rejection"
                : status === "edit"
                  ? "Confirm Approval"
                  : "Confirm Request"
            }
            confirmText={
              pendingAction === "reject"
                ? "Reject"
                : status === "edit"
                  ? "Approve"
                  : "Confirm"
            }
          />
        </>
      )}
    </Formik>
  );
}
