import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Select,
  TextArea,
} from "../../../../_metronic/_partials/controls";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
const incidentEditSchema = Yup.object().shape({
  callerName: Yup.string().required("Caller name is required"),
  callerCNIC: Yup.string().matches(
    cnicRegExp,
    "CNIC should be like 35401-2432321-1"
  ),
  callerPhoneNo: Yup.string()
    .matches(phoneRegExp, "Number should be like 03049018107")
    .required("Phone No is required"),
  patientName: Yup.string(),
  patientCNIC: Yup.string().matches(
    cnicRegExp,
    "CNIC shold be like 35401-2432321-1"
  ),
  location: Yup.string().required("Locations is required"),
  area: Yup.string().required("Area ia required"),
  shortDescription: Yup.string(),
  incidentTypeId: Yup.string().required("Incident type is required"),
  incidentSeverityId: Yup.string().required("Severity is required"),
  centerId: Yup.string().required("Center is required"),
  vehicleId: Yup.string().required("Vehicle is required"),
});

export default function CreateIncidentDialog({
  open,
  handleClickOpen,
  handleClose,
  vehicle,
}) {
  return (
    <div>
      <Formik
        initialValues={{ name: "jared" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(props) => (
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              Modal Til
            </DialogTitle>
            <DialogContent dividers>
              <form onSubmit={props.handleSubmit}>
                <input
                  type="text"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.name}
                  name="name"
                />

                <button type="submit">Submit</button>
              </form>

              {/* <Formik
            enableReinitialize={true}
            //initialValues={NewIncidentForEdit}
            validationSchema={incidentEditSchema}
            onSubmit={(values) => {
              console.log("Values", values);
              //saveIncident(values);
            }}
          >
            {({
              errors,
              values,
              handleBlur,
              touched,
              isValidating,
              handleSubmit,
              handleChange,
            }) => {
              return (
                <>
                  <Form className="form form-label-right">
                    <fieldset>
                      <div className="form-group row">
                        <div className="col-12 col-md-6">
                          <Field
                            name="callerName"
                            component={Input}
                            label="Caller Name*"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <Field
                            name="callerPhoneNo"
                            component={Input}
                            label="Caller Phone No*"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-12 col-md-6">
                          <Field
                            name="callerCNIC"
                            component={Input}
                            label="Date"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <Field
                            name="patientName"
                            component={Input}
                            label="Time"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-12 col-md-6">
                          <Field
                            name="patientCNIC"
                            component={Input}
                            label="From"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <Field
                            name="location"
                            component={Input}
                            label="To*"
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-12 col-md-6">
                          <Field
                            name="area"
                            component={Input}
                            label="Charges"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <Field
                            name="shortDescription"
                            component={TextArea}
                            label="Short Description"
                          />
                        </div>
                      </div>
                      <div className="from-group row">
                        <div className="col-12">
                          <ul>
                            {vehicle &&
                              vehicle.map((item, key) => {
                                return (
                                  <>
                                    <li key={key}>{item}</li>
                                  </>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </fieldset>
                    <button
                      type="submit"
                      //onClick={() => handleSubmit()}
                      className="btn btn-primary btn-elevate"
                    >
                      Save
                       {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )} 
                    </button>
                    <button
                      type="button"
                      //onClick={onHide}
                      className="btn btn-light btn-elevate"
                    >
                      Cancel
                    </button>
                  </Form>
                </>
              );
            }}
          </Formik> */}
            </DialogContent>
            <DialogActions>
              <button
                type="submit"
                //onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {/* {loading && (
                        <span className="ml-3 mr-3 spinner spinner-white"></span>
                      )} */}
              </button>
              <button
                type="button"
                //onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              {/* <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button> */}
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </div>
  );
}
