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
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { assetStatusOptions } from "../FormUIHelpers";
import { fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";

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

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
    dispatch(fetchAllRegisterAssetName());
  }, [dispatch]);

  // ✅ NEW: Set default selections when data loads
  useEffect(() => {
    // Set default for asset_categoryId (select all by default)
    if (dashboard?.allAssetCategoryList && 
        dashboard.allAssetCategoryList.length > 0 && 
        (!FormUIProps.queryParams.asset_categoryId || 
         FormUIProps.queryParams.asset_categoryId.length === 0)) {
      
      const allCategoryValues = dashboard.allAssetCategoryList.map(item => item.value);
      const updatedQueryParams = {
        ...FormUIProps.queryParams,
        asset_categoryId: allCategoryValues,
      };
      FormUIProps.setQueryParams(updatedQueryParams);
      // Don't dispatch fetch here to avoid multiple calls
    }

    // Set default for asset_registerId (select all by default)
    if (dashboard?.allRegisterAssetList && 
        dashboard.allRegisterAssetList.length > 0 && 
        (!FormUIProps.queryParams.asset_registerId || 
         FormUIProps.queryParams.asset_registerId.length === 0)) {
      
      const allAssetValues = dashboard.allRegisterAssetList.map(item => item.value);
      const updatedQueryParams = {
        ...FormUIProps.queryParams,
        asset_registerId: allAssetValues,
      };
      FormUIProps.setQueryParams(updatedQueryParams);
      // Don't dispatch fetch here to avoid multiple calls
    }
  }, [dashboard?.allAssetCategoryList, dashboard?.allRegisterAssetList]);

  return (
    <>
      <TCard name={CurrentModuleName()}>
        <div className="grid md:grid-cols-8 gap-3 mb-2">
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
        </div>

        <div className="grid md:grid-cols-8 gap-3 mb-2">
          {/* ✅ FIXED: asset_categoryId - Now shows all selected by default AND clears properly */}
          <MultiSelect
            name="asset_categoryId"
            label="Asset Category"
            value={
              (dashboard?.allAssetCategoryList || []).filter((o) =>
                (FormUIProps.queryParams.asset_categoryId || []).includes(o.value)
              )
            }
            options={dashboard?.allAssetCategoryList || []}
            onChange={(items = []) => {
              const updatedQueryParams = {
                ...FormUIProps.queryParams,
                asset_categoryId: items.map((i) => i.value),
                pageNumber: 1,
              };
              FormUIProps.setQueryParams(updatedQueryParams);
              dispatch(fetchAssetRegisters(updatedQueryParams));
            }}
          />

          {/* ✅ FIXED: assetStatus - Already working fine */}
          <MultiSelect
            name="assetStatus"
            label="Asset Status"
            value={assetStatusOptions.filter((o) =>
              (FormUIProps.queryParams.assetStatus || []).includes(o.value)
            )}
            options={assetStatusOptions}
            onChange={(items = []) => {
              const updatedQueryParams = {
                ...FormUIProps.queryParams,
                assetStatus: items.map((i) => i.value),
                pageNumber: 1,
              };
              FormUIProps.setQueryParams(updatedQueryParams);
              dispatch(fetchAssetRegisters(updatedQueryParams));
            }}
          />

          {/* ✅ FIXED: asset_registerId - Now shows all selected by default AND clears properly */}
          <MultiSelect
            name="asset_registerId"
            label="Asset"
            value={
              (dashboard?.allRegisterAssetList || []).filter((o) =>
                (FormUIProps.queryParams.asset_registerId || []).includes(o.value)
              )
            }
            options={dashboard?.allRegisterAssetList || []}
            onChange={(items = []) => {
              const updatedQueryParams = {
                ...FormUIProps.queryParams,
                asset_registerId: items.map((i) => i.value),
                pageNumber: 1,
              };
              FormUIProps.setQueryParams(updatedQueryParams);
              dispatch(fetchAssetRegisters(updatedQueryParams));
            }}
          />
        </div>

        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <FormFIlter />
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        <FormTable />
      </TCard>
    </>
  );
}