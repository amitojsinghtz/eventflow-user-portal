import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
});

const CustomFieldTemplateTwo = (props)=>{
  const {id, classNames, label, help, required, description, errors, children} = props;
  return (
    <Grid className={classNames}>
      <label htmlFor={id}>{label}{required ? "*" : null}</label>
      {description}
      {children}
      {errors}
      {help}
    </Grid>
  );
}

const CustomFieldTemplate = (props) => {
  
  const classes = useStyles();

  //console.log(props);
  const {DescriptionField,
    description,
    TitleField,
    title,
    properties,
    required,
    uiSchema,
    idSchema} = props;

  return (
    <>
      {(uiSchema['ui:title'] || title) && (
        <TitleField
          id={`${idSchema.$id}-title`}
          title={title}
          required={required}
        />
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )}
      <Grid container={true} spacing={2} className={classes.root}>
        {properties.map((element, index) => {
          //console.log(element);
          //console.log(element.content.props.uiSchema);
          const { xs, md, classes } = element.content.props.uiSchema;
          return (
            <Grid
              item
              xs={xs||12}
              md={md||12}
              className={classes||''}
              key={index}
              style={{ marginBottom: '10px' }}
            >
              {element.content}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};


export default CustomFieldTemplate;
