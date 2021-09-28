import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { ButtonBase, Link, Tooltip } from '@material-ui/core';

// project imports
import Avatar from './../extended/Avatar';

// assets
import MuiLogo from './../../assets/images/logo-mui.svg';

//-----------------------|| CARD SECONDARY ACTION ||-----------------------//

const CardSecondaryAction = ({ title, link, icon }) => {
    return (
        <Tooltip title={title ? title : 'Reference'} placement="left">
            <ButtonBase>
                {!icon && (
                    <Avatar
                        component={Link}
                        href={link}
                        target="_blank"
                        alt="MUI Logo"
                        src={MuiLogo}
                        size="badge"
                        color="primary"
                        outline
                    />
                )}
                {icon && (
                    <Avatar component={Link} href={link} target="_blank" size="badge" color="primary" outline>
                        {icon}
                    </Avatar>
                )}
            </ButtonBase>
        </Tooltip>
    );
};

CardSecondaryAction.propTypes = {
    icon: PropTypes.node,
    link: PropTypes.string,
    title: PropTypes.string
};

export default CardSecondaryAction;
