import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "react-bootstrap/Button";
import ClearIcon from "@material-ui/icons/Clear";
import SwipeableViews from "react-swipeable-views";
import { bindKeyboard } from "react-swipeable-views-utils";
// import Button from "@material-ui/core/Button";
// import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
// import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  root: {
    //maxWidth: 400,
    flexGrow: 1,
    margin: "auto",
    maxWidth: "40%",
    maxHeight: "600px",
  },
  imageContainer: {
    maxHeight: "550px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    height: "auto",
    //maxWidth: 400,
    overflow: "hidden",
    display: "block",
    width: "100%",
  },
}));

export function InfoImageSlider({ images, show, setShow }) {
  const [Sliderimages, setSliderimages] = useState([]);

  useEffect(() => {
    if (images) {
      setSliderimages(images);
    }
  }, [images]);

  const handleClose = () => setShow(false);

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = Sliderimages.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <Modal
        size="xl"
        dialogClassName="modal-90w modal-bg img-dialog"
        show={show}
        onHide={handleClose}
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header>
          <Modal.Title>Images View</Modal.Title>
          <ClearIcon onClick={handleClose} style={{ cursor: "pointer" }} />
        </Modal.Header>
        <Modal.Body>
          <div className={classes.root}>
            <BindKeyboardSwipeableViews
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {Sliderimages &&
                Sliderimages.map((step, index) => {
                  return (
                    <div className={classes.imageContainer} key={step.label}>
                      <img
                        className={classes.img}
                        src={step.url}
                        alt={step.name}
                      />
                    </div>
                  );
                })}
            </BindKeyboardSwipeableViews>
            <MobileStepper
              steps={Sliderimages.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={() => setActiveStep((prevStep) => prevStep + 1)}
                  disabled={activeStep === Sliderimages.length - 1}
                >
                  Next
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() => setActiveStep((prevStep) => prevStep - 1)}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
              }
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
