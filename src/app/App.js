/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { AuthInit } from "./modules/Auth";
import { Routes } from "../app/Routes";
import { I18nProvider } from "../_metronic/i18n";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";
import { ModalProvider } from '../context/ModalContext.js'; // Import the ModalProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ store, persistor, basename }) {
  return (
    <Provider store={store}>
      {/* Global toast container — always mounted so toasts work during session expiry */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        <React.Suspense fallback={<LayoutSplashScreen />}>
          <BrowserRouter basename={basename}>
            <MaterialThemeProvider>
              <I18nProvider>
                <ModalProvider>
                  <AuthInit>
                    <Routes />
                  </AuthInit>
                </ModalProvider>
              </I18nProvider>
            </MaterialThemeProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}