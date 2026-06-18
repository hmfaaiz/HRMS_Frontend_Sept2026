import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  BadgeDollarSign,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardPaste,
  FileText,
  PiggyBank,
  WalletCards,
} from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import StatsCard from "./StatsCard";
import { BigTable } from "./FormTable";
import FormTableModal from "./FormTableModal";

export function FormData() {
  // Customer UI Context
  const dispatch = useDispatch();
  const [budgetYearId, setBudgetYearId] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalHeading, setModalHeading] = useState(null);
  const [desigReportLoading, setDesigReportLoading] = useState(false);

  const { data, loading, budgetyearBySubList } = useSelector(
    (state) => ({
      data: state.manpower_budget_dashboard?.data,
      loading: state.manpower_budget_dashboard?.actionsLoading,
      budgetyearBySubList: state?.dashboard?.budgetyearBySubList,
    }),
    shallowEqual,
  );

  // Prepare options with "All" option
  const budgetYearOptions = React.useMemo(() => {
    if (!budgetyearBySubList?.length) return [];

    const allOption = {
      label: "All",
      value: "",
    };

    return [allOption, ...budgetyearBySubList];
  }, [budgetyearBySubList]);

  useEffect(() => {
    if (!budgetyearBySubList?.length) return;

    // Set the first budget year (index 0 after "All" option) as default
    if (!budgetYearId || budgetYearId === "") {
      const firstBudgetYear = budgetyearBySubList?.[0]?.value;
      if (firstBudgetYear) {
        setBudgetYearId(firstBudgetYear);
      }
    }
  }, [budgetyearBySubList]);

  useEffect(() => {
    // Call API with budgetYearId (will be called when budgetYearId is set)
    if (budgetYearId !== undefined) {
      dispatch(actions?.fetchDasboardData({ budgetYearId }));
    }
  }, [budgetYearId, dispatch]);

  const handleDesigReport = async () => {
    setDesigReportLoading(true);
    await dispatch(
      actions.downloadDesignationWiseBudgetReport({ budgetYearId }),
    );
    setDesigReportLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-8 gap-2 bg-white rounded-lg px-3 py-2">
        <div className="col-span-8 flex items-end justify-end gap-2">
           <div className="w-80">
            <SearchSelect
              name="budgetPeriodId"
              isDisabled={loading}
              label={<span>Budget Year</span>}
              onChange={(e) => setBudgetYearId(e?.value || "")}
              value={
                budgetYearOptions?.find(
                  (option) => option.value === budgetYearId,
                ) ||
                budgetYearOptions?.[1] ||
                ""
              }
              options={budgetYearOptions}
            />
          </div>
          <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
            <OverlayTrigger
              overlay={
                <Tooltip id="manpower-dashboard-desig-report-tooltip">
                  Designation Wise Budget Report
                </Tooltip>
              }
            >
              <button
                type="button"
                className="border-none bg-transparent"
                disabled={desigReportLoading}
                onClick={handleDesigReport}
              >
                <FileText className="w-4 h-4 text-black cursor-pointer" />
              </button>
            </OverlayTrigger>
          </div>

         
        </div>
        <StatsCard
          name={"Total Request"}
          value={data?.totalBudgetRecord || 0}
          keyName={"totalBudgetRecord"}
          icon={<Clipboard className="w-5 h-5 text-white" />}
        />
        <StatsCard
          name={"Pending Request"}
          value={data?.pendingBudget || 0}
          keyName={"pendingBudget"}
          icon={<ClipboardPaste className="w-5 h-5 text-white" />}
        />

        <StatsCard
          name={"Approved Request"}
          value={data?.approvedBudget || 0}
          keyName={"approvedBudget"}
          icon={<ClipboardCheck className="w-5 h-5 text-white" />}
        />
        <StatsCard
          name={"Rejected Request"}
          value={data?.rejectedBudget || 0}
          keyName={"rejectedBudget"}
          icon={<ClipboardCopy className="w-5 h-5 text-white" />}
        />
        <StatsCard
          name={"Total Budget"}
          value={data?.totalBudget || 0}
          isAmountFormat={true}
          keyName={"totalBudget"}
          icon={<BadgeDollarSign className="w-5 h-5 text-white" />}
        />
        <StatsCard
          name={"Utilized Budget"}
          isAmountFormat={true}
          value={Number(data?.utilizedBudget) || 0}
          keyName={"utilizedBudget"}
          icon={<WalletCards className="w-5 h-5 text-white" />}
        />
        <StatsCard
          name={"Remaining Budget"}
          value={data?.unUtilizedBudget || 0}
          isAmountFormat={true}
          keyName={"unUtilizedBudget"}
          icon={<PiggyBank className="w-5 h-5 text-white" />}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 ">
        <BigTable
          name="Total Request"
          data={data?.totalBudgetDetailRecord}
          setModalData={setModalData}
          setModalHeading={setModalHeading}
          expand={true}
        />
        <BigTable
          name="Department Manpower"
          data={data?.utilizedBudgetDetail}
          setModalData={setModalData}
          setModalHeading={setModalHeading}
          expand={true}
        />
        <BigTable
          name="Pending Request"
          data={data?.pendingBudgetDetail}
          setModalData={setModalData}
          setModalHeading={setModalHeading}
          expand={false}
        />

        <BigTable
          name="Approved Request"
          data={data?.approvedBudgetDetail}
          setModalData={setModalData}
          setModalHeading={setModalHeading}
          expand={false}
        />

        <BigTable
          name="Rejected Request"
          data={data?.rejectedBudgetDetail}
          setModalData={setModalData}
          setModalHeading={setModalHeading}
          expand={false}
        />
      </div>
      <FormTableModal
        data={modalData}
        name={modalHeading}
        onHide={() => {
          setModalData(null);
          setModalHeading(null);
        }}
        show={modalData && modalHeading}
      />
    </div>
  );
}