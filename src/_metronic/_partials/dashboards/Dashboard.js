import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../layout";
import { Demo1Dashboard } from "./Demo1Dashboard";
import { Demo2Dashboard } from "./Demo2Dashboard";
import { Demo3Dashboard } from "./Demo3Dashboard";
import { Demo4Dashboard } from "./Demo4Dashboard";
import { Demo5Dashboard } from "./Demo5Dashboard";
import { Demo6Dashboard } from "./Demo6Dashboard";
import { Demo7Dashboard } from "./Demo7Dashboard";
import { useDispatch } from "react-redux";
import { fetchAllCity } from "../../redux/dashboardActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const body = {
  centerId: 53,
  available: true,
  notAvailable: false,
};

export function Dashboard() {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchAllCity(body));
  // }, []);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      demo: objectPath.get(uiService.config, "demo"),
    };
  }, [uiService]);
  return (
    <>
      {/* {layoutProps.demo === "demo1" && <Demo1Dashboard />} */}
      {layoutProps.demo === "demo2" && <Demo2Dashboard />}
      {/* {layoutProps.demo === "demo3" && <Demo3Dashboard />}
      {layoutProps.demo === "demo4" && <Demo4Dashboard />}
      {layoutProps.demo === "demo5" && <Demo5Dashboard />}
      {layoutProps.demo === "demo6" && <Demo6Dashboard />}
      {layoutProps.demo === "demo7" && <Demo7Dashboard />} */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
