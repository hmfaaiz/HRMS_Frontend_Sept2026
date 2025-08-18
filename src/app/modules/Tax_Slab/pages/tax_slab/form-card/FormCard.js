import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { SelectTaxSetup } from "./Select-tax-setup";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

export function FormCard(fetchSubsidiaryId, fetchTaxSetupId) {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      fetchTaxSetupId: FormUIContext?.fetchTaxSetupId,
      fetchSubsidiaryId: FormUIContext?.fetchSubsidiaryId,
      setFetchSubsidiaryId: FormUIContext?.setFetchSubsidiaryId,
      setFetchTaxSetupId: FormUIContext?.setFetchTaxSetupId,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.tax_slab,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateTaxSlab"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.tax_slab,
      userAccess: state?.auth?.userAccess["tax_slab"],
    };
  }, shallowEqual);

  return (
    // <>
      // <Card>
      //   <CardHeader title={CurrentModuleName()}>
      //     <div className="d-flex justify-content-between align-items-center gap-3 m-4">
      //       {/* <div className="pt-5">
      //         <FormFIlter />
      //       </div> */}
      //       <div className=" p-2">
      //         <CardHeaderToolbar>
      //           {FormUIProps?.fetchTaxSetupId?.isActive ? (
      //             <button
      //               type="button"
      //               className="btn btn-primary"
      //               onClick={FormUIProps.newFormButtonClick}
      //             >
      //               + Add Income Tax Slab
      //             </button>
      //           ) : null}

      //           {/* <button
      //             type="button"
      //             className="btn btn-primary "
      //             onClick={FormUIProps.newFormButtonClick}
      //           >
      //             + Add Income Tax Slab
      //           </button> */}
      //         </CardHeaderToolbar>
      //       </div>
      //     </div>
      //   </CardHeader>
      //   <SelectTaxSetup
      //     setFetchSubsidiaryId={FormUIProps?.setFetchSubsidiaryId}
      //     setFetchTaxSetupId={FormUIProps?.setFetchTaxSetupId}
      //   />

      //   {/* <CardBody>


      //     <FormTable />
      //   </CardBody> */}

      //   {FormUIContext?.fetchSubsidiaryId && FormUIContext?.fetchTaxSetupId ? (
      //     <CardBody>
      //       <FormTable />
      //     </CardBody>
      //   ) : (
      //     <></>
      //   )}
      // </Card>
      <TCard name={CurrentModuleName()}>
        <SelectTaxSetup
          setFetchSubsidiaryId={FormUIProps?.setFetchSubsidiaryId}
          setFetchTaxSetupId={FormUIProps?.setFetchTaxSetupId}
        />
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {FormUIProps?.fetchTaxSetupId?.isActive && (
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
        {FormUIContext?.fetchSubsidiaryId && FormUIContext?.fetchTaxSetupId ? (
          <FormTable />
        ) : (
          <></>
        )}
      </TCard>
    // </>
  );
}
