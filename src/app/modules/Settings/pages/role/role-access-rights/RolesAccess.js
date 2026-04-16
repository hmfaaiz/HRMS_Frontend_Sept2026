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
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    shallowEqual,
  );

  // const currentState = useSelector((state) => ({
  //   entities: state.entities,
  // }))

  //Role Redux State
  const dispatch = useDispatch();

  useEffect(() => {
    // Serer call by params
    dispatch(
      actions.accessRights({ roleId: id, sortBy: "name", limit: 10, page: 1 }),
    );
  }, [id, dispatch]);
  // let newdata;
  // if (currentState) {
  //   newdata = Object.entries(currentState);
  // } else {
  //   dispatch(
  //     actions.accessRights({ roleId: id, sortBy: "name", limit: 10, page: 1 })
  //   );
  // }
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
      actions.updateAccessRightByRoleAndResourceId([
        {
          roleId: name,
          resourceId: id,
          isAccess: checked,
        },
      ]),
    );

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

  const moduleList = {
    1: "Employee",
    2: "Leave Management",
    3: "Attendance Management",
    4: "Payroll",
    5: "Recruitment",
    6: "Separation",
    7: "Settings",
    8: "Appraisal",
    9: "Task Management",
  };

  return (
    <>
      <TCard isSecondChild={false} name={"Role Access page"}></TCard>
      {/* for hrms  */}
      <div className="flex items-center px-3 py-2 rounded-lg bg-white mt-2">
        <Link to={"/settings/read-all-roles"}>
          <ArrowLeft className="w-5 h-5 text-tprimary" />{" "}
        </Link>
        <h6 className="m-0 text-tprimary font-bold text-base sm:text-lg py-1">
          HRMS Roles Access
        </h6>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-2 mt-2">
        {/* Add a check for currentState existence */}
        {currentState &&
          Object.entries(currentState)?.map((dd, index) => {
            if (dd[0] === "Settings") return null;

            // filter + sort once
            const filteredRights = [...dd[1]]
              .sort((a, b) => {
                if (a.sortOrder == null) return 1;
                if (b.sortOrder == null) return -1;
                return a.sortOrder - b.sortOrder;
              })
              .filter((ee) => ee?.portalType !== 2);

            // if no rights, don't render box
            if (filteredRights.length === 0) return null;
            let name =
              customMappings[
                dd[0]
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              ] ||
              dd[0]
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            return (
              <div
                className="px-3 py-2 rounded-lg bg-white overflow-y-auto"
                key={index}
              >
                <div className="space-y-3">
                  <EachSectionCheckbox name={name} record={filteredRights} />

                  <div className="overflow-auto min-h-44 max-h-44 border-none scrollbar-fancy">
                    {filteredRights.map((right, rightindex) => (
                      <div
                        key={rightindex}
                        className="text-black flex items-center gap-1"
                      >
                        <input
                          type="checkbox"
                          id={right.resourceId}
                          name={right.roleId}
                          label={right.name}
                          checked={right.isAccess}
                          onChange={onCheckboxChange}
                        />
                        <label>{right.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* for portal  */}
      <div className="px-3 py-2 rounded-lg bg-white mt-1">
        <h6 className="m-0 text-tprimary font-bold text-base sm:text-lg py-1">
          Portal Roles Access
        </h6>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-2 mt-2">
        {/* Add a check for currentState existence */}
        {currentState &&
          
          Object.entries(currentState)?.map((dd, index) => {
            if (dd[0] === "Settings") return null;

            // filter + sort once
            const filteredRights = [...dd[1]]
              .sort((a, b) => {
                if (a.sortOrder == null) return 1;
                if (b.sortOrder == null) return -1;
                return a.sortOrder - b.sortOrder;
              })
              .filter((ee) => ee?.portalType == 2);

            // if no rights, don't render box
            if (filteredRights.length === 0) return null;

            let name =
              customMappings[
                dd[0]
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              ] ||
              dd[0]
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return (
              <div
                className="px-3 py-2 rounded-lg bg-white overflow-y-auto"
                key={index}
              >
                <div className="space-y-3">
                  <div>
                    <h6 className="font-bold mb-0 text-primary my-2">{name}</h6>
                  </div>

                  <div className="overflow-auto min-h-44 max-h-44 border-none scrollbar-fancy">
                    {filteredRights.map((right, rightindex) => (
                      <div
                        key={rightindex}
                        className="text-black flex items-center gap-1"
                      >
                        <input
                          type="checkbox"
                          id={right.resourceId}
                          name={right.roleId}
                          label={right.name}
                          defaultChecked={right.isAccess}
                          onChange={onCheckboxChange}
                        />
                        <label>{right.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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

const EachSectionCheckbox = ({ name, record }) => {
  const checkboxRef = useRef(null);
  const dispatch = useDispatch(); // Add this

  useEffect(() => {
    if (checkboxRef.current) {
      const allChecked = record?.every((e) => e?.isAccess);
      const someChecked = record?.some((e) => e?.isAccess);
      
      if (someChecked && !allChecked) {
        checkboxRef.current.indeterminate = true;
      } else {
        checkboxRef.current.indeterminate = false;
      }
    }
  }, [record]); // This will run when record updates

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    // Create updates for all resources in this section
    const updates = record.map(item => ({
      roleId: item.roleId,
      resourceId: item.resourceId,
      isAccess: isChecked
    }));
    
    // Dispatch bulk update
    dispatch(actions.updateAccessRightByRoleAndResourceId(updates));
  };

  return (
    <div className="flex justify-between">
      <h6 className="font-bold mb-0 text-primary my-2">{name}</h6>
      <input
        type="checkbox"
        ref={checkboxRef}
        checked={record?.every((e) => e?.isAccess)}
        onChange={handleSelectAll}
      />
    </div>
  );
};