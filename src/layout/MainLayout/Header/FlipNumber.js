import React, { useState, useEffect } from "react";
import FlipNumbers from "react-flip-numbers";
import moment from "moment";
import { BorderColor } from "@material-ui/icons";
import { Typography, Grid, Box } from "@material-ui/core";

const Digit = ({ digit, unit, theme }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}
  >
    <div
      style={{
        backgroundColor: (theme==='dark')?"#555":"#efefefe",
        borderRadius: 5,
        padding: "5px 3px",
        marginBottom: 2, 
        border: (theme==='dark')?"#efefefe solid 1px":"#c1c1c1 solid 1px"
      }}
    >
      <FlipNumbers
        play
        background={(theme==='dark')?"#555":"#efefefe"}
        color={(theme==='dark')?"#efefefe":"#555"}
        width={15}
        height={12}
        numbers={digit <= 9 ? `0${digit}` : `${digit}`}
      />
    </div>
    <Typography variant="caption">{unit}</Typography>
  </div>
);

const CountDown = ({ timeEnd }) => {
  const today = moment();
  const deadline = moment(timeEnd, "YYYY-MM-DD", true);

  const milliseconds = deadline.diff(moment(), "milliseconds");
  const months = moment.duration(milliseconds).months();
  const days = moment.duration(milliseconds).days();
  const hours = moment.duration(milliseconds).hours();
  const minutes = moment.duration(milliseconds).minutes();
  const seconds = moment.duration(milliseconds).seconds();
  const [time, setTime] = useState([months,days, hours, minutes, seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      const milliseconds = deadline.diff(moment(), "milliseconds");
      const months = moment.duration(milliseconds).months();
      const days = moment.duration(milliseconds).days();
      const hours = moment.duration(milliseconds).hours();
      const minutes = moment.duration(milliseconds).minutes();
      const seconds = moment.duration(milliseconds).seconds();
      setTime([months,days, hours, minutes, seconds]);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (deadline.isBefore(today)) {
    return <h2></h2>;
  }

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item><Digit digit={time[0]} unit="months" /></Grid>
      <Grid item><Digit digit={time[1]} unit="days" /></Grid>
      <Grid item><Digit digit={time[2]} unit="hrs" /></Grid>
      <Grid item><Digit digit={time[3]} unit="mins" /></Grid>
      <Grid item><Digit digit={time[4]} unit="secs" /></Grid>
    </Grid>
  );
};

export default function FlipNumber({endTime,startTime, title}) {
  const timeEnd = moment(endTime)
    .format("YYYY-MM-DD");

  return (
    <div className="App">
     {(moment().isSameOrAfter(moment(startTime))  && moment().isSameOrBefore(moment(endTime))  &&  title  ) ?
     <> 
        <Box mb={1}>
          <Typography gutterBottom variant="caption" >{title}</Typography>
        </Box>
      <CountDown timeEnd={timeEnd} title={title}  />
      </>
      : ''
      }
    </div>
  );
}
