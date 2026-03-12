import React, { useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { useFormUIContext } from "../FormUIContext";

export function FormCard() {
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.customer_config,
    }),
    shallowEqual,
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateCustomerConfig",
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="mb-3">
        <FormFilter
          accessUser={accessUser}
          newButtonClick={() => {
            formUIProps.newButtonClick();
          }}
        />
      </div>
      <FormTable />
    </TCard>
  );
}
