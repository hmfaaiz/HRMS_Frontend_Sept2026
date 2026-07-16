import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import {
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";

const ASSET_CATEGORY_FORM_ID = 557; 
const ASSET_MAKE_FORM_ID = 558; 

export function AssetListPage() {
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("0");
  const { dashboard, listLoading, pdfLoading } = useSelector((state) => ({
    dashboard: state.dashboard,
    listLoading: state.asset_list.listLoading,
    pdfLoading: state.asset_list.pdfLoading,
  }));

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length)
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

    if (!dashboard?.allLocationChildMenus?.length)
      dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));

    if (!dashboard?.allAssetCategoryList?.length)
      dispatch(fetchAllFormsMenu(ASSET_CATEGORY_FORM_ID, "allAssetCategoryList"));

    if (!dashboard?.allAssetMakeList?.length)
      dispatch(fetchAllFormsMenu(ASSET_MAKE_FORM_ID, "allAssetMakeList"));


  }, [dispatch]);

  return (
    <FormUIProvider FormUIEvents={{}}>
      <TCard name={CurrentModuleName()}>
        <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
          <Card>
            <Card.Header className="d-flex justify-content-center">
              <div className="accordion-header-btn w-100 d-flex bg-tsecondary">
                <Accordion.Toggle
                  as={Button}
                  eventKey="0"
                  className="flex justify-start text-bold"
                >
                  {activeKey === "0" ? (
                    <CircleMinus className="h-4 w-4 text-black mr-1" />
                  ) : (
                    <CirclePlus className="h-4 w-4 text-black mr-1" />
                  )}
                  <span className="text-black">Filters</span>
                </Accordion.Toggle>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <>
                <FormFilter
                  loading={listLoading}
                  pdfLoading={pdfLoading}
                  dispatch={dispatch}
                />
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