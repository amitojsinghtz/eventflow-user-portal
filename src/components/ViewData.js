import React, {useState, useEffect} from 'react';
import {Backdrop,TextField, Box, InputLabel, Grid, Container, Typography, makeStyles} from '@material-ui/core';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(2),
    minWidth:400
  },
  closeButton: {
    position: 'absolute',
    // right: theme.spacing(1),
    // top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  input:{
    '& .MuiInputLabel-formControl':{
      color:'#000',
      fontSize: theme.typography.pxToRem(14),
      // margin:theme.spacing(1,0),
    }
  },
  label:{
    color:'#000',
    fontSize: theme.typography.pxToRem(13),
    fontWeight: '600',
    // margin:theme.spacing(1,0),
  }
}));


export default function ViewData(props) {
  
  const valids = ['control_fullname','control_textbox','control_address','control_widget','control_email']
  const textFields = []
  const classes = useStyles();
  const {data} = props;
  const [formData, setFormData] = useState();
  const [orderedData, setOrderedData] = useState(); 

  useEffect(()=>{
    //console.log(props.formData);
    setFormData(props.formData);
  }, [props.formData]);

  useEffect(()=>{
    let _data = [];
    for (const [key, item] of Object.entries(data)) {
      if(valids.indexOf(item.type)>-1)
        _data.push(item);
    }
    setOrderedData(_data);
    //console.log(_data, _data.sort(compare));
  },[data]);

  const compare =(a,b)=>{
    if ( parseInt(a.order) < parseInt(b.order) ){
      return -1;
    }
    if ( parseInt(a.order) > parseInt(b.order) ){
      return 1;
    }
    return 0;
  }
  const renderSubItem = (items)=>{
    return(
      <Grid container direction="row" spacing={2}>
        {Object.keys(items).map(function(key) {
          return(
            <Grid item key={`subitem-${key}`}>
              <TextField 
                fullWidth
                className={classes.input}
                label={key} 
                InputProps={{readOnly: true}}
                defaultValue={items[key]}
              />
            </Grid>
          );
        })}
      </Grid>
    ) 
    
    
  }
  const renderItem = (item,i)=>{
    //console.log(item.answer,item.answer.replace(/<\/?[^>]+(>|$)/g, ""));
    if(formData && formData.hidden.indexOf(item.name)===-1){
      if(typeof item.answer === 'object'){
        return(
          <Grid key={`${item.text}-${i}`} className={classes.input}>
            <Box mb={2}><InputLabel className={classes.label}>{item.text}:</InputLabel></Box>
            <Box mb={2}>
              {renderSubItem(item.answer)}
            </Box>
          </Grid>
        );
      }else{
        return(
          <Grid key={`${item.text}-${i}`}>
            <Box mb={2}>
              <TextField 
                fullWidth
                key={`${item.text}-${i}`}
                className={classes.input}
                label={item.text} 
                InputProps={{
                  readOnly: true,
                }}
                defaultValue={(item.answer)?item.answer.replace(/<\/?[^>]+(>|$)/g, ""):item.answer}
              />
            </Box>
          </Grid>
        );
      }
    }
    
    
  }
  
  


  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Grid container direction="column" spacing={1}>
          {orderedData && 
            orderedData.map((item,i)=>(
              renderItem(item,i)
            ))
          }
        </Grid>
      </Container>
    </div>
  );
}
