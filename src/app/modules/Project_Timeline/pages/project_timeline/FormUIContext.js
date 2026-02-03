import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const ProjectTimelineUIContext = createContext();

export function useProjectTimelineUIContext() {
  return useContext(ProjectTimelineUIContext);
}

export function ProjectTimelineUIProvider({ children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);

  const [ids, setIds] = useState([]);

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }
      if (isEqual(prevQueryParams, nextQueryParams)) return prevQueryParams;
      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParams,
    ids,
    setIds,
  };

  return (
    <ProjectTimelineUIContext.Provider value={value}>
      {children}
    </ProjectTimelineUIContext.Provider>
  );
}