import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@material-ui/core';

// project imports
import config from './../../../config';

// assets
// import logo from './../../../assets/images/logo.svg';
// import logoDark from './../../../assets/images/logo-dark.svg';
import logo from './../../../assets/images/awardflex/awardflex-logo.jpeg';
import { USER_AWARD_ALIAS } from '../../../utils/constant/constant'

//-----------------------|| MAIN LOGO ||-----------------------//

const LogoSection = () => {
    //const customization = useSelector((state) => state.customization);
    const awardAlias = localStorage.getItem(USER_AWARD_ALIAS)
    return (
        <ButtonBase disableRipple component={Link} to={config.defaultPath+(awardAlias||'')}>
            <img src={logo} alt="Berry" width="100" />
            {/*<img src={customization.navType === 'dark' ? logoDark : logo} alt="Berry" width="100" />*/}
        </ButtonBase>
    );
};

export default LogoSection;
