import React, { useEffect, useMemo } from "react";


import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";

import { useSelector, shallowEqual,useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { EmployeeSelect } from "../form-edit-dialog/employeeSelect";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { fetchAllActiveEmployees } from "../../../../../../_metronic/redux/dashboardActions";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      setemployeeId: FormUIContext.setemployeeId,
      id: FormUIContext.ids,
      employeeId: FormUIContext.employeeId,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
      readMode: FormUIContext.readMode,
      setReadMode: FormUIContext.setReadMode,
    };
  }, [FormUIContext]);

  const { userAccess,dashboard } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.employee_doc,
       dashboard: state.dashboard,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeDoc"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.employee_doc,
      userAccess: state?.auth?.userAccess["employee_doc"],
    };
  }, shallowEqual);

  useEffect(() => {
    if (!dashboard.employee || !dashboard.employee.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch, FormUIProps.employeeId]);

  const { entities } = currentState;

  // return (
  //   <>
  //     {/* <Card>
  //       <CardHeader title={CurrentModuleName()}>
  //         <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
  //           <div className="col-6">
  //             <FormFIlter />
  //           </div>

  //           <div className=" p-2">
  //             <CardHeaderToolbar>
  //               {accessUser && (
  //                 <button
  //                   type="button"
  //                   className="btn btn-primary"
  //                   onClick={FormUIProps.newFormButtonClick}
  //                 >
  //                   + Add News & Event Ticker
  //                 </button>
  //               )}
  //             </CardHeaderToolbar>
  //           </div>
  //         </div>
  //       </CardHeader>

  //       <CardBody>
  //         <FormTable />
  //       </CardBody>
  //     </Card> */}
  //     <TCard name={CurrentModuleName()}>
  //       <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
  //         <FormFIlter />

  //         <div className="flex items-center gap-2">
  //           {/* <CardHeaderToolbar> */}
  //           {accessUser && (
  //             <>
  //               <button
  //                 type="button"
  //                 className="btn btn-primary"
  //                 onClick={FormUIProps.newFormButtonClick}
  //               >
  //                 <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
  //                 Add
  //               </button>
  //             </>
  //           )}
  //           {/* </CardHeaderToolbar> */}
  //         </div>
  //       </div>
  //       <FormTable />
  //     </TCard>
  //   </>
  // );
  return (

    <TCard name={CurrentModuleName()}>
      <EmployeeSelect
        setemployeeId={FormUIProps.setemployeeId}
        setPanelMode={FormUIProps.setPanelMode}
        panelMode={FormUIProps.panelMode}
      />
      <br />

      <EmployeeProfile
        employeeId={FormUIProps.employeeId}
        panelMode={FormUIProps.panelMode}
      />
      {/* EmployeeProfile Ends */}

      {/* <br /> */}

      {/* FormEditDialog Starts */}
      <FormEditDialog id={FormUIProps.id} employeeId={FormUIProps.employeeId} />
      {/* FormEditDialog Ends */}

      <br />
      <hr />
      <FormTable />
    </TCard>
    // </>
  );


}
