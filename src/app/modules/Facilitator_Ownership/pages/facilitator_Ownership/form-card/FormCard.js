import React, { useState } from "react";
import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import OwnershipTransferHeader from "../ownership-transfer-header/OwnershipTransferHeader";
import { TicketSendTable } from "../form-table/TicketSendTable";
import { TicketReceivedTable } from "../form-table/TicketReceivedTable";
import { useDispatch } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { toast } from "react-toastify";

export function FormCard() {
  const dispatch = useDispatch();
  const [showTables, setShowTables] = useState(false);
  const [filterData, setFilterData] = useState(null);

  const [sendSelection, setSendSelection] = useState([]);
  const [receiveSelection, setReceiveSelection] = useState([]);
  const [resetHeader, setResetHeader] = useState(false);

  const handleFilter = (data) => {
    if (data.fromEmployee) {
      setFilterData({ fromEmployee: data.fromEmployee, toEmployee: data.toEmployee });
      setShowTables(true);
      setSendSelection([]);
      setReceiveSelection([]);
    }
  };

  const handleTransferTicket = async () => {
  if (!filterData?.fromEmployee || !filterData?.toEmployee) {
    toast.error("Please select both From Employee and To Employee.");
    return;
  }

  try {
    if (sendSelection.length > 0) {
      await dispatch(
        actions.transferTickets({
          ticketIds: sendSelection.map((t) => t.rowId),
          fromEmployeeId: filterData.fromEmployee,
          toEmployeeId: filterData.toEmployee,
        })
      );
    }

    if (receiveSelection.length > 0) {
      await dispatch(
        actions.transferTickets({
          ticketIds: receiveSelection.map((t) => t.rowId),
          fromEmployeeId: filterData.fromEmployee,
          toEmployeeId: filterData.toEmployee,
        })
      );
    }

    dispatch(actions.fetchFacilitatorOwnershipSent({ employeeId: filterData.fromEmployee }));
    dispatch(actions.fetchFacilitatorOwnershipReceived({ employeeId: filterData.fromEmployee }));

    setSendSelection([]);
    setReceiveSelection([]);
    
  } catch (error) {
    toast.error("Error transferring tickets");
  }
};


  const handleClear = () => {
  setFilterData(null);
  setShowTables(false);
  setSendSelection([]);
  setReceiveSelection([]);
  setResetHeader((prev) => !prev); //reset header
};

  return (
    <TCard name={CurrentModuleName()}>
      <OwnershipTransferHeader onFilter={handleFilter} reset={resetHeader} />

      {showTables && (
        <>
          <h6 className="font-bold mb-0 text-primary my-2">Ticket (Receive)</h6>
          <TicketReceivedTable
            filterData={filterData}
            transferSelection={receiveSelection}
            setTransferSelection={setReceiveSelection}
          />

          <br />

          <h6 className="font-bold mb-0 text-primary my-2">Ticket (Send)</h6>
          <TicketSendTable
            filterData={filterData}
            transferSelection={sendSelection}
            setTransferSelection={setSendSelection}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button className="btn btn-success" onClick={handleTransferTicket}>
              Transfer Ticket
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </>
      )}
    </TCard>
  );
}
