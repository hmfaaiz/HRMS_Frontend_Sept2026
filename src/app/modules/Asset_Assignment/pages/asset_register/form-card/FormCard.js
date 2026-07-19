import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, UserRoundCheck, UserRoundX } from "lucide-react";
import { fetchAllActiveEmployees, fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
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
      userAccess: state.auth.userAccess.asset_assignment,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAssetAssignment"
  );
  
  const { dashboard } = useSelector((state) => state);
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.asset_assignment,
      userAccess: state?.auth?.userAccess["asset_assignment"],
    };
  }, shallowEqual);

  const loading = currentState.actionsLoading;
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  // Check if Unassigned button is active (status === 0)
  const isUnassigned = FormUIProps?.queryParams?.status === 0;
  // Check if Assigned button is active (status === 1)
  const isAssigned = FormUIProps?.queryParams?.status === 1;

  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="grid md:grid-cols-8 gap-3 mb-2">
          
          {/*Conditionally hide filters when Unassigned is selected */}
          {!isUnassigned && (
            <>
              <div className="">
                <div>
                  <SearchSelect
                    name="subsidiaryId"
                    label={<span> Subsidiary</span>}
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
                      dispatch(fetchAssetRegisters(updatedQueryParams));
                      dispatch(fetchAllDept(e.value));
                    }}
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
                  label={<span> Department</span>}
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
                    dispatch(fetchAssetRegisters(updatedQueryParams));
                  }}
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
                    label={<span> Designation</span>}
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
                      dispatch(fetchAssetRegisters(updatedQueryParams));
                    }}
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
                    label={<span> Employee</span>}
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
                      dispatch(fetchAssetRegisters(updatedQueryParams));
                    }}
                    options={[
                      { label: "All", value: "" },
                      ...(Array.isArray(dashboard?.allEmployees)
                        ? dashboard?.allEmployees
                        : []),
                    ]}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 mt-3 col-span-12">
            <div className="">
              <button
                type="button"
                disabled={loading}
                className={`btn mr-2 rounded-xl ${isAssigned ? "bg-primary text-white" : "btn-secondary"}`}
                onClick={() => {
                  const updatedQueryParams = {
                    ...FormUIProps.queryParams,
                    status: 1,
                    pageNumber: 1,
                  };
                  FormUIProps.setQueryParams(updatedQueryParams);
                  dispatch(fetchAssetRegisters(updatedQueryParams));
                }}
              >
                Assigned Asset <UserRoundCheck size={12} />
              </button>
            </div>
            
            <div className="">
              <button
                type="button"
                disabled={loading}
                
                className={`btn mr-2 rounded-xl ${isUnassigned ? "bg-primary text-white" : "btn-secondary"}`}
                onClick={() => {
                  const updatedQueryParams = {
                    ...FormUIProps.queryParams,
                    status: 0,
                    pageNumber: 1,
                  };
                  FormUIProps.setQueryParams(updatedQueryParams);
                  dispatch(fetchAssetRegisters(updatedQueryParams));
                }}
              >
                Unassigned Asset <UserRoundX size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <FormFIlter />
          <div className="flex items-center gap-2">
            {accessUser && (
              <>
                <button
                  type="button"
                    disabled={loading}
                  className="btn btn-primary"
                  onClick={() => {
                    const updatedQueryParams = {
                      ...FormUIProps.queryParams,
                      status: 1,
                      pageNumber: 1,
                    };
                    FormUIProps.setQueryParams(updatedQueryParams);
                    FormUIProps.newFormButtonClick();
                  }}
                >
                  <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                  Add
                </button>
              </>
            )}
          </div>
        </div>
        <FormTable />
      </TCard>
    </>
  );
}