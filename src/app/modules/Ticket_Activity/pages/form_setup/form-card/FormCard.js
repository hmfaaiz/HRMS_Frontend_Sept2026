import React, { useDebugValue, useEffect, useMemo } from "react";
import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import TicketDetail from "../../../../../utils/common-modules/TicketDetail";
import { useFormUIContext } from "../FormUIContext";
import { CommentSection } from "../comment-section/CommentSection";
import { useHistory } from "react-router-dom";
import { fetchAllTicket } from "../../../../Dashboard/_redux/dashboardActions";
import { useDispatch } from "react-redux";
export function FormCard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      setCommentsFilter: formUIContext.setCommentsFilter,
      commentsFilter: formUIContext.commentsFilter,
      panelMode: formUIContext.panelMode,
    };
  }, [formUIContext]);

  useEffect(() => {
    const queryParams = Object?.fromEntries(
      new URLSearchParams(history?.location?.search)?.entries(),
    );

    if (queryParams && Object.keys(queryParams).length > 0) {
      // Set filter from query params
      formUIProps.setCommentsFilter({
        ...formUIProps.commentsFilter,
        ...queryParams,
      });
      if (queryParams?.projectId)
        dispatch(fetchAllTicket(null, queryParams?.projectId));

      // Clear query params from URL
      history.replace({
        pathname: history.location.pathname,
        search: "", // Empty search params
        state: history.location.state,
      });
    }
  }, [history]);
  return (
    <>
      <TCard name={CurrentModuleName()}>
        <FormFilter />
        <br />
        {formUIProps?.panelMode && (
          <TicketDetail
            ticketId={formUIProps?.commentsFilter?.ticketId}
            panelMode={formUIProps?.panelMode}
          />
        )}
      </TCard>
      <CommentSection />
      <FormTable />
    </>
  );
}
