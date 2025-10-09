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
import { } from "../../_redux/redux-Actions";
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
      history.push("/requisition_job_vacancy/read-all-requisition-job-vacancy/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/requisition_job_vacancy/read-all-requisition-job-vacancy/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/requisition_job_vacancy/read-all-requisition-job-vacancy/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/requisition_job_vacancy/read-all-requisition-job-vacancy/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/requisition_job_vacancy/read-all-requisition-job-vacancy/${id}/read`);
    },

  };

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess.requisition_job_vacancy,
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateRequisitionJobVacancy"
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadRequisitionJobVacancy"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateRequisitionJobVacancy";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteRequisitionJobVacancy"
  );

console.log("isAccessForEdit1111",isAccessForEdit)
  const [activeKey, setActiveKey] = useState(null);
  return (
 

    <FormUIProvider FormUIEvents={FormUIEvents}>


      {/* <FormCard /> */}
      {/* <TCard name={CurrentModuleName()}>
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
     
      </TCard> */}
         <FormCard />
      {/* <Switch>

        {accessUser && (
          <Route exact path="/requisition_job_vacancy/read-all-requisition-job-vacancy/new">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                status="new"
                onHide={() => history.push("/requisition_job_vacancy/read-all-requisition-job-vacancy")}
              />
            )}
          </Route>
        )}

    
        {isAccessForEdit && (
          <Route path="/requisition_job_vacancy/read-all-requisition-job-vacancy/:id/edit">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="edit"
                onHide={() => history.push("/requisition_job_vacancy/read-all-requisition-job-vacancy")}
              />
            )}
          </Route>
        )}
      
        {isAccessForView && (
          <Route path="/requisition_job_vacancy/read-all-requisition-job-vacancy/:id/read">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                id={match?.params?.id}
                status="read"
                dataForRead={true}
                onHide={() => history.push("/requisition_job_vacancy/read-all-requisition-job-vacancy")}
              />
            )}
          </Route>
        )}

  
        {isAccessForDelete && (
          <Route path="/requisition_job_vacancy/read-all-requisition-job-vacancy/:id/:status/delete">
            {({ history, match }) => (
              <FormDeleteDialog
                show={match != null}
                id={match?.params?.id}
                status={match?.params?.status}
                onHide={() => history.push("/requisition_job_vacancy/read-all-requisition-job-vacancy")}
              />
            )}
          </Route>
        )}


      </Switch> */}

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
