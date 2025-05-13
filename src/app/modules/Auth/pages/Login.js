import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect, useSelector, shallowEqual, useDispatch } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

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
};
// const initialValues = {
//   email: "abdul@gmail.com",
//   password: "test12345",
// };

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);

  // const user = useSelector(({ auth }) => auth, shallowEqual)

  // useEffect(() => {
  //   return () => {}
  // }, [user])

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
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
        login(values.email, values.password)
          .then((data) => {
            disableLoading();
            const res = Object.values(data?.data?.data?.userAccess).flatMap(
              (items) => items
            );
            const HRMSRoutesLength = res.filter(
              (e) => e?.isResourceShow && e.portalType === 1
            ).length;
            localStorage.setItem(
              "isEmployeePortal",
              HRMSRoutesLength > 0 ? false : true
            );
            props.login(data?.data?.data);
          })
          .catch(() => {
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN",
              })
            );
          })
          .finally(() => {
            disableLoading();
            setSubmitting(false);
          });
      }, 1000);
    },
  });

  return (
    <div className="d-flex flex-column mt-5">
      <div
        className=" login-signin"
        id="kt_login_signin_form"
        style={{
          height: "72vh", // Full height of the viewport
          width: "30vw", // Make the form take full width
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          backgroundColor: "white",
          backgroundSize: "cover", // Ensures the gradient covers the entire area
          backgroundPosition: "center", // Ensures the background is centered
          padding: "60px", // Padding inside the form
        }}
      >
        <div
          className="text-center mb-10 mb-lg-20"
          style={{
            // width: "70%",  // Make the form take full width
            width: "20vw",
            height: "8vh", // 10% of the viewport height (can be adjusted)
            backgroundImage: `url(${toAbsoluteUrl(
              "/media/bg/login-logo.png"
            )})`, // Add image as background
            backgroundSize: "cover", // Ensure the image covers the entire container
            backgroundPosition: "center", // Center the image inside the container
            backgroundRepeat: "no-repeat", // Prevent the image from repeating
            borderRadius: "8px", // Optional: rounded corners
          }}
        ></div>

        <div>
          <h1
            className="fw-bold"
            style={{ color: "#2490CF", fontSize: "2rem" }}
          >
            Log In
          </h1>
        </div>
        <br />
        {/* end::Head */}

        {/*begin::Form*/}
        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework"
          // className="login-form"
        >
          {formik.status ? (
            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
              <div className="alert-text font-weight-bold">{formik.status}</div>
            </div>
          ) : (
            // (
            //   <div className="mb-10 alert alert-custom alert-light-info alert-dismissible">
            //     <div className="alert-text ">
            //       Use account <strong>admin@demo.com</strong> and password{" "}
            //       <strong>demo</strong> to continue.
            //     </div>
            //   </div>
            // )
            ""
          )}

          <div className="form-group fv-plugins-icon-container ">
            <input
              placeholder="Email"
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6  ${getInputClasses(
                "email"
              )} inputcolor`}
              name="emails"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>

          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )} inputcolor`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>

          <div className="d-flex align-items-center  ">
            <input
              type="checkbox"
              style={{
                transform: "scale(1.5)", // This will increase the size of the checkbox
                height: "12px", // You can also adjust height directly, though it's less effective
                width: "12px", // Increase width as well if needed
              }}
            />
            <span className="ml-3" style={{ fontSize: "15px" }}>
              Remember me
            </span>
          </div>
          <br />
          <br />

          <div className="">
            <button
              id=""
              type="submit"
              disabled={formik.isSubmitting}
              className="custom-button"
            >
              <span>Log In</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>

          <br />
          <div className="d-flex align-items-center  ">
            <span
              className="ml-1"
              style={{ fontSize: "15px", color: "#007bff" }}
            >
              Forgot Password?
            </span>
          </div>
        </form>
        {/* <div>footer</div> */}
        {/*end::Form*/}
        <br />
        <br />

        {/* <footer class="footer">
        <div class="footer-container">
            <div class="footer-left">
                <p>Privacy Policy</p>
                <p>Legal</p>
                <p>Contact Us</p>
            </div>
           
        </div>
    </footer> */}
      </div>
      <footer className="d-flex gap-4  login-footer  p-4 ">
        <div></div>
        <div>
          <p className="ml-5 mt-4">Privacy Policy</p>
        </div>
        <div>
          <p className="ml-5 mt-4">Legal</p>
        </div>
        <div>
          <p className="ml-5 mt-4">Contact Us</p>
        </div>
      </footer>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
