import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Chip, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@material-ui/core';

// project imports
import { MENU_OPEN, SET_MENU } from '../../../../../store/actions';

// assets
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { inject, observer } from 'mobx-react'
import moment from 'moment';

// style constant
const useStyles = makeStyles((theme) => ({
    listIcon: {
        minWidth: '18px',
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    listCustomIconSub: {
        width: '6px',
        height: '6px'
    },
    listCustomIconSubActive: {
        width: '8px',
        height: '8px'
    },
    listItem: {
        marginBottom: '5px',
        alignItems: 'center'
    },
    listItemNoBack: {
        marginBottom: '5px',
        backgroundColor: 'transparent !important',
        paddingTop: '8px',
        paddingBottom: '8px',
        alignItems: 'flex-start'
    },
    subMenuCaption: {
        ...theme.typography.subMenuCaption
    }
}));

//-----------------------|| SIDEBAR MENU LIST ITEMS ||-----------------------//

const NavItem = ({ item, level,flowStore }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);
    const matchesSM = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const {  userAward,AllSubmission } =
    flowStore

    const Icon = item.icon;
    const itemIcon = item.icon ? (
        <Icon stroke={1.5} size="1.3rem" className={classes.listCustomIcon} />
    ) : (
        <FiberManualRecordIcon
            className={
                customization.isOpen.findIndex((id) => id === item.id) > -1 ? classes.listCustomIconSubActive : classes.listCustomIconSub
            }
            fontSize={level > 0 ? 'inherit' : 'default'}
        />
    );

    let itemIconClass = !item.icon ? classes.listIcon : classes.menuIcon;
    itemIconClass = customization.navType === 'nav-dark' ? [itemIconClass, classes.listCustomIcon].join(' ') : itemIconClass;

    let itemTarget = '';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = { component: Link, to: item.url };
    if (item.external) {
        listItemProps = { component: 'a', href: item.url };
    }

    const itemHandler = (id) => {
        dispatch({ type: MENU_OPEN, id: id });
        matchesSM && dispatch({ type: SET_MENU, opened: false });
    };

    // active menu item on page load
    React.useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: item.id });
        }
        // eslint-disable-next-line
    }, []);

    const compareDate = (start,end) =>{
    
        if(moment().isSameOrAfter(moment(start)) && moment().isSameOrBefore(moment(end)))
        {
          return false;
        }else{
          return true;
        }
      }  

    return (
        <ListItem
            disabled={item.title === 'Start Submission' ? userAward?.allowSubmission ? false : true : '' }
            className={level > 1 ? classes.listItemNoBack : classes.listItem}
            sx={{ borderRadius: customization.borderRadius + 'px' }}
            selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
            onClick={() => itemHandler(item.id)}
            button
            target={itemTarget}
            style={{ paddingLeft: level * 23 + 'px' }}
            {...listItemProps}
        >
            <ListItemIcon className={itemIconClass}>{itemIcon}</ListItemIcon>
            <ListItemText
                primary={
                    <Typography variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'} color="inherit">
                        {item.title}
                    </Typography>
                }
                secondary={
                    item.caption && (
                        <Typography variant="caption" className={classes.subMenuCaption} display="block" gutterBottom>
                            {item.caption}
                        </Typography>
                    )
                }
            />
            {item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItem>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default inject((stores) => ({
    flowStore: stores.store.flowStore,
  }))(observer(NavItem))
