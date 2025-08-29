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
     
      >


        <div>
          <img
            className="fluid"
            src="/media/bg/Login/DSC-Logo.svg"
            alt="DSC"
            style={{ height: "7vh", backgroundSize: 'cover', }}

          />
        </div>

        {/* <br /> */}
        <br />

      
          <h1
            className="fw-bold mt-10 " style={{ color: '#000000', fontWeight: 400,height:"2vh" }}
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
         

          <div className="flex flex-col" >
            <label className=" pb-2" style={{ color: '#000000', fontWeight: 400 }}>
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

          <div className="flex flex-col mt-4" >
            <label className=" pb-2" style={{ color: '#000000', fontWeight: 400 }}>
              Password
            </label>
            <input
              placeholder="Password"
              type="password"
              className={`login-control form-control-solid !h-[7vh]  ${getInputClasses(
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

     
          <br />
          {/* <br /> */}

          <div className="">
            <button
              id=""
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-tprimary text-white text-base font-bold h-[7vh] cursor-pointer rounded border-none hover:bg-black"
            >

              <span>Log in    <CircleArrowRight strokeWidth={3} className="w-5 h-5 cursor-pointer" /></span>
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
