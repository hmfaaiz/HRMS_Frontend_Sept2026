import React, { useEffect, useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { DesignationTable } from "../designation-table/DesignationTable";
import { useDesignationUIContext } from "../DesignationUIContext";
import { BanksFilter } from "../bank-filter/BanksFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import * as actions from "../../../_redux/designationActions";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { useLocation, useHistory } from "react-router-dom";

export function ReligionCard({ onHide }) {
  const designationUIContext = useDesignationUIContext();
  const { dashboard } = useSelector((state) => state);
  const dispatch = useDispatch();
   const location = useLocation();
  const history = useHistory();

  const DesignationUIProps = useMemo(() => {
    return {
      newAcademicButtonClick: designationUIContext.newAcademicButtonClick,
      newDesignationButtonClick: designationUIContext.newDesignationButtonClick,
      openEditDesignationDialog: designationUIContext.openEditDesignationDialog,
    };
  }, [designationUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Profile,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateProfile"
  );

  const DesignationUIContext = useDesignationUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: DesignationUIContext.queryParams,
      setQueryParams: DesignationUIContext.setQueryParams,
    };
  }, [DesignationUIContext]);

  const fetchInctive = () => {
    onHide()
    dispatch(actions.clearForm());
    const updatedQueryParams = {
      ...usersUIProps.queryParams,
      isActive: false,
      pageNumber: 1, // Toggle the isActive flag
    };

    // Set the updated queryParams
    usersUIProps.setQueryParams(updatedQueryParams);
    // initialFilter.isActive = false

    dispatch(actions.fetchUsers(usersUIProps.queryParams));
  };

  const fetchActive = () => {
    onHide()
    dispatch(actions.clearForm());
    const updatedQueryParams = {
      ...usersUIProps.queryParams,
      isActive: true,
      pageNumber: 1, // Toggle the isActive flag
    };

    // Set the updated queryParams
    usersUIProps.setQueryParams(updatedQueryParams);
    // initialFilter.isActive = true

    dispatch(actions.fetchUsers(usersUIProps.queryParams));
  };


  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(377, "allEmpTypeDynamicChildMenus"));
    dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus"));
  }, [dispatch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subsidiaryId = searchParams.get("subsidiary");

    if (subsidiaryId) {
      //  Update queryParams
      const updatedQueryParams = {
        ...usersUIProps.queryParams,
        subsidiaryId: parseInt(subsidiaryId, 10),
        pageNumber: 1,
      };

      usersUIProps.setQueryParams(updatedQueryParams);

      //  Fetch users and departments based on subsidiary
      dispatch(actions.fetchUsers(updatedQueryParams));
      dispatch(fetchAllDept(subsidiaryId));

      //  Remove the query param from the URL without reload
      searchParams.delete("subsidiary");
      const newUrl =
        location.pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");
      history.replace(newUrl);
    }
  }, [location.search]);


  return (


    <TCard
      name={
        CurrentModuleName() +
        (usersUIProps.queryParams.isActive ? "  (Active)" : "  (Inactive)")
      }
    >

      <>
        <div className="grid md:grid-cols-6 gap-3 mb-2">

          <div className="">
            <div>
              <SearchSelect
                name="subsidiaryId"
                label={
                  <span>
                    {" "}
                    Subsidiary

                  </span>
                }

                value={
                  (dashboard?.allSubsidiaryList || []).find(
                    (item) => item.value === usersUIProps?.queryParams?.subsidiaryId
                  ) || { label: "All", value: "" }
                }
                onChange={(e) => {

                  const updatedQueryParams = {
                    ...usersUIProps.queryParams,
                    subsidiaryId: e.value,
                    pageNumber: 1,
                  };


                  usersUIProps.setQueryParams(updatedQueryParams);


                  dispatch(actions.fetchUsers(usersUIProps.queryParams));
                  dispatch(fetchAllDept(e.value));
                }}

                // options={dashboard.allSubsidiaryList}
                options={[
                  { label: "All", value: "" },
                  ...(Array.isArray(dashboard?.allSubsidiaryList)
                    ? dashboard.allSubsidiaryList
                    : []),
                ]}
              />
            </div>
          </div>
          <div className="">
            <div>
              <SearchSelect
                name="departmentId"
                label={
                  <span>
                    {" "}
                    Department

                  </span>
                }

                value={
                  (dashboard?.allDept || []).find(
                    (item) => item.value === usersUIProps?.queryParams?.departmentId
                  ) || { label: "All", value: "" }
                }
                onChange={(e) => {

                  const updatedQueryParams = {
                    ...usersUIProps.queryParams,
                    departmentId: e.value,
                    pageNumber: 1,
                  };


                  usersUIProps.setQueryParams(updatedQueryParams);


                  dispatch(actions.fetchUsers(usersUIProps.queryParams));
                }}

                // options={dashboard.allDept}
                options={[
                  { label: "All", value: "" },
                  ...(Array.isArray(dashboard?.allDept)
                    ? dashboard?.allDept
                    : []),
                ]}
              />
            </div>
          </div>
          <div className="">
            <div>
              <SearchSelect
                name="employeeTypeId"
                label={
                  <span>
                    {" "}
                    Designation

                  </span>
                }


                value={
                  (dashboard?.allDesignations || []).find(
                    (item) => item.value === usersUIProps?.queryParams?.designationId
                  ) || { label: "All", value: "" }
                }
                onChange={(e) => {

                  const updatedQueryParams = {
                    ...usersUIProps.queryParams,
                    designationId: e.value,
                    pageNumber: 1,
                  };


                  usersUIProps.setQueryParams(updatedQueryParams);


                  dispatch(actions.fetchUsers(usersUIProps.queryParams));
                }}

                // options={dashboard?.allDesignations}
                options={[
                  { label: "All", value: "" },
                  ...(Array.isArray(dashboard?.allDesignations)
                    ? dashboard?.allDesignations
                    : []),
                ]}
              />
            </div>
          </div>

          <div className="">
            <div>
              <SearchSelect
                name="employeeTypeId"
                label={
                  <span>
                    {" "}
                    Employee Type

                  </span>
                }


                onChange={(e) => {

                  const updatedQueryParams = {
                    ...usersUIProps.queryParams,
                    employeeTypeId: e.value,
                    pageNumber: 1,
                  };


                  usersUIProps.setQueryParams(updatedQueryParams);


                  dispatch(actions.fetchUsers(usersUIProps.queryParams));
                }}

                options={[
                  { label: "All", value: "" },
                  ...(dashboard?.allEmpTypeDynamicChildMenus || []),
                  ...(dashboard?.allEmpTypeChildMenus || []),
                ]}


              />
            </div>
          </div>




        </div>

        <div className="grid md:grid-cols-2 ">
          <div className="grid md:grid-cols-6">

            <div className="">
              <button
                type="button"
                className={`btn mr-2 rounded-xl ${usersUIProps.queryParams.isActive
                  ? "bg-black text-white"
                  : "btn-secondary"
                  }`}
                onClick={fetchActive}
              >
                Active Employee
              </button>
            </div>
            <div className="">
              <button
                type="button"
                className={`btn mr-2 rounded-xl ${!usersUIProps.queryParams.isActive
                  ? "bg-black text-white"
                  : "btn-secondary"
                  }`}
                onClick={fetchInctive}
              >
                Inactive Employee
              </button>
            </div>



          </div>

          <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
            <BanksFilter />
            <div className="flex items-center gap-2">

              {accessUser && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={DesignationUIProps.newDesignationButtonClick}
                  >
                    <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                    Add
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </>

      <DesignationTable onHide={onHide} />
    </TCard>
    // </>
  );
}
