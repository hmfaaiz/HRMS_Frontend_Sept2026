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
import { fetchJobVacancyById } from "../../_redux/redux-Actions";
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
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/job_vacancy/read-all-job-vacancy/new");
    },
    openEditFormDialog: (id) => {
      dispatch(fetchJobVacancyById(id));
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
        dispatch(fetchJobVacancyById(id));
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/read`);
    },
    openPostingFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/posting`);
    },
    openHoldFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/hold`);
    },
    openCloseFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/close`);
    },
  };

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess.job_vacancy,
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateJobVacancy"
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadJobVacancy"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateJobVacancy";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteJobVacancy"
  );

  const isAccessForPost = userAccess?.find(
    (item) => item.componentName === "PostJobVacancy"
  );
  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "HoldJobVacancy"
  );
  const isAccessForClose = userAccess?.find(
    (item) => item.componentName === "CloseJobVacancy"
  );
  const [activeKey, setActiveKey] = useState(null);
  return (
    // <FormUIProvider FormUIEvents={FormUIEvents}>
    //   <Route exact path="/job_vacancy/read-all-job-vacancy/new">
    //     {({ history, match }) => (
    //       <FormEditDialog
    //         show={match != null}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/edit">
    //     {({ history, match }) => (
    //       <FormEditDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/read">
    //     {({ history, match }) => (
    //       <FormEditDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         dataForRead={true}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/delete">
    //     {({ history, match }) => (
    //       <FormDeleteDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>

    //   {/* dynamic rendering */}

    //   {/* posting */}
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/posting">
    //     {({ history, match }) => (
    //       <FormDynamicDialogModal
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         title="Post Record"
    //         message="Are you sure you want to post this record?"
    //         confirmButtonText="Post Record"
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //         actionName="postJobVacancy"
    //       />
    //     )}
    //   </Route>

    //   {/* hold */}
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/hold">
    //     {({ history, match }) => (
    //       <FormDynamicDialogModal
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         title="Hold Record"
    //         message="Are you sure you want to hold this record?"
    //         confirmButtonText="Hold Record"
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //         actionName="holdJobVacancy"
    //       />
    //     )}
    //   </Route>

    //   {/* close */}
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/close">
    //     {({ history, match }) => (
    //       <FormDynamicDialogModal
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         title="Close Record"
    //         message="Are you sure you want to close this record?"
    //         confirmButtonText="Close Record"
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //         actionName="closeJobVacancy"
    //       />
    //     )}
    //   </Route>

    //   <FormFIlter />
    //   <FormCard />

    //   <ToastContainer
    //     position="top-right"
    //     autoClose={5000}
    //     hideProgressBar={false}
    //     newestOnTop={false}
    //     closeOnClick
    //     rtl={false}
    //     pauseOnFocusLoss
    //     draggable
    //     pauseOnHover
    //   />
    // </FormUIProvider>

    <FormUIProvider FormUIEvents={FormUIEvents}>
      {/* <CardHeadeing>
        <CardHeader title={CurrentModuleName()} />
      </CardHeadeing> */}

      {/* <FormCard /> */}
      <TCard name={CurrentModuleName()}>
        <div >
          <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)} >
            <Card>
              <Card.Header className="d-flex justify-content-center">
                <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                  <Accordion.Toggle
                    as={Button}
                    eventKey="0"
                    className="flex justify-start text-bold"
                  >
                   
                    {activeKey === "0" ? <CircleMinus  className="h-4 w-4 text-black mr-1"/> : <CirclePlus  className="h-4 w-4 text-black mr-1"/>}<span className="text-black">Filters</span>

                  </Accordion.Toggle>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                
                  <>
                    <FormFIlter />
                  </>
              
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
        <FormCard />
      </TCard>
      <Switch>
        {/* NEW */}
        {accessUser && (
          <Route exact path="/job_vacancy/read-all-job-vacancy/new">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                status="new"
                onHide={() => history.push("/job_vacancy/read-all-job-vacancy")}
              />
            )}
          </Route>
        )}

        {/* EDIT */}
        {isAccessForEdit && (
          <Route path="/job_vacancy/read-all-job-vacancy/:id/edit">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="edit"
                onHide={() => history.push("/job_vacancy/read-all-job-vacancy")}
              />
            )}
          </Route>
        )}
        {/* READ */}
        {isAccessForView && (
          <Route path="/job_vacancy/read-all-job-vacancy/:id/read">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="read"
                dataForRead={true}
                onHide={() => history.push("/job_vacancy/read-all-job-vacancy")}
              />
            )}
          </Route>
        )}

        {/* DELETE */}
        {isAccessForDelete && (
          <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/delete">
            {({ history, match }) => (
              <FormDeleteDialog
                show={match != null}
                id={match?.params?.id}
                status={match?.params?.status}
                onHide={() => history.push("/job_vacancy/read-all-job-vacancy")}
              />
            )}
          </Route>
        )}
        {/* DYNAMIC ACTIONS */}

        {/* dynamic rendering */}

        {/* posting */}
        {isAccessForPost && (
          <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/posting">
            {({ history, match }) => (
              <FormDynamicDialogModal
                show={match != null}
                id={match && match.params.id}
                status={match && match.params.status}
                title="Post Record"
                message="Are you sure you want to post this record?"
                confirmButtonText="Post Record"
                onHide={() => {
                  history.push("/job_vacancy/read-all-job-vacancy");
                }}
                actionName="postJobVacancy"
              />
            )}
          </Route>
        )}
        {/* hold */}
        {isAccessForHold && (
          <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/hold">
            {({ history, match }) => (
              <FormDynamicDialogModal
                show={match != null}
                id={match && match.params.id}
                status={match && match.params.status}
                title="Hold Record"
                message="Are you sure you want to hold this record?"
                confirmButtonText="Hold Record"
                onHide={() => {
                  history.push("/job_vacancy/read-all-job-vacancy");
                }}
                actionName="holdJobVacancy"
              />
            )}
          </Route>
        )}

        {/* close */}
        {isAccessForClose && (
          <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/close">
            {({ history, match }) => (
              <FormDynamicDialogModal
                show={match != null}
                id={match && match.params.id}
                status={match && match.params.status}
                title="Close Record"
                message="Are you sure you want to close this record?"
                confirmButtonText="Close Record"
                onHide={() => {
                  history.push("/job_vacancy/read-all-job-vacancy");
                }}
                actionName="closeJobVacancy"
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
