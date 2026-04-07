import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import {
  initialFilterForSubTask,
  initialFilterForComments,
} from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ children, formUIEvents }) {
  // table state
  const initVal = {
    comment: "",
    file: "",
    mentionEmpId: [],
  };
  const [panelMode, setPanelMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [commentForm, setCommentForm] = useState(initVal);
  const [queryParams, setQueryParamsBase] = useState(initialFilterForSubTask);
  const [commentsFilter, setCommentsFilter] = useState(
    initialFilterForComments,
  );
  const [refreshSubTickets, setRefreshSubTickets] = useState(null);

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }
      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }
      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParams,
    commentsFilter,
    setCommentsFilter,
    deleteModal,
    setDeleteModal,
    initVal,
    panelMode,
    setPanelMode,
    openTicketEditDialog: formUIEvents?.openTicketEditDialog,
    addTicketButtonClick: formUIEvents?.addTicketButtonClick,
    ticketTimeLogDialog : formUIEvents?.ticketTimeLogDialog,
    refreshSubTickets,
    setRefreshSubTickets,
    commentForm,
    setCommentForm,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
