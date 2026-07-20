import React, { useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, UserRoundCheck, UserRoundX } from "lucide-react";
import { fetchAllActiveEmployees, fetchAllDept, fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAssetRegisters } from "../../../_redux/redux-Actions";
import { fetchAllAssetModelName, fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";

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
      userAccess: state.auth.userAccess.asset_disposal,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAssetDisposal"
  );
  const { dashboard } = useSelector((state) => state);
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.asset_disposal,
      userAccess: state?.auth?.userAccess["asset_disposal"],
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
    dispatch(fetchAllRegisterAssetName({status:2}));
    dispatch(fetchAllAssetModelName());

  }, []);

  return (
    <>

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
                  asset_modelId: "",
                  asset_registerId: "",
                  pageNumber: 1,
                };
                dispatch(fetchAllRegisterAssetName({status:2, asset_categoryId: e?.value ?? "", asset_modelId: FormUIProps.queryParams?.asset_modelId ?? "" }));
                dispatch(fetchAllAssetModelName({ asset_categoryId: e?.value ?? "" }));


                FormUIProps.setQueryParams(updatedQueryParams);

                dispatch(fetchAssetRegisters(updatedQueryParams));


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
                  asset_registerId: "",
                  pageNumber: 1,
                };


                dispatch(fetchAllRegisterAssetName({status:2, asset_modelId: e?.value ?? "", asset_categoryId: FormUIProps.queryParams?.asset_categoryId ?? "" }));



                FormUIProps.setQueryParams(updatedQueryParams);

                dispatch(fetchAssetRegisters(updatedQueryParams));


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

                dispatch(fetchAssetRegisters(updatedQueryParams));
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
