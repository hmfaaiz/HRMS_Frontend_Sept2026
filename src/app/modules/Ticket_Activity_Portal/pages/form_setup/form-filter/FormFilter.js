import React, { useEffect, useMemo } from "react";
import { Formik } from "formik";
import { useFormUIContext } from "../FormUIContext";
import {
  fetchAllProjects,
  fetchAllTicket,
} from "../../../../Dashboard/_redux/dashboardActions";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { TicketType } from "../../../../../utils/common";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import * as Yup from "yup";
import { CalendarClockIcon, Edit, Eye, XCircle } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import * as actions from "../../../_redux/redux-Actions";

const formSchema = Yup.object().shape({
  projectId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  ticketTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  ticketId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormFilter() {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const { dashboard } = useSelector((state) => state);

  const { userAccess, auth } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess["ticket_setup_portal"],
      auth: state?.auth,
    }),
    shallowEqual,
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateTicketSetup",
  )?.isAccess;

  const formUIProps = useMemo(() => {
    return {
      commentsFilter: formUIContext.commentsFilter,
      setCommentsFilter: formUIContext.setCommentsFilter,
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
      openTicketEditDialog: formUIContext.openTicketEditDialog,
      ticketTimeLogDialog: formUIContext.ticketTimeLogDialog,
    };
  }, [formUIContext]);

  useEffect(() => {
    if (!auth?.user?.employeeIdMapping) return;

    dispatch(fetchAllProjects(auth?.user?.employeeIdMapping));
  }, [auth?.user?.employeeIdMapping]);

  return (
    <>
      <Formik
        enableReinitialize
        validationSchema={formSchema}
        initialValues={{ ...formUIProps?.commentsFilter }}
      >
        {({ values, handleSubmit, setFieldValue, errors, touched }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="grid grid-cols-6 gap-x-2 items-end">
              <div>
                <SearchSelect
                  name="projectId"
                  label={<span>Project</span>}
                  value={
                    [
                      { label: "Select", value: "" },
                      ...dashboard?.allProjects,
                    ]?.find((el) => el?.value == values?.projectId) || ""
                  }
                  options={
                    [
                      { label: "Select", value: "" },
                      ...dashboard?.allProjects,
                    ] || []
                  }
                  error={errors.projectId}
                  touched={touched.projectId}
                  onChange={(e) => {
                    setFieldValue("projectId", e?.value);
                    formUIProps.setCommentsFilter({
                      ...formUIProps.commentsFilter,
                      projectId: e?.value,
                      ticketTypeId: "",
                      ticketId: "",
                    });
                    dispatch(fetchAllTicket(null, e?.value));
                    dispatch(actions.clearReduxState());
                  }}
                />
              </div>
              <div>
                <SearchSelect
                  name="ticketTypeId"
                  label={<span>Ticket Type</span>}
                  error={errors.ticketTypeId}
                  touched={touched.ticketTypeId}
                  value={
                    [{ label: "Select", value: "" }, ...TicketType]?.find(
                      (el) => el?.value == values?.ticketTypeId,
                    ) || ""
                  }
                  options={
                    [{ label: "Select", value: "" }, ...TicketType] || []
                  }
                  onChange={(e) => {
                    setFieldValue("ticketTypeId", e?.value);
                    formUIProps.setCommentsFilter({
                      ...formUIProps.commentsFilter,
                      ticketTypeId: e?.value,
                      ticketId: "",
                    });
                    dispatch(actions.clearReduxState());
                  }}
                />
              </div>
              <div>
                <SearchSelect
                  name="ticketId"
                  error={errors.ticketId}
                  touched={touched.ticketId}
                  isDisabled={!values?.projectId || !values?.ticketTypeId}
                  label={<span>Ticket</span>}
                  value={
                    [
                      { label: "Select", value: "" },
                      ...dashboard?.allTicket,
                    ]?.find((el) => el?.value == values?.ticketId) || ""
                  }
                  options={[
                    { label: "Select", value: "" },
                    ...(values?.ticketTypeId
                      ? dashboard?.allTicket?.filter(
                          (e) => e.ticketType === values?.ticketTypeId,
                        ) || []
                      : dashboard?.allTicket || []),
                  ]}
                  onChange={(e) => {
                    setFieldValue("ticketId", e?.value);
                    formUIProps.setCommentsFilter({
                      ...formUIProps.commentsFilter,
                      ticketId: e?.value,
                    });
                    dispatch(actions?.clearReduxState());
                  }}
                />
              </div>
              <div className="mt-6 flex gap-2">
                {values?.ticketId &&
                  formUIProps?.commentsFilter?.ticketId &&
                  isAccessForEdit && (
                    <OverlayTrigger
                      overlay={<Tooltip id={`edit`}>Edit</Tooltip>}
                    >
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => {
                          formUIProps.openTicketEditDialog(values?.ticketId);
                          formUIProps.setPanelMode(false);
                        }}
                      >
                        <Edit className="w-4 h-4 text-white" />
                      </button>
                    </OverlayTrigger>
                  )}
                {values?.ticketId && formUIProps?.commentsFilter?.ticketId && (
                  <OverlayTrigger
                    overlay={<Tooltip id={`edit`}>Ticket Time Log</Tooltip>}
                  >
                    <button
                      type="button"
                      className="btn btn-primary d-flex align-items-center gap-2"
                      onClick={() => {
                        formUIProps.ticketTimeLogDialog(values?.ticketId);
                      }}
                    >
                      <CalendarClockIcon className="w-4 h-4 text-white" />
                    </button>
                  </OverlayTrigger>
                )}
                {formUIProps?.panelMode ? (
                  <button
                    type="button"
                    className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                    onClick={() =>
                      formUIProps.setPanelMode(!formUIProps?.panelMode)
                    }
                  >
                    <XCircle className="w-3 h-3 text-black" />
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() =>
                      formUIProps.setPanelMode(!formUIProps?.panelMode)
                    }
                  >
                    <Eye className="w-4 h-4 text-white" />
                    View Details
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
