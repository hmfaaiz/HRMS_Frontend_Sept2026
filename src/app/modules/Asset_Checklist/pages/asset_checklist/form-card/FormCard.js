import React, { useEffect, useMemo } from "react";

import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";

import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import { fetchAllAssetModelName, fetchAllPresentUnassignedCategory, fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAssetInspectionList } from "../../../_redux/redux-Actions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => {

      return {
        userAccess: state.auth.userAccess.asset_checklist,
      };
    },
    shallowEqual
  );
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAssetChecklist"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.asset_checklist,
      userAccess: state?.auth?.userAccess["asset_checklist"],
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
    dispatch(fetchAllRegisterAssetName());
    dispatch(fetchAllAssetModelName());

  }, []);


  return (

    <TCard name={CurrentModuleName()}>

      <div className="grid md:grid-cols-8 gap-3 mb-2">



        <div>
          <SearchSelect
            name="asset_categoryId"
            label={
              <span>
                Asset Category
              </span>
            }
            value={
              [
                { label: "All", value: "" },
                ...(Array.isArray(dashboard?.allAssetCategoryList)
                  ? dashboard.allAssetCategoryList
                  : []),
              ].find(
                (item) =>
                  String(item.value) ===
                  String(FormUIProps.queryParams?.asset_categoryId ?? "")
              ) || { label: "All", value: "" }
            }
            onChange={(e) => {
              const updatedQueryParams = {
                ...FormUIProps.queryParams,
                asset_categoryId: e?.value ?? "",
                asset_modelId:  "",
                asset_registerId:  "",
                pageNumber: 1,
              };
              dispatch(fetchAllRegisterAssetName({ asset_categoryId: e?.value ?? "", asset_modelId: FormUIProps.queryParams?.asset_modelId ?? "" }));
              dispatch(fetchAllAssetModelName({ asset_categoryId: e?.value ?? "" }));


              FormUIProps.setQueryParams(updatedQueryParams);

              dispatch(fetchAssetInspectionList(updatedQueryParams));


            }}
            options={[
              { label: "All", value: "" },
              ...(Array.isArray(dashboard?.allAssetCategoryList)
                ? dashboard.allAssetCategoryList
                : []),
            ]}
          />
        </div>
        <div>
          <SearchSelect
            name="asset_categoryId"
            label={
              <span>
                Asset Model Name
              </span>
            }
            value={
              [
                { label: "All", value: "" },
                ...(Array.isArray(dashboard?.allAssetModelNameList)
                  ? dashboard.allAssetModelNameList
                  : []),
              ].find(
                (item) =>
                  String(item.value) ===
                  String(FormUIProps.queryParams?.asset_modelId ?? "")
              ) || { label: "All", value: "" }
            }
            onChange={(e) => {
              const updatedQueryParams = {
                ...FormUIProps.queryParams,
                asset_modelId: e?.value ?? "",
                asset_registerId:  "",
                pageNumber: 1,
              };


              dispatch(fetchAllRegisterAssetName({ asset_modelId: e?.value ?? "", asset_categoryId: FormUIProps.queryParams?.asset_categoryId ?? "" }));



              FormUIProps.setQueryParams(updatedQueryParams);

              dispatch(fetchAssetInspectionList(updatedQueryParams));


            }}
            options={[
              { label: "All", value: "" },
              ...(Array.isArray(dashboard?.allAssetModelNameList)
                ? dashboard.allAssetModelNameList
                : []),
            ]}
          />
        </div>


        <div>
          <SearchSelect
            name="asset_registerId"
            label={
              <span>
                Asset
              </span>
            }
            value={
              [
                { label: "All", value: "" },
                ...(Array.isArray(dashboard?.allRegisterAssetList)
                  ? dashboard.allRegisterAssetList
                  : []),
              ].find(
                (item) =>
                  String(item.value) ===
                  String(FormUIProps.queryParams?.asset_registerId ?? "")
              ) || { label: "All", value: "" }
            }
            onChange={(e) => {
              const updatedQueryParams = {
                ...FormUIProps.queryParams,
                asset_registerId: e?.value ?? "",
                pageNumber: 1,
              };

              FormUIProps.setQueryParams(updatedQueryParams);

              dispatch(fetchAssetInspectionList(updatedQueryParams));
            }}
            options={[
              { label: "All", value: "" },
              ...(Array.isArray(dashboard?.allRegisterAssetList)
                ? dashboard.allRegisterAssetList
                : []),
            ]}
          />
        </div>


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

                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}
        </div>
      </div>
      <FormTable />
    </TCard>
    // </>
  );
}
