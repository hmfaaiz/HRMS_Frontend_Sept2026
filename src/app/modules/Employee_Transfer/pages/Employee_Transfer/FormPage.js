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
import { fetchEmployeeTransferById } from "../../_redux/redux-Actions";
import { FormFIlter } from "./form-filter/FormFIlter";
import { Switch } from "react-router-dom";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import {
  Card as CardHeadeing,
  CardHeader,
  Input,
} from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { CirclePlus  } from "lucide-react";
import { CircleMinus  } from "lucide-react";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  //shared state for applicant detail toggle
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/employee_transfer/read-all-employee-transfer/new");
    },
    openEditFormDialog: (id) => {
  
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
    
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/read`);
    },
    openPostingFormDialog: (id, status) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/${status}/posting`);
    },
    openHoldFormDialog: (id, status) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/${status}/hold`);
    },
    openCloseFormDialog: (id, status) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/${status}/close`);
    },
  };

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess?.employee_transfer || [],
    };
  }, shallowEqual);

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeTransfer"
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadEmployeeTransfer"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateEmployeeTransfer";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeTransfer"
  );

  const isAccessForPost = userAccess?.find(
    (item) => item.componentName === "PostEmployeeTransfer"
  );
  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "HoldEmployeeTransfer"
  );
  const isAccessForClose = userAccess?.find(
    (item) => item.componentName === "CloseEmployeeTransfer"
  );
  const [activeKey, setActiveKey] = useState(null);
  return (
   

    <FormUIProvider FormUIEvents={FormUIEvents}>
      {/* <CardHeadeing>
        <CardHeader title={CurrentModuleName()} />
      </CardHeadeing> */}

      {/* <FormCard /> */}
      <TCard name={CurrentModuleName()}>
      

        {/*pass toggle state + handler into FormCard ── */}
        <FormCard showApplicantDetails={showApplicantDetails} onApplicantDetailsChange={setShowApplicantDetails} />
      </TCard>
      <Switch>
        {/* NEW */}
        {accessUser && (
          <Route exact path="/employee_transfer/read-all-employee-transfer/new">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                status="new"
                onHide={() => history.push("/employee_transfer/read-all-employee-transfer")}
              />
            )}
          </Route>
        )}

        {/* EDIT */}
        {isAccessForEdit && (
          <Route path="/employee_transfer/read-all-employee-transfer/:id/edit">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="edit"
                onHide={() => history.push("/employee_transfer/read-all-employee-transfer")}
              />
            )}
          </Route>
        )}
        {/* READ */}
        {isAccessForView && (
          <Route path="/employee_transfer/read-all-employee-transfer/:id/read">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="read"
                dataForRead={true}
                onHide={() => history.push("/employee_transfer/read-all-employee-transfer")}
              />
            )}
          </Route>
        )}

        {/* DELETE */}
        {isAccessForDelete && (
          <Route path="/employee_transfer/read-all-employee-transfer/:id/:status/delete">
            {({ history, match }) => (
              <FormDeleteDialog
                show={match != null}
                id={match?.params?.id}
                status={match?.params?.status}
                onHide={() => history.push("/employee_transfer/read-all-employee-transfer")}
              />
            )}
          </Route>
        )}
        {/* DYNAMIC ACTIONS */}

        {/* dynamic rendering */}

        {/* posting */}
        {isAccessForPost && (
          <Route path="/employee_transfer/read-all-employee-transfer/:id/:status/posting">
            {({ history, match }) => (
              <FormDynamicDialogModal
                show={match != null}
                id={match && match.params.id}
                status={match && match.params.status}
                title="Post Record"
                message="Are you sure you want to post this record?"
                confirmButtonText="Post Record"
                onHide={() => {
                  history.push("/employee_transfer/read-all-employee-transfer");
                }}
                actionName="postEmployeeTransfer"
              />
            )}
          </Route>
        )}
        {/* hold */}
        {isAccessForHold && (
          <Route path="/employee_transfer/read-all-employee-transfer/:id/:status/hold">
            {({ history, match }) => (
              <FormDynamicDialogModal
                show={match != null}
                id={match && match.params.id}
                status={match && match.params.status}
                title="Hold Record"
                message="Are you sure you want to hold this record?"
                confirmButtonText="Hold Record"
                onHide={() => {
                  history.push("/employee_transfer/read-all-employee-transfer");
                }}
                actionName="holdEmployeeTransfer"
              />
            )}
          </Route>
        )}

        {/* close */}
        {isAccessForClose && (
          <Route path="/employee_transfer/read-all-employee-transfer/:id/:status/close">
            {({ history, match }) => (
              <FormDynamicDialogModal
                show={match != null}
                id={match && match.params.id}
                status={match && match.params.status}
                title="Close Record"
                message="Are you sure you want to close this record?"
                confirmButtonText="Close Record"
                onHide={() => {
                  history.push("/employee_transfer/read-all-employee-transfer");
                }}
                actionName="closeEmployeeTransfer"
              />
            )}
          </Route>
        )}
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

