import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
// import Form from 'react-bootstrap/Form'
// import Card from 'react-bootstrap/Card'
import Row from "react-bootstrap";
import Col from "react-bootstrap";
// import moment from 'moment'
import {
  DB_COLUMNS,
  FormClasses,
  Http,
  OperationStatus,
  RedirectURLs,
  TOAST_CONFIG,
} from "../../../../../utils/constants";
import { Formik, Field } from "formik";
// import { RolesTable } from "./role-table/RolesTable"
// import { useRolesUIContext } from "./RolesUIContext"
// import { RolesFilter } from "./role-filter/RolesFilter"
export function AccessRightPage() {
  // const rolesUIContext = useRolesUIContext()
  // //console.log("RoleUIContext", rolesUIContext)

  // const rolesUIProps = useMemo(() => {
  //   return {
  //     newRoleButtonClick: rolesUIContext.newRoleButtonClick,
  //   }
  // }, [rolesUIContext])
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={2}>
            {/* <Form.Text className={FormClasses.LABEL_NON_REQUIRED}>{resource.resourceName}</Form.Text> */}
            {/* <Form.Text className={FormClasses.LABEL_NON_REQUIRED}>Parent Name 1</Form.Text> */}
          </Col>
          <Col lg={10}>
            <Row>
              {/* {resource.rights.map((right, ii) => ( */}
              <Col lg={2}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className={FormClasses.CHECK_BOX}
                    // disabled={isView}
                    // checked={right.access}
                    // {...formik.getFieldProps(`resources[${i}].rights[${ii}].access`)}
                  />
                  {/* <Form.Text className={FormClasses.LABEL_NON_REQUIRED}>Access Name1</Form.Text> */}
                  {/* <Form.Text className={FormClasses.LABEL_NON_REQUIRED}>{right.rightName}</Form.Text> */}
                </div>
              </Col>
              {/* ))} */}
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
