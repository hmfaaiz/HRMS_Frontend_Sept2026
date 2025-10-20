import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { updatePassword } from "../_redux/authCrud";
import { CircleArrowRight } from "lucide-react";

const initialValues = {
  password: "",
  confirmPassword: "",
};

function ResetLinkPassword(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [linkValid, setLinkValid] = useState(true);
  const { Id } = useParams();
  const history = useHistory();

  // Validation schema
  const ResetLinkPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(5, "Minimum 6 characters")
      .max(50, "Maximum 50 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Validate the reset link when component loads
  useEffect(() => {
    if (!Id) {
      setRedirect(true);
    } else {
      // Call API to verify reset link validity
      updatePassword({ forgetLink: Id })
        .then(() => setLinkValid(true))
        .catch(() => setLinkValid(false));
    }
  }, [Id]);

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
    validationSchema: ResetLinkPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      updatePassword({ forgetLink: Id, password: values.password })
        .then(() => {
          setSubmitting(false);
          setLoading(false);
          setStatus("Password reset successfully!");
          setTimeout(() => history.push("/auth/login"), 2500);
        })
        .catch((err) => {
          setSubmitting(false);
          setLoading(false);
          setStatus(err?.response?.data?.message || "Something went wrong");
        });
    },
  });

  // Redirect if no Id param
  if (redirect) {
    return <Redirect to="/auth/login" />;
  }

  // Show message if link invalid
  if (!linkValid) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-red-600">Reset link is invalid or expired</h2>
        <Link to="/auth/login" className="text-blue-600 underline">
          Go back to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column h-100">
        <div className="bg-white p-10 h-100 rounded-top opacity-97">
          <div>
            <img
              className="fluid"
              src="/media/bg/Login/DSC-Logo.svg"
              alt="DSC"
              style={{ height: "7vh", backgroundSize: "cover" }}
            />
          </div>

          <br />

          <p
            className="mt-10 text-lg text-left"
            style={{ color: "#000000", fontWeight: 400, height: "2vh" }}
          >
            Enter your new password
          </p>

          <br />

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="form">
            <div className="flex flex-col">
              <label className="pb-2" style={{ color: "#000000", fontWeight: 400 }}>
                Password
              </label>
              <input
                placeholder="Password"
                type="password"
                className={`login-control form-control-solid ${getInputClasses(
                  "password"
                )} inputcolor !h-[7vh]`}
                name="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.password}</div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label className="pb-2" style={{ color: "#000000", fontWeight: 400 }}>
                Confirm Password
              </label>
              <input
                placeholder="Confirm Password"
                type="password"
                className={`login-control form-control-solid ${getInputClasses(
                  "confirmPassword"
                )} inputcolor !h-[7vh]`}
                name="confirmPassword"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.confirmPassword}</div>
                </div>
              ) : null}
            </div>

            <br />

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-tprimary text-white text-base font-bold h-[7vh] cursor-pointer rounded border-none hover:bg-black"
              >
                <span>
                  Submit
                  <CircleArrowRight strokeWidth={3} className="w-5 h-5 cursor-pointer" />
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
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ResetLinkPassword));
