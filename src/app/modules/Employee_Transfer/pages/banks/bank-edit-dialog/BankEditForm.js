import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea, Checkbox } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { toast } from "react-toastify";

import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllEarningDeductionList,
  fetchAllEarningHeads,
  fetchAllDeductionList,
  fetchAllEarningList,
  fetchAllDept,

} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { useBanksUIContext } from "../BanksUIContext";
// // import { CheckBox } from "@material-ui/icons";
import axios from 'axios';
export const USERS_URL = process.env.REACT_APP_API_URL;

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const formValidation = Yup.object().shape(
  {

    // transferCategory: Yup.string()
    //   .required("Required*"),
    // employeeId: Yup.number()
    //   .required("Required*"),
    transferType: Yup.string()
      .required("Required*"),
    transferDate: Yup.string()
      .required("Required*"),

    // basicFactorEarn: Yup.number()
    //   .max(100, 'Value cannot be greater than 100')
    //   .required('basic Factor is required')

  },

);
export function BankEditForm({
  saveEmployeeTransfer,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
  id
}) {
  const { dashboard } = useSelector((state) => state);
  const BanksUIContext = useBanksUIContext()
  const ModalUIProps = useMemo(() => {
    return {
      newButtonEarningTran: BanksUIContext.newButtonEarningTran,
      newButtonDeductionTran: BanksUIContext.newButtonDeductionTran,
    }
  }, [BanksUIContext])
  const dispatch = useDispatch();
  const [defTillEffectiveDate, setTillEffectiveDate] = useState(false);

  const [defEmployeeGrade = null, setDefualtEmployeeGrade] = useState(null);
  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(null);

  const [defEarningList = null, setDefaultEarningList] = useState([]);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defReportTo = null, setDefaultReportTo] = useState(null);

  const [defCountry, setDefaultCountry] = useState({});
  const [defCity, setDefaultCity] = useState({});
  const [defDept = null, setDefaultDept] = useState(null);
  const [defchildMenus = null, setDefaultChildMenus] = useState(null);
  const [defchildTeamMenus = null, setDefaultChildTeamsMenus] = useState(null);

  const [defchildRegionMenus = null, setDefaultChildRegionMenus] = useState(null);
  const [defchildReligionMenus = null, setDefaultChildReligionMenus] = useState(null);
  const [defchildEmptypeMenus = null, setDefaultChildEmpTypeMenus] = useState(null);
  const [defchildLocationMenus = null, setDefaultChildLocationMenus] = useState(null);
  const [defDateOfTransfer, setDateOfTransferDate] = useState(null);
  const [defDesignation = null, setDefaultDesignation] = useState(null);
  const [defEmpProfileList = null, SetDefaultEmpProfileList] = useState(null);
  const [defCompanyList = null, SetDefaulCompanyList] = useState(null);


  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllDept(1));
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // For All Grade Codes
      dispatch(fetchAllFormsMenu(84, "allChildMenus")); // For Payroll Group
      dispatch(fetchAllFormsMenu(174, "allTeamsChildMenus")); // For Teams
      dispatch(fetchAllFormsMenu(86, "allRegionChildMenus")); // For Region
      dispatch(fetchAllFormsMenu(87, "allReligionChildMenus")); // For Religion
      dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus")); // For EmployeeType
      dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // For Location
      dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsisidaries
      dispatch(fetchAllFormsMenu(158, "allDesignations")); // For All Designations
      dispatch(fetchAllFormsMenu(165, "allCompanyList")); // For All Companies

      dispatch(fetchAllCountry());
      dispatch(fetchAllActiveEmployees());
    }
  }, [dispatch]);


  //======================= Employee Type

  useEffect(() => {
    const emptypeId = defchildEmptypeMenus?.value ? defchildEmptypeMenus.value : user.employeeTypeId_To;
    setDefaultChildEmpTypeMenus(
      dashboard.allEmpTypeChildMenus &&
      dashboard.allEmpTypeChildMenus.filter((item) => {
        return item.value === emptypeId;
      })
    );

  }, [user?.employeeTypeId_To, dashboard.employeeTypeId_To]);
  //======================= End

  useEffect(() => {

    const subsidiaryId = defSubsidiary?.value ? defSubsidiary.value : user.subsidiaryId_To;
    console.log("subsidiaryId123", user);

    setDefualtSubsidiaryList(
      dashboard.allSubidiaryList &&
      dashboard.allSubidiaryList.filter((item) => {
        return item.value === subsidiaryId;
      })
    );

  }, [user?.subsidiaryId_To, dashboard.subsidiaryId_To]);

  useEffect(() => {

    const companyId = defCompanyList?.value ? defCompanyList.value : user.companyId_To;

    SetDefaulCompanyList(
      dashboard.allCompanyList &&
      dashboard.allCompanyList.filter((item) => {
        return item.value === companyId;
      })
    );

  }, [user?.companyId_To, dashboard.companyId_To]);

  useEffect(() => {
    const gradeId = defEmployeeGrade?.value ? defEmployeeGrade.value : user.gradeId_To;
    setDefualtEmployeeGrade(
      dashboard.allEmployeeGradeList &&
      dashboard.allEmployeeGradeList.filter((item) => {
        return item.value === gradeId;
      })
    );

  }, [user?.gradeId_To, dashboard.gradeId_To]);

  useEffect(() => {
    const locationId = defchildLocationMenus?.value ? defchildLocationMenus.value : user.locationId_To;
    setDefaultChildLocationMenus(
      dashboard.allLocationChildMenus &&
      dashboard.allLocationChildMenus.filter((item) => {
        return item.value === locationId;
      })
    );

  }, [user?.locationId_To, dashboard.locationId_To]);
  //======================= End

  useEffect(() => {
    if (user.cityId) {
    
    }
  }, [user.cityId, dispatch]);

  //===== Date Of Till date
  useEffect(() => {

    if (user.tillTransferDate) {
      setTillEffectiveDate(new Date(user.tillTransferDate));
    }
  }, [user.tillTransferDate]);

  //=========== END


  // This method is used for when edit record and get selected dept where id save in DB

  useEffect(() => {
    const employeeId = defEmployee?.value ? defEmployee.value : user.employeeId;

    setEmployeeDefault(
      dashboard.allEmployees &&
      dashboard.allEmployees.filter((item) => {
        return item.value === employeeId;
      })
    );

  }, [user?.employeeId, dashboard.employeeId]);


  useEffect(() => {
    const deptId = defDept?.value ? defDept.value : user.departmentId_To;
    console.log("deptID", deptId);
    setDefaultDept(
      dashboard.allDept &&
      dashboard.allDept.filter((item) => {
        return item.value === deptId;
      })
    );

  }, [user?.departmentId_To, dashboard.departmentId_To]);

  useEffect(() => {
    const countryId = defCountry?.value ? defCountry.value : user.countryId_To;
    setDefaultCountry(
      dashboard.allCountry &&
      dashboard.allCountry.filter((item) => {
        return item.value === countryId;
      })
    );

  }, [user?.countryId_To, dashboard.countryId_To]);
  //======================= Payroll Group
  useEffect(() => {
    const payrollGroupId = defchildMenus?.value ? defchildMenus.value : user.payrollGroupId_To;
    setDefaultChildMenus(
      dashboard.allChildMenus &&
      dashboard.allChildMenus.filter((item) => {
        return item.value === payrollGroupId;
      })
    );

  }, [user?.payrollGroupId_To, dashboard.payrollGroupId_To]);
  //======================= End

  //======================= Team

  useEffect(() => {
    const teamId = defchildTeamMenus?.value ? defchildTeamMenus.value : user.teamId_To;
    setDefaultChildTeamsMenus(
      dashboard.allTeamsChildMenus &&
      dashboard.allTeamsChildMenus.filter((item) => {
        return item.value === teamId;
      })
    );

  }, [user?.teamId_To, dashboard.teamId_To]);
  //======================= End

  useEffect(() => {
    const reportTo = defReportTo?.value ? defReportTo.value : user.reportTo_To;
    console.log("reportTo", reportTo);
    setDefaultReportTo(
      dashboard.allEmployees &&
      dashboard.allEmployees.filter((item) => {
        return item.value === reportTo;
      })
    );

  }, [user?.reportTo_To, dashboard.reportTo_To]);

  useEffect(() => {
    const designationId = defDesignation?.value ? defDesignation.value : user.designationId_To;

    setDefaultDesignation(
      dashboard.allDesignations &&
      dashboard.allDesignations.filter((item) => {
        return item.value === designationId;
      })
    );

  }, [user?.designationId_To, dashboard.designationId_To]);

  useEffect(() => {
    const cityId = defCity?.value ? defCity.value : user.cityId_To;

    setDefaultCity(
      dashboard.allCity &&
      dashboard.allCity.filter((item) => {
        return item.value === cityId;
      })
    );

  }, [user?.cityId_To, dashboard.cityId_To]);

  //======================= Region

  useEffect(() => {
    const regionId = defchildRegionMenus?.value ? defchildRegionMenus.value : user.regionId_To;
    setDefaultChildRegionMenus(
      dashboard.allRegionChildMenus &&
      dashboard.allRegionChildMenus.filter((item) => {
        return item.value === regionId;
      })
    );

  }, [user?.regionId_To, dashboard.regionId_To]);

  //===== Date Of Birth
  useEffect(() => {

    if (user.transferDate) {
      setDateOfTransferDate(new Date(user.transferDate));
    }
  }, [user.transferDate]);

  //=========== END

  function toastMessage(message, type) {

    if (type == "error") {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (type == "success") {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }


  const fetchEmployeeProfileByEmpCode = async () => {
    try {
      const code = document.getElementById("txtemployeeCode").value;
      console.log("code", code)
      const response = await axios.post(`${USERS_URL}/profile/read-all-employee-profile`, { employeeId: code });
      SetDefaultEmpProfileList(response?.data?.data);
      console.log("response profile", response)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  console.log("user control", user)

  return (
    <>

      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          values.departmentId_To = values.departmentId;
          values.reportTo_To = values.reportTo;
          values.designationId_To = values.designationId;
          values.gradeId_To = values.gradeId;
          values.regionId_To = values.regionId;
          values.locationId = values.locationId;
          values.teamId_To = values.teamId;
          values.subsidiaryId_To = values.subsidiaryId;
          values.employeeTypeId_To = values.employeeTypeId;
          values.defaultShiftId_To = values.defaultShiftId;
          values.countryId_To = values.countryId;
          values.cityId_To = values.cityId;
          values.companyId_To = values.companyId;
          values.payrollGroupId_To = values.payrollGroupId;

          enableLoading();
          saveEmployeeTransfer(values, defEmpProfileList);

        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          formik,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">

                <fieldset disabled={isUserForRead}>
                  <div className="from-group row">
                    <div className="col-12 col-md-12 mt-3">
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                        <h6>Transfer From:</h6>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            Employee Code: <input type="text" placeholder="Enter Employee Code" className="form-control" id="txtemployeeCode" name="txtemployeeCode"></input>
                          </div>
                          <div className="col-12 col-md-4 mt-9">
                            <input type="button" className="btn btn-success" onClick={fetchEmployeeProfileByEmpCode} value="Search"></input>
                          </div>
                        </div>
                        <br></br>
                        <div className="from-group row">
                          <div style={{ overflow: "scroll", overflowX: "hidden", height: "200px" }}>
                            <table width="100%" class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                              <tr style={{ backgroundColor: '#4d5f7a', color: '#fff', fontSize: "10px", width: "100%" }}>
                                <td>&nbsp;</td>
                                <td>Employee</td>
                                <td>Code</td>
                                <td>Country</td>
                                <td>City</td>
                                <td>Department</td>
                                {/* <td>Employee Type</td>
                            <td>Grade</td> */}
                                {/* <td>Payroll Group</td> */}
                                <td>Team</td>
                                <td>Subsidiary</td>
                              </tr>
                              {defEmpProfileList?.map((obj, rightindex) => (
                                <><tr style={{ fontSize: "10px" }}>
                                  <td><input onChange={handleChange} name={'empChecked-' + rightindex} type="checkbox" id={rightindex}></input> </td>
                                  <td>
                                    {obj.employee}
                                  </td>
                                  <td>
                                    {obj.employeeCode}
                                  </td>
                                  <td>{obj.country}</td>
                                  <td>{obj.city}</td>
                                  <td>{obj.department}</td>
                                  {/* <td>{obj.employeeType}</td>
                              <td>{obj.grade}</td>
                              <td>{obj.payrollGroup}</td> */}
                                  <td>{obj.team}</td>
                                  <td>{obj.subsidiary}</td>
                                </tr>
                                </>
                              ))}

                            </table></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="from-group row">
                    <div className="col-12 col-md-12 mt-3">

                      <br></br><br></br>
                      <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                        <h6>Transfer To:</h6>
                        <div className="from-group row">
                          {/* {
                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              label={<span> Employee<span style={{ color: 'red' }}>*</span></span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("employeeId", e.value || null);
                                setEmployeeDefault(e);
                                //  dispatch(fetchAllActiveEmployees(e.value));
                              }}
                              value={(defEmployee || null)}
                              error={errors.employeeId}
                              touched={touched.employeeId}
                              options={dashboard.allEmployees}
                            />
                          </div>
                        } */}
                          <div className="col-12 col-md-4 mt-3">

                            <SearchSelect
                              name="companyId"
                              label={<span> Company<span style={{ color: 'red' }}>*</span></span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("companyId", e.value || null);
                                SetDefaulCompanyList(e);
                                //handlePaymenModeChanged(e)
                              }}

                              value={(defCompanyList || null)}
                              error={errors.companyId}
                              touched={touched.companyId}
                              options={dashboard.allCompanyList}
                            />

                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="subsidiaryId"
                              label={<span> Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("subsidiaryId", e.value || null);
                                setDefualtSubsidiaryList(e);
                                //handlePaymenModeChanged(e)
                              }}

                              value={(defSubsidiary || null)}
                              error={errors.subsidiaryId}
                              touched={touched.subsidiaryId}
                              options={dashboard.allSubidiaryList}
                            />

                          </div>
                          {/* <div className="col-12 col-md-4 mt-3">
                          <Select
                            label={<span> Transfer Category<span style={{ color: 'red' }}>*</span></span>}
                            name="transferCategory"
                            value={values.transferCategory}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{ display: "block" }}
                            autoComplete="off"
                          >
                            <option value="-1" label="Select" />
                            <option value="Inter Company" label="Inter Company" />
                            <option value="Intra Company" label="Intra Company" />

                          </Select>
                          {errors.transferCategory && touched.transferCategory && (
                            <div className="invalid-text">{errors.transferCategory}</div>
                          )}
                        </div> */}
                        </div>
                        <div className="from-group row">
                          {
                            <>

                              <div className="col-12 col-md-4 mt-3">
                                <Select

                                  label={<span> Transfer Status<span style={{ color: 'red' }}>*</span></span>}
                                  name="transferType"
                                  value={values.transferType}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  style={{ display: "block" }}
                                  autoComplete="off"
                                >
                                  <option value="-1" label="Select" />
                                  <option value="Temporary" label="Temporary" />
                                  <option value="Permanent" label="Permanent" />


                                </Select>
                                {errors.transferType && touched.transferType && (
                                  <div className="invalid-text">{errors.transferType}</div>
                                )}

                              </div>
                              <div className="col-12 col-md-4 mt-3">

                                <label> Effective Date<span style={{ color: 'red' }}>*</span></label>
                                <DatePicker
                                  className="form-control"
                                  placeholder="Enter Date Of Transfer"
                                  selected={defDateOfTransfer}
                                  onChange={(date) => {
                                    setFieldValue("transferDate", date);
                                    setDateOfTransferDate(date);
                                  }}
                                  timeInputLabel="Time:"
                                  dateFormat="dd-MMM-yyyy"
                                  showTimeInput
                                  name="transferDate"
                                  disabled={isUserForRead}
                                  autoComplete="off"
                                />
                              </div>
                              <div className="col-12 col-md-4 mt-3">
                                <label>Till Date</label>
                                <DatePicker
                                  className="form-control"
                                  placeholder="Enter Date Of Transfer"
                                  selected={defTillEffectiveDate}
                                  onChange={(date) => {
                                    setFieldValue("tillTransferDate", date);
                                    setTillEffectiveDate(date);
                                  }}
                                  disabled={values.transferType == "Permanent"}
                                  timeInputLabel="Time:"
                                  dateFormat="dd-MMM-yyyy"
                                  showTimeInput
                                  name="tillTransferDate"

                                  autoComplete="off"
                                />
                              </div>


                              <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                  name="departmentId"
                                  label={<span> Department<span style={{ color: 'red' }}>*</span></span>}
                                  isDisabled={isUserForRead && true}
                                  onBlur={() => {
                                    // handleBlur({ target: { name: "countryId" } });
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("departmentId", e.value || null);
                                    setDefaultDept(e);
                                    dispatch(fetchAllDept(e.value));
                                  }}
                                  value={(defDept || null)}
                                  error={errors.departmentId}
                                  touched={touched.departmentId}
                                  options={dashboard.allDept}
                                />
                              </div>
                              <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                  name="reportTo"
                                  label={<span> ReportTo<span style={{ color: 'red' }}>*</span></span>}
                                  isDisabled={isUserForRead && true}
                                  onBlur={() => {
                                    // handleBlur({ target: { name: "countryId" } });
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("reportTo", e.value || null);
                                    setDefaultReportTo(e);
                                    //  dispatch(fetchAllActiveEmployees(e.value));
                                  }}
                                  value={(defReportTo || null)}
                                  error={errors.reportTo}
                                  touched={touched.reportTo}
                                  options={dashboard.allEmployees}
                                />
                              </div>
                              {/* <div className="col-12 col-md-4 mt-3">
                              <SearchSelect
                                name="designationId"
                                label={<span> Designation<span style={{ color: 'red' }}>*</span></span>}
                                isDisabled={isUserForRead && true}
                                onBlur={() => {
                                  // handleBlur({ target: { name: "countryId" } });
                                }}
                                onChange={(e) => {
                                  setFieldValue("designationId", e.value || null);
                                  setDefaultDesignation(e);
                                  //  dispatch(fetchAllActiveEmployees(e.value));
                                }}
                                value={(defDesignation || null)}
                                error={errors.designationId}
                                touched={touched.designationId}
                                options={dashboard.allDesignations}
                              />
                            </div> */}
                              {/* <div className="col-12 col-md-4 mt-3">
                              <SearchSelect
                                name="gradeId"
                                label={<span> Grade<span style={{ color: 'red' }}>*</span></span>}
                                isDisabled={isUserForRead && true}
                                onBlur={() => {
                                  // handleBlur({ target: { name: "countryId" } });
                                }}
                                onChange={(e) => {
                                  setFieldValue("gradeId", e.value || null);
                                  setDefualtEmployeeGrade(e);
                                  // dispatch(fetchAllFormsMenu(e.value));
                                }}
                                value={(defEmployeeGrade || null)}
                                error={errors.gradeId}
                                touched={touched.gradeId}
                                options={dashboard.allEmployeeGradeList}
                              />

                            </div> */}
                              <div className="col-12 col-md-4 mt-3">
                                <SearchSelect
                                  name="teamId"
                                  label={<span> Team<span style={{ color: 'red' }}>*</span></span>}
                                  isDisabled={isUserForRead && true}
                                  onBlur={() => {
                                    // handleBlur({ target: { name: "countryId" } });
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("teamId", e.value || null);
                                    setDefaultChildTeamsMenus(e);
                                    // dispatch(fetchAllFormsMenu(e.value));
                                  }}
                                  value={(defchildTeamMenus || null)}
                                  error={errors.Id}
                                  touched={touched.Id}
                                  options={dashboard.allTeamsChildMenus}
                                />
                              </div>
                              {/* <div className="col-12 col-md-4 mt-3">
                              <SearchSelect
                                name="payrollGroupId"
                                label={<span> Payroll Group<span style={{ color: 'red' }}>*</span></span>}
                                isDisabled={isUserForRead && true}
                                onBlur={() => {
                                  // handleBlur({ target: { name: "countryId" } });
                                }}
                                onChange={(e) => {
                                  setFieldValue("payrollGroupId", e.value || null);
                                  setDefaultChildMenus(e);
                                  // dispatch(fetchAllFormsMenu(e.value));
                                }}
                                value={(defchildMenus || null)}
                                error={errors.payrollGroupId}
                                touched={touched.payrollGroupId}
                                options={dashboard.allChildMenus}
                              />
                            </div> */}
                              <div className="col-12 col-md-4 mt-3">

                                <SearchSelect
                                  name="regionId"
                                  label={<span> Region<span style={{ color: 'red' }}>*</span></span>}
                                  isDisabled={isUserForRead && true}
                                  onBlur={() => {
                                    // handleBlur({ target: { name: "countryId" } });
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("regionId", e.value || null);
                                    setDefaultChildRegionMenus(e);
                                    // dispatch(fetchAllFormsMenu(e.value));
                                  }}
                                  value={(defchildRegionMenus || null)}
                                  error={errors.Id}
                                  touched={touched.Id}
                                  options={dashboard.allRegionChildMenus}
                                />
                              </div>
                              {/* <div className="col-12 col-md-4 mt-3">
                              <SearchSelect
                                name="employeeTypeId"
                                label={<span> Employee Type<span style={{ color: 'red' }}>*</span></span>}
                                isDisabled={isUserForRead && true}
                                onBlur={() => {
                                  // handleBlur({ target: { name: "countryId" } });
                                }}
                                onChange={(e) => {
                                  setFieldValue("employeeTypeId", e.value || null);
                                  setDefaultChildEmpTypeMenus(e);
                                  // dispatch(fetchAllFormsMenu(e.value));
                                }}
                                value={(defchildEmptypeMenus || null)}
                                error={errors.Id}
                                touched={touched.Id}
                                options={dashboard.allEmpTypeChildMenus}
                              />
                            </div> */}
                              <div className="col-12 col-md-4 mt-3">
                                <Select
                                  label="Default Shift"
                                  name="defaultShiftId"
                                  value={values.defaultShiftId_To}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  style={{ display: "block" }}
                                  autoComplete="off"
                                >
                                  <option value="-1" label="Select Shift" />
                                  <option value="1" label="Morning Shift-A" />
                                  <option value="2" label="Evening Shift-B" />
                                  <option value="3" label="Night Shift-C" />

                                </Select>
                                {errors.defaultShiftId && touched.defaultShiftId && (
                                  <div className="invalid-text">{errors.defaultShiftId}</div>
                                )}
                              </div>
                            </>
                          }
                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="locationId"
                              label={<span> Location<span style={{ color: 'red' }}>*</span></span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("locationId", e.value || null);
                                setDefaultChildLocationMenus(e);
                                // dispatch(fetchAllFormsMenu(e.value));
                              }}
                              value={(defchildLocationMenus || null)}
                              error={errors.locationId}
                              touched={touched.locationId}
                              options={dashboard.allLocationChildMenus}
                            />
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="countryId"
                              label={<span> Country<span style={{ color: 'red' }}>*</span></span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                // handleBlur({ target: { name: "countryId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("countryId", e.value);
                                setDefaultCountry(e);
                                dispatch(fetchAllCity(e.value));
                              }}
                              value={defCountry}
                              error={errors.countryId}
                              touched={touched.countryId}
                              options={dashboard.allCountry}
                            />
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="cityId"
                              label={<span> City<span style={{ color: 'red' }}>*</span></span>}
                              isDisabled={isUserForRead && true}
                              onBlur={() => {
                                //   handleBlur({ target: { name: "cityId" } });
                              }}
                              onChange={(e) => {
                                setFieldValue("cityId", e.value);
                                setDefaultCity(e);
                                
                              }}
                              value={defCity}
                              error={errors.cityId}
                              touched={touched.cityId}
                              options={dashboard.allCity}
                            />
                          </div>

                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <Field
                              name="transferRemarks"
                              component={TextArea}
                              placeholder="Enter Remarks"
                              label="Enter Remarks"
                              autoComplete="off"
                            />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                </fieldset>

              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isUserForRead ? (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-primary btn-elevate"
                >
                  OK
                </button>
              )}

              <> </>
              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Transfer
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              )}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
