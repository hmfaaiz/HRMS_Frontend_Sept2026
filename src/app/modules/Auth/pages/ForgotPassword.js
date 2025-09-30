import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { requestPassword } from "../_redux/authCrud";
import { CircleArrowRight } from "lucide-react";

const initialValues = {
  email: "",
};

function ForgotPassword(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      requestPassword(values.email)
        .then(() => {
          setStatus("Reset link sent to your email successfully");
          setTimeout(() => setIsRequested(true), 2500);
        })
        .catch((err) => {
          setIsRequested(false);
          setSubmitting(false);
          setStatus(err?.response?.data?.message || "Something went wrong");
        });
    },
  });

  return (
    <>
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (
        <div className="d-flex flex-column  h-100 ">
          <div
            className="bg-white p-10 h-100 rounded-top opacity-97"
            id="kt_login_signin_form"
          >
            <div>
              <img
                className="fluid"
                src="/media/bg/Login/DSC-Logo.svg"
                alt="DSC"
                style={{ height: "7vh", backgroundSize: "cover" }}
              />
            </div>

            {/* <br /> */}
            <br />

            <p
              className=" mt-10 text-lg text-center"
              style={{ color: "#000000", fontWeight: 400, height: "2vh" }}
              // style={{ color: "#2490CF", fontSize: "2rem" }}
            >
              Enter your email to reset your password
            </p>

            <br />
            <br />
            {/* end::Head */}

            {/*begin::Form*/}
            <form
              onSubmit={formik.handleSubmit}
              className="form   "
              // className="login-form"
            >
              <div className="flex flex-col">
                <label
                  className=" pb-2"
                  style={{ color: "#000000", fontWeight: 400 }}
                >
                  Email address
                </label>
                <input
                  placeholder="Email"
                  type="text"
                  className={`login-control form-control-solid  ${getInputClasses(
                    "email"
                  )} inputcolor !h-[7vh]`}
                  name="emails"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.email}</div>
                  </div>
                ) : null}
              </div>

              <br />

              <div className="">
                <button
                  id=""
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-tprimary text-white text-base font-bold h-[7vh] cursor-pointer rounded border-none hover:bg-black"
                >
                  <span>
                    Submit
                    <CircleArrowRight
                      strokeWidth={3}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </span>
                  {loading && (
                    <span className="ml-3 spinner spinner-white"></span>
                  )}
                </button>
              </div>
              {formik.status ? (
                <div className="text-center mt-2">
                  <div className="alert-text font-weight-bold text-red-700 text-sm">
                    {formik.status}
                  </div>
                </div>
              ) : (
                ""
              )}
              <div></div>

              <br />
              <div className="d-flex align-items-center  ">
                <span className="text-sm text-tprimary">
                  <Link to="/auth/login">Go to Login Page</Link>
                </span>
              </div>
            </form>

            <br />
            <br />
          </div>
          <footer className="flex gap-4 bg-tsecondary p-4 rounded-bottom pl-7">
            <div>
              <Link
                to="/privacy-policy"
                className=" text-black hover:underline cursor-pointer"
              >
                Privacy Policy
              </Link>
            </div>

            <div>
              <Link
                to="/disclaimer"
                className=" text-black hover:underline cursor-pointer"
              >
                Disclaimer
              </Link>
            </div>

            <div>
              <a
                href="https://dynasoftcloud.com/contact-us.php"
                target="_blank"
                rel="noopener noreferrer"
                className=" text-black hover:underline cursor-pointer"
              >
                Contact Us
              </a>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
