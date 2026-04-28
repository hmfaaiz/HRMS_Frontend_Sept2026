import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter, initialValues } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}
export const FormUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [travelRequestId, setTravelRequestId] = useState(null);
  const [panelMode, setPanelMode] = useState(false);
  const [userForEdit, setUserForEdit] = useState(null);

  // ── Delete state ──
  const [idToDelete, setIdToDelete] = useState(null);
  const openDeleteDialog = (Id) => setIdToDelete(Id);
  const closeDeleteDialog = () => setIdToDelete(null);

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

  const value = useMemo(() => ({
    queryParams,
    setQueryParams,
    ids,
    setIds,
    initUser: initialValues,
    employeeId,
    setEmployeeId,
    travelRequestId,
    setTravelRequestId,
    panelMode,
    setPanelMode,
    userForEdit,
    setUserForEdit,
    // ── Delete ──
    idToDelete,
    openDeleteFormDialog: openDeleteDialog,
    closeDeleteDialog,
  }), [
    queryParams, ids, employeeId, travelRequestId,
    panelMode, userForEdit, setQueryParams, idToDelete,
  ]);

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}