// import React, { createContext, useContext, useState, useCallback } from "react";
// import { isEqual, isFunction } from "lodash";



// const TaskAssignmentTimelineUIContext = createContext();

// export function useTaskAssignmentTimelineUIContext() {
//   return useContext(TaskAssignmentTimelineUIContext);
// }

// export function TaskAssignmentTimelineUIProvider({ children }) {
//   const [queryParams, setQueryParamsBase] = useState({
//     filter: {},
//     pageNumber: 1,
//     pageSize: 10,
//     isFiltered: false,});

//   const [ids, setIds] = useState([]);
//   const [showFilter, setShowFilter] = useState(false);

//   const [hasRecords, setHasRecords] = useState(false);

//   const setQueryParams = useCallback((nextQueryParams) => {
//     setQueryParamsBase((prevQueryParams) => {
//       if (isFunction(nextQueryParams)) {
//         nextQueryParams = nextQueryParams(prevQueryParams);
//       }
//       if (isEqual(prevQueryParams, nextQueryParams)) return prevQueryParams;
//       return nextQueryParams;
//     });
//   }, []);

//  const value = {
//   queryParams,
//   setQueryParams,
//   ids,
//   setIds,
//   showFilter,
//   setShowFilter,
//   hasRecords,
//   setHasRecords
// };


//   return (
//     <TaskAssignmentTimelineUIContext.Provider value={value}>
//       {children}
//     </TaskAssignmentTimelineUIContext.Provider>
//   );
// }


import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";

const TaskAssignmentTimelineUIContext = createContext();

export function useTaskAssignmentTimelineUIContext() {
  return useContext(TaskAssignmentTimelineUIContext);
}

export function TaskAssignmentTimelineUIProvider({ taskAssignmentTimelineUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState({
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    isFiltered: false,
  });

  const [ids, setIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [hasRecords, setHasRecords] = useState(false);

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
    showFilter,
    setShowFilter,
    hasRecords,
    setHasRecords,
    // ADD: Navigation events
    openDetailGridData: taskAssignmentTimelineUIEvents?.openDetailGridData,
    openDetailTimeLog: taskAssignmentTimelineUIEvents?.openDetailTimeLog,
    addNewTicket: taskAssignmentTimelineUIEvents?.addNewTicket,
  };

  return (
    <TaskAssignmentTimelineUIContext.Provider value={value}>
      {children}
    </TaskAssignmentTimelineUIContext.Provider>
  );
}