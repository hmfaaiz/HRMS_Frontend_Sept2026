import { async } from "q";
import * as requestFromServer from "./dashboardCrud";
import { dashboardSlice } from "./dashboardSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SERVER_MESSAGES } from "../../../utils/constants";

const { actions } = dashboardSlice;

// export const fetchAllCenters = () => async (dispatch) => {
//   return await requestFromServer
//     .getAllCeters()
//     .then((response) => {
//       const entities = response.data?.data;
//       dispatch(actions.AllCentersFetch(entities));
//     })
//     .catch((error) => {
//       toast.error("Some thing went wrong");
//     });
// };

export const fetchAllSubCenter = (centerId) => async (dispatch) => {
  return await requestFromServer
    .getAllSubcenter(centerId)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllSubCenterFetch(entities));
    })
    .catch((error) => {
      toast.error("Some thing went wrong");
    });
};

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

// export const fetchAllDept = (id) => async (dispatch) => {
//
//   return await requestFromServer
//     .getAllDepartments(id)
//     .then((response) => {

//       const entities = response.data?.data;
//        dispatch(actions.AllDeptFetch(entities));
//     })
//     .catch((error) => {
//       toast.error("Something went wrong");
//     });
// };

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

export const getLastTrips = (body) => async (dispatch) => {
  return await requestFromServer
    .getLastTrips(body)
    .then((response) => {
      dispatch(actions.lastTripsVehicles(response?.data?.data));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const updateTripLog = (payload) => async (dispatch) => {
  return await requestFromServer
    .updateTripLog(payload)
    .then((response) => {
      const updatedUser = response?.data?.data;
      dispatch(actions.updateData(response?.data?.data));
      toast.success("Successfully Updated", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};

export const alaramTime = () => async (dispatch) => {
  return await requestFromServer
    .getAlaramTime()
    .then((response) => {
      dispatch(actions.AlaramTime(response?.data?.data));
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};

export const getEmployeeHierarchy = (level) => (dispatch) => {
  return requestFromServer
    .getEmployeeHierarchy(level)
    .then((res) => {
      const { levelList, employeeList } = res.data?.data;
      dispatch(actions.EmployeeHierarchyFetched({ levelList, employeeList }));
    })
    .catch((error) => {
      console.error("Error fetching employee hierarchy:", error);
      dispatch(
        actions.EmployeeHierarchyFetched({ levelList: [], employeeList: [] })
      );
      error.clientMessage = "Can't Get Employee Hierarchy";
    });
};

export const getLogedInEmployee = () => (dispatch) => {
  return requestFromServer
    .getEmployeeProfile()
    .then((res) => {
      const data = res.data?.data;
      dispatch(actions.fetchLogedInInEmployee(data));
    })
    .catch((error) => {
      console.error("Error fetching employee:", error);
      dispatch(actions.fetchLogedInInEmployee(null));
      error.clientMessage = "Can't Get Employee";
    });
};

export const fetchLeaveBalances = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getAllLeaveBalances({ employeeId })
      .then((response) => {
        dispatch(actions.LeaveBalancesFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Balances";
      });
  } else {
    dispatch(actions.LeaveBalancesFetched([]));
  }
};

export const fetchProfileInfo = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getProfileInfo({ Id: employeeId })
      .then((response) => {
        dispatch(actions.ProfileInfoFetched(response?.data?.data || null));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Profile Info";
      });
  } else {
    dispatch(actions.ProfileInfoFetched(null));
  }
};

export const fetchContactInfo = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getContactInfo({ Id: employeeId })
      .then((response) => {
        dispatch(actions.ContactInfoFetched(response?.data?.data || null));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Contact Info";
      });
  } else {
    dispatch(actions.ContactInfoFetched(null));
  }
};

export const fetchExperienceInfo = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getExperienceInfo({ Id: employeeId })
      .then((response) => {
        dispatch(actions.ExperienceInfoFetched(response?.data?.data || null));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Experience Info";
      });
  } else {
    dispatch(actions.ExperienceInfoFetched(null));
  }
};

export const fetchAcademicInfo = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getAcademicInfo({ Id: employeeId })
      .then((response) => {
        dispatch(actions.AcademicInfoFetched(response?.data?.data || null));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Academic Info";
      });
  } else {
    dispatch(actions.AcademicInfoFetched(null));
  }
};

