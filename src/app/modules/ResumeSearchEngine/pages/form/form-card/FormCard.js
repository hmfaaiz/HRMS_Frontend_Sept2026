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
  (state) => {

    return {
      userAccess: state.auth.userAccess.resume_search_engine,
    };
  },
  shallowEqual
);


  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateResumeSearchEngine"
  )

  const { currentState } = useSelector(
    (state) => {
      return {

        currentState: state.resume_search_engine,
        userAccess: state?.auth?.userAccess["resume_search_engine"],
      }
    },
    shallowEqual
  );

  // const { currentState } = useSelector();

  const { entities } = currentState;

  return (
    <>


      <Card>

        <CardHeader title={""}>

  
            <div className=" p-2">
                  {accessUser && (

                  <button

                    type="button"

                    className="btn btn-primary"

                    onClick={FormUIProps.newFormButtonClick}

                  >

                    + Add Job Vacancy

                  </button>

                )}

              <CardHeaderToolbar>



            





              </CardHeaderToolbar>

            </div>



  

        </CardHeader>



        <CardBody>



          <FormTable />

        </CardBody>

      </Card>

    </>
  )
}
