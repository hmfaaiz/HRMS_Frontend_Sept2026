import React from "react"
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls"
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog"

export function FormCard() {

  return (
    < Card >
      {/* Card Starts */}
      <CardBody>
        {/* FormEditDialog Starts */}
        <FormEditDialog />
        {/* FormEditDialog Ends */}
      </CardBody>
      {/* Card Ends */}
    </Card >
  )
}
