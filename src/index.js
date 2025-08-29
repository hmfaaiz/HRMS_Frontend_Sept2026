/**
 * Create React App entry point. This and `public/index.html` files can not be
 * changed or moved.
 */
import "react-app-polyfill/ie11"
import "react-app-polyfill/stable"
import React from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import * as _redux from "./redux"
import store, { persistor } from "./redux/store"
import App from "./app/App"
import "./index.scss" // Standard version
// import "./sass/style.react.rtl.css"; // RTL version
import "./_metronic/_assets/plugins/keenthemes-icons/font/ki.css"
import "socicon/css/socicon.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "./_metronic/_assets/plugins/flaticon/flaticon.css"
import "./_metronic/_assets/plugins/flaticon2/flaticon.css"
// Datepicker
import "react-datepicker/dist/react-datepicker.css"
import {
  MetronicLayoutProvider,
  MetronicSplashScreenProvider,
  MetronicSubheaderProvider,
} from "./_metronic/layout"
import { MetronicI18nProvider } from "./_metronic/i18n"
import "./custum.css"

const { PUBLIC_URL, REACT_APP_ENV } = process.env
//console.log("Env", process.env)
// This the mock-axios-data setup. You can comment this part when you want to integrate your server.
// Don't forget to update server url in .env file

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/* const mock = */

/**
 * Inject metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */

if (REACT_APP_ENV !== "server") {
  // _redux.mockAxios(axios)
  _redux.setupAxios(axios, store)
} else {
  //console.log("Get Server Data")
  _redux.setupAxios(axios, store)
}
//console.log("Initial Store State in index.js", store.getState())
ReactDOM.render(
  <MetronicI18nProvider>
    <MetronicLayoutProvider>
      <MetronicSubheaderProvider>
        <MetronicSplashScreenProvider>
          <App store={store} persistor={persistor} basename={PUBLIC_URL} />
        </MetronicSplashScreenProvider>
      </MetronicSubheaderProvider>
    </MetronicLayoutProvider>
  </MetronicI18nProvider>,
  document.getElementById("root")
)
