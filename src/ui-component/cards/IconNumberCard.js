import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { Grid, Typography } from '@material-ui/core';

// project imports
import MainCard from './MainCard';

//=============================|| ICON NUMBER CARD ||=============================//

const IconNumberCard = ({ title, primary, color, iconPrimary }) => {
    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary size="5rem"  /> : null;

    return (
        <MainCard>
            <Grid container spacing={2} alignItems="center" textAlign="center">
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" alignItems="center" textAlign="center">
                        <Grid item xs={12}>
                            <Typography variant="h1" variant="subtitle2" sx={{ color: color }}>
                                {primaryIcon}
                            </Typography>
                            <Typography variant="h3" sx={{ color: color || "inherit" }}>
                                {title}
                            </Typography>
                            <Typography variant="h5" color="inherit">{primary}</Typography>
                        </Grid>
                        {/* <Grid item>
                            
                        </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

IconNumberCard.propTypes = {
    title: PropTypes.string,
    primary: PropTypes.string,
    color: PropTypes.string,
    iconPrimary: PropTypes.object
};

export default IconNumberCard;
