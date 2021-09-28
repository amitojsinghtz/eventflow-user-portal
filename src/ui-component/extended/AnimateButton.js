import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { Button } from '@material-ui/core';

// third-party
import { motion } from 'framer-motion';

//-----------------------|| ANIMATION BUTTON ||-----------------------//

/**
 * Component of animate button with scale and other properties
 */
const AnimateButton = ({ variant, color, href, text, scale, className }) => {
    return (
        <motion.div whileTap={{ scale: scale }}>
            <Button variant={variant} color={color} href={href} className={className}>
                {text}
            </Button>
        </motion.div>
    );
};

AnimateButton.propTypes = {
    variant: PropTypes.string,
    color: PropTypes.string,
    href: PropTypes.string,
    text: PropTypes.string,
    scale: PropTypes.number,
    className: PropTypes.string
};

export default AnimateButton;
