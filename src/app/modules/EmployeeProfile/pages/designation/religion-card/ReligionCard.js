import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { DesignationTable } from "../designation-table/DesignationTable";
import { useDesignationUIContext } from "../DesignationUIContext";
import { BanksFilter } from "../bank-filter/BanksFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import * as actions from "../../../_redux/designationActions";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

export function ReligionCard() {
  const designationUIContext = useDesignationUIContext();

  const dispatch = useDispatch();
  const DesignationUIProps = useMemo(() => {
    return {
      newAcademicButtonClick: designationUIContext.newAcademicButtonClick,
      newDesignationButtonClick: designationUIContext.newDesignationButtonClick,
      openEditDesignationDialog: designationUIContext.openEditDesignationDialog,
    };
  }, [designationUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Profile,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateProfile"
  );

  const DesignationUIContext = useDesignationUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: DesignationUIContext.queryParams,
      setQueryParams: DesignationUIContext.setQueryParams,
    };
  }, [DesignationUIContext]);

  const fetchInctive = () => {
    const updatedQueryParams = {
      ...usersUIProps.queryParams,
      isActive: false,
      pageNumber: 1, // Toggle the isActive flag
    };

    // Set the updated queryParams
    usersUIProps.setQueryParams(updatedQueryParams);
    // initialFilter.isActive = false

    dispatch(actions.fetchUsers(usersUIProps.queryParams));
  };

  const fetchActive = () => {
    const updatedQueryParams = {
      ...usersUIProps.queryParams,
      isActive: true,
      pageNumber: 1, // Toggle the isActive flag
    };

    // Set the updated queryParams
    usersUIProps.setQueryParams(updatedQueryParams);
    // initialFilter.isActive = true

    dispatch(actions.fetchUsers(usersUIProps.queryParams));
  };

  return (
    // <>
    //   <Card>
    //     <CardHeader
    //       title={
    //         CurrentModuleName() +
    //         (usersUIProps.queryParams.isActive
    //           ? "  ( Active )"
    //           : "  ( Inactive )")
    //       }
    //     >
    //       <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
    //         <div className="col-6">
    //           <BanksFilter />
    //         </div>

    //         <div className=" p-2">
    //           <CardHeaderToolbar>
    //             {usersUIProps.queryParams.isActive ? (
    //               <button
    //                 type="button"
    //                 className="btn btn-red   ml-5 mr-5"
    //                 onClick={fetchInctive}
    //               >
    //                 Inactive Employee
    //               </button>
    //             ) : (
    //               <button
    //                 type="button"
    //                 className="btn btn-green  ml-5 mr-5"
    //                 onClick={fetchActive}
    //               >
    //                 Active Employee
    //               </button>
    //             )}

    //             {accessUser && (
    //               <button
    //                 type="button"
    //                 className="btn btn-primary"
    //                 onClick={DesignationUIProps.newDesignationButtonClick}
    //               >
    //                 + Add Employee Profile
    //               </button>
    //             )}
    //           </CardHeaderToolbar>
    //         </div>
    //       </div>
    //     </CardHeader>

    //     <CardBody>
    //       <DesignationTable />
    //       {/* <DesignationEditDialog/> */}
    //     </CardBody>
    //   </Card>
    <TCard
      name={
        CurrentModuleName() +
        (usersUIProps.queryParams.isActive ? "  ( Active )" : "  ( Inactive )")
      }
    >
      <div className="flex justify-between items-center">
        <div>
          <button
            type="button"
            className={`btn mr-2 rounded-xl ${
              usersUIProps.queryParams.isActive
                ? "bg-black text-white"
                : "btn-secondary"
            }`}
            onClick={fetchActive}
          >
            Active Employee
          </button>
          <button
            type="button"
            className={`btn mr-2 rounded-xl ${
              !usersUIProps.queryParams.isActive
                ? "bg-black text-white"
                : "btn-secondary"
            }`}
            onClick={fetchInctive}
          >
            Inactive Employee
          </button>
        </div>
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <BanksFilter />
          <div className="flex items-center gap-2">
            {/* <CardHeaderToolbar> */}
            {accessUser && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={DesignationUIProps.newDesignationButtonClick}
                >
                  <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                  Add Employee Profile
                </button>
              </>
            )}
            {/* </CardHeaderToolbar> */}
          </div>
        </div>
      </div>
      <DesignationTable />
    </TCard>
    // </>
  );
}
