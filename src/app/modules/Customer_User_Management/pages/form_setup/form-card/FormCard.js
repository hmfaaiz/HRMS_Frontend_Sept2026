import React, { useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const formUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      customerId: formUIContext.customerId,
    };
  }, [formUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.customer_user,
    }),
    shallowEqual,
  );

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateCustomerUser",
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

      {formUIProps?.customerId ? <FormTable /> : null}
    </TCard>
  );
}
