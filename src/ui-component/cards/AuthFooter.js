import React from 'react';

// material-ui
import { Grid, Link, Typography, useMediaQuery } from '@material-ui/core';

//-----------------------|| FOOTER - AUTHENTICATION 2 & 3 ||-----------------------//

const AuthFooter = () => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Grid
            sx={{ mb: '-20px', display: { xs: 'none', sm: 'flex' } }}
            item
            container
            justifyContent={matchDownSM ? 'center' : 'space-between'}
            direction={matchDownSM ? 'column' : 'row'}
            alignItems="center"
            spacing={matchDownSM ? 2 : 0}
        >
            <Grid item>
                <Typography variant="subtitle2" component={Link} href="https://berrydashboard.io" target="_blank">
                    berrydashboard.io
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="subtitle2" component={Link} href="https://codedthemes.com" target="_blank">
                    &copy; codedthemes.com
                </Typography>
            </Grid>
        </Grid>
    );
};

export default AuthFooter;
