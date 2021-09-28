import value from '../assets/scss/_themes-vars.module.scss';

/**
 * MUI Components whose styles are override as per theme
 * @param {JsonObject} theme Plain Json Object
 */
export function componentStyleOverrides(theme) {
    return {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    borderRadius: '4px'
                }
            }
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0
            },
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                },
                rounded: {
                    borderRadius: theme.customization.borderRadius + 'px'
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    color: value.textDark,
                    padding: '24px'
                },
                title: {
                    fontSize: '1.125rem'
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '24px'
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: '24px'
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    alignItems: 'center'
                },
                outlined: {
                    border: '1px dashed'
                }
            }
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    '&.MuiListItem-root': {
                        color: theme.textDarkPrimary,
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        '&.Mui-selected': {
                            color: theme.menuSelected,
                            backgroundColor: theme.menuSelectedBack,
                            '&:hover': {
                                backgroundColor: theme.menuSelectedBack
                            },
                            '& .MuiListItemIcon-root': {
                                color: theme.menuSelected
                            }
                        },
                        '&:hover': {
                            backgroundColor: theme.menuSelectedBack,
                            color: theme.menuSelected,
                            '& .MuiListItemIcon-root': {
                                color: theme.menuSelected
                            }
                        }
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: theme.textDarkPrimary,
                    minWidth: '36px'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: theme.textDark
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: theme.textDark,
                    '&::placeholder': {
                        color: theme.textDarkSecondary,
                        fontSize: '0.875rem'
                    }
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: theme.customization.outlinedFilled
                        ? theme.customization.navType === 'dark'
                            ? value.backgroundDark
                            : value.grey50
                        : 'transparent',
                    borderRadius: theme.customization.borderRadius + 'px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.customization.navType === 'dark' ? value.textDarkPrimary + 28 : value.grey400
                    },
                    '&:hover $notchedOutline': {
                        borderColor: value.blue50
                    },
                    '&.MuiInputBase-multiline': {
                        padding: 1
                    }
                },
                input: {
                    fontWeight: 500,
                    background: theme.customization.outlinedFilled
                        ? theme.customization.navType === 'dark'
                            ? value.backgroundDark
                            : value.grey50
                        : 'transparent',
                    padding: '15.5px 14px',
                    borderRadius: theme.customization.borderRadius + 'px',
                    '&.MuiInputBase-inputSizeSmall': {
                        padding: '10px 14px'
                    }
                },
                inputAdornedStart: {
                    paddingLeft: 4
                },
                notchedOutline: {
                    borderRadius: theme.customization.borderRadius + 'px'
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    '&.Mui-disabled': {
                        color: theme.customization.navType === 'dark' ? value.textDarkPrimary + 50 : value.grey300
                    }
                },
                mark: {
                    backgroundColor: theme.paper,
                    width: '4px'
                },
                valueLabel: {
                    color: value.blue500
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiAutocomplete-tag': {
                        background: theme.customization.navType === 'dark' ? value.textDarkPrimary + 20 : value.deepPurple50,
                        borderRadius: 4,
                        color: theme.textDark,
                        '.MuiChip-deleteIcon': {
                            color: theme.customization.navType === 'dark' ? value.textDarkPrimary + 80 : value.deepPurple200
                        }
                    }
                },
                popper: {
                    borderRadius: theme.customization.borderRadius + 'px',
                    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)'
                }
            }
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: theme.divider,
                    opacity: theme.customization.navType === 'dark' ? 0.2 : 1
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    '&:focus': {
                        backgroundColor: 'transparent'
                    }
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {
                select: {
                    fontSize: '28px'
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: theme.customization.navType === 'dark' ? value.darkLevel1 : value.blue600,
                    background: theme.customization.navType === 'dark' ? theme.textDarkPrimary : value.blue200
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    '&.MuiChip-deletable .MuiChip-deleteIcon': {
                        color: 'inherit'
                    }
                }
            }
        },
        MuiTimelineContent: {
            styleOverrides: {
                root: {
                    color: theme.textDark,
                    fontSize: '16px'
                }
            }
        },
        MuiTreeItem: {
            styleOverrides: {
                label: {
                    marginTop: 14,
                    marginBottom: 14
                }
            }
        },
        MuiTimelineDot: {
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            }
        },
        MuiInternalDateTimePickerTabs: {
            styleOverrides: {
                tabs: {
                    backgroundColor: theme.customization.navType === 'dark' ? value.paperDark : value.blue50,
                    '& .MuiTabs-flexContainer': {
                        borderColor: theme.customization.navType === 'dark' ? value.textDarkPrimary + 20 : value.blue200
                    },
                    '& .MuiTab-root': {
                        color: theme.customization.navType === 'dark' ? value.textDarkSecondary : value.grey900
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: value.blue600
                    },
                    '& .Mui-selected': {
                        color: value.blue600
                    }
                }
            }
        },
        MuiTabs: {
            styleOverrides: {
                flexContainer: {
                    borderBottom: '1px solid',
                    borderColor: theme.customization.navType === 'dark' ? value.textDarkPrimary + 20 : value.grey200
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    padding: '12px 0 12px 0'
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: theme.customization.navType === 'dark' ? value.textDarkPrimary + 15 : value.grey200,
                    '&.MuiTableCell-head': {
                        fontSize: '0.875rem',
                        color: theme.heading,
                        fontWeight: 500
                    }
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    color: theme.customization.navType === 'dark' ? value.darkLevel1 : theme.paper,
                    background: theme.customization.navType === 'dark' ? value.grey50 : value.grey700
                }
            }
        }
    };
}
