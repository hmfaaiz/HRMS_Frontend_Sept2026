import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function LeaveBalanceTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      setQueryParamsLeaveApp: formUIContext.setQueryParamsLeaveApp,
    };
  }, [formUIContext]);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.leave_request,
    };
  }, shallowEqual);

  const { leaveBalances } = currentState;

  return (
    <div className="px-3 py-2 w-full bg-white rounded-lg ">
      <div className="w-full text-xs flex flex-col justify-between h-full">
        <h6 className="font-bold mb-0 text-primary my-2">Leave Balances</h6>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8  w-full md:w-7/12">
          {leaveBalances?.length > 0 &&
            leaveBalances?.map((el, i) => {
              return (
                <div
                  className="grid grid-cols-2 gap-4 items-center text-sm"
                  key={el?.leaveTypeName || i}
                >
                  <p className="text-black m-0 p-0">{el?.leaveTypeName}</p>
                  <p className="text-primary font-extrabold m-0">
                    {el?.remainingCount || 0}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
