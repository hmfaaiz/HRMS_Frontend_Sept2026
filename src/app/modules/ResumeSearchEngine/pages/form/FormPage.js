import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";
import { FormFIlter } from "./form-filter/FormFIlter";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { FormTable } from "./form-table/FormTable";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";

export function FormPage({ history }) {
  const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState(null);
  const FormUIEvents = {
    openReadFormDialog: (id, isUserRead) => {
      history.push(
        `/resume_search_engine/read-all-resume-search-engine/${id}/read`
      );
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/resume_search_engine/read-all-resume-search-engine/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            dataForRead={true}
            onHide={() => {
              history.push(
                "/resume_search_engine/read-all-resume-search-engine"
              );
            }}
          />
        )}
      </Route>

      <TCard name={CurrentModuleName()}>



        <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)} >
          <Card>
            <Card.Header className="d-flex justify-content-center">
              <div className="accordion-header-btn w-100  d-flex bg-tsecondary">
                <Accordion.Toggle
                  as={Button}
                  eventKey="0"
                  className="flex justify-start text-bold"
                >

                  {activeKey === "0" ? <CircleMinus className="h-4 w-4 text-black mr-1" /> : <CirclePlus className="h-4 w-4 text-black mr-1" />}<span className="text-black">Filters</span>

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

        <FormTable />
      </TCard>




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
