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
          // Redirect to login page If token is expired or not logged in
          window.location.href = '/logout'
        } 
      }

      // Reject the error for further handling in individual requests
      return Promise.reject(error);
    }
  );
}
