import React, {useState, useEffect} from 'react';
import { makeStyles, Stepper, Step, StepLabel, Box, Container } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // marginBottom: theme.spacing(4),
  },
  button: {
    // marginRight: theme.spacing(1),
  },
  instructions: {
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
}

const Steps = (props) => {
  const classes = useStyles();
  //console.log(props);
  const [activeStep, setActiveStep] =useState(props.currStep||0);
 
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box mb={2} mt={2} className={classes.root}>
      <Container maxWidth="sm">
        <Stepper activeStep={activeStep}>
          {props.workflow && props.workflow.map((step, index) => {
            return (
              <Step key={step.step} active={(step.stepId===props.currStepId)?true:false}>
                <StepLabel>{step.step}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Container>
    </Box>
  );
}

export default Steps;