import React, { useMemo } from "react";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import JobSection from "../job_section/job_section";
import ApplicationSection from "../applicant_section/applicant_section";
import { FormTable } from "../form_table/FormTable";
import { useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import HRRecomendation from "../hr_recomendation/HRRecomendation";
import TCard from "../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
export default function FormCard() {
  const FormUIContext = useFormUIContext();
  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state?.auth?.userAccess["interview_schedule"],
    };
  }, shallowEqual);
  const accessToCreate = userAccess.find(
    (item) => item?.componentName === "CreateInterviewSchedule"
  );

  const accessToHRRecommendation = userAccess.find(
    (item) => item?.componentName === "UpdateApplicantStatus"
  );

  const formUIProps = useMemo(() => {
    return {
      newButtonClick: FormUIContext?.newButtonClick,
      selectedApplicant: FormUIContext?.selectedApplicant,
      selectedJob: FormUIContext?.selectedJob,
    };
  });

  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}></CardHeader>
    //     <CardBody>
    //       <JobSection />
    //       <ApplicationSection />
    //       <div className=" p-2 d-flex justify-content-end">
    //         <CardHeaderToolbar>
    //           {accessToCreate?.isAccess && (
    //             <button
    //               type="button"
    //               disabled={
    //                 !formUIProps?.selectedApplicant || !formUIProps?.selectedJob
    //               }
    //               className="btn btn-primary"
    //               onClick={formUIProps.newButtonClick}
    //             >
    //               + Add
    //             </button>
    //           )}
    //         </CardHeaderToolbar>
    //       </div>

    //       <FormTable />
    //       <br />
    //       <hr />
    //       {accessToHRRecommendation?.isAccess && <HRRecomendation />}
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <JobSection />
      <ApplicationSection />
      <div className="d-flex justify-end items-center">
        {accessToCreate?.isAccess && (
          <button
            type="button"
            disabled={
              !formUIProps?.selectedApplicant || !formUIProps?.selectedJob
            }
            className="btn btn-primary"
            onClick={formUIProps.newButtonClick}
          >
            <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
            Add
          </button>
        )}
      </div>
      <FormTable />
      {accessToHRRecommendation?.isAccess && <HRRecomendation />}
    </TCard>
    // </>
  );
}
