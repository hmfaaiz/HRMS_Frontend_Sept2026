import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls"

export function CreateResource() {
  console.log("calling Create Resource pahge")
  return (
    <Card>
      <CardHeader title="list">
        <CardHeaderToolbar>
          <button type="button" className="btn btn-primary">
            Add Resource
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody></CardBody>
    </Card>
  )
}
