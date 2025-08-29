import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  Children,
} from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter, initialvehicleFilter } from "./DashboardUIHelpers";

const CentersUIContext = createContext();

export function useCentersUIContext() {
  return useContext(CentersUIContext);
}

export const CentersUIConsumer = CentersUIContext.Consumer;
// const initialFilter = {
//   sortBy: "name",
//   limit: 10,
//   page: 1,
// }
export function DashboardUIProvider({ centersUIEvents, children }) {
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

  const [secondQueryParams, setSecondQueryParamsBase] = useState(
    initialvehicleFilter
  );

  const setSecondQueryParams = useCallback((nextQueryParams) => {
    setSecondQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initCenter = {
    centerId: "",
    name: "",
    phoneNo: "",
    // location: "",
    // longitude: "",
    // latitude: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    setSecondQueryParams,
    setSecondQueryParamsBase,
    secondQueryParams,
    ids,
    setIds,
    initCenter,
    newCenterButtonClick: centersUIEvents.newCenterButtonClick,
    openEditCenterDialog: centersUIEvents.openEditCenterDialog,
    openDeleteCenterDialog: centersUIEvents.openDeleteCenterDialog,
    openActiveCenterDialog: centersUIEvents.openActiveCenterDialog,
    openReadCenterDialog: centersUIEvents.openReadCenterDialog,
    openReadLastTripsDialog: centersUIEvents.openReadLastTripsDialog,
  };
  return (
    <CentersUIContext.Provider value={value}>
      {children}
    </CentersUIContext.Provider>
  );
}
