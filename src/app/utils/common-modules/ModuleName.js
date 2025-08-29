import { useMemo } from 'react';
import { shallowEqual, useSelector } from "react-redux";

/**
 * Custom hook to get the name based on the user's access and the current path.
 * 
 * @returns {string} - The name corresponding to the current path from the user access.
 */
const CurrentModuleName = () => {
  // Get the auth state from the Redux store
  const auth = useSelector(({ auth }) => auth, shallowEqual);
  const UserAccess = auth?.userAccess;
  const pathName = window?.location?.pathname?.substring(1);
  const name = useMemo(() => {
    return Object.values(UserAccess || {})?.flatMap(el => el)?.find(acc => pathName.includes(acc?.url))?.name || '';
  }, [pathName, UserAccess]);

  return name;
};

export default CurrentModuleName;
