import React, { useEffect, useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import { fetchAllActiveEmployees, fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAssetRegisters } from "../../../_redux/redux-Actions";
export function FormCard() {
  const FormUIContext = useFormUIContext();
const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.asset_register,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAssetRegister"
  );
 const { dashboard } = useSelector((state) => state);
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.asset_register,
      userAccess: state?.auth?.userAccess["asset_register"],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  return (
    <>
   
      <TCard name={CurrentModuleName()}>

        <div className="grid md:grid-cols-8 gap-3 mb-2">
        
        
                  <div className="">
                    <div>
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            {" "}
                            Subsidiary
        
                          </span>
                        }
        
                        value={
                          (dashboard?.allSubsidiaryList || []).find(
                            (item) => item.value === FormUIProps?.queryParams?.subsidiaryId
                          ) || { label: "All", value: "" }
                        }
                        onChange={(e) => {
        
                          const updatedQueryParams = {
                            ...FormUIProps.queryParams,
                            subsidiaryId: e.value,
                            pageNumber: 1,
                          };
        
        
                          FormUIProps.setQueryParams(updatedQueryParams);
        
        
                          dispatch(fetchAssetRegisters(FormUIProps.queryParams));
                          dispatch(fetchAllDept(e.value));
                        }}
        
                        // options={dashboard.allSubsidiaryList}
                        options={[
                          { label: "All", value: "" },
                          ...(Array.isArray(dashboard?.allSubsidiaryList)
                            ? dashboard.allSubsidiaryList
                            : []),
                        ]}
                      />
                    </div>
        
                  </div>
                  <div>
                    <SearchSelect
                      name="departmentId"
                      label={
                        <span>
                          {" "}
                          Department
        
                        </span>
                      }
        
                      value={
                        (dashboard?.allDept || []).find(
                          (item) => item.value === FormUIProps?.queryParams?.departmentId
                        ) || { label: "All", value: "" }
                      }
                      onChange={(e) => {
        
                        const updatedQueryParams = {
                          ...FormUIProps.queryParams,
                          departmentId: e.value,
                          pageNumber: 1,
                        };
        
        
                        FormUIProps.setQueryParams(updatedQueryParams);
        
        
                        dispatch(fetchAssetRegisters(FormUIProps.queryParams));
                      }}
        
                      // options={dashboard.allDept}
                      options={[
                        { label: "All", value: "" },
                        ...(Array.isArray(dashboard?.allDept)
                          ? dashboard?.allDept
                          : []),
                      ]}
                    />
                  </div>
                  <div className="">
                    <div>
                      <SearchSelect
                        name="designationId"
                        label={
                          <span>
                            {" "}
                            Designation
        
                          </span>
                        }
        
        
                        value={
                          (dashboard?.allDesignations || []).find(
                            (item) => item.value === FormUIProps?.queryParams?.designationId
                          ) || { label: "All", value: "" }
                        }
                        onChange={(e) => {
        
                          const updatedQueryParams = {
                            ...FormUIProps.queryParams,
                            designationId: e.value,
                            pageNumber: 1,
                          };
        
        
                          FormUIProps.setQueryParams(updatedQueryParams);
        
        
                          dispatch(fetchAssetRegisters(FormUIProps.queryParams));
                        }}
        
                        // options={dashboard?.allDesignations}
                        options={[
                          { label: "All", value: "" },
                          ...(Array.isArray(dashboard?.allDesignations)
                            ? dashboard?.allDesignations
                            : []),
                        ]}
                      />
                    </div>
                  </div>
        
                  <div className="">
                    <div>
                      <SearchSelect
                        name="employeeId"
                        label={
                          <span>
                            {" "}
                            Employee
        
                          </span>
                        }
        
                        value={
                          (dashboard?.allEmployees || []).find(
                            (item) => item.value === FormUIProps?.queryParams?.employeeId
                          ) || { label: "All", value: "" }
                        }
                        onChange={(e) => {
        
                          const updatedQueryParams = {
                            ...FormUIProps.queryParams,
                            employeeId: e.value,
                            pageNumber: 1,
                          };
        
        
                          FormUIProps.setQueryParams(updatedQueryParams);
        
        
                          dispatch(fetchAssetRegisters(FormUIProps.queryParams));
                        }}
        
                        // options={dashboard.allDept}
                        options={[
                          { label: "All", value: "" },
                          ...(Array.isArray(dashboard?.allEmployees)
                            ? dashboard?.allEmployees
                            : []),
                        ]}
                      />
                    </div>
                  </div>
        
        
                
        
        
        
                </div>
        
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <FormFIlter />

          <div className="flex items-center gap-2">
            {/* <CardHeaderToolbar> */}
            {accessUser && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={FormUIProps.newFormButtonClick}
                >
                  <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                  Add
                </button>
              </>
            )}
            {/* </CardHeaderToolbar> */}
          </div>
        </div>
        <FormTable />
      </TCard>
    </>
  );
}
