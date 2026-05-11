import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";
import { useSelector, shallowEqual } from "react-redux";
import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";
import { FormFIlter } from "./form-filter/FormFIlter";
import { Switch } from "react-router-dom";
import { Accordion, Button, Card } from "react-bootstrap";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import { CircleMinus } from "lucide-react";

export function FormPage({ history }) {
  const dispatch = useDispatch();
  console.log("hrform11111");
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push(
        "/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/new",
      );
    },
    openEditFormDialog: (id) => {
      history.push(
        `/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/${id}/edit`,
      );
    },
    openDeleteFormDialog: (id, status) => {
      history.push(
        `/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/${id}/${status}/delete`,
      );
    },

    openReadFormDialog: (id, isUserRead) => {
      history.push(
        `/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/${id}/read`,
      );
    },
  };

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess.hr_requisition_job_vacancy,
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateHrRequisitionJobVacancy",
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadHrRequisitionJobVacancy",
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateHrRequisitionJobVacancy";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteHrRequisitionJobVacancy",
  );

  console.log(
    "isAccessForView1111",
    isAccessForView,
    isAccessForEdit,
    isAccessForDelete,
  );
  const [activeKey, setActiveKey] = useState(null);
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      {/* <FormCard /> */}
      <TCard name={CurrentModuleName()}>
        <FormCard />
      </TCard>
      <Switch>
        {/* NEW */}
        {accessUser && (
          <Route
            exact
            path="/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/new"
          >
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                status="new"
                onHide={() =>
                  history.push(
                    "/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy",
                  )
                }
              />
            )}
          </Route>
        )}

        {/* EDIT */}
        {isAccessForEdit && (
          <Route path="/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/:id/edit">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="edit"
                onHide={() =>
                  history.push(
                    "/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy",
                  )
                }
              />
            )}
          </Route>
        )}
        {/* READ */}
        {isAccessForView && (
          <Route path="/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/:id/read">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="read"
                dataForRead={true}
                onHide={() =>
                  history.push(
                    "/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy",
                  )
                }
              />
            )}
          </Route>
        )}

        {/* DELETE */}
        {isAccessForDelete && (
          <Route path="/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy/:id/:status/delete">
            {({ history, match }) => (
              <FormDeleteDialog
                show={match != null}
                id={match?.params?.id}
                status={match?.params?.status}
                onHide={() =>
                  history.push(
                    "/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy",
                  )
                }
              />
            )}
          </Route>
        )}
        {/* DYNAMIC ACTIONS */}

        {/* dynamic rendering */}
      </Switch>

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
    </FormUIProvider>
  );
}
