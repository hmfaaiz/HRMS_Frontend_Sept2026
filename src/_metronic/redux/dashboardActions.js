import { async } from "q";
import * as requestFromServer from "./dashboardCrud";
import { format } from 'date-fns';
import { dashboardSlice, callTypes } from "./dashboardSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { actions } = dashboardSlice;

export const fetchAllCountry = () => async (dispatch) => {
  return await requestFromServer
    .getAllCountry()
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllCountryFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllActiveEmployees = (data={}) => async (dispatch) => {

  return await requestFromServer
    .getAllActiveEmployees(data)
    .then((response) => {
      const entities = response.data?.data;

      dispatch(actions.AllActiveEmployeeFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllActiveEmployeesBySubsidiary = (subsidiaryId) => async (dispatch) => {
  return await requestFromServer
    .getAllActiveEmployeesBySubsidiary({subsidiaryId})
    .then((response) => {
      const entities = response.data?.data;

      dispatch(actions.AllActiveEmployeeFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchEmpSalaryRevisionByEmployeeId = (employeeId) => async (dispatch) => {
  return await requestFromServer
    .getAllEmployeeSalaryReviewForDDL(employeeId)
    .then((response) => {
      const formatDates = (dataArray) => {

        return dataArray.map(item => ({
          ...item,
          label: format(new Date(item.label), 'dd/MM/yyyy') // Format to 'Month Year'
        }));
      };

      const entities = formatDates(response.data.data);

      dispatch(actions.AllEmpSalaryReviewDate(entities));
      return response?.data?.data.length || 0;
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllActiveEmployeesSalaryForDDL = (employeeId) => async (dispatch) => {
  return await requestFromServer
    .getAllActiveEmployeesSalaryForDDL(employeeId)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllActiveEmployeeSalaryDDL(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};





export const fetchAllEarningDeductionList = (Id) => async (dispatch) => {
  return await requestFromServer
    .getAllEarningDeductionList(Id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllEarningDeductionListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllEarningList = (Id, subsidiaryId, employeeId = '', excludeBasic = false) => async (dispatch) => {
  return await requestFromServer
    .getAllEarningDeductionList(Id, subsidiaryId, employeeId, excludeBasic)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllEarningHeadsFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllDeductionList = (Id, subsidiaryId, employeeId = '') => async (dispatch) => {
  return await requestFromServer
    .getAllEarningDeductionList(Id, subsidiaryId, employeeId)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllDeductionHeadsFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllEmpCompensationBenefitsForDDL = (Id) => async (dispatch) => {
  return await requestFromServer
    .getAllEmp_Compensation_Benefits_DDL()
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllCompensationBenefitsListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllDept = (id) => async (dispatch) => {

  return await requestFromServer
    .getAllDepartments(id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.AllDeptFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Get Data for dropdown according to id and set it in state on the key provided
 * text key is sent so that when fetching dopdown data if text key has value it will add default entry in array for that value
 * 
 * like if text = 'All' the response will have 1 default object {label: 'All', value : null}
 * if text is not provided then response will have 1 default object {label: '--Select--', value: null}
 * 
 * @param {String|Number} id 
 * @param {string} key 
 * @param {string} text 
 * @returns 
 */
export const fetchAllFormsMenu = (id, key, text = null, mergeLabel = false) => async (dispatch) => {
  return await requestFromServer
    .getAllFormMenus(id, text, mergeLabel)
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Get All leave Types Data from Server and set it in state on the key provided in argument
 * EmployeeId key is an optional parameter to send to request. If employeeId value is sent to the server then it's response will have leave Types that are accessible to that employee Only
 * otherwise if not provided by default its value will be null that means response will have all leave types 
 * 
 * @param {String} key 
 * @returns 
 */
export const fetchAllLeaveType = (key, employeeId = null) => async (dispatch) => {
  return await requestFromServer
    .getAllLeaveTypes({ employeeId })
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Get All leave Types Data from Server and set it in state on the key provided in argument
 * Get Leave Type according to Subsidiary. If Subsidiary is not present then it will bring empty array.
 * 
 * @param {String} key 
 * @param {String|Number} subsidiaryId 
 * @returns 
 */
export const fetchAllLeaveTypeBySubsidiary = (key, subsidiaryId = null) => async (dispatch) => {
  return await requestFromServer
    .getAllLeaveTypesBySubsidiary({ subsidiaryId })
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Get All leave Types Data from Server and set it in state on the key provided in argument
 * It will only get Leave Type Data that are of Encashable for current year
 * 
 * @param {String} key 
 * @returns 
 */
export const fetchEncashmentLeaveType = (key, employeeId = null, yearId = null) => async (dispatch) => {
  return await requestFromServer
    .getAllEncashmentLeaveTypes({ employeeId, yearId })
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Get All Employee Shift Data from Server and set it in state on the key provided in argument
 * 
 * @param {String} key 
 * @returns 
 */
export const fetchAllEmployeeShifts = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllEmployeeShift()
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Get Current Payroll Month data from server and set it in state on the key provided in argument
 * 
 * @param {String} key 
 * @returns 
 */
export const getPayrollMonth = (key) => (dispatch) => {
  return requestFromServer.getPayrollMonth()
    .then((res) => {
      const payrollData = res.data?.data;
      dispatch(actions.AllChildMenusFetch({ entities: payrollData, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
}

/**
 * 
 * Get Current Active Fiscal Year data from server and set it in state on the key provided in argument
 * 
 * @param {String} key 
 * @returns 
 */
export const getActiveFiscalYear = (key, subsidiaryId) => (dispatch) => {
  return requestFromServer.getActiveFiscalYear({subsidiaryId})
    .then((res) => {
      const fiscalData = res.data?.data;
      dispatch(actions.AllChildMenusFetch({ entities: fiscalData, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
}

/**
 * 
 * Get All Subsidiaries Data from Server and set it in state on the key provided in argument
 * 
 * @param {String} key 
 * @returns 
 */
export const fetchAllSubsidiaryData = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllSubsidiary()
    .then((response) => {

      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


/**
 * 
 * Get All Fiscal year Data in dropdown format from Server and set it in state on the key provided in argument
 * 
 * @param {String} key 
 * @returns 
 */
export const fetchAllFiscalYearData = (key, employeeId) => async (dispatch) => {
  return await requestFromServer
    .getAllFiscalYear({employeeId})
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllEarningHeads = (id) => async (dispatch) => {
  return await requestFromServer
    .getAllEarningHeads(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllBanksFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllBanks = (id) => async (dispatch) => {
  return await requestFromServer
    .getAllBanks(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllBanksFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllCompanyBanks = (id) => async (dispatch) => {
  return await requestFromServer
    .getAllBanks(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllCompanyBanksFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllBankBranch = (bankId) => async (dispatch) => {
  return await requestFromServer
    .getAllBankBranch({bankId})
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllBankBranchFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};



export const fetchAllCity = (cityId) => async (dispatch) => {
  return await requestFromServer
    .getCityByCountryId(cityId)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllCityFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};



export const fetchStandByVehicles = (body) => async (dispatch) => {
  return await requestFromServer
    .getVehiclesByCenterAndSubcenterId(body)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllVehiclesByCenterAndSubCenterId(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong.");
    });
};

export const fetchDashboardVehicles = (body) => async (dispatch) => {
  return await requestFromServer
    .getDashboardVehicle(body)
    .then((response) => {
      const entities = response.data.data;
      dispatch(actions.dashboardVehicles(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const updateVehicelStatus = (body) => async (dispatch) => {
  return await requestFromServer
    .updateVehicleStatus(body)
    .then((response) => {
      toast.success("Successfully Updated");
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const getLatestBookingNo = (bookingNo) => async (dispatch) => {
  return await requestFromServer
    .getLastBookingNo(bookingNo)
    .then((response) => {

      return response?.data?.data;
      // dispatch(receiptSlice.MaxIdFetchForReceipt(response?.data?.data));
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};

export const getLatestTableId = (tableName, pkIdColumn, whereClause, setValue = null) => async () => {
  return await requestFromServer
    .getLastTableId(tableName, pkIdColumn, whereClause)
    .then((response) => {
      if(setValue){
        setValue(response?.data?.data?.[0]?.NewId || '')
      }
      return response?.data?.data;
      // dispatch(receiptSlice.MaxIdFetchForReceipt(response?.data?.data));
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};


export const fetchAllHumanResourceRole = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllHumanResourceRole()
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllHumanResourceRoleListFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};




export const fetchAllReimbursementConfigList = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllReimbursementConfigList()
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllReimbursementConfigListFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });


};

export const fetchAllPayrollMonthYearList = (body, key) => async (dispatch) => {

  return await requestFromServer
    .getAllPayrollMonthYearList(body, key)
    .then((response) => {
      const entities = [...response.data?.data];

      dispatch(actions.AllPayrollMonthYearListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });


}

export const fetchAllComapnyData = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllCompany()
    .then((response) => {

      const entities = [...response.data?.data];
      dispatch(actions.AllChildMenusFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllEmployeesWithNoPermissionData = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllEmployeesWithNoPermission()
    .then((response) => {

      const entities = [...response.data?.data];
      dispatch(actions.AllEmployeesWithNoPermissionFetch( entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

/**
 * 
 * Download Excel Template
 * 
 * @param {Document} document 
 * @returns 
 */
export const downloadTemplateExcel = (document, type, fileName) => async (dispatch) => {
  return requestFromServer.downloadTemplate({type})
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't Download Template";
      toast.error(error.clientMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};


export const fetchPayrollConfigApproverPermission = (key) => async (dispatch) => {
  return await requestFromServer
    .getPayrollConfigApproverPermission()
    .then((response) => {
   
      const entities = [...response.data?.data];
      dispatch(actions.AllPayrollConfigApproverPermissionFetch({ entities, key }));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};



export const fetchAllRosterPattern = (key) => async (dispatch) => {
  return await requestFromServer
    .getAllRosterPattern()
    .then((response) => {
   
      const entities = [...response.data?.data];
      dispatch(actions.AllRosterPatternFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};



export const getAllLoanType = (body) => async (dispatch) => {
  return await requestFromServer
    .getAllLoanType(body)
    .then((response) => {
   
      const entities = [...response.data?.data];
      dispatch(actions.AllLoanTypeFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};