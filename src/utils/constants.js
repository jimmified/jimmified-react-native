import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

export const JIMMIFY_API_URL = 'https://jimmified.com/api/';

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

export const colors = {
    GREEN: '#3cba54',
    YELLOW: '#f4c20d',
    RED: '#db3236',
    BLUE: '#4885ed',
};

export const STORE_KEYS = {
    login: 'loginCreds'
};