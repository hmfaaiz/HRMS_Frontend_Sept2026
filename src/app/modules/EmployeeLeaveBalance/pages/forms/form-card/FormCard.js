import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { useDispatch, useSelector } from "react-redux";

export function FormCard() {

    const {
   
 leaveBalances
    } = useSelector((state) => ({
   
      leaveBalances: state.employee_leave_balance.leaveBalances,

    }
    ));
  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}></CardHeader>
    //     <CardBody>
    //       <FormEditDialog />
    //     </CardBody>
    //   </Card>

    
    <TCard name={CurrentModuleName()}>
      <FormEditDialog />


    </TCard>
    // </>
  );
}
