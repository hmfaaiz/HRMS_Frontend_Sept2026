import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { BanksTable } from "../bank-table/BanksTable";
import { useBanksUIContext } from "../BanksUIContext";
import { BanksFilter } from "../bank-filter/BanksFIlter";
import { useSelector, shallowEqual,useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus, FileText } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import TCard from "../../../../../utils/common-modules/TCard";
import { clearData } from "../../../_redux/bankActions";
import * as actions from "../../../_redux/bankActions";
export function BanksCard({onHide}) {
  const banksUIContext = useBanksUIContext();
  const BanksUIProps = useMemo(() => {
    return {
      newBankButtonClick: banksUIContext.newBankButtonClick,
      openEditBankDialog: banksUIContext.openEditBankDialog,
      panelMode: banksUIContext.panelMode,
      setPanelMode: banksUIContext.setPanelMode,
        queryParams: banksUIContext.queryParams,
      setQueryParams: banksUIContext.setQueryParams,
    };
  }, [banksUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Employee_Salary,
    }),
    shallowEqual
  );
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeSalary"
  );
const dispatch = useDispatch();

  const fetchInctive = () => {
    onHide()
    dispatch(actions.clearData());
    const updatedQueryParams = {
      ...BanksUIProps.queryParams,
      isActive: false,
      pageNumber: 1, // Toggle the isActive flag
    };

    // Set the updated queryParams
    BanksUIProps.setQueryParams(updatedQueryParams);
    // initialFilter.isActive = false

    dispatch(actions.fetchUsers(BanksUIProps.queryParams));
  };

  const fetchActive = () => {
    onHide()
    dispatch(actions.clearData());
    const updatedQueryParams = {
      ...BanksUIProps.queryParams,
      isActive: true,
      pageNumber: 1, // Toggle the isActive flag
    };

    // Set the updated queryParams
    BanksUIProps.setQueryParams(updatedQueryParams);
    // initialFilter.isActive = true

    dispatch(actions.fetchUsers(BanksUIProps.queryParams));
  };
  return (
    // <>

    //   <Card>
    //     <CardHeader title={CurrentModuleName()}>
    //      <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
    //         <div className="col-6">
    //           <BanksFilter />
    //         </div>
    //         <div className=" p-2">
    //           <CardHeaderToolbar>
    //             {accessUser ? (
    //               <button
    //                 type="button"
    //                 className="btn btn-primary"
    //                 onClick={BanksUIProps.newBankButtonClick}
    //               >
    //                 + Add Employee Salary
    //               </button>
    //             ) : (
    //               <></>
    //             )}
    //           </CardHeaderToolbar>
    //         </div>
    //       </div>
    //     </CardHeader>

    //     <CardBody>

    //       <BanksTable />
    //     </CardBody>
    //   </Card >
    <TCard name={CurrentModuleName()}>

         <div className="grid md:grid-cols-6">

            <div className="">
              <button
                type="button"
                className={`btn mr-2 rounded-xl ${BanksUIProps.queryParams?.isActive
                  ? "bg-black text-white"
                  : "btn-secondary"
                  }`}
                onClick={fetchActive}
              >
                Active Employee
              </button>
            </div>
            <div className="">
              <button
                type="button"
                className={`btn mr-2 rounded-xl ${!BanksUIProps.queryParams?.isActive
                  ? "bg-black text-white"
                  : "btn-secondary"
                  }`}
                onClick={fetchInctive}
              >
                Inactive Employee
              </button>
            </div>



          </div>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <BanksFilter />
        <div className="flex items-center gap-2">
          {/* <CardHeaderToolbar> */}
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={()=>{
                  dispatch(clearData());
                  BanksUIProps.newBankButtonClick()}}
              >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                Add
              </button>
            </>
          )}
        </div>
      </div>
      <BanksTable />
    </TCard>
    // </>
  );
}
