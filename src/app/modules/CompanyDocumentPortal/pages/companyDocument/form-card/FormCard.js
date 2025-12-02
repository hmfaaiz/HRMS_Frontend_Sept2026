import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { EmployeeDocTable } from "../form-table/EmployeeDocTable";
import { EmployeeUIProvider } from "../EmployeeUIContext";
export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.company_doc_portal,
    }),
    shallowEqual
  );



  const { currentState } = useSelector((state) => {
    return {
      currentState: state.company_doc_portal,
      userAccess: state?.auth?.userAccess["company_doc_portal"],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  const { entities } = currentState;

  return (
    <>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
              menuOptions={[

              ]}
              isDashboardIcon={true}
            />
          </div>
          <EmployeeProfile />
        </div>
        <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
          <div className="hidden xl:block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
              menuOptions={[

              ]}
              isDashboardIcon={true}
            />
          </div>
          <div className="px-3 py-2 rounded-lg bg-white">
            {/* <div className="grid grid-cols-6">
              <FormFIlter />
            </div> */}



            <FormTable />
            <br></br>

          </div>


          {/* Employee Doc */}
            <EmployeeUIProvider>
          

           <div className="px-3 py-2 rounded-lg bg-white">
            {/* <div className="grid grid-cols-6">
              <FormFIlter />
            </div> */}



            <EmployeeDocTable />
            <br></br>

          </div>
           </EmployeeUIProvider>

        </div>
      </div>


    </>
  );
}
