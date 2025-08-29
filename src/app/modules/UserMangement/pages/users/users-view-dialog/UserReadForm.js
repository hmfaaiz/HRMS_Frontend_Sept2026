import React, { useEffect } from "react"
import { Modal } from "react-bootstrap"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import {
  Input,
  Select,
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import * as actions from "../../../_redux/usersActions"

// Validation schema
const userEditSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .min(3, "Minimum 3 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Firstname is required"),
  // lastName: Yup.string()
  //   .min(3, "Minimum 3 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Lastname is required"),
  // email: Yup.string()
  //   .email("Invalid email")
  //   .required("Email is required"),
  // phNo: Yup.string().required("Phone is Required"),
  // cnic: Yup.string().required("CNIC is Required"),
  // password: Yup.string().required("password is required"),
  // dateOfBbirth: Yup.mixed()
  //   .nullable(false)
  //   .required("Date of Birth is required"),
  // ipAddress: Yup.string().required("IP Address is required"),
})

export function UserReadForm({
  saveUser,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
}) {
  const dispatch = useDispatch()
  const title = "UserEditForm"
  //console.log(title, roles)
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={userEditSchema}
        onSubmit={(values) => {
          //console.log("User form Values", values)
          saveUser(values)
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-6">
                    <Select name="centerId" label="Center">
                      {centers.map((item) => {
                        return (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        )
                      })}
                    </Select>
                  </div>

                  <div className="col-lg-6">
                    <Select name="roleId" label="Role">
                      {roles.map((item) => {
                        return (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        )
                      })}
                    </Select>
                  </div>
                </div>
                <div className="form-group row">
                  {/* First Name */}
                  <div className="col-lg-4">
                    <Field
                      name="firstName"
                      component={Input}
                      placeholder="First Name"
                      label="First Name"
                    />
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-4">
                    <Field
                      name="lastName"
                      component={Input}
                      placeholder="Last Name"
                      label="Last Name"
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      type="email"
                      name="email"
                      component={Input}
                      placeholder="Email"
                      label="Email"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-4">
                    <Field
                      name="phNo"
                      component={Input}
                      placeholder=""
                      label="Phone No"
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      name="cnic"
                      component={Input}
                      placeholder=""
                      label="CNIC"
                    />
                  </div>
                  <div className="col-lg-4">
                    <Field
                      name="password"
                      type="password"
                      component={Input}
                      placeholder=""
                      label="Password"
                    />
                  </div>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  )
}
