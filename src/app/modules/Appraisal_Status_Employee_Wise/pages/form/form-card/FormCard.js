import React, { useState } from "react";
import { FormFilter } from "../form-filter/FormFIlter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { useSelector, shallowEqual } from "react-redux";
import { BigTable } from "../../../../Dashboard/pages/dashboard/admin_portal_comp/BigTable";
import BigTableModal from "../../../../Dashboard/pages/dashboard/admin_portal_comp/ExpandViews/BigTableModal";
export function FormCard() {
  const [modalData, setModalData] = useState(null);
  const { entities } = useSelector((state) => {
    return {
      entities: state?.appraisal_status?.entities,
    };
  }, shallowEqual);
  return (
    <>
      <TCard name={CurrentModuleName()}>
        <FormFilter />
      </TCard>
      <div className="grid sm:grid-cols-2 gap-3 mt-2">
        {entities?.length > 0 &&
          entities?.map((e, i) => {
            return (
              <BigTable data={e} key={i} setBigTableModalData={setModalData} />
            );
          })}
      </div>
      <BigTableModal
        show={modalData}
        data={modalData}
        onHide={() => {
          setModalData(null);
        }}
      />
    </>
  );
}
