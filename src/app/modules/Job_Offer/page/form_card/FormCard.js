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
import { useSelector, shallowEqual } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import GenerateSection from "../generate_section/generate_section";
import TCard from "../../../../utils/common-modules/TCard";
export default function FormCard() {
  const FormUIContext = useFormUIContext();
  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state?.auth?.userAccess["job_offer"],
    };
  }, shallowEqual);
  const accessToCreate = userAccess.find(
    (item) => item?.componentName === "CreateInterviewSchedule"
  );

  const formUIProps = useMemo(() => {
    return {
      newInterview: FormUIContext?.FormUIEvents.newInterview,
      selectedApplicant: FormUIContext?.selectedApplicant,
      selectedJob: FormUIContext?.selectedJob,
    };
  });

  return (
    // <>
    //   <Card>
    //     <CardHeader title={CurrentModuleName()}></CardHeader>
    //     <CardBody>
    //       <br />
    //       {/* <hr /> */}
    //       <JobSection />
    //       <br />
    //       {/* <hr /> */}
    //       <ApplicationSection />
    //       <br />
    //       {/* <hr /> */}
    //       <GenerateSection />
    //     </CardBody>
    //   </Card>
    <TCard name={CurrentModuleName()}>
      {/* <hr /> */}
      <JobSection />
    
      {/* <hr /> */}
      <ApplicationSection />
    
      <hr />
      <GenerateSection />
    </TCard>
    // </>
  );
}
