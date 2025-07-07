import React, { useEffect, useState, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/bankActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../BanksUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useBanksUIContext } from "../BanksUIContext";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";
import { Form, Modal } from "react-bootstrap";
import { fetchAllActiveEmployees, fetchAllActiveEmployeesSalaryForDDL, fetchAllDeductionList, fetchAllEarningList, fetchAllFormsMenu, fetchEmpSalaryRevisionByEmployeeId } from "../../../../../../_metronic/redux/dashboardActions";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import DatePicker from "react-datepicker";
import axios from 'axios';
import { format } from "date-fns";
import { parseISO } from "date-fns/esm";
import moment from "moment";
export const USERS_URL = process.env.REACT_APP_API_URL;
export function BanksTable(save_salary_revision,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading) {
  //Users UI Context
  const bankUIContext = useBanksUIContext();

  const bankUIProps = useMemo(() => {
    return {
      ids: bankUIContext.ids,
      setIds: bankUIContext.setIds,
      queryParams: bankUIContext.queryParams,
      setQueryParams: bankUIContext.setQueryParams,
      openEditBankDialog: bankUIContext.openEditBankDialog,
      openDeleteBankDialog: bankUIContext.openDeleteBankDialog,
      openActiveBankDialog: bankUIContext.openActiveBankDialog,
      openReadBankDialog: bankUIContext.openReadBankDialog,
    };
  }, [bankUIContext]);

  const [defOld_MapEarningDeductionList = null, setDefaultOld_MapEarningDeductionList] = useState([]);
  const [defNew_MapEarningDeductionList = null, setDefaultNew_MapEarningDeductionList] = useState([]);

  //console.log("queryparms", usersUIProps.queryparms)
  const { currentState, userAccess } = useSelector(
    (state) => {
      return {

        currentState: state.salary_revision,
        userAccess: state?.auth?.userAccess["Salary_Revision"],
      }
    },
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);
  const [defEmployee = null, setEmployeeDefault] = useState(null);

  // Old / Current Positions
  const [defOld_PayrollGroup = null, setOld_PayrollGroup] = useState(null);
  const [defOld_EmployeeGrade = null, setOld_EmployeeGrade] = useState(null);
  const [defOld_EmpDesingaton = null, setOld_EmpDesignation] = useState(null);
  const [defOld_EmployeeType = null, setOld_EmployeeType] = useState(null);
  const [defOld_BasicSalary, setOld_BasicSalary] = useState(0);
  const [defOld_GrossSalary, setOld_GrossSalary] = useState(0);

  // New / Instances

  const [defNew_PayrollGroup = null, setNew_PayrollGroup] = useState(null);
  const [defNew_EmployeeGrade = null, setNew_EmployeeGrade] = useState(null);
  const [defNew_EmpDesingaton = null, setNew_EmpDesignation] = useState(null);
  const [defNew_EmployeeType = null, setNew_EmployeeType] = useState(null);
  const [defNew_BasicSalary, setNew_BasicSalary] = useState(0);
  const [defNew_GrossSalary, setNew_GrossSalary] = useState(0);
  const [defReviewDropdownDisabled, setReviewDropdownDisabled] = useState(true);
  const [defReviewDateFlag, setReviewDateFlag] = useState(true);
  const [defMapEarningDeductionList = null, setDefaultMapEarningDeductionList] = useState([]);
  const [defReviewDate, setReviewDate] = useState(null);

  const [defReviewDateDDL, setdefReviewDateDDL] = useState(null);
  const [defBasicSalaryFactor, setBasicSalaryFactor] = useState(0);
  const [defGrossSalary, setGrossSalary] = useState(0);
  const [defBasicSalary, setBasicSalary] = useState(0);
  const [defGrossSalaryDB, setGrossSalaryDB] = useState(0);
  const [defBasicSalaryDB, setBasicSalaryDB] = useState(0);

  const handleChanged = (e, setFieldValue) => {
    const newValue = e.value;
    console.log('Selected value:', newValue);
    fetchEmployeeSalaryEarningList(e.value, 0, setFieldValue);
  };

  const handleReviewChange = (e) => {
    console.log("onchange date", e.toLocaleString());
  }

  const fetchCompensationByGradeAndEmployeeType = async (gradeId, employeeTypeId, temp) => {

    const confirmed = window.confirm("Compensation policy effected, want to proceed with the upgradation?");
    console.log("tell", gradeId, employeeTypeId, temp)

    if (confirmed) {
      if (gradeId && employeeTypeId) {
        console.log("grade", gradeId, employeeTypeId);
        const response = await axios.post(`${USERS_URL}/employee_salary_earning/read-compensation-grade-employeeType`, { gradeId: gradeId, employeeTypeId: employeeTypeId || 0 });

        console.log("response", response);
        setDefaultNew_MapEarningDeductionList(response?.data?.data);

      }
    }
    else {
      console.log("cancelled");
    }
  }

  const fetchEmployeeSalaryEarningList = async (empId, basicSalary, setFieldValue) => {
    try {

      const response = await axios.post(`${USERS_URL}/employee_salary_earning/read-all-emp-earning_byId`, { id: empId, basicSalary: basicSalary || 0 });

      const list = [...response?.data?.data]
      console.log("ggg", response);
      // setReviewDropdownDisabled(false);

      if (list.length) {

        let i = 1;
        const newList = list.map(item => ({
          ...item,
          type: 'new',
          mapId: i++
        }));

        const oldList = list.map(item => ({
          ...item,
          type: 'old',
          mapId: i++
        }));

        // dispatch(fetchAllActiveEmployees());
        setFieldValue("empSalaryReviewHist", null);
        setdefReviewDateDDL(null); // Reset the dropdown value

        setFieldValue("reviewDate", null);
        setReviewDate(null)

        const respCode = await dispatch(fetchEmpSalaryRevisionByEmployeeId(empId))

        if (respCode == 0) {
          setReviewDropdownDisabled(true);
          setReviewDateFlag(false);
        }
        else {
          setReviewDropdownDisabled(false)
          setReviewDateFlag(true)
        }


        setDefaultOld_MapEarningDeductionList(oldList);
        setDefaultNew_MapEarningDeductionList(newList);

        setOld_GrossSalary(response?.data?.data[0]?.grossSalary)
        setOld_BasicSalary(response?.data?.data[0]?.basicSalary)

        setFieldValue("new_grossSalary", response?.data?.data[0]?.grossSalary)
        setFieldValue("new_basicSalary", response?.data?.data[0]?.basicSalary)


        setNew_GrossSalary(response?.data?.data[0]?.grossSalary)
        setNew_BasicSalary(response?.data?.data[0]?.basicSalary)

        // set payroll GroupId // Old Instances
        const payrollGroupId = response?.data?.data[0]?.payrollGroupId; //defOld_PayrollGroup?.value ? defOld_PayrollGroup.value : user.payrollGroupId;
        setOld_PayrollGroup(
          dashboard.allChildMenus &&
          dashboard.allChildMenus.filter((item) => {
            return item.value === payrollGroupId;
          })
        );


        // set gradeId

        const gradeId = response?.data?.data[0]?.gradeId;
        setOld_EmployeeGrade(
          dashboard.allEmployeeGradeList &&
          dashboard.allEmployeeGradeList.filter((item) => {
            return item.value === gradeId;
          })
        );


        const emptypeId = response?.data?.data[0]?.employeeTypeId;
        setOld_EmployeeType(
          dashboard.allEmpTypeChildMenus &&
          dashboard.allEmpTypeChildMenus.filter((item) => {
            return item.value === emptypeId;
          })
        );


        const designationId = response?.data?.data[0]?.designationId;
        setOld_EmpDesignation(
          dashboard.allDesignations &&
          dashboard.allDesignations.filter((item) => {
            return item.value === designationId;
          })
        );

        ///========================================

        // New Instances For Dropdown

        //const new_payrollGroupId = response?.data?.data[0]?.payrollGroupId; //defOld_PayrollGroup?.value ? defOld_PayrollGroup.value : user.payrollGroupId;
        setNew_PayrollGroup(
          dashboard.allChildMenus &&
          dashboard.allChildMenus.filter((item) => {
            return item.value === payrollGroupId;
          })
        );
        setFieldValue("new_payrollGroupId", payrollGroupId);
        // set gradeId

        //const gradeId = response?.data?.data[0]?.gradeId;
        setNew_EmployeeGrade(
          dashboard.allEmployeeGradeList &&
          dashboard.allEmployeeGradeList.filter((item) => {
            return item.value === gradeId;
          })
        );
        setFieldValue("new_gradeId", gradeId);


        setNew_EmployeeType(
          dashboard.allEmpTypeChildMenus &&
          dashboard.allEmpTypeChildMenus.filter((item) => {
            return item.value === emptypeId;
          })
        );
        setFieldValue("new_employeeTypeId", emptypeId);

        setNew_EmpDesignation(
          dashboard.allDesignations &&
          dashboard.allDesignations.filter((item) => {
            return item.value === designationId;
          })
        );
        setFieldValue("new_desingationId", designationId);
      }

      //====================================

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fnAddNewRevision = (ele, setFieldValue) => {

    setReviewDropdownDisabled(true);

    setFieldValue("empSalaryReviewHist", null);
    setdefReviewDateDDL(null); // Reset the dropdown value
    console.log("review ddl", defReviewDropdownDisabled)
    setReviewDateFlag(false);

  }


  const calculateEmployeeSalaryPolicy = (el, setFieldValue) => {

    const basicSalaryInputFactor = 66.66; // el.target.form.elements['basicSalaryFactor'].value;
    const grossSalaryInput = defNew_GrossSalary; //el.target.form.elements['grossSalary'].value;

    setGrossSalary(grossSalaryInput);
    const totalBasicWithFactorVal = ((Number(grossSalaryInput) * Number(basicSalaryInputFactor)) / 100)


    setFieldValue("basicSalary", totalBasicWithFactorVal)
    setBasicSalary(totalBasicWithFactorVal);

    // fetchEmployeeSalaryEarningList(employeeId,basicSalary)
    if (Number(basicSalaryInputFactor)) {

      setDefaultNew_MapEarningDeductionList([...defNew_MapEarningDeductionList.map((x) => {
        if (x.calculation_type == '% Of Basic') {
          x.amount = ((totalBasicWithFactorVal * x.factorValue) / 100);
        }
        return x;
      })]);

    }
  }

  //===== Date Of End Date
  useEffect(() => {

    if (user.reviewDate) {
      setReviewDate(new Date(user.reviewDate));
    }
  }, [user.reviewDate]);


  useEffect(() => {
    bankUIProps.setIds([]);
    dispatch(actions.fetchUsers(bankUIProps.queryParams));
  }, [bankUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEmployeeSalary"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeSalary"
  );


  useEffect(() => {
    dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // For All Grade Codes
    dispatch(fetchAllFormsMenu(127, "allChildMenus")); // For Payroll Group
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus")); // For EmployeeType
    dispatch(fetchAllFormsMenu(158, "allDesignations")); // For All Designations
    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllEarningList(1));
    dispatch(fetchAllDeductionList(2));

    dispatch(fetchAllActiveEmployeesSalaryForDDL(null));
  }, [dispatch]);

  // Table columns
  const columns = [
    // {
    //   dataField: "Id",
    //   text: "ID",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },

    {
      dataField: "employeeName",
      text: "Employee",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "employeeCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "employeeType",
      text: "Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "grossSalary",
      text: "Gross",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "basicSalary",
      text: "Basic",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    // {
    //   dataField: "calculation_type",
    //   text: "Calculation Type",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },

    // {
    //   dataField: "earningName",
    //   text: "Earning",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
    // {
    //   dataField: "factorValue",
    //   text: "Factor",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
    // {
    //   dataField: "subsidiary",
    //   text: "Subsidiary",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },






    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditBankDialog: bankUIProps.openEditBankDialog,
        openDeleteBankDialog: bankUIProps.openDeleteBankDialog,
        openActiveBankDialog: bankUIProps.openActiveBankDialog,
        openReadBankDialog: bankUIProps.openReadBankDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: bankUIProps.queryParams.pageSize,
    page: bankUIProps.queryParams.pageNumber,
  };

  const formValidation = Yup.object().shape(
    {
      reviewDate: Yup.string()
        .required("Required*"),
    },

  );

  useEffect(() => {
  }, [user?.employeeTypeId, dashboard.employeeTypeId]);

  useEffect(() => {
    const designationId = defOld_EmpDesingaton?.value ? defOld_EmpDesingaton.value : user.designationId;
    setOld_EmpDesignation(
      dashboard.allDesignations &&
      dashboard.allDesignations.filter((item) => {
        return item.value === designationId;
      })
    );

  }, [user?.designationId, dashboard.designationId]);



  const addRow = (element) => {
    console.log("click", element.target.id)
    if (element.target.id == "Other") {
      setDefaultNew_MapEarningDeductionList([...defNew_MapEarningDeductionList, { transactionType: "Earning", isPartOfGrossSalary: 0, type: 'new' }])
    }
    else {
      setDefaultNew_MapEarningDeductionList([...defNew_MapEarningDeductionList, { transactionType: element.target.id, isPartOfGrossSalary: 1, type: 'new' }])
    }

  }

  const handleFieldChanged = (el) => {
    const index = el.target.id.split('-')[1]
    const key = el.target.id.split('-')[0]
    setDefaultNew_MapEarningDeductionList([...defNew_MapEarningDeductionList.map((val, ind) => {

      if (ind == index) {
        if (!(key == "factorValue" && Number(el.target.value) > 100)) {
          val[key] = key == 'calculation_type' ? (el.target.value) : Number(el.target.value)
        }
      }

      return val
    })])

  }

  const deleteRow = (element) => {
    const data = defNew_MapEarningDeductionList;
    data.splice(element.target.id, 1);
    setDefaultNew_MapEarningDeductionList([...data])
  }

  // ============== New Objects For New Revision

  const totalAllowance = defNew_MapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  }, 0) || 0;


  const totalGross = defNew_MapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  }, 0) || 0;


  const totalDeduction = defNew_MapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Deduction' ? prev + curr.amount : prev
  }, 0) || 0;

  // ============== Old Objects For Current Calculations

  const totalAllowance_Old = defOld_MapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  }, 0) || 0;


  const totalGross_old = defOld_MapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  }, 0) || 0;


  const totalDeduction_Old = defOld_MapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Deduction' ? prev + curr.amount : prev
  }, 0) || 0;

  // =============== END

  const fnSaveSalaryRevision = async (obj, oldList, newList) => {

    const salObj = {
      old_grossSalary: oldList[0].grossSalary,
      old_basicSalary: oldList[0].basicSalary,
      old_gradeId: oldList[0].gradeId,
      old_employeeTypeId: oldList[0].employeeTypeId,
      old_payrollGroupId: oldList[0].payrollGroupId,
      old_designationId: oldList[0].designationId,
    }

    const mergeList = obj.map(item => ({
      ...item,
      ...salObj
    }))

    

    //console.log("newObj",newObjList)

    const newObjList = [];
    newList.forEach(async ele => {

      const old = ele.Id && oldList.find(x => x.Id === ele.Id)

      const earningDeductionList = {
        mapId: ele.Id || 0,
        old_transactionType: old?.transactionType || '',
        old_calculation_type: old?.calculation_type || '',
        old_earning_deductionId: old?.earning_deduction_id || 0,
        old_factorValue: old?.factorValue || 0,
        old_amount: old?.amount || 0,
        old_IsPartOfGrossSalary: old?.isPartOfGrossSalary,

        new_IsPartOfGrossSalary: ele.isPartOfGrossSalary,
        new_transactionType: ele.transactionType || '',
        new_calculation_type: ele.calculation_type || '',
        new_earning_deductionId: ele.earning_deduction_id || 0,
        new_factorValue: ele.factorValue || 0,
        new_amount: ele.amount || 0,

      }
      newObjList.push(earningDeductionList);

    })

    const response = await axios.post(`${USERS_URL}/salary_revision/create-salary-revision`, { data: { mergeList, newObjList } });
    console.log("res1", response);

    if (response.data?.data[0]?.message == "1") {

      toast.error("Revision already exists for given month!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else if (response.data?.data[0]?.message == 404) {
      toast.error("Review date not allowed greater than joining date!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {

      if (response?.data.code == "200") {
        setDefaultOld_MapEarningDeductionList([]);
        setDefaultNew_MapEarningDeductionList([]);
        setNew_GrossSalary(0)
        setOld_GrossSalary(0)
        setNew_BasicSalary(0)
        setOld_BasicSalary(0)
        setOld_PayrollGroup(null);
        setOld_EmployeeType(null)
        setOld_EmployeeGrade(null)
        setOld_EmpDesignation(null)

        setNew_PayrollGroup(null);
        setNew_EmployeeType(null)
        setNew_EmployeeGrade(null)
        setNew_EmpDesignation(null)
        setEmployeeDefault(null)


        document.getElementById("txtGrossPackage").value = 0

        toast.success("Successfully inserted", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      }
    }
  }

  const formatDate = (dateString) => {
    // Split the date string by '/'

    const [day, month, year] = dateString.split('/');

    // Rearrange to 'MM/DD/YYYY' format
    return `${month}/${day}/${year}`;
  };

  return (
    <>

      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  bankUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   entities,

                // })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        // validationSchema={formValidation}
        onSubmit={async (values) => {

          // console.log("input time",new Date('09/24/2024'));

          if (values.empSalaryReviewHist) {
            const t = new Date(formatDate(values.empSalaryReviewHist))
          
          }
        
          fnSaveSalaryRevision([values], defOld_MapEarningDeductionList, defNew_MapEarningDeductionList);

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
          <>  <Form className="form form-label-right">
            <fieldset >
              <div style={{ width: "100%", backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                <h6>Salary Review Detail</h6>
                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="employeeId"
                      label={<span> Employee<span style={{ color: 'red' }}>*</span></span>}
                      isDisabled={isUserForRead && true}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("employeeId", e.value || null);
                        setEmployeeDefault(e);
                        //  dispatch(fetchAllActiveEmployees(e.value));
                        handleChanged(e, setFieldValue)
                        //  fetchEmployeeCompensationSalaryExpList(e.value);
                      }}
                      value={(defEmployee || null)}
                      error={errors.Id}
                      touched={touched.Id}
                      options={dashboard.allEmployees}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <SearchSelect
                      name="empSalaryReviewHist"
                      label={<span> Salary Revision History<span style={{ color: 'red' }}>*</span></span>}

                      isDisabled={defReviewDropdownDisabled}
                      onBlur={() => {
                        // handleBlur({ target: { name: "countryId" } });
                      }}
                      onChange={(e) => {
                        setFieldValue("empSalaryReviewHist", e.label || null);
                        setdefReviewDateDDL(e);

                        //  dispatch(fetchAllActiveEmployees(e.value));
                        // handleChanged(e, setFieldValue)
                        //  fetchEmployeeCompensationSalaryExpList(e.value);
                      }}
                      value={(defReviewDateDDL || null)}
                      error={errors.empSalaryReviewHist}
                      touched={touched.empSalaryReviewHist}
                      options={dashboard.allSalaryReviewDateByEmpIdForDDL || null}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-5">

                    {<span> Review Date<span style={{ color: 'red' }}>*</span></span>}
                    <DatePicker
                      className="form-control"
                      placeholder="Enter Review Date"
                      selected={values.reviewDate}
                      onChange={(e) => {
                        setFieldValue("reviewDate", e);
                        setReviewDate(e);
                        handleReviewChange(e);
                      }}
                      timeInputLabel="Time:"
                      dateFormat="dd-MMM-yyyy"
                      showTimeInput
                      name="reviewDate"
                      autoComplete="off"
                      disabled={defReviewDateFlag}
                    // value = {values.dateOfJoining}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="review_reason"
                      onChange={(e) => {

                        setFieldValue("review_reason", e.target.value);
                      }}
                      component={TextArea}
                      placeholder="Enter Review Reason"
                      label={<span> Review Reason<span style={{ color: 'red' }}>*</span></span>}
                      autoComplete="off"

                    />
                  </div>
                  <div className="col-12 col-md-4 mt-12">
                    <input type="button" class="btn btn-success"
                      onClick={(e) => fnAddNewRevision(e, setFieldValue)} id="btnSalaryPolicyCalc" value="Add New"></input>
                  </div>
                </div>
              </div>
              <br></br>
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ float: "left", width: "50%", backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                  <h6>Current Position</h6>

                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="old_payrollGroupId"
                        label={<span> Payroll Group<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("old_payrollGroupId", e.value || null);
                          setOld_PayrollGroup(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defOld_PayrollGroup || null)}
                        error={errors.old_payrollGroupId}
                        touched={touched.old_payrollGroupId}
                        options={dashboard.allChildMenus}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="old_gradeId"
                        label={<span> Grade<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("old_gradeId", e.value || null);
                          setOld_EmployeeGrade(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defOld_EmployeeGrade || null)}
                        error={errors.old_gradeId}
                        touched={touched.old_gradeId}
                        options={dashboard.allEmployeeGradeList}
                        disabled
                      />

                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="old_designationId"
                        label={<span> Designation<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("old_designationId", e.value || null);
                          setOld_EmpDesignation(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defOld_EmpDesingaton || null)}
                        error={errors.old_designationId}
                        touched={touched.old_designationId}
                        options={dashboard.allDesignations}

                      />

                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="old_employeeTypeId"
                        label={<span> Employee Type<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("old_employeeTypeId", e.value || null);
                          setOld_EmployeeType(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defOld_EmployeeType || null)}
                        error={errors.old_employeeTypeId}
                        touched={touched.old_employeeTypeId}
                        options={dashboard.allEmpTypeChildMenus}

                      />
                    </div>
                  </div>
                </div>

                <div style={{ float: "left", width: "50%", backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                  <h6>New Position</h6>



                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="new_payrollGroupId"
                        label={<span> Payroll Group<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("new_payrollGroupId", e.value || null);
                          setNew_PayrollGroup(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defNew_PayrollGroup || null)}
                        error={errors.new_payrollGroupId}
                        touched={touched.new_payrollGroupId}
                        options={dashboard.allChildMenus}
                      />
                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="new_gradeId"
                        label={<span> Grade<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("new_gradeId", e.value || null);
                          setNew_EmployeeGrade([e]);
                          fetchCompensationByGradeAndEmployeeType(e.value, defNew_EmployeeType[0]?.value, defNew_EmployeeType)

                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defNew_EmployeeGrade || null)}
                        error={errors.new_gradeId}
                        touched={touched.new_gradeId}
                        options={dashboard.allEmployeeGradeList}
                      />

                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="new_designationId"
                        label={<span> Designation<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("new_designationId", e.value || null);
                          setNew_EmpDesignation(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defNew_EmpDesingaton || null)}
                        error={errors.new_designationId}
                        touched={touched.new_designationId}
                        options={dashboard.allDesignations}
                      />

                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-2 mt-3"></div>
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="new_employeeTypeId"
                        label={<span> Employee Type<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("new_employeeTypeId", e.value || null);
                          setNew_EmployeeType([e]);
                          fetchCompensationByGradeAndEmployeeType(defNew_EmployeeGrade[0]?.value, e.value, defNew_EmployeeGrade)
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defNew_EmployeeType || null)}
                        error={errors.new_employeeTypeId}
                        touched={touched.new_employeeTypeId}
                        options={dashboard.allEmpTypeChildMenus}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <div id="middleLine" style={{ height: "4px" }}>&nbsp;</div>
            <fieldset >

              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ float: "left", width: "50%", backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                  <h6>Current Salary</h6>
                  <div className="from-group row">

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="old_grossSalary"
                        onChange={(e) => {
                          setOld_GrossSalary(e.target.value);
                          setFieldValue("old_grossSalary", e.target.value);
                        }}
                        component={Input}
                        value={defOld_GrossSalary || 0}
                        placeholder="Enter Gross Salary"
                        label={<span> Gross Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        disabled
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="old_basicSalary"
                        onChange={(e) => {
                          setOld_BasicSalary(e.target.value);
                          setFieldValue("old_basicSalary", e.target.value);
                        }}
                        value={defOld_BasicSalary || 0}
                        component={Input}
                        placeholder="Enter Basic Salary"
                        label={<span> Basic Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="from-group row">
                    <br>
                    </br>
                    <div className="col-12 col-md-12 mt-3" style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px" }}>
                      <h6>Earnings </h6>
                      {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                      <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                          {/* <td>Employee</td> */}
                          <td>Action</td>
                          <td>Earning</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                        </tr>
                        {defOld_MapEarningDeductionList?.map((obj, rightindex) => (
                          obj.transactionType == 'Earning' && obj.isPartOfGrossSalary == true &&
                          <><tr>
                            <td id={rightindex} onClick={deleteRow}> Delete</td>
                            <td>
                              <select disabled onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                                <option value="-1"> --Select--</option>
                                {
                                  dashboard.allEarnings?.map((x) => {
                                    return <option disabled value={x.value}> {x.label} </option>
                                  })}
                              </select>
                            </td>
                            <td>
                              <select disabled value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                <option value="-1">--Select--</option>
                                <option value="% Of Basic">% Of Basic</option>
                                <option value="Fixed Amount">Fixed Amount</option>
                              </select>

                            </td>
                            {/* <td>{obj.transactionType}</td> */}
                            <td>
                              <input disabled style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                            </td>
                            <td>
                              <input disabled style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.amount} id={'amount-' + rightindex}></input> </td>
                          </tr>

                          </>
                        ))}

                      </table>

                      {/* {<> <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Earning" onClick={addRow} value='+Add'></input>
                      </div>

                    </div>
                    </>} */}

                    </div>
                    <br>
                    </br>
                    <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", width: "100%" }}>
                      <h6> Other Earnings </h6>
                      {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                      <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                          {/* <td>Employee</td> */}
                          <td>Action</td>
                          <td>Earning</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                        </tr>
                        {defOld_MapEarningDeductionList?.map((obj, rightindex) => (
                          obj.transactionType == 'Earning' && obj.isPartOfGrossSalary == false &&
                          <><tr>
                            <td id={rightindex} onClick={deleteRow}> Delete</td>
                            <td>
                              <select disabled onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                                <option value="-1"> --Select--</option>
                                {
                                  dashboard.allEarnings?.map((x) => {
                                    return <option disabled value={x.value}> {x.label} </option>
                                  })}
                              </select>
                            </td>
                            <td>
                              <select disabled value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                <option value="-1">--Select--</option>
                                <option value="% Of Basic">% Of Basic</option>
                                <option value="Fixed Amount">Fixed Amount</option>
                              </select>

                            </td>
                            {/* <td>{obj.transactionType}</td> */}
                            <td>
                              <input disabled style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                            </td>

                            <td>
                              <input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.amount} id={'amount-' + rightindex}></input> </td>
                          </tr>

                          </>
                        ))}

                      </table>

                    </div>

                  </div>

                  <div className="from-group row">
                    <br>
                    </br>
                    <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", width: "100%" }}>
                      <h6>Deductions</h6>
                      {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                      <table style={{ width: "100%" }} class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                          {/* <td>Employee</td> */}
                          <td>Action</td>
                          <td>Deduction</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                        </tr>
                        {defOld_MapEarningDeductionList?.map((obj, rightindex) => (
                          obj.transactionType == 'Deduction' &&
                          <><tr>
                            <td id={rightindex} onClick={deleteRow}> Delete</td>
                            <td>  <select style={{ width: "113px" }} disabled onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                              <option value="-1"> --Select--</option>
                              {
                                dashboard.allDeductions?.map((x) => {
                                  return <option disabled={defOld_MapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select></td>
                            <td>
                              <td>
                                <select disabled value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                  <option value="-1">--Select--</option>
                                  <option value="% Of Basic">% Of Basic</option>
                                  <option value="Fixed Amount">Fixed Amount</option>
                                </select>
                              </td></td>
                            {/* <td>{obj.transactionType}</td> */}
                            <td> <input disabled style={{ width: "100px" }} type="number" onChange={handleFieldChanged} value={obj.factorValue} id={'factorValue-' + rightindex}></input></td>
                            <td><input disabled style={{ width: "100px" }} type="number"
                              onChange={handleFieldChanged} value={obj.amount} id={'amount-' + rightindex}></input> </td>
                          </tr>
                          </>
                        ))}

                      </table>

                      {/* <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Deduction" onClick={addRow} value='+Add'></input>
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                      </div>

                    </div> */}

                      {<>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                          </div>

                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            Total Allowance <input type="number" disabled="true" value={totalAllowance_Old} id="txtOldTotalAllowance"></input>
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            Gross Package <input disabled="true" value={values.old_grossSalary > 0 ? Number(values.old_grossSalary) + Number(totalGross_old) : Number(defOld_GrossSalary) + Number(totalGross_old)} type="number" id="txtOldGrossPackage"></input>
                          </div>
                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">

                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            Total Deductions <input disabled="true" type="number" value={totalDeduction_Old} id="txtOldTotalDeductions"></input>
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            Net Salary <input disabled="true" value={defOld_GrossSalary > 0 ? (Number(defOld_GrossSalary) + Number(totalGross_old)) - Number(totalDeduction_Old) : Number(defOld_GrossSalary) + Number(totalGross_old)} type="number" id="txtOldGrossPackage"></input>
                          </div>
                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">

                          </div>
                          <div className="col-12 col-md-4 mt-3">
                          </div>

                        </div>


                      </>
                      }

                    </div>
                  </div>
                </div>
                <div style={{ float: "left", width: "50%", backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                  <h6>New Salary</h6>
                  <div className="from-group row">

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="new_grossSalary"
                        onChange={(e) => {
                          setNew_GrossSalary(e.target.value);
                          setFieldValue("new_grossSalary", e.target.value);
                        }}
                        component={Input}
                        value={defNew_GrossSalary || 0}
                        placeholder="Enter Gross Salary"
                        label={<span> Gross Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="new_basicSalary"
                        onChange={(e) => {
                          setNew_BasicSalary(e.target.value);
                          setFieldValue("new_basicSalary", e.target.value);
                        }}
                        value={defNew_BasicSalary || 0}
                        component={Input}
                        placeholder="Enter Basic Salary"
                        label={<span> Basic Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-12">
                      <input type="button" class="btn btn-success" onClick={(e) => calculateEmployeeSalaryPolicy(e, setFieldValue)} id="btnSalaryPolicyCalc" value="Calculate"></input>


                    </div>
                  </div>
                  <div className="from-group row">
                    <br>
                    </br>
                    <div className="col-12 col-md-12 mt-3" style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px" }}>
                      <h6>Earnings </h6>
                      {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                      <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                          {/* <td>Employee</td> */}
                          <td>Action</td>
                          <td>Earning</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                        </tr>
                        {defNew_MapEarningDeductionList?.map((obj, rightindex) => (
                          obj.transactionType == 'Earning' && obj.isPartOfGrossSalary == true &&
                          <><tr>
                            <td id={rightindex} onClick={deleteRow}> Delete</td>
                            <td>
                              <select onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                                <option value="-1"> --Select--</option>
                                {
                                  dashboard.allEarnings?.map((x) => {
                                    return <option disabled={defNew_MapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                  })}
                              </select>
                            </td>
                            <td>
                              <select value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                <option value="-1">--Select--</option>
                                <option value="% Of Basic">% Of Basic</option>
                                <option value="Fixed Amount">Fixed Amount</option>
                              </select>

                            </td>
                            {/* <td>{obj.transactionType}</td> */}
                            <td>
                              <input disabled={obj.calculation_type == 'Fixed Amount'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                            </td>
                            <td>
                              <input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.amount} id={'amount-' + rightindex}></input> </td>
                          </tr>

                          </>
                        ))}

                      </table>

                      {<> <div className="from-group row">
                        <div className="col-12 col-md-4 mt-3">
                          <input type='button' id="Earning" onClick={addRow} value='+Add'></input>
                        </div>

                      </div>
                      </>}

                    </div>
                    <br>
                    </br>
                    <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", width: "100%" }}>
                      <h6> Other Earnings </h6>
                      {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                      <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                          {/* <td>Employee</td> */}
                          <td>Action</td>
                          <td>Earning</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                        </tr>
                        {defNew_MapEarningDeductionList?.map((obj, rightindex) => (
                          obj.transactionType == 'Earning' && obj.isPartOfGrossSalary == false &&
                          <><tr>
                            <td id={rightindex} onClick={deleteRow}> Delete</td>
                            <td>
                              <select onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                                <option value="-1"> --Select--</option>
                                {
                                  dashboard.allEarnings?.map((x) => {
                                    return <option disabled={defNew_MapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                  })}
                              </select>
                            </td>
                            <td>
                              <select value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                <option value="-1">--Select--</option>
                                <option value="% Of Basic">% Of Basic</option>
                                <option value="Fixed Amount">Fixed Amount</option>
                              </select>

                            </td>
                            {/* <td>{obj.transactionType}</td> */}
                            <td>
                              <input disabled={obj.calculation_type == 'Fixed Amount'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                            </td>

                            <td>
                              <input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                                value={obj.amount} id={'amount-' + rightindex}></input> </td>
                          </tr>

                          </>
                        ))}

                      </table>

                      {<>

                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <input type='button' id="Other" onClick={addRow} value='+Add'></input>
                          </div>


                        </div>
                      </>

                      }


                    </div>
                  </div>

                  <div className="from-group row">
                    <br>
                    </br>
                    <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", width: "100%" }}>
                      <h6>Deductions</h6>
                      {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                      <table style={{ width: "100%" }} class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                        <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                          {/* <td>Employee</td> */}
                          <td>Action</td>
                          <td>Deduction</td>
                          <td>Calculation Type</td>
                          <td>Factor</td>
                          <td>Amount</td>
                        </tr>
                        {defNew_MapEarningDeductionList?.map((obj, rightindex) => (
                          obj.transactionType == 'Deduction' &&
                          <><tr>
                            <td id={rightindex} onClick={deleteRow}> Delete</td>
                            <td>  <select style={{ width: "113px" }} onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                              <option value="-1"> --Select--</option>
                              {
                                dashboard.allDeductions?.map((x) => {
                                  return <option disabled={defNew_MapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select></td>
                            <td>
                              <td>
                                <select value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                  <option value="-1">--Select--</option>
                                  <option value="% Of Basic">% Of Basic</option>
                                  <option value="Fixed Amount">Fixed Amount</option>
                                </select>
                              </td></td>
                            {/* <td>{obj.transactionType}</td> */}
                            <td> <input disabled={obj.calculation_type == 'Fixed Amount'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged} value={obj.factorValue} id={'factorValue-' + rightindex}></input></td>
                            <td><input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged} value={obj.amount} id={'amount-' + rightindex}></input> </td>
                          </tr>
                          </>
                        ))}

                      </table>

                      <div className="from-group row">
                        <div className="col-12 col-md-4 mt-3">
                          <input type='button' id="Deduction" onClick={addRow} value='+Add'></input>
                        </div>
                        <div className="col-12 col-md-4 mt-3">
                        </div>

                      </div>
                      <br></br>
                      {<>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                          </div>

                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            Total Allowance <input type="number" disabled="true" value={totalAllowance} id="txtTotalAllowance"></input>
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            Gross Package <input disabled="true" value={values.new_grossSalary > 0 ? Number(values.new_grossSalary) + Number(totalGross) : Number(defNew_GrossSalary) + Number(totalGross)} type="number" id="txtGrossPackage"></input>
                          </div>
                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">

                          </div>

                          <div className="col-12 col-md-4 mt-3">
                            Total Deductions <input disabled="true" type="number" value={totalDeduction} id="txtTotalDeductions"></input>
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            Net Salary <input disabled="true" value={defNew_GrossSalary > 0 ? (Number(defNew_GrossSalary) + Number(totalGross)) - Number(totalDeduction) : Number(defNew_GrossSalary) + Number(totalGross)} type="number" id="txtGrossPackage"></input>
                          </div>
                        </div>
                        <div className="from-group row">
                          <div className="col-12 col-md-4 mt-3">

                          </div>
                          <div className="col-12 col-md-4 mt-3">
                          </div>

                        </div>


                      </>
                      }

                    </div>
                  </div>
                </div>

              </div>

            </fieldset>

          </Form>
            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </>

        )}


      </Formik >
    </>
  );
}
