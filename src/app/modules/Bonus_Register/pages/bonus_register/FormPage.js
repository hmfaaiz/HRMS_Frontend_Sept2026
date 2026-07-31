import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BonusRegisterFilter } from "./form-filter/FormFilter";
import { useSelector } from "react-redux";
import { BonusRegisterUIProvider } from "./FormUIContext";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";

export function BonusRegisterPage() {
  const { registerLoading, registerExcelLoading, registerPreviewLoading } = useSelector(
    (state) => ({
      registerLoading: state.bonus_register.registerLoading,
      registerExcelLoading: state.bonus_register.registerExcelLoading,
      registerPreviewLoading: state.bonus_register.registerPreviewLoading,
    })
  );

  return (
    <BonusRegisterUIProvider>
      <TCard name={CurrentModuleName()}>
        <BonusRegisterFilter
          registerLoading={registerLoading}
          registerExcelLoading={registerExcelLoading}
          registerPreviewLoading={registerPreviewLoading}
        />
      </TCard>
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
    </BonusRegisterUIProvider>
  );
}