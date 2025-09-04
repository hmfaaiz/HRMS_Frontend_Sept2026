import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import {
  Input,
  Checkbox,
} from "../../../../../../_metronic/_partials/controls";
// import { Formik, Form} from "formik"
// import   'react-bootstrap/Form'
// import Card from 'react-bootstrap/Card'
import { Row, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { shallowEqual, useSelector } from "react-redux";
import * as actions from "../../../_redux/roles/rolesAction";
import {
  DB_COLUMNS,
  FormClasses,
  Http,
  OperationStatus,
  RedirectURLs,
  TOAST_CONFIG,
} from "../../../../../utils/constants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TCard from "../../../../../utils/common-modules/TCard";

export function RolesAccess({
  history,
  match: {
    params: { id },
  },
}) {
  // const obj = {
  //   roleId: id,
  //   sortBy: "name",
  //   limit: 10,
  //   page: 1,
  // }

  const { actionsLoading, currentState } = useSelector(
    (state) => ({
      actionsLoading: state.roles.actionsLoading,
      currentState: state.roles.accessRights,
    }),
    shallowEqual
  );

  // const currentState = useSelector((state) => ({
  //   entities: state.entities,
  // }))

  //Role Redux State
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Serer call by params
  //   dispatch(
  //     actions.accessRights({ roleId: id, sortBy: "name", limit: 10, page: 1 })
  //     )
  //   }, [id, dispatch])
  let newdata;
  if (currentState) {
    newdata = Object.entries(currentState);
  } else {
    dispatch(
      actions.accessRights({ roleId: id, sortBy: "name", limit: 10, page: 1 })
    );
  }

  // newdata.push(currentState);

  // console.log("currentState_new", Object.keys(currentState).length)
  // console.log('newdata', newdata);
  // const { entities, listLoading, totalCount } = currentState
  // newdata.forEach((data) => {
  //   console.log('data', data[0]);
  // })

  // function changeState (id){

  //   console.log('yeloid', id);

  // }

  const [isChecked, setIsChecked] = React.useState(true);

  // const [isChecked, setIsChecked] = useState()

  const onCheckboxChange = async (event) => {
    const target = event.currentTarget;
    const name = target.name;
    const id = target.id;
    const checked = target.checked;
    // console.log("Access Right", {
    //   roleId: name,
    //   resourceId: id,
    //   isAccess: checked,
    // })

    // openRoleAccessPage(row.id)
    await dispatch(
      actions.updateAccessRightByRoleAndResourceId({
        roleId: name,
        resourceId: id,
        isAccess: checked,
      })
    );

    setIsChecked({
      ...isChecked,
      [id]: checked, // using "id" seems to not work here.
    });
  };

  const customMappings = {
    Exchange: "Exchange Rate",
    Policy: "Application Configuration",
    Profile: "Employee Profile",
    "Tax Slab": "Income Tax Slab",
    Form: "General Setup Configuration",
    FormDetails: "General Setup",
    "Leave Management Configuration": "Leave Configuration and Allocation",
    Holidays: "Holiday Setup",
    "Employee Shift": "Shift Setup",
    Attendance: "Employee Attendance",
    Earning: "Earning Setup",
    Deduction: "Deduction Setup",
    "Loan Type": "Loan Type Setup",
    Bank: "Banks",
    Compensation: "Compensation Policy",
    "Tax Setup": "Tax Year Setup",
    "Fiscal Setup": "Fiscal Year Setup",
    "Payroll Process Policy": "Payroll Configuration",
  };

  return (
    <>
      {/* <h1 className="mb-10">Role Access page</h1> */}

      {/* {newdata.map((dd, index) => (
        <Card key={index}>
          <CardBody>
            <Row>
              <Col lg={2}>
                <Form.Text className="col-form-label fw-bold fs-6">
                  {dd[0]
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Form.Text>
              </Col>
              <Col lg={10}>
                <Row>
                 
                       {[
              ...dd[1] 
            ]
              .sort((a, b) => {
           
                if (a.sortOrder == null) return 1;
                if (b.sortOrder == null) return -1;
                return a.sortOrder - b.sortOrder; 
              })
                    .map((right, rightindex) => (
                      <Col lg={3} key={rightindex}>
                        <div className="row">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={right.resourceId}
                            name={right.roleId}
                            label={right.name}
                            defaultChecked={right.isAccess}
                            onChange={onCheckboxChange}
                          />
                          <Form.Text className={FormClasses.LABEL_NON_REQUIRED}>
                            {right.name}
                          </Form.Text>
                      
                        </div>
                      </Col>
                    ))}
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
      ))} */}
      <TCard isSecondChild={false} name={"Role Access page"}></TCard>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-2 mt-2">
        {newdata?.map(
          (dd, index) =>
            dd[0] !== "Settings" && ( // Check if dd[0] is not "Settings"
              <div
                className="px-3 py-2 rounded-lg bg-white  overflow-y-auto"
                key={index}
              >
                <div className="space-y-3">
                  <div>
                    {/* <Form.Text className="col-form-label fw-bold fs-6">
              {dd[0]
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Form.Text> */}

                    <h6 className="font-bold mb-0 text-primary my-2">
                      {customMappings[
                        dd[0]
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      ] ||
                        dd[0]
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                    </h6>
                  </div>
                  <div className="overflow-auto min-h-44 max-h-44 border-none scrollbar-fancy">
                    {[
                      ...dd[1], // Create a shallow copy of dd[1]
                    ]
                      .sort((a, b) => {
                        // If a or b has null sortOrder, place it last
                        if (a.sortOrder == null) return 1;
                        if (b.sortOrder == null) return -1;
                        return a.sortOrder - b.sortOrder; // Standard sorting logic for non-null values
                      })
                      .map((right, rightindex) => (
                        <div className="text-black flex items-center gap-1">
                          <input
                            type="checkbox"
                            // className="form-check-input"
                            id={right.resourceId}
                            name={right.roleId}
                            label={right.name}
                            defaultChecked={right.isAccess}
                            onChange={onCheckboxChange}
                          />
                          <label>{right.name}</label>
                          {/* <Form.Text className={FormClasses.LABEL_NON_REQUIRED}>{right.rightName}</Form.Text> */}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
