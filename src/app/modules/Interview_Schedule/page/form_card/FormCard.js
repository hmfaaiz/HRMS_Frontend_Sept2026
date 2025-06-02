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

  const formUIProps = useMemo(() => {
    return {
      newInterview: FormUIContext?.FormUIEvents.newInterview,
      selectedApplicant: FormUIContext?.selectedApplicant,
      selectedJob: FormUIContext?.selectedJob,
    };
  });

  return (
    <>
      <Card>
        <CardBody>
          <CardHeader title={CurrentModuleName()}></CardHeader>
          <br />
          <hr />
          <JobSection />
          <br />
          <hr />
          <ApplicationSection />
          <br />
          <hr />
          {/* <CardHeader title={"Interview Schedule List"}></CardHeader> */}
          <div className=" p-2 d-flex justify-content-end">
            <CardHeaderToolbar>
              {accessToCreate?.isAccess && (
                <button
                  type="button"
                  disabled={
                    !formUIProps?.selectedApplicant || !formUIProps?.selectedJob
                  }
                  className="btn btn-primary"
                  onClick={formUIProps.newInterview}
                >
                  + Add Interview
                </button>
              )}
            </CardHeaderToolbar>
          </div>

          <FormTable />
        </CardBody>
      </Card>
    </>
  );
}
