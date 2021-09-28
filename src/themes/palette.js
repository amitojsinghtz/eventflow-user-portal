// assets
import value from '../assets/scss/_themes-vars.module.scss';

/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */
export function themePalette(theme) {
    return {
        mode: theme.customization.navType,
        common: {
            black: value.paperDark
        },
        primary: {
            light: value.blue50,
            main: value.blue500,
            dark: value.blue600,
            200: value.blue200,
            800: value.blue800
        },
        secondary: {
            light: theme.customization.navType === 'dark' ? value.APurple100 : value.deepPurple50,
            main: theme.customization.navType === 'dark' ? value.APurple200 : value.deepPurple500,
            dark: theme.customization.navType === 'dark' ? value.APurple400 : value.deepPurple600,
            200: value.deepPurple200,
            800: theme.customization.navType === 'dark' ? value.APurple700 : value.deepPurple800
        },
        purple: {
            light: theme.customization.navType === 'dark' ? value.APurple100 : value.deepPurple50,
            main: theme.customization.navType === 'dark' ? value.APurple200 : value.deepPurple500,
            dark: theme.customization.navType === 'dark' ? value.APurple400 : value.deepPurple600,
            200: value.deepPurple200,
            800: theme.customization.navType === 'dark' ? value.APurple700 : value.deepPurple800
        },
        error: {
            light: value.red200,
            main: value.red500,
            dark: value.red800
        },
        orange: {
            light: value.deepOrange50,
            main: value.deepOrange200,
            dark: value.deepOrange800
        },
        warning: {
            light: value.amber50,
            main: value.amber100,
            dark: value.amber500
        },
        success: {
            light: value.A100,
            200: value.A200,
            main: value.A400,
            dark: value.A700
        },
        grey: {
            50: value.grey50,
            100: value.grey100,
            500: theme.textDarkSecondary,
            600: theme.heading,
            700: theme.textDarkPrimary,
            900: theme.textDark
        },
        dark: {
            light: value.textDarkPrimary,
            main: value.darkLevel1,
            dark: value.darkLevel2,
            800: value.backgroundDark,
            900: value.paperDark
        },
        text: {
            primary: theme.textDarkPrimary,
            secondary: theme.textDarkSecondary,
            dark: theme.textDark,
            hint: value.grey100
        },
        background: {
            paper: theme.paper,
            default: theme.backgroundDefault
        }
    };
}
