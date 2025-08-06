import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect, useSelector, shallowEqual, useDispatch } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { CircleArrowRight } from 'lucide-react';
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
    <div className="d-flex flex-column  h-100 ">
      <div
        className="bg-white p-10 h-100 rounded-top opacity-97"
        id="kt_login_signin_form"
      // style={{
      //   height: "72vh", // Full height of the viewport
      //   width: "30vw", // Make the form take full width
      //   justifyContent: "center", // Center horizontally
      //   alignItems: "center", // Center vertically
      //   backgroundColor: "white",
      //   backgroundSize: "cover", // Ensures the gradient covers the entire area
      //   backgroundPosition: "center", // Ensures the background is centered
      //   padding: "60px", // Padding inside the form
      // }}
      >


        <div>
          <img
          className="fluid"
            src="/media/bg/Login/DSC-Logo.svg"
            alt="DSC"
            style={{ height: 50, marginRight: 30 , backgroundSize: 'cover',}}
            
          />
        </div>

        {/* <br /> */}
        <br />

        <div>
          <h1
            className="fw-bold mt-10" style={{ color: '#000000', fontWeight: 400 }}
          // style={{ color: "#2490CF", fontSize: "2rem" }}
          >
            Log In
          </h1>


        </div>
        <br />
        {/* end::Head */}

        {/*begin::Form*/}
        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework "
        // className="login-form"
        >
          {/* {formik.status ? (
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
          )} */}

          <div className="form-group fv-plugins-icon-container ">
            <label className=" pb-2" style={{ color: '#000000', fontWeight: 400 }}>
              Email address
            </label>
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
            <label className=" pb-2" style={{ color: '#000000', fontWeight: 400 }}>
              Password
            </label>
            <input
              placeholder="Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )} inputcolor`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            {(formik.touched.password && formik.errors.password) || formik.status ? (
              <div className="fv-plugins-message-container">
                {formik.errors.password && (
                  <div className="fv-help-block">{formik.errors.password}</div>
                )}
                {/* {formik.status && (
                  <div className="fv-help-block">{formik.status}</div>
                )} */}
              </div>
            ) : null}
  {/* <br />
  <br /> */}
            {formik.status ? (
              <div className="alert alert-custom alert-light-danger alert-dismissible text-center h-2 mt-10">
                <div className="alert-text font-weight-bold">{formik.status}</div>
              </div>
            ) : (

              ""
            )}

          </div>

          {/* <div className="d-flex align-items-center  ">
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
          </div> */}
          <br />
          {/* <br /> */}

          <div className="">
            <button
              id=""
              type="submit"
              disabled={formik.isSubmitting}
              className="custom-button rounded"
            >

              <span>Log in    <CircleArrowRight strokeWidth={3} className="w-5 h-5 cursor-pointer"/></span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
          <div>

          </div>

          <br />
          {/* <div className="d-flex align-items-center  ">
            <span
              className="ml-1"
              style={{ fontSize: "15px", color: "#007bff" }}
            >
              Forgot Password?
            </span>
          </div> */}
        </form>

        <br />
        <br />


      </div>
      <footer className="d-flex gap-4  login-footer rounded-bottom ">
        <div></div>
        <div>
          <p className="mt-4 text-black">Privacy Policy</p>
        </div>
        <div>
          <p className="ml-4 mt-4 text-black">Legal</p>
        </div>
        <div>
          <p className="ml-4 mt-4 text-black">Contact Us</p>
        </div>
      </footer>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
