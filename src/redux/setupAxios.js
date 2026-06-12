import { actions } from "../app/modules/Auth/_redux/authRedux";
import { toast } from "react-toastify";

// Flag to ensure session expiry logout + toast fires only once,
// even when multiple in-flight API calls all return 308 simultaneously.
let isLoggingOut = false;

export default function setupAxios(axios, store) {
  // setTimeout(() => {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { tokens },
      } = store.getState();

      if (tokens) {
        config.headers.Authorization = `Bearer ${tokens?.access}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );
  // }, 10000)


  // Add response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Return response as is if status code is in the 2xx range
      return response;
    },
    (error) => {
      if (error.response) {
        // Check for specific status code
        const { status } = error.response;

        if (status === 308) {
          // Guard: only the first 308 triggers logout & toast
          if (!isLoggingOut) {
            isLoggingOut = true;

            // Dispatch logout first React immediately routes to login screen
            store.dispatch(actions.logout());

            // Delay toast slightly so the global ToastContainer in App.js has settled
            setTimeout(() => {
              toast.error('Your session is no longer active. Please log in again to continue.');
              // Reset flag after logout is complete so future logins work normally
              isLoggingOut = false;
            }, 300);
          }

          // Return a forever-pending promise so no component catch() fires
          return new Promise(() => { });
        }
      }

      // Reject the error for further handling in individual requests
      return Promise.reject(error);
    }
  );
}
