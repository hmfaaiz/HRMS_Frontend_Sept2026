import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { CustomerTable } from "../form-table/FormTable";
import { CustomerFilter } from "../form-filter/FormFilter";
import { useCustomerUIContext } from "../FormUIContext";

export function CustomerCard() {
  const customerUIContext = useCustomerUIContext();

  const customerUIProps = useMemo(() => {
    return {
      newCustomerButtonClick: customerUIContext.newCustomerButtonClick,
    };
  }, [customerUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.customer_setup,
    }),
    shallowEqual
  );
  console.log("Customer userAccess:", userAccess);

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateCustomerSetup"
  );
  console.log("accessUser:", accessUser);

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        <CustomerFilter />

        {accessUser && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={customerUIProps.newCustomerButtonClick}
          >
            <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
            Add
          </button>
        )}
      </div>

      <CustomerTable />
    </TCard>
  );
}
