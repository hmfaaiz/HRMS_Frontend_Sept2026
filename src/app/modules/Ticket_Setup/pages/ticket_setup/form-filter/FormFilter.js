import React, { useEffect, useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { InputSearch } from "../../../../../utils/common-modules/InputSearch";
import { CirclePlus } from "lucide-react";
import {
  fetchAllProjects,
  fetchAllTicketStatus,
} from "../../../../Dashboard/_redux/dashboardActions";
import { useDispatch, useSelector } from "react-redux";
import { PriorityType, TicketType } from "../../../../../utils/common";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { Checkbox } from "../../../../../../_metronic/_partials/controls";

const prepareFilter = (queryParams, values) => {
  const {
    searchText,
    projectId,
    ticketTypeId,
    priority,
    ticketStatusId,
    isGroupByProject,
  } = values || {};
  const newQueryParams = { ...queryParams };
  const filter = {};

  if (searchText) {
    filter.searchQuery = searchText;
  }
  if (isGroupByProject) {
    filter.isGroupByProject = isGroupByProject;
  }
  if (ticketStatusId) {
    filter.ticketStatusId = ticketStatusId;
  }
  if (priority) {
    filter.priority = priority;
  }
  if (ticketTypeId) {
    filter.ticketTypeId = ticketTypeId;
  }
  if (projectId) {
    filter.projectId = projectId;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

const ALL_OPTION = { label: "All", value: "" };
export function FormFilter({ accessUser, newButtonClick, exportButtons }) {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const { dashboard } = useSelector((state) => state);

  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(fetchAllTicketStatus());
  }, [dispatch]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          searchText: "",
          projectId: "",
          ticketTypeId: "",
          priority: "",
          ticketStatusId: "",
          isGroupByProject: false,
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="grid grid-cols-3 gap-x-2 items-end">
              <div className="grid grid-cols-5 gap-x-2 col-span-2">
                <div>
                  <SearchSelect
                    name="projectId"
                    label={<span>Project</span>}
                    options={[ALL_OPTION, ...(dashboard?.allProjects || [])]}
                    value={
                      [ALL_OPTION, ...(dashboard?.allProjects || [])]?.find(
                        (el) => el?.value == values?.projectId,
                      ) || ALL_OPTION
                    }
                    onChange={(e) => {
                      setFieldValue("projectId", e?.value);
                      handleSubmit();
                      // const updateValue = {
                      //   ...formUIProps.queryParams,
                      //   filter: {
                      //     ...formUIProps?.queryParams?.filter,
                      //     projectId: e?.value,
                      //   },
                      // };
                      // formUIProps.setQueryParams(updateValue);
                    }}
                  />
                </div>
                <div>
                  <SearchSelect
                    name="ticketTypeId"
                    label={<span>Ticket Type</span>}
                    options={[ALL_OPTION, ...TicketType]}
                    value={
                      [ALL_OPTION, ...TicketType]?.find(
                        (el) => el?.value == values?.ticketTypeId,
                      ) || ALL_OPTION
                    }
                    onChange={(e) => {
                      setFieldValue("ticketTypeId", e?.value);
                      // const updateValue = {
                      //   ...formUIProps.queryParams,
                      //   filter: {
                      //     ...formUIProps?.queryParams?.filter,
                      //     ticketTypeId: e?.value,
                      //   },
                      // };
                      handleSubmit();
                      // formUIProps.setQueryParams(updateValue);
                    }}
                  />
                </div>
                <div>
                  <SearchSelect
                    name="priority"
                    label={<span>Priority</span>}
                    options={[ALL_OPTION, ...PriorityType]}
                    value={
                      [ALL_OPTION, ...PriorityType]?.find(
                        (el) => el?.value == values?.priority,
                      ) || ALL_OPTION
                    }
                    onChange={(e) => {
                      setFieldValue("priority", e?.value);
                      handleSubmit();
                      // const updateValue = {
                      //   ...formUIProps.queryParams,
                      //   filter: {
                      //     ...formUIProps?.queryParams?.filter,
                      //     priority: e?.value,
                      //   },
                      // };
                      // formUIProps.setQueryParams(updateValue);
                    }}
                  />
                </div>
                <div>
                  <SearchSelect
                    name="ticketStatusId"
                    label={<span>Ticket Status</span>}
                    options={[
                      ALL_OPTION,
                      ...(dashboard?.allTicketStatus || []),
                    ]}
                    value={
                      [ALL_OPTION, ...(dashboard?.allTicketStatus || [])]?.find(
                        (el) => el?.value == values?.ticketStatusId,
                      ) || ALL_OPTION
                    }
                    onChange={(e) => {
                      setFieldValue("ticketStatusId", e?.value);
                      // const updateValue = {
                      //   ...formUIProps.queryParams,
                      //   filter: {
                      //     ...formUIProps?.queryParams?.filter,
                      //     ticketStatusId: e?.value,
                      //   },
                      // };
                      // formUIProps.setQueryParams(updateValue);
                      handleSubmit();
                    }}
                  />
                </div>
                <div className="mt-7">
                  <Checkbox
                    isSelected={values?.isGroupByProject}
                    children={"Ticket Code wise"}
                    onChange={(e) => {
                      setFieldValue("isGroupByProject", e?.target.checked);
                      // const updateValue = {
                      //   ...formUIProps.queryParams,
                      //   filter: {
                      //     ...formUIProps?.queryParams?.filter,
                      //     isGroupByProject: e?.target.checked,
                      //   },
                      // };
                      // formUIProps.setQueryParams(updateValue);
                      handleSubmit();
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end items-center">
                <InputSearch
                  values={values}
                  fieldName="searchText"
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  handleSubmit={handleSubmit}
                />
                {accessUser && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={newButtonClick}
                  >
                    <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                    Add
                  </button>
                )}
                {exportButtons}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
