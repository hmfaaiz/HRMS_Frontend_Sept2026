import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import { CircleArrowRight, RotateCcw } from "lucide-react";
/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  email: "",
  password: "",
  otp: "",
};
// const initialValues = {
//   email: "abdul@gmail.com",
//   password: "test12345",
// };

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // const user = useSelector(({ auth }) => auth, shallowEqual)

  // useEffect(() => {
  //   return () => {}
  // }, [user])

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(10, "Minimum 10 characters")
      .max(50, "Maximum 50 characters")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(5, "Minimum 5 characters")
      .max(20, "Maximum 20 characters")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    otp: Yup.string().when("isOTP", {
      is: true,
      then: Yup.string()
        .required("OTP is required")
        .min(5)
        .max(6),
    }),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

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
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        setStatus("");
        login(values.email, values.password, values?.otp)
          .then((data) => {
            disableLoading();
            const response = data?.data?.data;
            if (response?.isOTP) {
              setIsOTP(true);
              setResendTimer(60); // start 60s countdown
            } else {
              setIsOTP(false);
              const res = Object.values(response?.userAccess).flatMap(
                (items) => items
              );
              const HRMSRoutesLength = res.filter(
                (e) => e?.isResourceShow && e.portalType === 1
              ).length;
              localStorage.setItem(
                "isEmployeePortal",
                HRMSRoutesLength > 0 ? false : true
              );
              props.login(response);
            }
          })
          .catch((error) => {
            // setStatus(
            //   intl.formatMessage({
            //     id: "AUTH.VALIDATION.INVALID_LOGIN",
            //   })
            // );
            // Extract message from API error
            let message =
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Something went wrong";
            // Pass it to formik.status so you can display it
            setStatus(message);
          })
          .finally(() => {
            disableLoading();
            setSubmitting(false);
          });
      }, 1000);
    },
  });

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = () => {
    if (resendTimer > 0) return; // prevent resend
    setResendTimer(60);
    formik.setStatus(""); // ✅ reset status error message
    formik.setFieldValue("otp", ""); // clear OTP field
    // Call API again with only email + password to re-trigger OTP
    login(formik.values.email, formik.values.password)
      .then((data) => {
        const response = data?.data?.data;
        if (response?.isOTP) {
          setIsOTP(true);
        }
      })
      .catch((error) => {
        let message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong";
        // Pass it to formik.status so you can display it
        formik.setStatus(message);
      });
  };

  return (
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

        <h1
          className="fw-bold mt-10 "
          style={{ color: "#000000", fontWeight: 400, height: "2vh" }}
          // style={{ color: "#2490CF", fontSize: "2rem" }}
        >
          Log In
        </h1>

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
              disabled={isOTP}
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

          <div className="flex flex-col mt-4">
            <label
              className=" pb-2"
              style={{ color: "#000000", fontWeight: 400 }}
            >
              Password
            </label>
            <input
              placeholder="Password"
              type="password"
              disabled={isOTP}
              className={`login-control form-control-solid !h-[7vh]  ${getInputClasses(
                "password"
              )} inputcolor`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            {(formik.touched.password && formik.errors.password) ||
            formik.status ? (
              <div className="fv-plugins-message-container">
                {formik.errors.password && (
                  <div className="fv-help-block">{formik.errors.password}</div>
                )}
              </div>
            ) : null}
            {/* <br />
  <br /> */}
          </div>

          {isOTP && (
            <div className="grid grid-cols-3 gap-x-1 mt-4">
              <div className="col-span-2 flex flex-col !h-[7vh]">
                {/* <label
                className=" pb-2"
                style={{ color: "#000000", fontWeight: 400 }}
              >
                OTP
              </label> */}
                <input
                  name="otp"
                  type="text"
                  value={formik.values.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-numeric
                    if (value.length <= 5) {
                      formik.setFieldValue("otp", value);
                    }
                  }}
                  className="login-control form-control-solid !h-[7vh] flex-1"
                  placeholder="Enter Code"
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary text-[1rem] !h-[7vh]"
                onClick={handleResend}
                disabled={resendTimer > 0}
              >
                <RotateCcw className="w-7 h-7" />
                {resendTimer > 0 ? `${resendTimer}s` : "Resend"}
              </button>
              {formik.touched.otp && formik.errors.otp && (
                <div className="fv-help-block">{formik.errors.otp}</div>
              )}
            </div>
          )}

          <br />
          {/* <br /> */}

          <div className="">
            <button
              id=""
              type="submit"
              disabled={formik.isSubmitting || (isOTP && !formik.values.otp)}
              className="w-full bg-tprimary text-white text-base font-bold h-[7vh] cursor-pointer rounded border-none hover:bg-black"
            >
              <span>
                Log in{" "}
                <CircleArrowRight
                  strokeWidth={3}
                  className="w-5 h-5 cursor-pointer"
                />
              </span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
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
              <Link to="/auth/forgot-password">Forgot Password?</Link>
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
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