export const fetchSkillsInfo = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getSkillsInfo({ Id: employeeId })
      .then((response) => {
        dispatch(actions.SkillsInfoFetched(response?.data?.data || null));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Skills Info";
      });
  } else {
    dispatch(actions.SkillsInfoFetched(null));
  }
};

export const fetchReportingEmployee = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getReportingEmployee({ Id: employeeId })
      .then((response) => {
        dispatch(
          actions.ReportingEmployeeFetched(response?.data?.data || null)
        );
      })
      .catch((error) => {
        error.clientMessage = "Can't find reporting employee";
      });
  } else {
    dispatch(actions.ReportingEmployeeFetched(null));
  }
};

export const fetchLoanDetail = (employeeId) => async (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getLoanDetail({ Id: employeeId })
      .then((response) => {
        dispatch(actions.AllLoanFetch(response?.data?.data || null));
      })
      .catch((error) => {
        error.clientMessage = "Can't find loan";
      });
  } else {
    dispatch(actions.AllLoanFetch(null));
  }
};

export const fetchHolidayDetail = (employeeId) => async (dispatch) => {
  return requestFromServer
    .getHolidayDetail({ Id: employeeId })
    .then((response) => {
      dispatch(actions.AllHolidayFetch(response?.data?.data || null));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Holidays";
    });
};

export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  } else {
    return requestFromServer
      .getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
};

//// dashbaord related service

export const fetchDashboardAlert = (body) => async (dispatch) => {
  return await requestFromServer
    .getDashboardAlert(body)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AllDashboardAlertsFetch(entities));
    })
    .catch((error) => {
      dispatch(actions.AllDashboardAlertsFetch([]));
    });
};

export const fetchSummary = (filter) => async (dispatch) => {
  return await requestFromServer
    .getSummary(filter)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.SummaryFetch(entities));
    })
    .catch((error) => {
      dispatch(actions.SummaryFetch({}));
    });
};

export const fetchSummaryDetail = (filter, name) => async (dispatch) => {
  if (filter && name) {
    return await requestFromServer
      .getSummaryDetail({ filter, name })
      .then((response) => {
        const entities = response.data?.data;
        dispatch(actions.SummaryDetailFetch(entities));
      })
      .catch((error) => {
        dispatch(actions.SummaryDetailFetch(null));
      });
  } else {
    dispatch(actions.SummaryDetailFetch(null));
  }
};

// export const fetchRecruitmentSummary = (filter) => async (dispatch) => {
//   return await requestFromServer
//     .getRecruitmentSummary(filter)
//     .then((response) => {
//       const entities = response.data?.data;
//       dispatch(actions.RecruitmentSummaryFetch(entities));
//     })
//     .catch((error) => {
//       dispatch(actions.RecruitmentSummaryFetch({}));
//     });
// };

export const fetchAnnouncementData = () => async (dispatch) => {
  return await requestFromServer
    .getAnnouncment()
    .then((response) => {
      const data = response.data?.data;
      dispatch(actions.AnnouncementFetch(data));
    })
    .catch((error) => {
      dispatch(actions.AnnouncementFetch([]));
    });
};

export const fetchExitReasonData = (Id) => async (dispatch) => {
  return await requestFromServer
    .getExitReason(Id)
    .then((response) => {
      const data = response.data?.data;
      dispatch(actions.AllExitReasonListFetch(data));
    })
    .catch((error) => {
      dispatch(actions.AllExitReasonListFetch([]));
    });
};


export const getAttendance = (setLoading) => (dispatch) => {
  return requestFromServer
    .getAttendance()
    .then((res) => {
      dispatch(actions.CurrentAttFetch(res?.data?.data));
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
    });
};

