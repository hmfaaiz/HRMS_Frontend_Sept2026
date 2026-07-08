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
      userAccess: state.auth.userAccess.asset_assignment,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAssetAssignment"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.asset_assignment,
      userAccess: state?.auth?.userAccess["asset_assignment"],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  const { entities } = currentState;

  return (
    <>
      {/* <Card>
        <CardHeader title={CurrentModuleName()}>
          <div className="d-flex justify-content-end align-items-center gap-3 m-4 col-8">
            <div className="col-6">
              <FormFIlter />
            </div>

            <div className=" p-2">
              <CardHeaderToolbar>
                {accessUser && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={FormUIProps.newFormButtonClick}
                  >
                    + Add News & Event Ticker
                  </button>
                )}
              </CardHeaderToolbar>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <FormTable />
        </CardBody>
      </Card> */}
      <TCard name={CurrentModuleName()}>
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
