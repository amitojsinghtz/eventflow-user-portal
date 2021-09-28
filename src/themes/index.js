import  createTheme from '@material-ui/core/styles/createTheme';

// assets
import value from '../assets/scss/_themes-vars.module.scss';

// project imports
import { componentStyleOverrides } from './compStyleOverride';
import { themePalette } from './palette';
import { themeTypography } from './typography';

// remove these file when old component is removed
import oldshadows from './oldshadows';
import typography from './oldtypography';

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */
export function theme(customization) {
    let themeOption = {
        heading: '',
        paper: '',
        backgroundDefault: '',
        background: '',
        textDarkPrimary: '',
        textDarkSecondary: '',
        textDark: '',
        menuSelected: '',
        menuSelectedBack: '',
        divider: '',
        customization: customization
    };

    switch (customization.navType) {
        case 'dark':
            themeOption.paper = value.darkLevel2;
            themeOption.backgroundDefault = value.paperDark;
            themeOption.background = value.backgroundDark;
            themeOption.textDarkPrimary = value.textDarkPrimary;
            themeOption.textDarkSecondary = value.textDarkSecondary;
            themeOption.textDark = value.textDarkPrimary;
            themeOption.menuSelected = value.blue500;
            themeOption.menuSelectedBack = value.blue500 + 15;
            themeOption.divider = value.textDarkPrimary;
            themeOption.heading = value.textDarkTitle;
            break;
        case 'light':
        default:
            themeOption.paper = value.paper;
            themeOption.backgroundDefault = value.paper;
            themeOption.background = value.grey100;
            themeOption.textDarkPrimary = value.grey700;
            themeOption.textDarkSecondary = value.grey500;
            themeOption.textDark = value.grey900;
            themeOption.menuSelected = value.deepPurple600;
            themeOption.menuSelectedBack = value.deepPurple50;
            themeOption.divider = value.grey200;
            themeOption.heading = value.grey900;
            break;
    }

    return createTheme({
        direction: customization.rtlLayout ? 'rtl' : 'ltr',
        palette: themePalette(themeOption),
        // ...typography,
        ...oldshadows,
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypography(themeOption),
        components: componentStyleOverrides(themeOption)
    });
}

export default theme;
