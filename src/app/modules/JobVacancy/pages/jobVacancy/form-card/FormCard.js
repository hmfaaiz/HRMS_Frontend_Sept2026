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
    console.log("aaaa",state.auth.userAccess); // ✅ Now valid
    return {
      userAccess: state.auth.userAccess.job_vacancy,
    };
  },
  shallowEqual
);


  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateJobVacancy"
  )

  const { currentState } = useSelector(
    (state) => {
      return {

        currentState: state.job_vacancy,
        userAccess: state?.auth?.userAccess["job_vacancy"],
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

          <div className="d-flex justify-content-between align-items-center gap-3 m-4">



            <div className="pt-5">

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

                    + Add Job Vacancy

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
