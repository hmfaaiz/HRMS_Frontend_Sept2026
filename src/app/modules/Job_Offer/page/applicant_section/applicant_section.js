import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllJobVacancy } from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { format } from "date-fns";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Eye, XCircle } from "lucide-react";
import { amountFormat } from "../../../../utils/common";

export default function ApplicationSection() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      selectedApplicant: FormUIContext?.selectedApplicant,
      setSelectedApplicant: FormUIContext?.setSelectedApplicant,
      signatoryisShow: FormUIContext?.signatoryisShow,
      setSignatoryisShow: FormUIContext?.setSignatoryisShow,
      setApplicantVacancyId: FormUIContext?.setApplicantVacancyId,
      applicantVacancyId: FormUIContext?.applicantVacancyId,
      panelMode2: FormUIContext.panelMode2,
      setPanelMode2: FormUIContext.setPanelMode2,
    };
  });

  const { applicants, applicantProfile } = useSelector((state) => {
    return {
      applicants: state?.job_offer?.applicants,
      applicantProfile: state?.job_offer?.applicantProfile,
    };
  }, shallowEqual);

  useEffect(() => {
    if (formUIProps?.selectedApplicant) {
      dispatch(actions?.fetchApplicantProfile(formUIProps?.selectedApplicant));
    }
  }, [formUIProps?.selectedApplicant]);

  useEffect(() => {
    if (formUIProps?.applicantVacancyId && formUIProps?.selectedApplicant) {
      // dispatch(actions?.fetchApplicantVacancy(formUIProps?.applicantVacancyId));
    }
  }, [formUIProps?.applicantVacancyId, formUIProps?.selectedApplicant]);

  return (
     <>
      {/* job selection area  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 col-span-12">

        {/* Employee Id Dropdown Starts */}
        <div className="ml-3">
          <SearchSelect
            name="cityId"
            options={applicants}
            label="Applicant Name"
            onChange={(e) => {
              formUIProps.setSelectedApplicant(e?.value);
              formUIProps.setApplicantVacancyId(e?.applicantVacancyId);
              formUIProps.setApplicantDetail(e?.applicantDetail);
            }}
            value={
              applicants?.find(
                (el) => el?.value === formUIProps.selectedApplicant
              ) || ""
            }
            isClearable={false}
          />
        </div>
        {/* <div className="col-12 col-md-4 d-flex  align-items-center pt-10">
          <span
            className="svg-icon svg-icon-md svg-icon-primary"
            onClick={() => formUIProps.setPanelMode2(!formUIProps.panelMode2)}
          >
            <SVG
              src={toAbsoluteUrl(
                formUIProps.panelMode2
                  ? "/media/svg/icons/Communication/CancelButton.svg"
                  : "/media/svg/icons/Communication/AddButton.svg"
              )}
            />
          </span>


        </div> */}
        <div className="mt-6">



          {formUIProps.panelMode2 ? (
            <button
              type="button"
              className="btn btn-light btn-elevate d-flex align-items-center gap-2"
              onClick={() => formUIProps.setPanelMode2(!formUIProps.panelMode2)}
            >
              <XCircle className="w-3 h-3 text-black" />
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => formUIProps.setPanelMode2(!formUIProps.panelMode2)}
            >


              <Eye className="w-4 h-4 text-white" />
              View Details
            </button>
          )}




        </div>

      </div>
      <br />
      {/* job detail collapsable panel  */}
      {formUIProps.panelMode2 && (


        <div className="px-2">
          {formUIProps.selectedApplicant && applicantProfile && Object?.keys(applicantProfile)?.length > 0 ? (

            <>
              {/* <hr /> */}
              <div className="grid lg:grid-cols-4 gap-x-3 gap-y-1 bg-tsecondary px-4 py-3">


                <div >

                  <h6 className="font-bold mb-0 text-primary my-2">
                    Office Information
                  </h6>

                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">

                    <React.Fragment>
                      <div className="font-medium">Date Of Birth: </div>
                      <div> {applicantProfile?.dateOfBirth
                        ? format(
                          new Date(applicantProfile?.dateOfBirth),
                          "dd-MMM-yyyy"
                        )
                        : "N/A"}</div>

                    </React.Fragment>


                    <React.Fragment>
                      <div className="font-medium"> Email Address : </div>
                      <div>    {applicantProfile?.email_personal || "N/A"}</div>
                    </React.Fragment>



                    <React.Fragment >

                      <div className="font-medium">  Gender: </div>
                      <div>  {applicantProfile?.gender || "N/A"} </div>

                    </React.Fragment>


                    <React.Fragment>
                      <div className="font-medium">  Marital Status: </div>
                      <div> {applicantProfile?.MaritalStatus?.formName || "N/A"} </div>
                    </React.Fragment>



                    <React.Fragment>
                      <div className="font-medium">  S/O , D/O , W/O:  </div>
                      <div> {applicantProfile?.relation_name || "N/A"} </div>
                    </React.Fragment>



                    <React.Fragment>
                      <div className="font-medium">  Religion:  </div>


                      <div> {applicantProfile?.Religion?.formName || "N/A"} </div>
                    </React.Fragment>


                    <React.Fragment>
                      <div className="font-medium"> Id Card No.: </div>
                      <div>  {applicantProfile?.nic_no || "N/A"} </div>
                    </React.Fragment>

                    <React.Fragment>
                      <div className="font-medium"> Passport:  </div>
                      <div>  {applicantProfile?.passportNo || "N/A"} </div>
                    </React.Fragment>

                    <React.Fragment>
                      <div className="font-medium"> Country:  </div>
                      <div>  {applicantProfile?.Country?.name || "N/A"}  </div>
                    </React.Fragment>

                    <React.Fragment>
                      <div className="font-medium"> City:  </div>
                      <div>  {applicantProfile?.City?.name || "N/A"} </div>
                    </React.Fragment>

                    <React.Fragment>
                      <div className="font-medium"> Phone No (Home) :  </div>
                      <div>   {applicantProfile?.phone_official || "N/A"} </div>
                    </React.Fragment>

                    <React.Fragment>
                      <div className="font-medium"> Cell No : </div>
                      <div> {applicantProfile?.phone_cell || "N/A"} </div>
                    </React.Fragment>

                  </div>
                </div>

                <div>

                  <h6 className="font-bold mb-0 text-primary my-2">
                    Applicant Job Detail
                  </h6>
                  <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 text-sm text-black gap-y-2 mt-2">
                    <React.Fragment>
                      <div className="font-medium">Designation : </div>
                      <div>  {applicantProfile?.currentDesignation || "N/A"}</div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Applicant Can Join (Days) : </div>
                      <div>   {applicantProfile?.applicantCanJoin || "N/A"}</div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Last Drawn Salary : </div>
                      <div>   {applicantProfile?.LastDawnSalaryCurrency?.formName ||
                        ""}{" "}
                        {applicantProfile?.lastDawnSalary || "N/A"}</div>
                    </React.Fragment>
                    <React.Fragment>
                      <div className="font-medium">Expected Salary Range : </div>
                      <div>    {applicantProfile?.ExpectedSalaryCurrency?.formName ||
                        ""}{" "}
                        {amountFormat(
                          applicantProfile?.expectedSalaryRangeFrom
                        ) || ""}{" "}
                        to{" "}
                        {amountFormat(
                          applicantProfile?.expectedSalaryRangeTo
                        ) || ""}</div>
                    </React.Fragment>
                    <React.Fragment><div className="font-medium">Other Information: </div>
                      <div>  {applicantProfile?.otherInformation || "N/A"}</div>

                    </React.Fragment>

                  </div>
                </div>
              </div>

            </>
          ) : (
            <p className="text-center m-2">Please Select Applicant Profile</p> // Improved message for clarity
          )}
        </div>

      )}
    </>
  );
}
