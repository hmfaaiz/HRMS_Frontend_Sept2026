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
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.accrue_gratuity_configuration,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAccrueGratuityConfiguration"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.accrue_gratuity_configuration,
      userAccess: state?.auth?.userAccess["accrue_gratuity_configuration"],
    };
  }, shallowEqual);

  return (
    // <>

    //   <Card>
    //     <CardHeader title={CurrentModuleName()} >

    //        <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8 col-12">

    //         <div className="col-4">
    //           <FormFIlter />
    //         </div>
    //         <div className=" p-2">
    //           <CardHeaderToolbar>
    //             {accessUser && <button
    //               type="button"
    //               className="btn btn-primary "
    //               onClick={FormUIProps.newFormButtonClick}
    //             >
    //               + Add Accrue Gratuity Configuration

    //             </button>}

    //           </CardHeaderToolbar>
    //           <div></div>
    //         </div>

    //       </div>
    //     </CardHeader>

    //     <CardBody>

    //       <FormTable />
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
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
