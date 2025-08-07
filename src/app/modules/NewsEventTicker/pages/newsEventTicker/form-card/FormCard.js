import React, { useMemo } from "react"

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls"
import { FormTable } from "../form-table/FormTable"
import { useFormUIContext } from "../FormUIContext"
import { FormFIlter } from "../form-filter/FormFIlter"
import { useSelector, shallowEqual } from "react-redux"
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName"

export function FormCard() {
  const FormUIContext = useFormUIContext()

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    }
  }, [FormUIContext])

  const { userAccess } = useSelector(

    (state) => ({

      userAccess: state.auth.userAccess.news_event_ticker,
    }),
    shallowEqual
  )

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateNewsEventTicker"
  )

  const { currentState } = useSelector(
    (state) => {
      return {

        currentState: state.news_event_ticker,
        userAccess: state?.auth?.userAccess["news_event_ticker"],
      }
    },
    shallowEqual
  );

  // const { currentState } = useSelector();

  const { entities } = currentState;

  return (
    <>


      <Card>

        <CardHeader title={CurrentModuleName()} >

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

      </Card>

    </>
  )
}
