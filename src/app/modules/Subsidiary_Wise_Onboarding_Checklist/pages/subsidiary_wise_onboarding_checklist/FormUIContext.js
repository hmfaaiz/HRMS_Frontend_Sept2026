import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const SubsidiaryOnboardingUIContext = createContext();

export function useSubsidiaryOnboardingUIContext() {
  return useContext(SubsidiaryOnboardingUIContext);
}

export function SubsidiaryOnboardingUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);

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

  const initChecklistItem = useMemo(
    () => ({
      companyId: null,
      subsidiaryId: null,
      departmentId: null,
      taskName: "",
      taskDescription: "",
      attachmentPath: "",
      list: [],
    }),
    []
  );

 const value = useMemo(
  () => ({
    queryParams,
    setQueryParams,
    ids,
    setIds,
    initChecklistItem,
    ...FormUIEvents, // all four methods
  }),
  [queryParams, ids, initChecklistItem, FormUIEvents]
);



  return (
    <SubsidiaryOnboardingUIContext.Provider value={value}>
      {children}
    </SubsidiaryOnboardingUIContext.Provider>
  );
}