export const createAttendance = (body, setLoading) => (dispatch) => {
  return requestFromServer
    .createAttendance(body)
    .then((res) => {
      dispatch(actions.CurrentAttFetch(res?.data?.data));
      toast.success("Attendance Mark Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    })
    .catch((error) => {
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.insertedFail,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      setLoading(false);
    });
};

export const fetchAllUserData = (Id) => async (dispatch) => {
  return await requestFromServer
    .getAllUser(Id)
    .then((response) => {
      const data = response.data?.data;
      dispatch(actions.AllUserFetch(data));
    })
    .catch((error) => {
      dispatch(actions.AllUserFetch([]));
    });
};
export const fetchAllAuditTablesName = (userId) => async (dispatch) => {
  return await requestFromServer
    .getAllAuditTablesName({userId})
    .then((response) => {
      const data = response.data?.data;
      dispatch(actions.AllAuditTablesNameFetch(data));
    })
    .catch((error) => {
      dispatch(actions.AllAuditTablesNameFetch([]));
    });
};



export const fetchAllFiscalYearDataBySubsidiaryId = (subsidiaryId) => async (dispatch) => {
  return await requestFromServer
    .getAllFiscalYearBySubsidiaryId({ subsidiaryId })
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllFiscalYearBySubListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllDepartmentBySubsidiaryIds = (subsidiaryIds) => async (dispatch) => {
  return await requestFromServer
    .getAllDepartmentBySubsidiaryIds({ subsidiaryIds })
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllDepartmentBysSubIdsListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};


export const fetchAllAppraisalPeriod = (employeeId) => async (dispatch) => {
  return await requestFromServer
    .getAllAppraisalPeriod({employeeId})
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllAppraisalPeriodListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};
export const fetchAllAppraisalPeriodDataBySubsidiaryId = (subsidiaryId) => async (dispatch) => {
  return await requestFromServer
    .getAllAppraisalPeriodBySubsidiaryId({ subsidiaryId })
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllAppraisalPeriodBySubListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchAllApprovedResignedEmp= () => async (dispatch) => {
  return await requestFromServer
    .getAllApprovedResignedEmp({})
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllApprovedResignedEmpListFetch(entities));
    })
    .catch((error) => {
      toast.error("Something went wrong");
    });
};

export const fetchGeoLocationBySubsidiary= (subsidiaryId) => async (dispatch) => {
  return await requestFromServer
    .getAllGeoLocationBySubsidiary({subsidiaryId})
    .then((response) => {
      const entities = [...response.data?.data];
      dispatch(actions.AllGeoLocationFetchedFetch(entities));
    })
    .catch((error) => {
      console.log("Something went wrong" , error);
    });
};

export const fetchEmpDeviceId= (employeeId) => async (dispatch) => {
  return await requestFromServer
    .getDeviceIdByEmpId({employeeId})
    .then((response) => {
      const entities = [...response.data?.data];
      return entities
    })
    .catch((error) => {
      console.log("Something went wrong" , error);
    });
};


export const fetchAllEarning = (

) => async (dispatch) => {
  return await requestFromServer
    .getAllEarning()
    .then((response) => {
       const entities = Array.isArray(response?.data?.data)
      ? response.data.data
      : [];

      dispatch(actions.AllEarningFetch(entities));
    })
    .catch((error) => {
      
      toast.error("Something went wrong");
    });
};

export const fetchSeparatedEmployeeById = (Id

) => async (dispatch) => {
  return await requestFromServer
    .getSeparatedEmployeeById(Id)
    .then((response) => {

      dispatch(actions.SeparatedEmployeeFetch(response.data));
    })
    .catch((error) => {
      
      toast.error("Something went wrong");
    });
};

export const FetchAllSalaryRoundingByFilters = (

) => async (dispatch) => {
  return await requestFromServer
    .getAllSalaryRoundingByFilters()
    .then((response) => {

      dispatch(actions.SalaryRoundingFetch(response?.data?.data));
    })
    .catch((error) => {
  
      toast.error("Something went wrong");
    });
};


export const FetchProfileDetailInfo = (id

) => async (dispatch) => {
  return await requestFromServer
    .getProfileDetailInfo(id)
    .then((response) => {

      dispatch(actions.ProfileDetailInfoFetch(response?.data?.data));
    })
    .catch((error) => {
  
      toast.error("Something went wrong");
    });
};

export const FetchAllApprovedFSEmp = (body

) => async (dispatch) => {
  return await requestFromServer
    .getAllApprovedFSEmp(body)
    .then((response) => {

      dispatch(actions.FSApprovedEmpFetch(response?.data?.data));
    })
    .catch((error) => {
  
      toast.error("Something went wrong");
    });
};

export const FetchAllTaxYearSetup = (
subsidiaryId
) => async (dispatch) => {
  return await requestFromServer
    .getAllTaxYearSetup(subsidiaryId)
    .then((response) => {

      dispatch(actions.TaxYearSetupFetch(response?.data?.data));
    })
    .catch((error) => {
  
      toast.error("Something went wrong");
    });
};


export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return await requestFromServer.uploadFiles(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {

      toast.error(error?.response?.data?.message || SERVER_MESSAGES.fileFail, {
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
